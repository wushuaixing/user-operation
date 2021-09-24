import { defineComponent } from 'vue';
import './style.scss';
import HeaderMessage from './header-message';

export default defineComponent({
  components: {
    HeaderMessage,
  },
  setup() {

  },
  render() {
    return (
      <div className="monitor-api-content">
        <div className="monitor-api-content-header">
          <span className="monitor-api-content-header-title">API监控管理</span>
          <HeaderMessage ref="HeaderMessage"/>
        </div>
        <div className="monitor-api-content-body">

        </div>
      </div>
    );
  },
});
