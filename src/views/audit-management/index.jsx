import {
  defineComponent, reactive, onMounted, getCurrentInstance, toRaw,
} from 'vue';
import CommonApi from '@/server/api/common';
import { auditTabs } from '@/static/fn';
import { auditColumn } from '@/static/column';
import { selectSlots, timeLineSlots, tableEmptytSlots } from '@/static/slot';
import columnHtml from './business/table';
import modalModule from './business/modal';
import queryModule from './business/query';
import Query from './view/query';
import './style.scss';

const option = [{ label: '正式', val: 1 }, { label: '试用', val: 0 }];

export default defineComponent({

  setup() {
    const { proxy } = getCurrentInstance();
    const treeState = reactive({
      type: 1,
      allList: [],
      treeSelectVal: '',
      treeList: [],
    });
    const {
      openModal, modalState, modalHtml, modalSlots,
    } = modalModule();
    const { formState, onSerch, resetForm } = queryModule();
    const tableState = reactive({
      tableList: [],
      page: 1,
      num: 10,
      total: 0,
    });
    const getTableList = () => {
      const params = toRaw(formState);
      CommonApi.getAuditList(params).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { page, total, list } = data || {};
          tableState.tableList = list;
          tableState.page = page;
          tableState.total = total;
        } else {
          proxy.$message.error('请求出错');
        }
      });
    };
    const tabChange = (isClear) => {
      const { allList } = treeState;
      treeState.treeList = allList.filter((i) => i.type === treeState.type);
      if (isClear === 'clear') {
        formState.orgId = '';
        proxy.$router.push('/auditManagement');
      }
    };
    const treeItemChange = (id, sign) => {
      const { treeList, type } = toRaw(treeState);
      if (sign === 'query' && id) {
        if (!(treeList.filter((i) => i.id === id) || []).length) {
          treeState.type = option.find((i) => i.val !== type).val;
          tabChange();
        }
      }
      formState.orgId = id;
      proxy.$router.push(`/auditManagement${id && '/'}${id}`);
      getTableList();
    };
    const getAllList = () => {
      const { id } = proxy.$route.params;
      CommonApi.listTopOrg().then((res) => {
        const { code, data = [] } = res.data || {};
        if (code === 200) {
          treeState.allList = data;
          tabChange();
          treeItemChange(Number(id) || '', 'query');
        } else {
          proxy.$message.error('请求出错');
        }
      });
    };
    const toDetail = (id) => {
      window.open(`/structureCheck/${id}`, '_blank');
    };
    const ColumnAction = ({ id }) => {
      const { tableType } = formState;
      const fn = Number(tableType) % 2 !== 0;
      return <div className='action-column'>
        <el-button type="text" class='button-link top' onClick={() => toDetail(id)}>结构化校验</el-button>
        {fn && <el-button type="primary" class='button-fourth middle' onClick = {() => openModal('push') }>推送</el-button>}
        {fn && tableType !== '3' && <el-button type="primary" class='button-fourth btm' onClick = {() => openModal('noPush') }>不推送</el-button>}
        {tableType === '4' && <el-button type="primary" class='button-fourth btm' onClick = {() => openModal('reCall') }>召回</el-button>}
      </div>;
    };

    const pageChange = () => {

    };
    const sizeChange = () => {

    };
    onMounted(() => {
      getAllList();
      document.title = '审核管理';
    });
    return {
      treeState,
      treeItemChange,
      tabChange,
      formState,
      onSerch,
      resetForm,
      tableState,
      ColumnAction,
      pageChange,
      sizeChange,
      modalState,
      modalHtml,
      modalSlots,
    };
  },
  render() {
    const {
      treeState,
      formState,
      treeItemChange,
      tabChange,
      tableState,
      ColumnAction,
      pageChange,
      sizeChange,
      modalState,
      modalSlots,
      modalHtml,
    } = this;
    const type = { 0: '试用', 1: '正式' };
    const list = this.treeState.allList.map((i) => ({ ...i, name: `${i.name}（${type[i.type]}` }));
    return (
        <div className="yc-container audit-management-container">
            <div className="content-left">
              <div className="content-left-tree">
                <div className="content-left-tree-query">
                  <el-select v-model={formState.orgId} filterable placeholder="请选择" v-slots={selectSlots} style={{ width: '100%', marginBottom: '16px' }} popper-class='content-left-tree-query-select' >
                    {
                      list.map((i) => <el-option key={i.id} label={i.name} value={i.id} onClick={() => treeItemChange(i.id, 'query')}></el-option>)
                    }
                  </el-select>
                </div>
                <div className="content-left-tree-tabs">
                    <div className="content-left-tree-tabs-content">
                      <el-radio-group v-model={treeState.type} onChange={() => tabChange('clear')}>
                        {
                          option.map((i) => <el-radio-button label={i.val} key={i.val}>{ i.label}</el-radio-button>)
                        }
                      </el-radio-group>
                    </div>
                </div>
                <div className="content-left-tree-list">
                    <div className="content-left-tree-list-title" onClick={() => treeItemChange('')}>
                      <svg className="icon" aria-hidden="true" style={{ width: '18px', height: '18px', marginRight: '8px' }}>
                        <use xlink:href="#iconyonghuyunying-quanbushiyongjigou"></use>
                      </svg>
                      <span className={!formState.orgId ? 'active' : ''}>全部{type[treeState.type]}机构</span>
                    </div>
                    <div className='content-left-tree-list-content'>
                      <el-timeline>
                        {
                          treeState.treeList.map((i) => (
                            <el-timeline-item
                              key={i.id}
                              v-slots={timeLineSlots}
                              onClick={() => treeItemChange(i.id)}
                              className={`${formState.orgId === i.id ? 'active' : ''} el-timeline-item` }
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
              <Query/>
              <div className="content-right-table">
                  <div className="content-right-table-tabs">
                    <el-tabs v-model={formState.tableType}>
                      {
                        auditTabs(23, 2).map((i) => (
                          <el-tab-pane
                            label={i.label}
                            name={i.name}
                            key={i.name}
                          />
                        ))
                      }
                    </el-tabs>
                  </div>
                <div className="content-right-table-list">
                  <el-table
                    data={tableState.tableList}
                    v-loading={tableState.loading}
                    v-slots={tableEmptytSlots}
                    row-key={(val) => val.id}
                  >
                    {
                      auditColumn.map((i) => (
                        <el-table-column label={i.label} key={i.prop} min-width={i.width} className ={i.prop} v-slots={(scope) => <div className='column-item-content'>{columnHtml(scope.row, formState.tableType)[i.prop]}</div>}/>
                      ))
                    }
                    <el-table-column label="操作" min-width='10%' v-slots={(scope) => <ColumnAction {...scope.row}/>}/>
                  </el-table>
                  <el-pagination
                    current-change={pageChange}
                    size-change={sizeChange}
                    background
                    current-page={tableState.page}
                    layout='total, prev, pager, next, jumper'
                    total={tableState.total}
                    key={tableState.page}
                />
                </div>
              </div>
            </div>
          <div className="content-modal yc-custom-modal">
            <el-dialog
              v-model={modalState.visible}
              width={modalState.type === 'reCall' ? '556px' : '500px'}
              destroy-on-close
              show-close={false}
              v-slots={modalSlots}
            >
              {modalHtml[modalState.type]}
            </el-dialog>
          </div>
        </div>
    );
  },
});
