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
      tab.tabKey = val.name;
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
      hasOtherAttach: false,
      showTabs: [],
    });

    const getSimilarFile = (id) => {
      console.log(3);
      MyOrgApi.getSimilarFile(id).then((res) => {
        console.log(res, '43');
        const { code, data } = res.data || {};
        htmlData.data.attachList = [];
        if (code === 200) htmlData.data.attachList = data;
      });
    };
    const getHtmlData = (id) => {
      MyOrgApi.htmlDetail(id).then((res) => {
        const { code, data, message } = res.data;
        if (code === 200) {
          // 渲染页面
          document.title = data.title;
          htmlData.data = { ...data };
          htmlData.showTabs = [];
          console.log(data.attachList.length, 'length');
          if (!data.attachList.length) {
            console.log('2');
            htmlData.hasOtherAttach = true;
            getSimilarFile(id);
          }
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
    const { id } = proxy.$route.params;
    getHtmlData(id);

    return {
      htmlData,
      tab,
      tabChange,
    };
  },
  render() {
    const {
      data, showTabs, hasOtherAttach,
    } = this.htmlData;
    const { tabChange, tab } = this;
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
          <el-affix offset={0}>
            <div className="yc-source-web-tab">
              {
                showTabs.map((item) => (
                  <div key={item.name} onClick={() => tabChange(item)} className={tab.tabKey === item.name ? 'yc-source-web-tab-item active' : 'yc-source-web-tab-item'}>
                    {item.isImgTab && <svg class="icon hasImg" aria-hidden="true" style={{ fontSize: '17px' }}>
                      <use xlink:href="#icontu"/>
                    </svg>
                    }
                    <a href={`#${item.name}`}>{item.label}</a>
                  </div>
                ))
              }
            </div>
          </el-affix>
          <div className="yc-source-web-content">
            <div className="yc-source-web-content-html">
              {
                showTabs.map((item) => (
                  <div className="html-item" id={item.name}>
                    <div className="header">
                      <div className="line" />
                      <div className="title">{item.label}</div>
                    </div>
                    <div className="html" v-html={data[item.name]} />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="attachList">
          <div className="attachList-title">本条数据附件</div>
          {
            !hasOtherAttach ? (
              data.attachList.map((item) => (
                <div className="attachList-link">
                  <a key={item.fileId} href={item.url} class="button-link">{item.name}</a>
                </div>
              ))
            ) : <div className="no-data">未找到相关附件</div>
          }
          {
            (hasOtherAttach && data.attachList.length) ? <div className="attachList-title">同组其他相似数据附件</div> : ''
          }
          {
            // eslint-disable-next-line no-nested-ternary
            (hasOtherAttach && data.attachList.length) ? (
              data.attachList.length
                ? data.attachList.map((item) => (
                  <div className="attachList-link">
                    <a key={item.fileId} href={item.url} class="button-link">{item.name}</a>
                  </div>
                )) : <div className="no-data">未找到相关附件</div>) : ''}
        </div>
      </div>
    );
  },
});
