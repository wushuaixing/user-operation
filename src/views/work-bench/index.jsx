import { defineComponent, reactive, onMounted } from 'vue';
import './style.scss';
import '@/assets/scroll-number.scss';
import numScroll from '@/utils/number-scroll';
import workbenchApi from '@/server/api/workbench';
import { workbenchTopAsset, columns } from './source';

export default defineComponent({
  setup() {
    const state = reactive({
      dataNum: {
        avgPush: 0,
        expiredOrg: 0,
        formalContractOrg: 0,
        formalOrgObligor: 0,
        historyContract: 0,
        incrFormalOrg: 0,
        incrTrialOrg: 0,
        lastDayPush: 0,
        trialContractOrg: 0,
        trialOrgObligor: 0,
        willExpireFormalOrg: 0,
        willExpireTrialOrg: 0,
      },
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
      ],
      dialogVisible: false,
      params: {
        name: '',
        num: 10,
        page: 1,
        sortColumn: '',
        sortOrder: '',
        type: 1,
      },
      total: 10,
    });

    // 获取各数量
    const getStatistics = () => {
      workbenchApi.getStatistics().then((res) => {
        if (res.data.code === 200) {
          console.log(res.data);
        }
      });
    };

    // 获取列表数据
    const getList = () => {
      workbenchApi.getList().then((res) => {
        if (res.data.code === 200) {
          console.log(res.data);
        }
      });
    };

    const onBlur = () => {
      getList();
    };

    const tabClick = (tab) => {
      console.log(tab);
    };

    const openExportModal = () => {
      console.log('导出了...');
    };

    const sortChange = ({ prop, order }) => {
      console.log(prop, order);
    };

    const pageChange = (page) => {
      console.log(page);
      state.params.page = page;
      console.log(state.params);
    };

    onMounted(() => {
      numScroll('#left_0', 12);
      getStatistics();
      getList();
    });
    return {
      state,
      openExportModal,
      sortChange,
      pageChange,
      onBlur,
      tabClick,
    };
  },
  render() {
    return (
      <div className="workbench-wrapper">
        <div className="workbench-top-content">
          {
            workbenchTopAsset.map((i, index) => <div className="workbench-top-content-item" key={i.key}>
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
                  <div className="num" id={`left_${index}`}>12</div>
                </div>
                <div className="vertical-line" />
                <div className="item-down-child">
                  <div className="subtitle">{i.subtitle_right}</div>
                  <div className="num" id={`right_${index}`}>12</div>
                </div>
              </div>
            </div>)
          }
        </div>
        <div className="workbench-container workbench-org-data">
          <div className="workbench-container-head">
            <div className="content-title">机构数据统计</div>
            <el-tabs onTabClick={this.tabClick}>
              <el-tab-pane label="正式机构" name="1" />
              <el-tab-pane label="试用机构" name="0" />
            </el-tabs>
          </div>
          <div className="workbench-container-operate">
            <el-input
              placeholder="顶级机构名称"
              prefix-icon="el-icon-search"
              onBlur={this.onBlur}
            />
            <el-button
              type="primary"
              class="button-third"
              icon="iconfont iconyonghuyunying-daochu"
              style="padding: 0 11px"
              onClick={this.openExportModal}
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
      </div>
    );
  },
});
