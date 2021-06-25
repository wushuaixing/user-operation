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
        <span className="zc-info">
          <span className="zc-info-title">债务人</span>：
          <span className="zc-info-cent">{}</span>
        </span>
      </div>
    );
  },
});
