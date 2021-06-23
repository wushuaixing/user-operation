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
    const orgId = ref(id);
    return {
      headerTitle,
      orgId,
    };
  },
  render() {
    const { headerTitle, orgId } = this;
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
                4
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
