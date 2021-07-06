import { AUCTION_STATUS } from '@/static';
import { auctionInfo } from '@/static/fn';
import './style.scss';
import { floatFormat } from '@/utils';

const AuctionInfo = (props) => {
  const {
    url, parsingTitle, consultPrice, initialPrice, pmStatus, ...rest
  } = props;
  const params = {
    ...rest,
    pmStatus: AUCTION_STATUS.find((i) => i.value === pmStatus.toString()).label,
    consultPrice: floatFormat(consultPrice),
    initialPrice: floatFormat(initialPrice),
  };

  return <div className='auction-info'>
    <div className="title"><a href={url} className='button-link' target='_blank'>{parsingTitle || ''}</a></div>
    <ul>
      {
        auctionInfo(pmStatus).map((i) => (
          <li>
            <div>{i.lable}：</div>
            <div className={i.class}>{params[i.key] || '-'}</div>
          </li>
        ))
      }
    </ul>
  </div>;
};

export default AuctionInfo;
