import { findDomByVNode, updateDomTree } from "./react-dom.js";
import { deeoClone } from "./utils.js";

export let updaterQueue = {
  isBatch: false,
  updaters: new Set(),
};

export function flushUpdaterQueue() {
  updaterQueue.isBatch = false;
  for (let updater of updaterQueue.updaters) {
    updater.launchUpdate();
  }
  updaterQueue.updaters.clear();
}

class Updater {
  constructor(ClassComponentInstance) {
    this.ClassComponentInstance = ClassComponentInstance;
    this.pendingStates = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    this.preHandleForUpdate();
  }
  // 预处理
  preHandleForUpdate() {
    if (updaterQueue.isBatch) {
      //
      updaterQueue.updaters.add(this);
    } else {
      this.launchUpdate();
    }
  }

  launchUpdate(nextProps) {
    const { ClassComponentInstance, pendingStates } = this;
    if (pendingStates.length === 0 && !nextProps) return;
    // if (pendingStates.length === 0) return;
    let isShouldUpdate = true;

    let prevProps = deeoClone(this.ClassComponentInstance.props);
    let prevState = deeoClone(this.ClassComponentInstance.state);

    // 合并
    let nextState = this.pendingStates.reduce((preState, newState) => {
      return { ...preState, ...newState };
    }, ClassComponentInstance.state);

    // 清空
    this.pendingStates.length = 0;
    if (
      ClassComponentInstance.shouldComponentUpdate &&
      !ClassComponentInstance.shouldComponentUpdate(nextProps, nextState)
    ) {
      isShouldUpdate = false;
    }

    ClassComponentInstance.state = nextState;
    if (nextProps) ClassComponentInstance.props = nextProps;

    // 更新
    if (isShouldUpdate) ClassComponentInstance.update(prevProps, prevState);
  }
}

export class Component {
  // 是否是类组件
  static IS_CLASS_COMPONENT = true;

  constructor(props) {
    this.updater = new Updater(this);
    this.state = {};
    this.props = props;
  }

  setState(partialState) {
    // // 1.合并属性

    // // 2.重新渲染进行更新
    // this.update();

    this.updater.addState(partialState);
  }

  update(prevProps, prevState) {
    // 1.获取重新执行render函数后的虚拟DOM 新虚拟DOM
    // 2.根据新虚拟DOM生成真实DOM
    // 3.将真实DOM挂载到页面上

    let oldVNode = this.oldVNode; // TODO: 让类组件拥有一个oldVNode属性保存类组件实例对应的虚拟DOM

    let oldDOM = findDomByVNode(oldVNode); // TODO: 将真实DOM保存到对应的虚拟DOM上

    if (this.constructor.getDerivedStateFromProps) {
      let newState = this.constructor.getDerivedStateFromProps(
        this.props,
        this.state
      );
      this.state = { ...this.state, ...newState };
    }

    let snapshot =
      this.getSnapshotBeforeUpdate &&
      this.getSnapshotBeforeUpdate(prevProps, prevState);

    let newVNode = this.render();

    updateDomTree(oldVNode, newVNode, oldDOM);

    this.oldVNode = newVNode;

    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapshot);
    }
  }
}
