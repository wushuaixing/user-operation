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

    // ????????????
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

    // ?????????????????????
    const timer = setInterval(() => {
      Promise.all([getTotalAuctionNum(), getSyncDiffNum()]).then((res) => {
        const [{ data: { data: totalNum } }, { data: { data: esDiffNum } }] = res;
        state.totalNum = totalNum;
        numScroll('#scroll-focus', totalNum, '???');
        state.esDiffNum = esDiffNum;
      }).catch(() => {
        console.log('????????????...');
      });
    }, 60000);

    onMounted(() => {
      $('.el-picker-panel__footer_custom-style .el-picker-panel__footer .el-button--text span')
        .text('??????');
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
        numScroll('#scroll-focus', totalNum, '???');
        state.esDiffNum = esDiffNum;
        state.syncView = syncView;
        chart.echarts1 = drawEcharts(echartsList1, 'match-statistics');
        chart.echarts2 = drawEcharts(echartsList2, 'data-trend');
        chart.echarts3 = drawEcharts(echartsList3, 'match-distribute', state.model.date1);
        chart.echarts4 = drawEcharts(echartsList4, 'data-distribute', state.model.date2);
        chart.echarts5 = drawEcharts(echartsList5, 'recall-statistics');
      }).catch(() => {
        console.log('????????????...');
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
                <div className="desc">?????????????????????????????????</div>
                <div><div className="num" id="scroll-focus">{state.totalNum}</div></div>
              </div>
            </div>
            <div className="right">
              <div><img src={es} alt=""/></div>
              <div>
                <div className="desc">ES????????????<span>
                  <el-tooltip
                    className="item"
                    effect="dark"
                    content="?????????????????????????????????????????????"
                    placement="top"
                  >
                    <img src={icon} alt=""/>
                  </el-tooltip>
                </span>
                </div>
                <div><span className="light">{state.esDiffNum > 0 ? '???' : '???'}</span><span className="num" style="margin: 0 8px;"><CountTo startVal={0} endVal={Math.abs(state.esDiffNum)} /></span><span className="light">???</span></div>
              </div>
            </div>
          </div>
          <div className="monitor-view-container-down">
            <div className="monitor-view-container-head">
              <div className="title">????????????????????????</div>
              <el-radio-group onChange={(value) => this.radioChange(value, 'radio1')} v-model={model.radio1}>
                <el-radio-button label="1">??????</el-radio-button>
                <el-radio-button label="2">??????</el-radio-button>
                <el-radio-button label="3">?????????</el-radio-button>
              </el-radio-group>
            </div>
            <div className="monitor-view-container-down-content">
              <div className="desc">
                <div className="left">
                  <div><span><img src={iconfont} alt=""/>?????????????????????????????????</span></div>
                  <div><span><i className="iconfont iconESshujuzengliang" style="color: #FE8E31;" />ES???????????????</span></div>
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
            <div className="title">??????????????????????????????</div>
            <el-radio-group onChange={(value) => this.radioChange(value, 'radio2')} v-model={model.radio2}>
              <el-radio-button label="1">?????????</el-radio-button>
              <el-radio-button label="2">?????????</el-radio-button>
              <el-radio-button label="3">??????</el-radio-button>
            </el-radio-group>
          </div>
          <div className="monitor-view-container-content relative">
            <div className="echarts-block" id="match-statistics" />
            <div className="legend-custom">
              <span className="before blue">???????????????</span>
              <span className="before green">???????????????</span>
              <el-tooltip
                effect="dark"
                content="???????????????????????????????????????????????????????????????"
                placement="top"
              >
                <img src={icon} alt="" />
              </el-tooltip>
            </div>
            <p>???????????????????????????????????????????????????????????????????????????</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.second}>
          <div className="monitor-view-container-head">
            <div className="title">?????????????????????</div>
            <el-radio-group onChange={(value) => this.radioChange(value, 'radio3')} v-model={model.radio3}>
              <el-radio-button label="1">?????????</el-radio-button>
              <el-radio-button label="2">?????????</el-radio-button>
              <el-radio-button label="3">??????</el-radio-button>
            </el-radio-group>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="data-trend" />
            <p>????????????????????????????????????????????????????????????????????????</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.third}>
          <div className="monitor-view-container-head">
            <div className="title">?????????????????????????????????{dateUtils.formatStandardDate(new Date()) === state.model.date1 ? <span>??????????????????{new Date().getHours()}???</span> : ''}</div>
            <el-form-item label-width="50px">
              <span>?????????</span>
              <el-date-picker
                type="date"
                placeholder="?????????"
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
            <div className="x-unit">(???)</div>
            <p>???????????????????????????????????????????????????????????????????????????</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.fourth}>
          <div className="monitor-view-container-head">
            <div className="title">??????????????????????????????{dateUtils.formatStandardDate(new Date()) === state.model.date2 ? <span>??????????????????{new Date().getHours()}???</span> : ''}</div>
            <el-form-item label-width="50px">
              <span>?????????</span>
              <el-date-picker
                type="date"
                placeholder="?????????"
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
            <div className="x-unit">(???)</div>
            <p>????????????????????????????????????????????????????????????????????????????????????</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.fifth}>
          <div className="monitor-view-container-head">
            <div className="title">?????????????????????</div>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="recall-statistics" />
            <p>???????????????????????????????????????????????????????????????????????????????????????</p>
          </div>
        </div>
    </div>);
  },
});
