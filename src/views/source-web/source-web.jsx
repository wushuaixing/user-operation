import { defineComponent, getCurrentInstance } from 'vue';
import './style.scss';

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const getHtmlData = () => {
    };
  },
  render() {
    return (
      <div>
      </div>
    );
  },
})
