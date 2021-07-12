import {
  defineComponent, reactive, ref, getCurrentInstance, watch, toRaw, nextTick,
} from 'vue';
import { dateUtils, dateRange } from '@/utils';
import { IMPORTANT_TYPE, AUCTION_STATUS, PROCESS } from '@/static';
import DateTime from './yc-date-picker/yc-date-picker';
// <DateTime v-model={state.DateTimeTest} />
import './style.scss';

export default defineComponent({
  emits: ['handleSearch', 'resetSearch'],
  components: {
    DateTime,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obName: '', // 债务人
      obNumber: '', // 证件号
      orgName: '', // 负责人/机构名称
      important: '', // 匹配类型 0-模糊匹配、1-精确匹配
      pmStatus: '', // 拍卖状态 1:'即将开始', 3:'进行中',5:'已成交',7:'已流拍',9:'中止',11:'撤回'
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
    // 监听开拍时间，选择日期范围后,结束日期置空
    watch(() => state.start, (newVal) => {
      const arr = toRaw(newVal) || [];
      const startDate = arr[0];
      const endDate = arr[1];
      const fn = (i) => dateUtils.formatStandardDate(i);
      const dom = document.getElementsByClassName('el-picker-panel__shortcut');
      if (new Date(endDate).getTime() === 0) {
        state.start = [startDate];
        dateRange().forEach((i, index) => {
          if (fn(i.value[0]) === fn(startDate)) {
            nextTick(() => dom[index].style.color = '#296DD3').then((r) => console.log(r));
          }
        });
      }
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
      emit('handleSearch');
    };

    const resetSearch = () => {
      const { resetFields } = proxy.$refs.monitorForm;
      resetFields();
      state.start = '';
      emit('resetSearch');
    };

    // 展开收起
    const openStatus = ref(false);
    const open = () => {
      openStatus.value = !openStatus.value;
    };

    const isDelete = ref(true);
    const deleteStatus = (val) => {
      isDelete.value = val;
    };

    return {
      state,
      disabledStartDate,
      disabledEndDate,
      handleSearch,
      resetSearch,
      openStatus,
      open,
      deleteStatus,
      isDelete,
    };
  },
  render() {
    const {
      state, disabledStartDate, disabledEndDate, handleSearch, resetSearch, openStatus, open, isDelete,
    } = this;
    return (
      <div>
        <el-form inline={true} model={state} className="monitor-form" ref="monitorForm">
          <div className="monitor-form-line">
            <el-form-item label="债务人：" prop="obName">
              <el-input
                v-model={state.obName}
                placeholder="姓名/公司名称"
                style={{ width: '220px' }}
                onBlur={() => state.obName = state.obName.replace(/\s+/g, '')}
                maxlength="100"
                clearable={true}
              />
            </el-form-item>
            <el-form-item label="证件号：" prop="obNumber">
              <el-input
                v-model={state.obNumber}
                placeholder="身份证号/统一社会信用代码"
                style={{ width: '220px' }}
                maxlength="100"
                onBlur={() => state.obNumber = state.obNumber.replace(/\s+/g, '')}
                clearable={true}
              />
            </el-form-item>
            <el-form-item label="负责人/机构：" prop="orgName">
              <el-input
                v-model={state.orgName}
                placeholder="负责人/机构名称"
                style={{ width: '220px' }}
                onBlur={() => state.orgName = state.orgName.replace(/\s+/g, '')}
                maxlength="100"
                clearable={true}
              />
            </el-form-item>
            <el-form-item label="匹配类型：" prop="important">
              <el-select v-model={state.important}
                         style={{ width: '96px' }}
                         placeholder="请选择匹配类型">
                {
                  IMPORTANT_TYPE.map((item) => <el-option key={item.value} label={item.label} value={item.value}/>)
                }
              </el-select>
            </el-form-item>
            <el-form-item label="拍卖状态：" prop="pmStatus">
              <el-select v-model={state.pmStatus}
                         style={{ width: '96px' }}
                         placeholder="请选择拍卖状态">
                {
                  AUCTION_STATUS.map((item) => <el-option key={item.value} label={item.label} value={item.value}/>)
                }
              </el-select>
            </el-form-item>
            <el-form-item class="open">
              <span onClick={open}>
              { openStatus
                ? <span>收起选项<i className="el-icon-arrow-up open-icon"/></span>
                : <span>展开选项<i className="el-icon-arrow-down open-icon"/></span>
              }
            </span>
            </el-form-item>
          </div>
          <div className="monitor-form-line" v-show={openStatus}>
            <el-form-item label="标题：" style={{ marginLeft: '13px' }} prop="title">
              <el-input
                v-model={state.title}
                placeholder="拍卖信息标题"
                style={{ width: '220px' }}
                onBlur={() => state.title = state.title.replace(/\s+/g, '')}
                maxlength="100"
                clearable={true}
              />
            </el-form-item>
            <el-form-item label="审核时间：">
              <div className="form-item-time">
                <el-form-item prop="approveTimeStart">
                  <el-date-picker
                    type="date"
                    placeholder="开始时间"
                    v-model={state.approveTimeStart}
                    style={{ width: '130px' }}
                    disabledDate={(val) => disabledStartDate(val, 'approveTimeEnd')}
                    popper-class="data-picker"
                    append-to-body={false}
                  />
                </el-form-item>
                <span className="line" style={{ margin: '0 6px' }}>至</span>
                <el-form-item prop="approveTimeEnd">
                  <el-date-picker
                    type="date"
                    placeholder="结束时间"
                    v-model={state.approveTimeEnd}
                    style={{ width: '130px' }}
                    disabledDate={(val) => disabledEndDate(val, 'approveTimeStart')}
                    popper-class="data-picker"
                    append-to-body={false}
                  />
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="匹配时间：">
              <div className="form-item-time">
                <el-form-item prop="createTimeStart">
                  <el-date-picker
                    type="date"
                    placeholder="开始时间"
                    v-model={state.createTimeStart}
                    style={{ width: '130px' }}
                    disabledDate={(val) => disabledStartDate(val, 'createTimeEnd')}
                    popper-class="data-picker"
                    append-to-body={false}
                  />
                </el-form-item>
                <span className="line" style={{ margin: '0 6px' }}>至</span>
                <el-form-item prop="createTimeEnd">
                  <el-date-picker
                    type="date"
                    placeholder="结束时间"
                    v-model={state.createTimeEnd}
                    style={{ width: '130px' }}
                    disabledDate={(val) => disabledEndDate(val, 'createTimeStart')}
                    popper-class="data-picker"
                    append-to-body={false}
                  />
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="开拍时间：" prop="start">
              { /* <DateTime v-model={state.start} key={state.start}/> */ }
              <el-date-picker
                v-model={state.start}
                type="daterange"
                unlink-panels
                class="query-date"
                style={{ width: '286px' }}
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                shortcuts={dateRange()}
                popper-class="date-picker-kp"
                key={state.start}
              />
            </el-form-item>
          </div>
          <div className="monitor-form-line">
            <div className="third-line-item">
              <el-form-item label="更新时间：">
                <div className="form-item-time">
                  <el-form-item prop="updateTimeStart">
                    <el-date-picker
                      type="date"
                      placeholder="开始时间"
                      v-model={state.updateTimeStart}
                      style={{ width: '130px' }}
                      disabledDate={(val) => disabledStartDate(val, 'updateTimeEnd')}
                      popper-class="data-picker"
                      append-to-body={false}
                    />
                  </el-form-item>
                  <span className="line" style={{ margin: '0 6px' }}>至</span>
                  <el-form-item prop="updateTimeEnd">
                    <el-date-picker
                      type="date"
                      placeholder="结束时间"
                      v-model={state.updateTimeEnd}
                      style={{ width: '130px' }}
                      disabledDate={(val) => disabledEndDate(val, 'updateTimeStart')}
                      popper-class="data-picker"
                      append-to-body={false}
                    />
                  </el-form-item>
                </div>
              </el-form-item>
                {
                  isDelete
                    ? <el-form-item label="状态：" prop="process">
                      <el-select v-model={state.process}
                                          style={{ width: '96px' }}
                                          placeholder="请选择拍卖状态">
                      {
                        PROCESS.map((item) => <el-option key={item.value} label={item.label} value={item.value}/>)
                      }
                      </el-select>
                    </el-form-item> : ''
                }
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
                onClick={resetSearch}
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
