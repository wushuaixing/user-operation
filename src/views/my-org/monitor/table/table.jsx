import { defineComponent, ref } from 'vue';
import { auditColumn } from '@/static/column';
import ZcInfo from '@/components/column-pane/zcInfo';
import PmInfo from '@/components/column-pane/pmInfo';
import { AUCTION_STATUS } from '@/static';

const width = ['20%', '35%', '35%', '10%'];
const column = auditColumn.filter((item, index) => index !== 1).map((item, index) => Object.assign(item, { width: width[index] }));
export default defineComponent({
  components: {
    ZcInfo,
    PmInfo,
  },
  props: {
    tableData: Array,
  },
  setup() {
    const loading = ref(false);
    const setTablePane = (row, type) => {
      if (type === 'zcInfo') return <ZcInfo data={row}/>;
      if (type === 'pmInfo') return <PmInfo data={row}/>;
      if (type === 'ppbzInfo') return <PmInfo data={row}/>;
      const status = AUCTION_STATUS.filter((i) => i.value === row.process.toString())[0].label;
      return <span>{status}</span>;
    };
    return {
      loading,
      setTablePane,
    };
  },
  render() {
    const { loading, setTablePane, tableData } = this;
    return (
      <div className="monitor-table">
        <el-table
          data={tableData}
          style={{ width: '100%' }}
          v-loading={loading}
        >
          { column.map((i) => <el-table-column label={i.label} key={i.class} min-width={i.width} v-slots={(scope) => setTablePane(scope.row, i.prop)}/>)}
        </el-table>
      </div>
    );
  },
});
