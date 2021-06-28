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

const RemarkInfo = (props) => <ul className='column-item-info'>
    <p>根据“姜修平”匹配 |{props.createTime}</p>
    <p>姜修平为拍卖资产的所有人</p>
</ul>;
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

const columnHtml = (props) => {
  const { status = '' } = props || {};
  const obj = PUSH_STATUS.find((i) => status === i.value) || {};
  return {
    assetInfo: AssetInfo(props),
    remarkInfo: RemarkInfo(props),
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
