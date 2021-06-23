import {
  defineComponent, reactive, onMounted, getCurrentInstance, watch, toRaw,
} from 'vue';

import './style.scss';
import MyOrgApi from '@/server/api/my-org';

const option = [{ label: '正式', val: 1 }, { label: '试用', val: 0 }];
const selectSlots = {
  prefix: () => <span className="iconfont iconsousuo"></span>,
};
const timeLineSlots = {
  dot: () => <b style={{ width: '8px', height: '1px', background: '#C5C7CE' }}></b>,
};
export default defineComponent({

  setup() {
    const { proxy } = getCurrentInstance();
    const treeState = reactive({
      type: 1,
      allList: [],
      treeSelectVal: '',
      treeList: [],
    });
    const tabChange = () => {
      const { allList } = treeState;
      treeState.treeList = allList.filter((i) => i.type === treeState.type);
      treeState.treeSelectVal = '';
    };
    const treeItemChange = (id) => {
      const { treeList, type } = toRaw(treeState);
      if (!(treeList.filter((i) => i.id === id) || []).length) {
        treeState.type = option.find((i) => i.val !== type).val;
        tabChange();
      }
      treeState.treeSelectVal = id;
    };
    const getAllList = () => {
      const params = { page: 1, num: 50 };
      MyOrgApi.myOrgList({ type: 1, ...params }).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { myOrgList: { list } } = data || {};
          treeState.allList = list.map((i) => ({ id: i.id, name: i.name, type: 1 })) || [];
        } else {
          proxy.$message.error('请求出错');
        }
      });
      MyOrgApi.myOrgList({ type: 0, ...params }).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { myOrgList: { list } } = data || {};
          treeState.allList = [...toRaw(treeState.allList), ...list.map((i) => ({ id: i.id, name: i.name, type: 0 }))];
          tabChange();
        } else {
          proxy.$message.error('请求出错');
        }
      });
    };
    watch(() => [treeState.treeSelectVal], ([treeSelecVal], [oldTreeSelecVal]) => {
      if (treeSelecVal !== oldTreeSelecVal && treeSelecVal) treeItemChange(treeSelecVal);
    });
    onMounted(() => {
      getAllList();
    });
    return { treeState, treeItemChange, tabChange };
  },
  render() {
    const {
      treeState,
      treeItemChange,
      tabChange,
    } = this;
    const type = { 0: '试用', 1: '正式' };
    const list = this.treeState.allList.map((i) => ({ ...i, name: `${i.name}（${type[i.type]}` }));
    console.log(treeState.type);
    return (
        <div className="yc-container audit-management-container">
            <div className="content-left">
              <div className="content-left-tree">
                <div className="content-left-tree-query">
                  <el-select v-model={treeState.treeSelectVal} filterable placeholder="请选择" v-slots={selectSlots} style={{ width: '100%', marginBottom: '16px' }} popper-class='content-left-tree-query-select'>
                    {
                      list.map((i) => <el-option key={i.id} label={i.name} value={i.id}></el-option>)
                    }
                  </el-select>
                </div>
                <div className="content-left-tree-tabs">
                    <div className="content-left-tree-tabs-content">
                      <el-radio-group v-model={treeState.type} onChange={tabChange}>
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
                      <span className={!treeState.treeSelectVal ? 'active' : ''}>全部{type[treeState.type]}机构</span>
                    </div>
                    <div className='content-left-tree-list-content'>
                      <el-timeline>
                        {
                          treeState.treeList.map((i) => (
                            <el-timeline-item
                              key={i.id}
                              v-slots={timeLineSlots}
                              onClick={() => treeItemChange(i.id)}
                              className={`${treeState.treeSelectVal === i.id ? 'active' : ''} el-timeline-item` }
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
