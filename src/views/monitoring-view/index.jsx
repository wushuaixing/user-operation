import { defineComponent, onMounted, reactive } from 'vue';
import * as echarts from 'echarts';
import './index.scss';
import '@/assets/scroll-number.scss';
import totalData from '@/assets/img/total_data.png';
import es from '@/assets/img/es.png';
import iconfont from '@/assets/img/iconsifapaimaishuju.png';
import icon from '@/assets/img/icon.png';
import monitorViewApi from '@/server/api/monitor-view';
import numScroll from '@/utils/number-scroll';
import { dateUtils } from '@/utils';
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
      esDiffNum: 12,
      syncView: {
        auctionNum: 2342,
        esNum: 123412,
        rate: 86,
      },
      model: {
        radio1: '1',
        radio2: '1',
        radio3: '1',
        date1: dateUtils.formatStandardDate(new Date(), 'YYYY-MM-DD'),
        date2: dateUtils.formatStandardDate(new Date(), 'YYYY-MM-DD'),
      },
    });

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

    const dateChange = (value, which) => {
      const val = dateUtils.formatStandardDate(value, 'YYYY-MM-DD');
      if (val) {
        if (which === 'date1') {
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

    onMounted(() => {
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
        state.totalNum = res[0].data.data;
        numScroll('#scroll-focus', state.totalNum, '条');
        state.esDiffNum = res[1].data.data;
        state.syncView = res[2].data.data;
        // chart.echarts1 = drawEcharts(res[3].data.data, 'match-statistics');
        chart.echarts2 = drawEcharts(res[4].data.data, 'data-trend', state.model.date1);
        // chart.echarts3 = drawEcharts(res[5].data.data, 'match-distribute');
        chart.echarts4 = drawEcharts(res[6].data.data, 'data-distribute', state.model.date2);
        chart.echarts5 = drawEcharts(res[7].data.data, 'recall-statistics');
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

      // data: 数据; match: 匹配; statistics: 统计; distribute: 分布; trend: 趋势; recall: 召回;
      // 匹配与推送情况统计图
      const chartDom1 = document.getElementById('match-statistics');
      const myChart1 = echarts.init(chartDom1);
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          textStyle: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 'normal',
          },
          formatter: (params) => (`
            <div>匹配推送情况</div>
            <div>${params[0].name}</div>
            <div class="before blue">${params[0].seriesName}：${params[0].data}条</div>
            <div class="before green">${params[1].seriesName}：${params[1].data}条</div>
        `),
        },
        legend: {
          data: ['匹配数据量', '实际推送量'],
          top: 16,
          right: 24,
          itemGap: 40,
          lineStyle: {
            width: 0,
          },
          textStyle: {
            fontSize: 14,
            color: '#4E5566',
          },
          itemWidth: 8,
          itemHeight: 8,
          selectedMode: false,
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '4%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '匹配数据量',
            type: 'line',
            stack: 'Total',
            symbol: 'circle',
            symbolSize: 7,
            showSymbol: false,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#3180EC' },
                { offset: 1, color: '#5BB4F7' },
              ]),
            },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#3180EC' },
                { offset: 1, color: '#5BB4F7' },
              ]),
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: '实际推送量',
            type: 'line',
            stack: 'Total',
            symbol: 'circle',
            symbolSize: 7,
            showSymbol: false,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#1BBA7C' },
                { offset: 1, color: '#5BDFC6' },
              ]),
            },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#1BBA7C' },
                { offset: 1, color: '#5BDFC6' },
              ]),
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ],
      };
      myChart1.setOption(option);

      // 匹配与推送时间段分布图
      const chartDom3 = document.getElementById('match-distribute');
      const myChart3 = echarts.init(chartDom3);
      myChart3.setOption(option);
    });
    return { state, dateChange, radioChange };
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
                <div><span className="light">少</span><span className="num"><CountTo startVal={0} endVal={state.esDiffNum} /></span><span className="light">条</span></div>
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
                <div style="margin-bottom: 5px;"><span><img src={iconfont} alt=""/>司法拍卖结构化数据量：</span><CountTo startVal={0} endVal={state.syncView.auctionNum} /></div>
                <i className="iconfont iconjiantou1" style="font-size: 60px; color: #2F7EEC;" />
                <div style="margin-top: 5px;"><span><i className="iconfont iconESshujuzengliang" style="color: #FE8E31;" />ES数据增量：</span><CountTo startVal={0} endVal={state.syncView.esNum} /></div>
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
              <el-radio-button label="2">近一年</el-radio-button>
              <el-radio-button label="3">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="match-statistics"></div>
            <p>分析参考：两条曲线重合度越高，说明当前推送情况越好</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.second}>
          <div className="monitor-view-container-head">
            <div className="title">数据增量趋势图</div>
            <el-radio-group onChange={(value) => this.radioChange(value, 'radio3')} v-model={model.radio3}>
              <el-radio-button label="1">近一周</el-radio-button>
              <el-radio-button label="2">近一年</el-radio-button>
              <el-radio-button label="3">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="data-trend" />
            <p>分析参考：数据统计截止到每日凌晨六点，曲线重合度越高，说明数据同步进程越稳定</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.third}>
          <div className="monitor-view-container-head">
            <div className="title">匹配与推送时间段分布图<span>今日统计截止24时</span></div>
            <el-form-item label-width="50px">
              <span>日期：</span>
              <el-date-picker
                type="date"
                placeholder="请选择"
                style="width: 150px"
                v-model={model.date1}
                editable={false}
                onChange={(value) => this.dateChange(value, 'date1')}
              />
            </el-form-item>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="match-distribute" />
            <p>分析参考：两条曲线重合度越高，说明当前推送情况越好</p>
          </div>
        </div>
        <div className="monitor-view-container" v-loading={loading.fourth}>
          <div className="monitor-view-container-head">
            <div className="title">数据增量时间段分布图<span>今日统计截止24时</span></div>
            <el-form-item label-width="50px">
              <span>日期：</span>
              <el-date-picker
                type="date"
                placeholder="请选择"
                style="width: 150px"
                v-model={model.date2}
                editable={false}
                onChange={(value) => this.dateChange(value, 'date2')}
              />
            </el-form-item>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="data-distribute" />
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
