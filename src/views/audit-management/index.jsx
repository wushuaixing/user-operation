import {
  defineComponent, reactive, onMounted, getCurrentInstance,
} from 'vue';

import './style.scss';
// import AdminApi from '@/server/api/admin';

const option = [{ label: '正式', val: 0 }, { label: '试用', val: 1 }];
export default defineComponent({

  setup() {
    const { ctx } = getCurrentInstance();
    console.log(ctx);
    const treeState = reactive({
      type: 0,
      treeList: [],
      treeSelectVal: '',
      activeKey: undefined,
    });
    const handleTreeItemClick = (id) => {
      treeState.activeKey = id;
    };
    onMounted(() => {
      // const params = { status: '0', page: 1, num: 50 };
      // AdminApi.searchOrg(params).then((res) => {
      //   const { code, data } = res.data || {};
      //   if (code === 200) {
      //     const { result: { list } } = data || {};
      //     treeState.treeList = list || [];
      //   } else {
      //     ctx.$message.error('请求出错');
      //   }
      // });
    });
    return { treeState, handleTreeItemClick };
  },
  render() {
    const {
      treeState,
      handleTreeItemClick,
    } = this;
    const selectSlots = {
      prefix: () => <span className="iconfont iconsousuo"></span>,
    };
    const timeLineSlots = {
      dot: () => <b style={{ width: '8px', height: '1px', background: '#C5C7CE' }}></b>,
    };
    return (
        <div className="yc-container audit-management-container">
            <div className="content-left">
              <div className="content-left-tree">
                <div className="content-left-tree-query">
                  <el-select v-model={treeState.treeSelectVal} filterable placeholder="请选择" v-slots={selectSlots} style={{ width: '100%', marginBottom: '16px' }}>
                    {
                      treeState.treeList.map((i) => <el-option key={i.id} label={i.name} value={i.id}></el-option>)
                    }
                  </el-select>
                </div>
                <div className="content-left-tree-tabs">
                    <div className="content-left-tree-tabs-content">
                      <el-radio-group v-model={treeState.type}>
                        {
                          option.map((i) => <el-radio-button label={i.val} key={i.val}>{ i.label}</el-radio-button>)
                        }
                      </el-radio-group>
                    </div>
                </div>
                <div className="content-left-tree-list">
                    <div className="content-left-tree-list-title">
                      <svg className="icon" aria-hidden="true" style={{ width: '18px', height: '18px', marginRight: '8px' }}>
                        <use xlink:href="#iconyonghuyunying-quanbushiyongjigou"></use>
                      </svg>
                      <span>全部正式机构</span>
                    </div>
                    <div className='content-left-tree-list-content'>
                      <el-timeline>
                        {
                          treeState.treeList.map((i) => (
                            <el-timeline-item
                              key={i.id}
                              v-slots={timeLineSlots}
                              onClick={() => handleTreeItemClick(i.id)}
                              className={`${treeState.activeKey === i.id ? 'active' : ''} el-timeline-item` }
                            >
                              {i.name}
                            </el-timeline-item>))
                        }
                      </el-timeline>

                    </div>
                </div>
              </div>
            </div>
            <div className="content-right">
              <div className="content-right-query">
                开发中..........
              </div>
              <div className="content-right-table"></div>
            </div>
        </div>
    );
  },
});
