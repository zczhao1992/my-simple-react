// import React from "react";
// import ReactDOM from "react-dom";
// // import ReactDOM from "react-dom/client";

// // const root = ReactDOM.createRoot(document.getElementById("root"));

// ReactDOM.render(<div>1111111</div>, document.getElementById("root"));

// // root.render(<div>1111111</div>);

import React from "./react";
import ReactDOM from "./react-dom";

// // 测试函数组件
// function MyFuncitonComponent(props) {
//   return <div style={{ color: "red" }}>1111111</div>;
// }

// 测试类组件
class MyClassComponent extends React.Component {
  render() {
    return <div style={{ color: "red" }}>{this.props.xx}</div>;
  }
}

// console.log(<div style={{ color: "red" }}>1111111</div>);

ReactDOM.render(
  <MyClassComponent xx="child1" />,
  document.getElementById("root")
);
