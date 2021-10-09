import {
  defineComponent,
  onMounted,
  reactive,
  onUnmounted,
} from 'vue';
import './index.scss';
import '@/assets/scroll-number.scss';
import totalData from '@/assets/img/total_data.png';
import es from '@/assets/img/es.png';
import iconfont from '@/assets/img/iconsifapaimaishuju.png';
import icon from '@/assets/img/icon.png';
import arrowDown from '@/assets/img/arrow_down.png';
import monitorViewApi from '@/server/api/monitor-view';
import numScroll from '@/utils/number-scroll';
import { dateUtils } from '@/utils';
import $ from 'jquery';
import drawEcharts from '@/views/monitoring-view/draw-echarts';
import CountTo from '@/components/vue-count-to/vue-countTo.vue';
import CircleProgress from './circle-progress';

export default defineComponent({
  setup() {
    const {
      getTotalAuctionNum,
      getSyncDiffNum,
      getSyncView,
      getPushView,
      getDataIncrView,
      getPushViewOfDay,
      getDataIncrViewOfDay,
      getRecallView,
    } = monitorViewApi;
    const state = reactive({
      loading: {
        first: true,
        second: true,
        third: true,
        fourth: true,
        fifth: true,
      },
      totalNum: 0,
      esDiffNum: 0,
      syncView: {
        auctionNum: 0,
        esNum: 0,
        rate: 0,
      },
      model: {
        radio1: '1',
        radio2: '1',
        radio3: '1',
        date1: dateUtils.formatStandardDate(new Date()),
        date2: dateUtils.formatStandardDate(new Date()),
      },
    });

    const disabledDate = (time) => time > new Date();

    // radio
    const radioChange = (value, which) => {
      switch (which) {
        case 'radio1':
          getSyncView(value).then((res) => {
            if (res.data.code === 200) {
              const { data } = res.data;
              state.syncView = data;
            }
          });
          break;
        case 'radio2':
          state.loading.first = true;
          getPushView(value).then((res) => {
            if (res.data.code === 200) {
              const { data } = res.data;
              state.loading.first = false;
              drawEcharts(data, 'match-statistics');
            }
          }).finally(() => {
            state.loading.first = false;
          });
          break;
        case 'radio3':
          state.loading.second = true;
          getDataIncrView(value).then((res) => {
            if (res.data.code === 200) {
              const { data } = res.data;
              state.loading.second = false;
              drawEcharts(data, 'data-trend');
            }
          }).finally(() => {
            state.loading.second = false;
          });
          break;
        default:
          break;
      }
    };

    // 选择日期
    const dateChange = (value, which) => {
      const val = dateUtils.formatStandardDate(value, 'YYYY-MM-DD');
      if (val) {
        if (which === 'date1') {
          state.model.date1 = val;
          state.loading.third = true;
          getPushViewOfDay(val).then((res) => {
            if (res.data.code === 200) {
              const { data } = res.data;
              state.loading.third = false;
              drawEcharts(data, 'match-distribute', val);
            }
          }).finally(() => {
            state.loading.third = false;
          });
        }
        if (which === 'date2') {
          state.model.date2 = val;
          state.loading.fourth = true;
          getDataIncrViewOfDay(val).then((res) => {
            if (res.data.code === 200) {
              const { data } = res.data;
              state.loading.fourth = false;
              drawEcharts(data, 'data-distribute', val);
            }
          }).finally(() => {
            state.loading.fourth = false;
          });
        }
      }
    };

    // 每分钟轮询一次
    const timer = setInterval(() => {
      Promise.all([getTotalAuctionNum(), getSyncDiffNum()]).then((res) => {
        const [{ data: { data: totalNum } }, { data: { data: esDiffNum } }] = res;
        state.totalNum = totalNum;
        numScroll('#scroll-focus', totalNum, '条');
        state.esDiffNum = esDiffNum;
      }).catch(() => {
        console.log('网络异常...');
      });
    }, 60000);

    onMounted(() => {
      $('.el-picker-panel__footer_custom-style .el-picker-panel__footer .el-button--text span')
        .text('今天');
      const { model } = state;
      const chart = {};
      Promise.all([
        getTotalAuctionNum(),
        getSyncDiffNum(),
        getSyncView(model.radio1),
        getPushView(model.radio2),
        getDataIncrView(model.radio3),
        getPushViewOfDay(model.date1),
        getDataIncrViewOfDay(model.date2),
        getRecallView(),
      ]).then((res) => {
        const [
          { data: { data: totalNum } },
          { data: { data: esDiffNum } },
          { data: { data: syncView } },
          { data: { data: echartsList1 } },
          { data: { data: echartsList2 } },
          { data: { data: echartsList3 } },
          { data: { data: echartsList4 } },
          { data: { data: echartsList5 } },
        ] = res;
        state.totalNum = totalNum;
        numScroll('#scroll-focus', totalNum, '条');
        state.esDiffNum = esDiffNum;
        state.syncView = syncView;
        chart.echarts1 = drawEcharts(echartsList1, 'match-statistics');
        chart.echarts2 = drawEcharts(echartsList2, 'data-trend');
        chart.echarts3 = drawEcharts(echartsList3, 'match-distribute', state.model.date1);
        chart.echarts4 = drawEcharts(echartsList4, 'data-distribute', state.model.date2);
        chart.echarts5 = drawEcharts(echartsList5, 'recall-statistics');
      }).catch(() => {
        console.log('请求失败...');
      }).finally(() => {
        Object.keys(state.loading).forEach((key) => {
          state.loading[key] = false;
        });
      });

      window.onresize = () => {
        Object.keys(chart).forEach((key) => {
          chart[key].resize();
        });
      };
    });

    onUnmounted(() => {
      if (timer) clearInterval(timer);
    });
    return {
      state,
      dateChange,
      radioChange,
      disabledDate,
    };
  },
  render() {
    const { state: { model, loading }, state } = this;
    return (
      <div className="monitor-view-wrapper">
        <div className="monitor-view-container">
          <div className="monitor-view-container-up">
            <div className="left">
              <div><img src={totalData} alt=""/></div>
              <div>
                <div className="desc">司法拍卖结构化数据总量</div>
                <div><div className="num" id="scroll-focus">{state.totalNum}</div></div>
              </div>
            </div>
            <div className="right">
              <div><img src={es} alt=""/></div>
              <div>
                <div className="desc">ES同步情况<span>
                  <el-tooltip
                    className="item"
                    effect="dark"
                    content="同步后的数据与原表数据差值情况"
                    placement="top"
                  >
                    <img src={icon} alt=""/>
                  </el-tooltip>
                </span>
                </div>
                <div><span className="light">{state.esDiffNum > 0 ? '多' : '少'}</span><span className="num" style="margin: 0 8px;"><CountTo startVal={0} endVal={Math.abs(state.esDiffNum)} /></span><span className="light">条</span></div>
              </div>
            </div>
          </div>
          <div className="monitor-view-container-down">
            <div className="monitor-view-container-head">
              <div className="title">数据同步情况监控</div>
              <el-radio-group onChange={(value) => this.radioChange(value, 'radio1')} v-model={model.radio1}>
                <el-radio-button label="1">昨天</el-radio-button>
                <el-radio-button label="2">前天</el-radio-button>
                <el-radio-button label="3">近一周</el-radio-button>
              </el-radio-group>
            </div>
            <div className="monitor-view-container-down-content">
              <div className="desc">
                <div className="left">
                  <div><span><img src={iconfont} alt=""/>司法拍卖结构化数据量：</span></div>
                  <div><span><i className="iconfont iconESshujuzengliang" style="color: #FE8E31;" />ES数据增量：</span></div>
                </div>
                <div className="right">
                  <div className="weight"><CountTo startVal={0} endVal={state.syncView.auctionNum} /></div>
                  <div style="text-align: center;"><img style="width: 12px;height: 60px" src={arrowDown} alt="" /></div>
                  <div className="weight"><CountTo startVal={0} endVal={state.syncView.esNum} /></div>
                </div>
              </div>
              <CircleProgress stroke-width={10} percentage={state.syncView.rate} width={120} />
            </div>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.first}>
          <div className="monitor-view-container-head">
            <div className="title">匹配与推送情况统计图</div>
            <el-radio-group onChange={(value) => this.radioChange(value, 'radio2')} v-model={model.radio2}>
              <el-radio-button label="1">近一周</el-radio-button>
              <el-radio-button label="2">近一月</el-radio-button>
              <el-radio-button label="3">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div className="monitor-view-container-content relative">
            <div className="echarts-block" id="match-statistics" />
            <div className="legend-custom">
              <span className="before blue">匹配数据量</span>
              <span className="before green">实际推送量</span>
              <el-tooltip
                effect="dark"
                content="实际推送量为当天匹配数据中实际推送的数据量"
                placement="top"
              >
                <img src={icon} alt="" />
              </el-tooltip>
            </div>
            <p>分析参考：两条曲线重合度越高，说明当前推送情况越好</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.second}>
          <div className="monitor-view-container-head">
            <div className="title">数据增量趋势图</div>
            <el-radio-group onChange={(value) => this.radioChange(value, 'radio3')} v-model={model.radio3}>
              <el-radio-button label="1">近一周</el-radio-button>
              <el-radio-button label="2">近一月</el-radio-button>
              <el-radio-button label="3">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="data-trend" />
            <p>分析参考：曲线重合度越高，说明数据同步进程越稳定</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.third}>
          <div className="monitor-view-container-head">
            <div className="title">匹配与推送时间段分布图{dateUtils.formatStandardDate(new Date()) === state.model.date1 ? <span>今日统计截止{new Date().getHours()}时</span> : ''}</div>
            <el-form-item label-width="50px">
              <span>日期：</span>
              <el-date-picker
                type="date"
                placeholder="请选择"
                style="width: 150px"
                v-model={model.date1}
                editable={false}
                disabledDate={this.disabledDate}
                popper-class="el-picker-panel__footer_custom-style"
                onChange={(value) => this.dateChange(value, 'date1')}
              />
            </el-form-item>
          </div>
          <div className="monitor-view-container-content relative">
            <div className="echarts-block" id="match-distribute" />
            <div className="x-unit">(时)</div>
            <p>分析参考：两条曲线重合度越高，说明当前推送情况越好</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.fourth}>
          <div className="monitor-view-container-head">
            <div className="title">数据增量时间段分布图{dateUtils.formatStandardDate(new Date()) === state.model.date2 ? <span>今日统计截止{new Date().getHours()}时</span> : ''}</div>
            <el-form-item label-width="50px">
              <span>日期：</span>
              <el-date-picker
                type="date"
                placeholder="请选择"
                style="width: 150px"
                v-model={model.date2}
                editable={false}
                disabledDate={this.disabledDate}
                popper-class="el-picker-panel__footer_custom-style"
                onChange={(value) => this.dateChange(value, 'date2')}
              />
            </el-form-item>
          </div>
          <div className="monitor-view-container-content relative">
            <div className="echarts-block" id="data-distribute" />
            <div className="x-unit">(时)</div>
            <p>分析参考：曲线重合度越高，说明当前数据新增及同步情况越好</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.fifth}>
          <div className="monitor-view-container-head">
            <div className="title">召回情况统计图</div>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="recall-statistics" />
            <p>分析参考：在正常范围内，曲线越平稳，说明数据推送情况越正常</p>
          </div>
        </div>
    </div>);
  },
});
