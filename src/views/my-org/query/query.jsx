import { defineComponent, reactive } from 'vue';
import './style.scss';
import { dateUtils } from '@/utils';

const query = defineComponent({
  setup() {
    const state = reactive({
      name: '',
      start: undefined,
      end: undefined,
    });
    const handleSearch = () => {

    };
    const resetSearch = () => {

    };
    // 日期控件做前后限制
    const disabledStartDate = (startTime) => {
      if (state.end) {
        const time = dateUtils.formatStandardDate(state.end);
        return startTime.getTime() > new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const disabledEndDate = (endTime) => {
      if (state.start) {
        const time = dateUtils.formatStandardDate(state.start);
        return endTime.getTime() < new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    return () => (
      <el-form inline={true} model={state} class="query-form">
        <el-form-item label="顶级合作机构名称：">
          <el-input
            v-model={state.name}
            placeholder="请输入机构名称"
            style={{ width: '220px' }}
            maxlength="100"
            clearable={true}
        />
      </el-form-item>
        <el-form-item label="合同结束日期：">
          <div className="form-item-time">
            <el-form-item prop="start">
              <el-date-picker
                type="date"
                placeholder="开始日期"
                v-model={ state.start }
                style={{ width: '130px' }}
                disabledDate={ disabledStartDate }
                popper-class="data-picker"
                append-to-body={false}
            />
        </el-form-item>
        <span className="line" style={{ margin: '0 6px' }}>至</span>
        <el-form-item prop="end">
          <el-date-picker
            type="date"
            placeholder="结束日期"
            v-model={state.end}
            style={{ width: '130px' }}
            disabledDate={ disabledEndDate }
            popper-class="data-picker"
            append-to-body={false}
          />
        </el-form-item>
        </div>
        </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              onClick={ handleSearch(true) }
              class="button-first"
              style={{ padding: '0 21px' }}
            >搜索</el-button
            >
            <el-button
              type="primary"
              onClick={ resetSearch(false) }
              class="button-fourth"
              style={{ padding: '0 11px' }}
            >清空搜索条件</el-button>
        </el-form-item>
      </el-form>
    );
  },

});
export default query;
