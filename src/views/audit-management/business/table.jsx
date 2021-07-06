import { PUSH_STATUS } from '@/static';
import RemarkInfo from '@/components/column-pane/remark-info';
import AssetInfo from '@/components/column-pane/asset-info';
import AuctionInfo from '@/components/column-pane/auction-info';

const columnHtml = (props, tabType) => {
  const { status = '' } = props || {};
  const obj = PUSH_STATUS.find((i) => status === i.value) || {};
  const levelType = {
    3: '一级',
    4: '二级',
    5: '三级',
    6: '四级',
    7: '五级',
    8: '六级',
  };
  const level = levelType[props.level];
  const levelHtml = level ? `【${level}】${props.conSumerName || ''}` : '-';
  return {
    assetInfo: AssetInfo(props),
    remarkInfo: RemarkInfo(props, tabType),
    auctionInfo: AuctionInfo(props),
    conSumerName: levelHtml,
    status: obj.label,
  };
};
export default columnHtml;
