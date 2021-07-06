// 匹配备注信息
import './style.scss';

const RemarkInfo = (props, tabType) => {
  const {
    recallRemark, approveTime, reason, createTime, remark, status,
  } = props;
  const dynamicReason = JSON.parse(reason) || [];
  const { hl = [], name } = dynamicReason[0] || {};
  const isShenHe = ['2', '3', '4'].includes(tabType);
  const obj = isShenHe ? {
    approveTime,
    label: '审核备注',
    detail: remark,
    display: true,
  } : {
    approveTime,
    label: '召回备注',
    detail: recallRemark,
    display: tabType === '5' || (status === 2 && tabType === '1'),
  };
  return <div className='remark-info'>
    {
      obj.display && <>
        <p className='before-circle'>{obj.label} | {obj.approveTime}</p>
        <p className='remark-info-detail'>{obj.detail || '-'}</p>
      </>
    }
    <p className='before-circle'>根据{name}匹配 | {createTime}</p>
    <p v-html={hl[0] || '-'} className='remark-info-detail'></p>
  </div>;
};
export default RemarkInfo;
