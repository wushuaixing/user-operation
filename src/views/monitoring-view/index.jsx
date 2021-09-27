import { defineComponent, onMounted, reactive } from 'vue';
import * as echarts from 'echarts';
import './index.scss';
import '@/assets/scroll-number.scss';
import CountTo from '@/components/vue-count-to/vue-countTo.vue';
import totalData from '@/assets/img/total_data.png';
import es from '@/assets/img/es.png';
import CircleProgress from './circle-progress';

export default defineComponent({
  setup() {
    const state = reactive({
      percent: 87,
      startVal: 0,
      endVal: 0,
    });
    onMounted(() => {
      // data: 数据; match: 匹配; statistics: 统计; distribute: 分布; trend: 趋势; recall: 召回;
      // 匹配与推送情况统计图
      const chartDom1 = document.getElementById('match-statistics');
      const myChart1 = echarts.init(chartDom1);
      const option = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['匹配数据量', '推送数据量'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: false,
          },
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
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: '推送数据量',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ],
      };
      myChart1.setOption(option);

      // 数据增量趋势图
      const chartDom2 = document.getElementById('data-trend');
      const myChart2 = echarts.init(chartDom2);
      myChart2.setOption(option);

      // 匹配与推送时间段分布图
      const chartDom3 = document.getElementById('match-distribute');
      const myChart3 = echarts.init(chartDom3);
      myChart3.setOption(option);

      // 数据增量时间段分布图
      const chartDom4 = document.getElementById('data-distribute');
      const myChart4 = echarts.init(chartDom4);
      myChart4.setOption(option);

      // 召回情况统计图
      const chartDom5 = document.getElementById('recall-statistics');
      const myChart5 = echarts.init(chartDom5);
      myChart5.setOption(option);
      const timer = setInterval(() => {
        state.endVal += (2000 / state.percent);
        if (state.endVal >= state.percent) {
          state.endVal = state.percent;
          clearInterval(timer);
        }
      }, 1000 / 60);
    });
    const progressSlot = {
      title: null,
      default: () => <>
        <span className="percentage-label">数据同步率</span><br />
        <CountTo startVal={0} endVal={87} suffix="%" />
      </>,
    };
    return {
      state,
      progressSlot,
    };
  },
  render() {
    return (
      <div className="monitor-view-wrapper">
        <div className="monitor-view-container">
          <div className="monitor-view-container-up">
            <div className="left">
              <div><img src={totalData} alt=""/></div>
              <div>
                <div className="desc">司法拍卖结构化数据总量</div>
                <div><span className="num">1231</span>条</div>
              </div>
            </div>
            <div className="right">
              <div><img src={es} alt=""/></div>
              <div>
                <div className="desc">ES同步情况</div>
                <div><span className="light">少</span><span className="num">111</span><span className="light">条</span></div>
              </div>
            </div>
          </div>
          <div className="monitor-view-container-down">
            <div className="monitor-view-container-head">
              <div className="title">数据同步情况监控</div>
              <el-radio-group>
                <el-radio-button label="0">昨天</el-radio-button>
                <el-radio-button label="1">前天</el-radio-button>
                <el-radio-button label="2">近一周</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <CircleProgress stroke-width={10} percentage={87} width={120} />
            </div>
          </div>
        </div>
        <div className="monitor-view-container">
          <div className="monitor-view-container-head">
            <div className="title">匹配与推送情况统计图</div>
            <el-radio-group>
              <el-radio-button label="0">近一周</el-radio-button>
              <el-radio-button label="1">近一年</el-radio-button>
              <el-radio-button label="2">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="match-statistics" />
            <p>分析参考：两条曲线重合度越高，说明当前推送情况越好</p>
          </div>
        </div>
        <div className="monitor-view-container">
          <div className="monitor-view-container-head">
            <div className="title">数据增量趋势图</div>
            <el-radio-group>
              <el-radio-button label="0">近一周</el-radio-button>
              <el-radio-button label="1">近一年</el-radio-button>
              <el-radio-button label="2">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="data-trend" />
            <p>分析参考：数据统计截止到每日凌晨六点，曲线重合度越高，说明数据同步进程越稳定</p>
          </div>
        </div>
        <div className="monitor-view-container">
          <div className="monitor-view-container-head">
            <div className="title">匹配与推送时间段分布图<span>今日统计截止24时</span></div>
            <el-form-item label-width="50px">
              <span>日期：</span>
              <el-date-picker
                type="date"
                placeholder="请选择"
                style="width: 150px"
              />
            </el-form-item>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="match-distribute" />
            <p>分析参考：两条曲线重合度越高，说明当前推送情况越好</p>
          </div>
        </div>
        <div className="monitor-view-container">
          <div className="monitor-view-container-head">
            <div className="title">数据增量时间段分布图<span>今日统计截止24时</span></div>
            <el-form-item label-width="50px">
              <span>日期：</span>
              <el-date-picker
                type="date"
                placeholder="请选择"
                style="width: 150px"
              />
            </el-form-item>
          </div>
          <div className="monitor-view-container-content">
            <div className="echarts-block" id="data-distribute" />
            <p>分析参考：曲线重合度越高，说明当前数据新增及同步情况越好</p>
          </div>
        </div>
        <div className="monitor-view-container">
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
