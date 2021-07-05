import { defineComponent } from 'vue';
import './style.scss';

export default defineComponent({
  props: {
    data: Object,
  },
  render() {
    const { data } = this;
    return (
      <div>
        <div className="zc-info">
          <span className="zc-info-title">债务人</span>：
          <span className="zc-info-cent">{data.obName}</span>
        </div>
        <div className="zc-info">
          <span className="zc-info-title">证件号</span>：
          <span className="zc-info-cent">{data.obNumber || '-' }</span>
        </div>
        <div className="zc-info">
          <span className="zc-info-title">所在省份</span>：
          <span className="zc-info-cent">{data.address || '-'}</span>
        </div>
        <div className="zc-info">
          <span className="zc-info-title long">负责人/机构</span>：
          <span className="zc-info-cent-long">{data.orgName || '-'}</span>
        </div>
        <div className="zc-info">
          <span className="zc-info-title">更新时间</span>：
          <span className="zc-info-cent">{data.updateTime || '-'}</span>
        </div>
        { data.important === 1 ? <svg class="icon jz" aria-hidden="true" style="font-size: 37px;">
          <use xlink:href="#iconjingzhun" />
        </svg> : ''}
      </div>
    );
  },
});
