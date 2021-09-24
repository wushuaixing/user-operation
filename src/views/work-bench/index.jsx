import { defineComponent, reactive, onMounted } from 'vue';
import './style.scss';
import * as echarts from 'echarts';
import { workbenchTopAsset, columns } from './source';

export default defineComponent({
  setup() {
    const state = reactive({
      orgTableData: [
        {
          name: 'a机构',
          end: '2021-09-22',
          lastDayObligor: 123,
          lastDayPush: 123,
          lastWeekObligor: 12,
          lastWeekPush: 124,
        },
        {
          name: 'a机构',
          end: '2021-09-22',
          lastDayObligor: 123,
          lastDayPush: 123,
          lastWeekObligor: 12,
          lastWeekPush: 124,
        },
        {
          name: 'a机构',
          end: '2021-09-22',
          lastDayObligor: 123,
          lastDayPush: 123,
          lastWeekObligor: 12,
          lastWeekPush: 124,
        },
        {
          name: 'a机构',
          end: '2021-09-22',
          lastDayObligor: 123,
          lastDayPush: 123,
          lastWeekObligor: 12,
          lastWeekPush: 124,
        },
        {
          name: 'a机构',
          end: '2021-09-22',
          lastDayObligor: 123,
          lastDayPush: 123,
          lastWeekObligor: 12,
          lastWeekPush: 124,
        },
      ],
      dialogVisible: false,
      total: 100,
      page: 1,
    });
    const toExport = () => {
      console.log('导出了...');
    };
    const sortChange = ({ column, prop, order }) => {
      console.log(column, prop, order);
    };
    const pageChange = (page) => {
      console.log(page);
    };
    onMounted(() => {
      const myChart = echarts.init(document.getElementById('echarts-main'));
      myChart.setOption({
        title: {
          text: '这是一个echarts',
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
    });
    return {
      state,
      toExport,
      sortChange,
      pageChange,
    };
  },
  render() {
    return (
      <div className="workbench-wrapper">
        <div className="workbench-top-content">
          {
            workbenchTopAsset.map((i) => <div className="workbench-top-content-item" key={i.key}>
              <div className="item-up">
                <div className="left-block"><img src={i.img} alt="" /></div>
                <div className="right-block">
                  <p className="title">{i.title}</p>
                  {i.describe ? <p className="describe"><span className="label">{i.describe}</span><span className="num">11</span></p> : ''}
                </div>
              </div>
              <div className="item-down">
                <div className="item-down-child">
                  <div className="subtitle">{i.subtitle_left}</div>
                  <div className="num">12</div>
                </div>
                <div className="vertical-line" />
                <div className="item-down-child">
                  <div className="subtitle">{i.subtitle_right}</div>
                  <div className="num">12</div>
                </div>
              </div>
            </div>)
          }
        </div>
        <div className="workbench-container workbench-org-data">
          <div className="workbench-container-head">
            <div className="content-title">机构数据统计</div>
            <el-tabs>
              <el-tab-pane label="正式机构" name="0"></el-tab-pane>
              <el-tab-pane label="试用机构" name="1"></el-tab-pane>
            </el-tabs>
          </div>
          <div className="workbench-container-operate">
            <el-input
              placeholder="顶级机构名称"
              prefix-icon="el-icon-search"
            />
            <el-button
              type="primary"
              class="button-third"
              icon="iconfont iconyonghuyunying-daochu"
              style="padding: 0 11px"
              onClick={this.toExport}
            >一键导出
            </el-button>
          </div>
          <div className="workbench-container-table">
            <el-table data={this.state.orgTableData} onSortChange={this.sortChange}>
              {columns.map((i) => <el-table-column {...i} />)}
            </el-table>
            <el-pagination
              onCurrentChange={this.pageChange}
              current-page="page"
              layout="total, prev, pager, next, jumper"
              total={this.state.total}
            />
          </div>
        </div>
        <div className="workbench-container workbench-login-data">
          <div className="workbench-container-head">
            <div className="content-title">平台账号登录数量统计</div>
          </div>
          <div className="workbench-container-echarts">
            <div id="echarts-main" style={{ width: '600px', height: '400px' }} />
          </div>
        </div>
      </div>
    );
  },
});
