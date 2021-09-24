import { defineComponent } from 'vue';
import '@/views/my-org/header/style.scss';

const App = defineComponent({
  props: {
    data: Object,
    type: Number,
  },
  render() {
    const {
      apiNums = 0, debtorNums = 0, apiExpireNums = 0,
    } = this.data || {};
    const contentList = [
      {
        title: 'API总数',
        number: apiNums,
        img: '#iconAPI',
        hasUnit: false,
      },
      {
        title: 'divide',
      },
      {
        title: '即将过期API数',
        number: apiExpireNums,
        img: '#iconguoqijigou',
        hasUnit: false,
      },
      {
        title: 'divide',
      },
      {
        title: '监控债务人总数',
        number: debtorNums,
        img: '#iconzhaiwuren',
        hasUnit: true,
      },
    ];
    return (
      <div className="my-org-message">
        {
          contentList.map((item) => (item.title !== 'divide'
            ? <div className="my-org-message-item">
                <div className="up">
                  <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
                    <use xlink:href={item.img}/>
                  </svg>
                  <span>{item.title}</span>
                </div>
                <div className="down">
                  {item.number}
                  {item.hasUnit
                    ? <span style={{
                      fontSize: '14px',
                      marginLeft: '4px',
                    }}>名</span>
                    : ''}
                </div>
              </div>
            : <div className="divider"/>))
        }
      </div>
    );
  },
});
export default App;
