import { defineComponent, getCurrentInstance, reactive } from 'vue';
import MyOrgApi from '@/server/api/my-org';
import './style.scss';

const tabList = [
  {
    label: '竞买公告',
    name: 'biddingAnnouncement',
  },
  {
    label: '标的物介绍',
    name: 'subjectMatterIntroduction',
  },
  {
    label: '竞价成功确认书',
    name: 'auctionSuccessConfirmation',
  },
];
// 寻找是否有图片标签
const findImgTag = (html) => {
  const reg = /<img*/;
  return reg.test(html);
};
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const tab = reactive({
      tabKey: 'biddingAnnouncement',
    });
    const tabChange = (val) => {
      console.log(val);
    };
    const htmlData = reactive({
      data: {
        attachList: [],
        auctionSuccessConfirmation: '',
        biddingAnnouncement: '',
        subjectMatterIntroduction: '',
        title: '',
        url: '',
      },
      showTabs: [],
    });

    const getHtmlData = (id) => {
      MyOrgApi.htmlDetail(id).then((res) => {
        const { code, data, message } = res.data;
        if (code === 200) {
          // 渲染页面
          htmlData.data = { ...data };
          htmlData.showTabs = [];
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < tabList.length; i++) {
            const item = data[tabList[i].name];
            if (item) {
              const isImgTab = findImgTag(item);
              htmlData.showTabs.push(Object.assign(tabList[i], { isImgTab }));
            }
          }
          // htmlData.showTabs = tabList.filter((item) => data[item.name]);
        } else {
          proxy.$message.error(message);
        }
      });
    };
    const { id } = proxy.$route.query;
    getHtmlData(id);

    return {
      htmlData,
      tab,
      tabChange,
    };
  },
  render() {
    const {
      data, showTabs,
    } = this.htmlData;
    const { tabChange } = this;
    return (
      <div className="yc-newpage-contaner">
        <div className="yc-source-web">
          <div className="yc-source-web-title">
            <a
              className="button-link source-title"
              href={data.url}
              target='_blank'
            >{data.title}</a>
          </div>
          <div className="yc-source-web-content">
            <div className="yc-source-web-content-tab">
                {
                  showTabs.map((item) => (
                    <div key={item.name} onClick={() => tabChange(item)} className="">
                      {item.isImgTab && <svg class="icon" aria-hidden="true" style={{ fontSize: '17px' }}>
                        <use xlink:href="#icontu"/>
                      </svg>
                      }
                      <a href={`#${item.name}`}>{item.label}</a>
                    </div>
                  ))
                }
            </div>
            <div className="yc-source-web-content-html" v-html={data.subjectMatterIntroduction}>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
