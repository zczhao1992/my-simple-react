# 手写简易 React 库

## 项目简介

- 深入理解 React 源码，从零实现 React v17 的核心功能，构建自己的 React 库

### 目录

### 1 初始化渲染

- 1.1 实现函数 React.createElement
- 1.2 实现函数 ReactDOM.render

### 2 类组件与函数组件

- 2.1 实现函数组件渲染 getDomByFunctionComponent
- 2.2 实现类组件渲染 getDomByClassComponent
- 2.3 实现更新并渲染 setState & updater 类
- 2.4 事件合成机制 syntheticEvent
- 2.5 ref & forwardRef

### 3 DOM DIFF

- 3.1 实现 DOM DIFF 算法

### 4 类组件生命周期

- 4.1 实现 componentDidMount、componentDidUpdate、componentWillUnmount
- 4.2 实现 shouldComponentUpdate
- 4.3 实现 getDefirvedStateFromProps
- 4.4 实现 getSnapshotBeforeUpdate

### 5 函数组件性能优化

- 5.1 实现 PureComponent
- 5.2 实现 memo
