import {
  defineComponent, reactive, onMounted, getCurrentInstance, toRaw, watch,
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
      readNotNum: '',
      recallNum: '',
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
    const typeChange = (isClear) => {
      const { allList, type } = treeState;
      treeState.treeList = allList.filter((i) => i.type === treeState.type);
      if (isClear === 'clear') {
        formState.orgId = '';
        proxy.$router.push(`/auditManagement/${type ? -1 : -2}`);
      }
    };
    const treeItemChange = (id, sign) => {
      const { treeList, type } = toRaw(treeState);
      let orgId = id;
      if (sign === 'all') {
        orgId = type ? -1 : -2;
      }
      if (sign === 'query') {
        if (id < 0) {
          treeState.type = id === -1 ? 1 : 0;
        } else if (!(treeList.filter((i) => i.id === id) || []).length) {
          treeState.type = option.find((i) => i.val !== type).val;
        }
        typeChange();
      }
      formState.orgId = id < 0 ? '' : id;
      proxy.$router.push(`/auditManagement/${orgId}`);
      getTableList();
    };
    const getTreeList = () => {
      const { id } = proxy.$route.params;
      CommonApi.listTopOrg().then((res) => {
        const { code, data = [] } = res.data || {};
        if (code === 200) {
          treeState.allList = data;
          typeChange();
          treeItemChange(Number(id) || '', 'query');
        } else {
          proxy.$message.error('请求出错');
        }
      });
    };
    const toDetail = (auctionId) => {
      window.open(`/structureCheck/${auctionId}`, '_blank');
    };

    const ColumnAction = (props) => {
      const { auctionId } = props || {};
      console.log(props);
      const { tableType } = formState;
      const fn = Number(tableType) % 2 !== 0;
      return <div className='action-column'>
        <el-button type="text" class='button-link top' onClick={() => toDetail(auctionId)}>结构化校验</el-button>
        {fn && <el-button type="primary" class='button-fourth middle' onClick = {() => openModal('push', props) }>推送</el-button>}
        {fn && tableType !== '3' && <el-button type="primary" class='button-fourth btm' onClick = {() => openModal('noPush', props) }>不推送</el-button>}
        {tableType === '4' && <el-button type="primary" class='button-fourth btm' onClick = {() => openModal('reCall', props) }>召回</el-button>}
      </div>;
    };
    const getNum = () => {
      const { orgId } = formState;
      CommonApi.auditCountNum({ orgId, type: 0 }).then((res) => {
        const { code, data = {} } = res.data || {};
        if (code === 200) {
          const { readNotNum, recallNum } = data;
          tableState.readNotNum = readNotNum || '0';
          tableState.recallNum = recallNum || '0';
        }
      });
    };
    const pageChange = () => {

    };
    watch(() => formState.tableType, (newVal, oldVal) => {
      if (newVal !== oldVal) getTableList();
    });
    onMounted(() => {
      getTreeList();
      getNum();
      document.title = '审核管理';
    });
    return {
      treeState,
      treeItemChange,
      typeChange,
      formState,
      onSerch,
      resetForm,
      tableState,
      ColumnAction,
      pageChange,
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
      typeChange,
      tableState,
      ColumnAction,
      pageChange,
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
                      <el-radio-group v-model={treeState.type} onChange={() => typeChange('clear')}>
                        {
                          option.map((i) => <el-radio-button label={i.val} key={i.val}>{ i.label}</el-radio-button>)
                        }
                      </el-radio-group>
                    </div>
                </div>
                <div className="content-left-tree-list">
                    <div className="content-left-tree-list-title" onClick={() => treeItemChange('', 'all')}>
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
                        auditTabs(tableState.readNotNum, tableState.recallNum).map((i) => (
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
