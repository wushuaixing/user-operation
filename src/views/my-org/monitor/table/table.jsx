import {
  defineComponent, getCurrentInstance, reactive,
} from 'vue';
import { auditColumn } from '@/static/column';
import ZcInfo from '@/components/column-pane/zcInfo';
import PmInfo from '@/components/column-pane/pmInfo';
import { PROCESS } from '@/static';
import './style.scss';

const width = ['20%', '35%', '35%', '10%'];
const column = auditColumn.filter((item, index) => index !== 1).map((item, index) => Object.assign(item, { width: width[index] }));
export default defineComponent({
  components: {
    ZcInfo,
    PmInfo,
  },
  props: {
    tableData: Object,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const setTablePane = (row, type) => {
      if (type === 'zcInfo') return <ZcInfo data={row}/>;
      if (type === 'pmInfo') return <PmInfo data={row}/>;
      if (type === 'ppbzInfo') return <PmInfo data={row}/>;
      const status = PROCESS.filter((i) => i.value === row.process);
      return <span>{status[0].label}</span>;
    };

    const multiple = reactive({
      isChecked: false,
      multipleSelection: [],
    });
    // 排序
    const handleSortChange = (sort) => {
      // 排序查询
      console.log(sort, 'sort', proxy);
    };

    const handleBatchCheck = (isChecked) => {
      multiple.isChecked = isChecked;
    };
    const handleExport = (val) => {
      console.log(val, 'val');
    };
    return {
      setTablePane, multiple, handleBatchCheck, handleExport, handleSortChange,
    };
  },
  render() {
    const {
      setTablePane, tableData = {}, multiple, handleBatchCheck, handleExport, handleSortChange, pageChange, sizeChange,
    } = this;
    return (
      <div className="monitor-table">
        <div className="table-content-btn">
          <el-button
            type="primary"
            v-show={!multiple.isChecked}
            onClick={() => handleBatchCheck(true)}
            class="button-third"
            icon="iconfont iconyonghuyunying-piliangguanli"
            style={{ padding: '0 11px', marginRight: '12px' }}>
            批量管理
          </el-button>
          <el-button
            type="primary"
            v-show={!multiple.isChecked}
            onClick={() => handleExport('all')}
            class="button-third"
            icon="iconfont iconyonghuyunying-daochu"
            style={{ padding: '0 11px' }}
          >
            一键导出
          </el-button>
          <el-button
            type="primary"
            v-show={multiple.isChecked}
            onClick={() => handleBatchCheck(false)}
            class="button-second"
            style={{ marginRight: '12px' }}
          >取消批量管理
          </el-button>
          <el-button
            onClick={handleExport}
            class="button-fourth"
            v-show={multiple.isChecked}
          >导出
          </el-button>
          <span v-show={(multiple.multipleSelection || []).length} className="total-tips">
            <svg
              class="icon"
              aria-hidden="true"
              style={{
                marginRight: '3px',
                fontSize: '16px',
                position: 'relative',
                top: '1px',
              }}
            >
              <use xlink:href="#iconxuanzhongshuju"/>
            </svg>
            已选中 <b>{(multiple.multipleSelection || []).length}</b> 条数据
            </span>
        </div>
        <el-table
          data={tableData.data}
          style={{ width: '100%' }}
          ref="multipleTable"
          v-loading={tableData.loading}
          tooltip-effect="dark"
          onSelectionChange={(val) => (multiple.multipleSelection = val)}
          onSortChange={handleSortChange}
        >
          { column.map((i) => <el-table-column label={i.label} key={i.class} min-width={i.width} v-slots={(scope) => setTablePane(scope.row, i.prop)}/>)}
        </el-table>
        <el-pagination
          onCurrentChange={pageChange}
          onSizeChange={sizeChange}
          background
          current-page={tableData.page}
          page-sizes={[10, 20, 30, 40, 50]}
          page-size={tableData.num}
          layout="total,sizes, prev, pager, next, jumper"
          total={tableData.total}
          key={tableData.page}
        />
      </div>
    );
  },
});
