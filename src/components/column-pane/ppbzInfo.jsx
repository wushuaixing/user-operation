import { defineComponent } from 'vue';
import './style.scss';

export default defineComponent({
  props: {
    data: Object,
  },
  render() {
    const { data } = this;
    const {
      reason = '[]', approveTime, createTime, remark = '-',
    } = data;
    const { name = '', hl } = (JSON.parse(reason) || [])[0] || {};
    return (
      <div>
        <p className="pp-title">{`审核备注 | ${approveTime}`}</p>
        <p className="pp-content">{remark || '-'}</p>
        <p className="pp-title">{`根据“${name}”匹配 | ${createTime}`}</p>
        <p v-html={hl} className="pp-content"/>
      </div>
    );
  },
});
