import { ASSETS_INFO, PUSH_STATUS, AUCTION_INFO } from '@/static';

const selectSlots = {
  prefix: () => <span className="iconfont iconsousuo"></span>,
};
const timeLineSlots = {
  dot: () => <b style={{ width: '8px', height: '1px', background: '#C5C7CE' }}></b>,
};

const AssetInfo = (props) => <div className='column-item-info'>
  <ul>
    {
      ASSETS_INFO.map((i) => (
        <li>
          <div>{i.lable}：</div>
          <div>{props[i.key]}</div>
        </li>
      ))
    }
  </ul>
</div>;

const RemarkInfo = (props, tabType) => {
  const {
    recallRemark, approveTime, reason, createTime, shenHeRemark, status,
  } = props;
  const isShenHe = ['2', '3', '4'].includes(tabType);
  const obj = isShenHe ? {
    approveTime,
    label: '审核备注',
    detail: shenHeRemark,
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
        <p className='remark-info-detail'>{obj.detail}</p>
      </>
    }
    <p className='before-circle'>根据{reason[0].name}匹配 | {createTime}</p>
    <p v-html={reason[0].hl[0]} className='remark-info-detail'></p>
  </div>;
};
const AuctionInfo = (props) => {
  const { url, parsingTitle } = props;
  return <div className='column-item-info auction-info'>
    <div className="title">
      <a href={url}>{parsingTitle}</a>
    </div>
    <ul>
      {
        AUCTION_INFO.map((i) => (
          <li>
            <div>{i.lable}：</div>
            <div>{props[i.key]}</div>
          </li>
        ))
      }
    </ul>
  </div>;
};

const columnHtml = (props, tabType) => {
  const { status = '' } = props || {};
  const obj = PUSH_STATUS.find((i) => status === i.value) || {};
  return {
    assetInfo: AssetInfo(props),
    remarkInfo: RemarkInfo(props, tabType),
    auctionInfo: AuctionInfo(props),
    conSumerName: props.conSumerName,
    status: obj.label,
  };
};
export {
  selectSlots,
  timeLineSlots,
  AssetInfo,
  columnHtml,
};
