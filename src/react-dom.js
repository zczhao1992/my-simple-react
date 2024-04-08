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

function createDom(VNode) {
  // 1.创建元素  2.处理子元素  3.处理属性值
  const { type, props } = VNode;
  let dom;
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
