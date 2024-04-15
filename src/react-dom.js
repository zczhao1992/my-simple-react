import {
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  REACT_TEXT,
  CREATE,
  MOVE,
} from "./utils.js";
import { addEvent } from "./event.js";

function mount(VNode, containerDOM) {
  let newDOM = createDom(VNode);
  newDOM && containerDOM.appendChild(newDOM);
}

function mountArray(children, parent) {
  if (!Array.isArray(children)) return;

  for (let i = 0; i < children.length; i++) {
    // if (typeof children[i] === "string") {
    //   parent.appendChild(document.createTextNode(children[i]));
    // } else {
    // 记录父节点下是第几个子元素，diff用
    children[i].index = i;
    mount(children[i], parent);
    // }
  }
}

function setPropsForDOM(dom, VNodeProps = {}) {
  if (!dom) return;

  for (let key in VNodeProps) {
    if (key === "children") continue;

    if (/^on[A-Z].*/.test(key)) {
      // TODO: 事件处理
      addEvent(dom, key.toLowerCase(), VNodeProps[key]);
    } else if (key === "style") {
      Object.keys(VNodeProps[key]).forEach((styleName) => {
        dom.style[styleName] = VNodeProps[key][styleName];
      });
    } else {
      dom[key] = VNodeProps[key];
    }
  }
}

// 处理函数组件
function getDomByFunctionComponent(VNode) {
  let { type, props } = VNode;
  // type为函数名
  let renderVNode = type(props);

  if (!renderVNode) return null;

  return createDom(renderVNode);
}

// 处理类组件
function getDomByClassComponent(VNode) {
  let { type, props, ref } = VNode;
  let instance = new type(props);

  let renderVNode = instance.render();

  instance.oldVNode = renderVNode;

  ref && (ref.current = instance);
  // // TODO: 测试setState
  // setTimeout(() => {
  //   // debugger;
  //   instance.setState({ xxx: "999999999" });
  // }, 2000);
  // // TODO: 测试setState

  if (!renderVNode) return null;

  return createDom(renderVNode);
}

// 处理函数组件的ref
function getDomByForwardRefFunction(VNode) {
  let { type, props, ref } = VNode;

  let renderVNode = type.render(props, ref);

  if (!renderVNode) return null;

  return createDom(renderVNode);
}

function createDom(VNode) {
  // 1.创建元素  2.处理子元素  3.处理属性值
  const { type, props, ref } = VNode;
  let dom;

  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return getDomByForwardRefFunction(VNode);
  }

  if (
    typeof type === "function" &&
    VNode.$$typeof === REACT_ELEMENT &&
    type.IS_CLASS_COMPONENT
  ) {
    // 判断是否为类组件
    return getDomByClassComponent(VNode);
  }

  if (typeof type === "function" && VNode.$$typeof === REACT_ELEMENT) {
    // 判断是否为函数组件
    return getDomByFunctionComponent(VNode);
  }

  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.text);
  } else if (type && VNode.$$typeof === REACT_ELEMENT) {
    dom = document.createElement(type);
  }

  if (props) {
    if (typeof props.children === "object" && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      mountArray(props.children, dom);
    }
    // else if (typeof props.children === "string") {
    //   dom.appendChild(document.createTextNode(props.children));
    // }
  }

  //TODO: 处理属性值
  setPropsForDOM(dom, props);

  VNode.dom = dom;

  ref && (ref.current = dom);
  return dom;
}

function render(VNode, containerDOM) {
  // 将虚拟DOM转化为真实DOM
  // 将得到的真实DOM挂载到containerDOM中
  mount(VNode, containerDOM);
}

export function findDomByVNode(VNode) {
  if (!VNode) return;

  if (VNode.dom) return VNode.dom;
}

export function updateDomTree(oldVNode, newVNode, oldDOM) {
  // let parentNode = oldDOM.parentNode;
  // parentNode.removeChild(oldDOM);
  // parentNode.appendChild(createDom(newVNode));

  // 新节点，旧节点都不存在
  // 新节点存在，旧节点不存在
  // 新节点不存在，纠节点存在
  // 新节点存在，纠节点也存在，但是类型不一样
  // 新节点存在，纠节点也存在，类型ye一样 --> 值得进行深入比较，探索复用相关节点的方案

  const typeMap = {
    NO_OPERATE: !oldVNode && !newVNode,
    ADD: !oldVNode && newVNode,
    DELETE: oldVNode && !newVNode,
    REPLACE: oldVNode && newVNode && oldVNode.type !== newVNode.type,
  };

  let UPDATE_TYPE = Object.keys(typeMap).filter((key) => typeMap[key])[0];

  switch (UPDATE_TYPE) {
    case "NO_OPERATE":
      break;
    case "DELETE":
      removeVNode(oldVNode);
      break;
    case "ADD":
      oldDOM.parentNode.appendChild(createDom(newVNode));
      break;
    case "REPLACE":
      removeVNode(oldVNode);
      oldDOM.parentNode.appendChild(createDom(newVNode));
      break;
    default:
      // 深度的dom diff，新老虚拟DOM都存在且类型相同
      deepDOMDiff(oldVNode, newVNode);
      break;
  }
}

