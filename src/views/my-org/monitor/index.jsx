import { defineComponent, getCurrentInstance, ref } from 'vue';
import { monitorTabs } from '@/static/fn';
import Tree from './tree/tree';
import Query from './query/query';
import Table from './table/table';
import './style.scss';

export default defineComponent({
  components: {
    Tree,
    Query,
    Table,
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
    const tabChange = (val) => {
      console.log(val, 'tab');
    };
    return {
      headerTitle,
      orgId,
      unReadNum,
      tabKey,
      tabChange,
    };
  },
  render() {
    const {
      headerTitle, orgId, tabKey, tabChange, unReadNum,
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
                    { monitorTabs(unReadNum).map((item) => (
                      <el-tab-pane
                        key={item.value}
                        label={item.label}
                        name={item.value}
                      />
                    )) }
                  </el-tabs>
                </div>
                <Table/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
