import { defineComponent } from 'vue';
import './style.scss';

export default defineComponent({
  setup() {

  },
  render() {
    return (
      <div className="monitor-manage">
        <div className="monitor-manage-header">
          1
        </div>
        <div className="monitor-manage-body">
          <div className="left-tree">
            2
          </div>
          <div className="query-data">
            <div className="query-area">
              3
            </div>
            <div className="data-area">
              4
            </div>
          </div>
        </div>
      </div>
    );
  },
});
