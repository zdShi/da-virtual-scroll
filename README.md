###一个简单的自定义的长列表优化插件
####目前的支持范围
1. 固定的高度
2. 仅支持垂直之方向
3. 支持上拉加载更多（需要将加载数据的方法传入插件，在触底是调用）
####主要实现的思路
1. 控制视口内的数据显示(截取总数据中的部分数据) 
   1. OffsetHeight 获取当前的列表外边框高度（根据此高度可以获取，时候最大容纳的内容数量）
   2. scrollTop 获取距离列表区域顶部的距离（根据此距离，和item的高度，获取出去视口顶部的item的index）
   3. 结合视口containerMaxCount，和startIndex可以计算出 endIndex
   4. 可以使用slice(startIndex, endIndex)
2. 监听 @scroll 事件
   1. 处理endIndex === dataList.length-1是行不通的，通过item的数量来计算是行，会在item在视口出现就导致刷新，无法真正到达底部
   2. 需要使用 startIndex + containerMaxCount，需要判断是否加载中，防止停留底部频繁发送异步请求（后续增加了其滚动事件的前置判断，但还是保留此处的更严谨）
   3. 后续改为动态高度，使用item的高度和位置判断
3. 使用padding填充截取数据外的内容
   1. scrollTop - 预留渲染的条目数量 / 单个数量
   2. 底部使用 startIndex + 2背最大容量
4. 简单优化
   1. scroll的监听，按照屏幕的刷新率适应触发
   2. 扩展 startIndex使用 sliceStart 和 sliceEnd，分别在顶部和尾部增加了一屏的内容