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
  constructor(props) {
    super(props);

    this.state = { xxx: "999", count: "0" };
  }

  updateCount() {
    console.log("ddddddd");
    this.setState({
      count: "1",
    });
  }

  render() {
    return (
      <div style={{ color: "red" }} onClick={() => this.updateCount()}>
        1111-{this.state.count}
      </div>
    );
  }
}

// console.log(<div style={{ color: "red" }}>1111111</div>);

// 测试ref
let res = React.forwardRef((props, ref) => {
  return <div ref={ref}>23123123213</div>;
});

console.log(res);

ReactDOM.render(
  <MyClassComponent xx="child1" />,
  document.getElementById("root")
);
