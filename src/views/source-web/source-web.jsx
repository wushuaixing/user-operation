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
];
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
        auctionSuccessConfirmation: null,
        biddingAnnouncement: '',
        subjectMatterIntroduction: '',
        title: '',
        url: '',
      },
    });

    const getHtmlData = (id) => {
      MyOrgApi.htmlDetail(id).then((res) => {
        const { code, data, message } = res.data;
        if (code === 200) {
          // 渲染页面
          console.log(data);
          htmlData.data = { ...data };
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
      url, title, subjectMatterIntroduction,
    } = this.htmlData.data;
    const { tab, tabChange } = this;
    return (
      <div className="yc-newpage-contaner">
        <div className="yc-source-web">
          <div className="yc-source-web-title">
            <a
              className="button-link source-title"
              href={url}
              target='_blank'
            >{title}</a>
          </div>
          <div className="yc-source-web-content">
            <div className="yc-source-web-content-tab">
              <el-tabs v-model={tab.tabKey} onTabClick={tabChange} class="monitor-tabs">
                { tabList.map((item) => (
                  <el-tab-pane
                    label={item.label}
                    name={item.name}
                    key={item.name}/>
                ))
                }
              </el-tabs>
            </div>
            <div className="yc-source-web-content-html" v-html={subjectMatterIntroduction}>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
