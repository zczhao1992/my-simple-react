export class Component {
  // 是否是类组件
  static IS_CLASS_COMPONENT = true;

  constructor(props) {
    this.state = {};
    this.props = props;
  }

  setState(partialState) {
    // 1.合并属性

    // 2.重新渲染进行更新
    this.update();
  }

  update() {
    // 1.获取重新执行render函数后的虚拟DOM 新虚拟DOM
    // 2.根据新虚拟DOM生成真实DOM
    // 3.将真实DOM挂载到页面上
  }
}
