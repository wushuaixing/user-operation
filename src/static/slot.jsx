// select 前缀icon
import emptyImg from '@/assets/img/no_data.png';

const selectSlots = {
  prefix: () => <span className="iconfont iconsousuo"></span>,
};
// 时间线自定义节点
const timeLineSlots = {
  dot: () => <b style={{ width: '8px', height: '1px', background: '#C5C7CE' }}></b>,
};
// 表格暂无数据
const tableEmptytSlots = {
  empty: () => <div><img src={emptyImg} alt="" /><p>暂无数据</p></div>,
};
export {
  selectSlots,
  timeLineSlots,
  tableEmptytSlots,
};
