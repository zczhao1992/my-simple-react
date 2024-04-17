import {
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  toVNode,
  shallowCompare,
  REACT_MEMO,
} from "./utils.js";
import { Component } from "./Component.js";

function createElement(type, properties, children) {
  let ref = properties.ref || null;
  let key = properties.key || null;

  ["key", "ref", "__self", "__source"].forEach((key) => {
    delete properties[key];
  });

  let props = { ...properties };

  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(toVNode);
  } else {
    props.children = toVNode(children);
  }

  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props,
  };
}

function createRef() {
  return {
    current: null,
  };
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}

class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowCompare(this.props, nextProps) ||
      !shallowCompare(this.state, nextState)
    );
  }
}

function memo(type, compare) {
  return {
    $$typeof: REACT_MEMO,
    type,
    compare,
  };
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  PureComponent,
  memo,
};

export default React;
