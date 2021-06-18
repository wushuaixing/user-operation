import { defineComponent, reactive } from 'vue';

import './style.scss';

const option = [{ label: '正式', val: 0 }, { label: '试用', val: 1 }];

const App = defineComponent({
  setup() {
    const state = reactive({
      type: 0,
      numList: [{
        lable: '我负责的顶级机构数',
        val: 27,
        icon: '#iconjigou',
        key: 'org',
      },
      {
        lable: '本周新增负责机构数',
        val: 1,
        icon: '#iconxinzengjigou',
        key: 'new',
      }, {
        lable: '即将过期机构数',
        val: 3,
        icon: '#iconguoqijigou\n',
        key: 'old',
      }, {
        lable: '监控债务人总数',
        val: 314,
        icon: '#iconzhaiwuren',
        key: 'debtor',
      }],
    });
    const handleChange = () => {
      console.log(state.type);
    };

    return () => (
      <div className="yc-container my-org-container">
        <div className="header">
          <div className="header-left">
            <div className="header-left-btn-box">
              <el-radio-group v-model={state.type} onChange={handleChange}>
                {
                  option.map((i) => <el-radio-button label={i.val} key={i.val}>{ i.label}</el-radio-button>)
                }
              </el-radio-group>
            </div>
          </div>
          <ul className="header-right">
            {
              state.numList.map((i) => (
                  <li key={i.key} >
                    <div>
                      <svg className="icon" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                        <use xlink:href={i.icon}></use>
                      </svg>
                      {i.lable}
                    </div>
                    <div>{i.val}</div>
                  </li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  },
});

export default App;
