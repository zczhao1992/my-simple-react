export const REACT_ELEMENT = Symbol("react.element");

export const REACT_FORWARD_REF = Symbol("react.forward_ref");

export const REACT_TEXT = Symbol("react.text");

export const CREATE = Symbol("react.dom.diff.create");

export const MOVE = Symbol("react.dom.diff.move");

export const toVNode = (node) => {
  return typeof node === "string" || typeof node === "number"
    ? {
        type: REACT_TEXT,
        props: { text: node },
      }
    : node;
};

export const deeoClone = (data) => {
  let type = getType(data);
  let resultValue;
  if (type !== "array" && type !== "object") return data;

  if (type === "array") {
    resultValue = [];

    data.forEach((item) => {
      resultValue.push(deeoClone(item));
    });
    return resultValue;
  }

  if (type === "object") {
    resultValue = {};

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        resultValue[key] = deeoClone(data[key]);
      }
    }

    return resultValue;
  }
};

export function getType(obj) {
  let typeMap = {
    "[Object Boolean]": "boolean",
    "[Object Number]": "number",
    "[object String]": "string",
    "[Object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
  };
  return typeMap[Object.prototype.toString.call(obj)];
}
