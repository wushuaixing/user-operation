import { defineComponent, getCurrentInstance, ref } from 'vue';
import Tree from './tree/tree';
import Query from './query/query';
import './style.scss';

export default defineComponent({
  components: {
    Tree,
    Query,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const { name, id } = proxy.$root.$route.query;
    const headerTitle = `${name}-监控管理`;
    document.title = `【监控管理】${name}`;
    const orgId = ref(id);

    // tab切换
    const tabKey = ref(1);
    const unReadNum = ref(0);
    const slot = {
      label: () => <span>{`客户未读(${unReadNum.value})`}</span>,
    };
    const tabChange = (val) => {
      console.log(val, 'tab');
    };
    return {
      headerTitle,
      orgId,
      unReadNum,
      tabKey,
      tabChange,
      slot,
    };
  },
  render() {
    const {
      headerTitle, orgId, tabKey, tabChange, slot,
    } = this;
    return (
      <div className="yc-newpage-contaner">
        <div className="monitor-manage">
          <div className="monitor-manage-header">
            <span className="header-title">
              {headerTitle}
            </span>
            <span className="data-type">
              <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
                <use xlink:href="#iconshujuleixing"/>
              </svg>
              <span className="middle">当前数据类型：</span>
              <span className="right">资产拍卖</span>
            </span>
          </div>
          <div className="monitor-manage-body">
            <div className="left-tree">
              <Tree
                orgId={orgId}
              />
            </div>
            <div className="query-data">
              <div className="query-area">
                <Query/>
              </div>
              <div className="data-area">
                <div>
                  <el-tabs v-model={tabKey} onTabClick={tabChange}>
                    <el-tab-pane label="已推送" name="1"/>
                    <el-tab-pane name="0" v-slots={slot}>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
