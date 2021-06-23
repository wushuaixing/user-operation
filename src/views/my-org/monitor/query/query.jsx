import {
  defineComponent, onMounted, reactive,
} from 'vue';
import { dateUtils } from '@/utils';
import './style.scss';
// import MyOrgApi from '@/server/api/my-org';

export default defineComponent({
  setup() {
    const state = reactive({
      obName: '', // 债务人
      obNumber: '', // 证件号
      orgName: '', // 负责人/机构名称
      important: 0, // 匹配类型 0-模糊匹配、1-精确匹配
      pmStatus: 0, // 拍卖状态 1:'即将开始', 3:'进行中',5:'已成交',7:'已流拍',9:'中止',11:'撤回'
      title: '', // 标题
      approveTimeStart: '', // 审核开始时间 ,示例值(2021-01-01)
      approveTimeEnd: '', // 审核结束时间 ,示例值(2021-01-01)
      createTimeStart: '', // 匹配开始时间 ,示例值(2021-01-01)
      createTimeEnd: '', // 匹配结束时间 ,示例值(2021-01-01)

      start: '',
      startStart: '', // 开拍开始时间 ,示例值(2021-01-01)
      startEnd: '', // 开拍结束时间 ,示例值(2021-01-01)

      updateTimeStart: '', // 更新开始时间 ,示例值(2021-01-01)
      updateTimeEnd: '', // 更新结束时间 ,示例值(2021-01-01)
      process: '', // 状态 0 未读 3 确认中（资产监控为跟进中） 6 跟进中 9 已完成 12 已忽略 15 已放弃
    });
    // 日期控件做前后限制
    const disabledStartDate = (startTime, prop) => {
      if (state[prop]) {
        const time = dateUtils.formatStandardDate(state[prop]);
        return startTime.getTime() > new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const disabledEndDate = (endTime, prop) => {
      if (state[prop]) {
        const time = dateUtils.formatStandardDate(state[prop]);
        return endTime.getTime() < new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };

    const handleSearch = () => {
      console.log(state, 'state');
    };

    const resetSearch = () => {

    };

    onMounted(() => {
    });

    return {
      state,
      disabledStartDate,
      disabledEndDate,
      handleSearch,
      resetSearch,
    };
  },
  render() {
    const {
      state, disabledStartDate, disabledEndDate, handleSearch, resetSearch,
    } = this;
    return (
      <div>
        <el-form inline={true} model={state} className="monitor-form">
          <div className="monitor-form-line">
            <el-form-item label="债务人：">
              <el-input
                v-model={state.obName}
                placeholder="姓名/公司名称"
                style={{ width: '220px' }}
                maxlength="100"
                clearable={true}
              />
            </el-form-item>
            <el-form-item label="证件号：">
              <el-input
                v-model={state.obNumber}
                placeholder="身份证号/统一社会信用代码"
                style={{ width: '220px' }}
                maxlength="100"
                clearable={true}
              />
            </el-form-item>
            <el-form-item label="负责人/机构：">
              <el-input
                v-model={state.orgName}
                placeholder="负责人/机构名称"
                style={{ width: '220px' }}
                maxlength="100"
                clearable={true}
              />
            </el-form-item>
            <el-form-item label="匹配类型：">

            </el-form-item>
            <el-form-item label="拍卖状态：">

            </el-form-item>
          </div>
          <div className="monitor-form-line line2">
            <el-form-item label="标题：" style={{ marginLeft: '13px' }}>
              <el-input
                v-model={state.title}
                placeholder="拍卖信息标题"
                style={{ width: '220px' }}
                maxlength="100"
                clearable={true}
              />
            </el-form-item>
            <el-form-item label="审核时间：">
              <div className="form-item-time">
                <el-form-item>
                  <el-date-picker
                    type="date"
                    placeholder="开始日期"
                    v-model={state.approveTimeStart}
                    style={{ width: '130px' }}
                    disabledDate={(val) => disabledStartDate(val, 'approveTimeStart')}
                    popper-class="data-picker"
                    append-to-body={false}
                  />
                </el-form-item>
                <span className="line" style={{ margin: '0 6px' }}>至</span>
                <el-form-item>
                  <el-date-picker
                    type="date"
                    placeholder="结束日期"
                    v-model={state.approveTimeEnd}
                    style={{ width: '130px' }}
                    disabledDate={(val) => disabledEndDate(val, 'approveTimeEnd')}
                    popper-class="data-picker"
                    append-to-body={false}
                  />
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="匹配时间：">
              <div className="form-item-time">
                <el-form-item>
                  <el-date-picker
                    type="date"
                    placeholder="开始日期"
                    v-model={state.createTimeStart}
                    style={{ width: '130px' }}
                    disabledDate={(val) => disabledStartDate(val, 'createTimeStart')}
                    popper-class="data-picker"
                    append-to-body={false}
                  />
                </el-form-item>
                <span className="line" style={{ margin: '0 6px' }}>至</span>
                <el-form-item>
                  <el-date-picker
                    type="date"
                    placeholder="结束日期"
                    v-model={state.createTimeEnd}
                    style={{ width: '130px' }}
                    disabledDate={(val) => disabledEndDate(val, 'createTimeEnd')}
                    popper-class="data-picker"
                    append-to-body={false}
                  />
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="开拍时间：">
              <el-date-picker
                v-model={state.start}
                type="daterange"
                align="right"
                unlink-panels
                style={{ width: '286px' }}
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                // shortcuts={shortcuts}
            >
            </el-date-picker>
            </el-form-item>
          </div>
          <div className="monitor-form-line">
            <div className="third-line-item">
              <el-form-item label="更新时间：">
                <div className="form-item-time">
                  <el-form-item>
                    <el-date-picker
                      type="date"
                      placeholder="开始日期"
                      v-model={state.updateTimeStart}
                      style={{ width: '130px' }}
                      disabledDate={(val) => disabledStartDate(val, 'updateTimeStart')}
                      popper-class="data-picker"
                      append-to-body={false}
                    />
                  </el-form-item>
                  <span className="line" style={{ margin: '0 6px' }}>至</span>
                  <el-form-item>
                    <el-date-picker
                      type="date"
                      placeholder="结束日期"
                      v-model={state.updateTimeEnd}
                      style={{ width: '130px' }}
                      disabledDate={(val) => disabledEndDate(val, 'updateTimeEnd')}
                      popper-class="data-picker"
                      append-to-body={false}
                    />
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="状态：">
              </el-form-item>
            </div>
            <el-form-item>
              <el-button
                type="primary"
                onClick={handleSearch}
                class="button-first"
                style={{ padding: '0 21px' }}
              >搜索
              </el-button
              >
              <el-button
                type="primary"
                onClick={resetSearch(false)}
                class="button-fourth"
                style={{ padding: '0 11px' }}
              >清空搜索条件
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    );
  },
});
