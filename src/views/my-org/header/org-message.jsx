import { defineComponent } from 'vue';
import './style.scss';
import img from '@/assets/img/icon.png';

const App = defineComponent({
  props: {
    data: Object,
    type: Number,
  },
  render() {
    const {
      newWeekNum = 0, orgNum = 0, totalObligorNum = 0, willExpireNum = 0,
    } = this.data || {};
    const info = this.type === 1
      ? {
        num1: '我负责的顶级机构数',
        num2: '本周新增负责机构数',
      }
      : {
        num1: '全部试用顶级机构数',
        num2: '本周新增试用机构数',
      };
    return (
      <div className="my-org-message">
        <div className="my-org-message-item">
          <div className="up">
            <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
              <use xlink:href="#iconjigou"/>
            </svg>
            <span className="">{info.num1}</span>
          </div>
          <div className="down">
            {orgNum}
          </div>
        </div>
        <div className="divider"/>
        <div className="my-org-message-item">
          <div className="up">
            <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
              <use xlink:href="#iconxinzengjigou"/>
            </svg>
            <span className="">{info.num2}</span>
          </div>
          <div className="down">
            {newWeekNum}
          </div>
        </div>
        <div className="divider"/>
        <div className="my-org-message-item">
          <div className="up">
            <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
              <use xlink:href="#iconguoqijigou"/>
            </svg>
            <span className="">即将过期机构数</span>
            <el-tooltip
              effect="dark"
              content="合同结束日期距今日三个月内"
              placement="top"
            >
              <img src={img} style={{ marginLeft: '5px', cursor: 'pointer' }}/>
            </el-tooltip>
          </div>
          <div className="down">
            {willExpireNum}
          </div>
        </div>
        <div className="divider"/>
        <div className="my-org-message-item">
          <div className="up">
            <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
              <use xlink:href="#iconzhaiwuren"/>
            </svg>
            <span className="">监控债务人总数</span>
          </div>
          <div className="down">
            {totalObligorNum}
            <span style={{
              fontSize: '14px',
              marginLeft: '4px',
            }}>名</span>
          </div>
        </div>
      </div>
    );
  },
});
export default App;
