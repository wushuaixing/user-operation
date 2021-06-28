import { defineComponent } from 'vue';
import './style.scss';
import { AUCTION_STATUS } from '@/static';
import { floatFormat } from '@/utils';

export default defineComponent({
  props: {
    data: Object,
  },
  render() {
    // pmStatusTitle, initialPriceText
    const { data } = this;
    const { pmStatus = '', consultPrice, initialPrice } = data;
    const consultPriceText = floatFormat(consultPrice) !== '-' ? `${floatFormat(consultPrice)}` : '-';
    const initialPriceText = floatFormat(initialPrice) !== '-' ? `${floatFormat(initialPrice)}` : '-';
    const text = AUCTION_STATUS.filter((i) => i.value === pmStatus.toString());
    const info = {
      pmStatusTitle: '当前价格',
      initialPriceText: text[0].label,
      textColor: '#20242E',
      moneyColor: '#20242E',
    };
    if (pmStatus === 1) info.pmStatusTitle = '起拍价格';
    if (pmStatus === 3) info.textColor = '#FF871C';
    if (pmStatus === 5) {
      info.pmStatusTitle = '成交价格';
      info.textColor = '#1BBA7C';
      info.moneyColor = '#F93535';
    }
    return (
      <div className="pm">
        <div className="pm-title">
          <a
            class="button-link"
            href={data.url}
            target='_blank'
        >{data.parsingTitle}</a>
        </div>
        <div className="pm-info">
          <div className="pm-info-sider left">
            <span className="pm-info-line">处置机关：<span className="pm-info-text">{data.court || '-'}</span></span>
            <span className="pm-info-line">开拍时间：<span className="pm-info-text">{data.start || '-'}</span></span>
            <span className="pm-info-line">拍卖状态：<span className="pm-info-text" style={{ color: info.textColor }}>{`${info.initialPriceText}`}</span></span>
          </div>
          <div className="pm-info-sider right">
            <span className="pm-info-line">省份名称：<span className="pm-info-text">{data.province || '-'}</span></span>
            <span className="pm-info-line">评估价格：<span className="pm-info-text">{consultPriceText}</span></span>
            <span className="pm-info-line">{info.pmStatusTitle}：<span className="pm-info-text" style={{ color: initialPriceText !== '-' ? info.moneyColor : '' }}>{initialPriceText}</span></span>
          </div>
        </div>
      </div>
    );
  },
});
