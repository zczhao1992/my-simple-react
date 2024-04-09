import { REACT_ELEMENT } from "./utils.js";

function mount(VNode, containerDOM) {
  let newDOM = createDom(VNode);
  newDOM && containerDOM.appendChild(newDOM);
}

function mountArray(children, parent) {
  if (!Array.isArray(children)) return;

  for (let i = 0; i < children.length; i++) {
    if (typeof children[i] === "string") {
      parent.appendChild(document.createTextNode(children[i]));
    } else {
      mount(children[i], parent);
    }
  }
}

function setPropsForDOM(dom, VNodeProps = {}) {
  if (!dom) return;

  for (let key in VNodeProps) {
    if (key === "children") continue;

    if (/^on[A-Z].*/.test(key)) {
      // TODO: 事件处理
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
  let { type, props } = VNode;
  let instance = new type(props);

  let renderVNode = instance.render();

  if (!renderVNode) return null;

  return createDom(renderVNode);
}

function createDom(VNode) {
  // 1.创建元素  2.处理子元素  3.处理属性值
  const { type, props } = VNode;
  let dom;

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

  if (type && VNode.$$typeof === REACT_ELEMENT) {
    dom = document.createElement(type);
  }

  if (props) {
    if (typeof props.children === "object" && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      mountArray(props.children, dom);
    } else if (typeof props.children === "string") {
      dom.appendChild(document.createTextNode(props.children));
    }
  }

  //TODO: 处理属性值
  setPropsForDOM(dom, props);
  return dom;
}

function render(VNode, containerDOM) {
  // 将虚拟DOM转化为真实DOM
  // 将得到的真实DOM挂载到containerDOM中
  mount(VNode, containerDOM);
}

const ReactDOM = {
  render,
};

export default ReactDOM;