function removeVNode(VNode) {
  const currentDOM = findDomByVNode(VNode);

  if (currentDOM) currentDOM.remove();
}

function deepDOMDiff(oldVNode, newVNode) {
  let diffTypeMap = {
    ORGIN_NODE: typeof oldVNode.type === "string",
    CLASS_COMPONENT:
      typeof oldVNode.type === "function" && oldVNode.type.IS_CLASS_COMPONENT,
    FUNCTION_COMPONENT: typeof oldVNode.type === "function",
    TEXT: oldVNode.type === REACT_TEXT,
  };
  let DIFF_TYPE = Object.keys(diffTypeMap).filter((key) => diffTypeMap[key])[0];

  switch (DIFF_TYPE) {
    case "ORGIN_NODE":
      let currentDOM = (newVNode.dom = findDomByVNode(oldVNode));
      setPropsForDOM(currentDOM, newVNode.props);
      updateChildren(
        currentDOM,
        oldVNode.props.children,
        newVNode.props.children
      );
      break;
    case "CLASS_COMPONENT":
      updateClassComponent(oldVNode, newVNode);
      break;
    case "FUNCTION_COMPONENT":
      updateFunctionComponent(oldVNode, newVNode);
      break;
    case "TEXT":
      newVNode.dom = findDomByVNode(oldVNode);
      newVNode.dom.textContent = newVNode.props.text;
      break;
    default:
      break;
  }
}

function updateFunctionComponent(oldVNode, newVNode) {
  let oldDOM = findDomByVNode(oldVNode);
  if (!oldDOM) return;
  const { type, props } = newVNode;

  let newRenderVNode = type(props);
  updateDomTree(oldVNode.oldRenderVNode, newRenderVNode, oldDOM);
  newVNode.oldRenderVNode = newRenderVNode;
}

function updateClassComponent(oldVNode, newVNode) {
  const classInstance = (newVNode.classInstance = oldVNode.classInstance);
  classInstance.updater.launchUpdate();
}

// DOM DIFF算法的核心
function updateChildren(parentDOM, oldVNodeChildren, newVNodeChildren) {
  oldVNodeChildren = (
    Array.isArray(oldVNodeChildren) ? oldVNodeChildren : [oldVNodeChildren]
  ).filter(Boolean);
  newVNodeChildren = (
    Array.isArray(newVNodeChildren) ? newVNodeChildren : [newVNodeChildren]
  ).filter(Boolean);

  let lastNotChangedIndex = -1;
  let oldKeyChildMap = {};
  oldVNodeChildren.forEach((oldVNode, index) => {
    let oldKey = oldVNode && oldVNode.key ? oldVNode.key : index;

    oldKeyChildMap[oldKey] = oldVNode;
  });

  // 遍历新的子虚拟DOM数组，找到可以复用但需要移动的节点，
  // 需要重新创建的节点，需要删除的节点，剩下的就是可以复用且不用移动的节点
  let actions = [];
  newVNodeChildren.forEach((newVNode, index) => {
    newVNode.index = index;
    let newKey = newVNode.key ? newVNode.key : index;
    let oldVNode = oldKeyChildMap[newKey];

    if (oldVNode) {
      deepDOMDiff(oldVNode, newVNode);
      if (oldVNode.index < lastNotChangedIndex) {
        actions.push({
          type: MOVE,
          oldVNode,
          newVNode,
          index,
        });
      }
      delete oldKeyChildMap[newKey];
      lastNotChangedIndex = Math.max(lastNotChangedIndex, oldVNode.index);
    } else {
      actions.push({
        type: CREATE,
        newVNode,
        index,
      });
    }
  });

  let VNodeToMove = actions
    .filter((action) => action.type === MOVE)
    .map((action) => action.oldVNode);

  let VNodeToDelete = Object.values(oldKeyChildMap);

  VNodeToMove.concat(VNodeToDelete).forEach((oldVNode) => {
    let currentDOM = findDomByVNode(oldVNode);
    currentDOM.remove();
  });

  actions.forEach((action) => {
    let { type, oldVNode, newVNode, index } = action;

    let childNodes = parentDOM.childNodes;
    let childNode = childNodes[index];
    const getDomForInsert = () => {
      if (type === CREATE) {
        return createDom(newVNode);
      }

      if (type === MOVE) {
        return findDomByVNode(oldVNode);
      }
    };
    if (childNode) {
      parentDOM.insertBefore(getDomForInsert(), childNode);
    } else {
      parentDOM.appendChild(getDomForInsert());
    }
  });
}

const ReactDOM = {
  render,
};

export default ReactDOM;
