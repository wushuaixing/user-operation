import {
  defineComponent,
  reactive,
  onMounted,
  computed,
  getCurrentInstance,
} from 'vue';
import './style.scss';
import '@/assets/scroll-number.scss';
import icon from '@/assets/img/icon.png';
import CountTo from 'vue-count-to';
import NumberScroll from '@/components/number-scroll';
// import numScroll from '@/utils/number-scroll';
import WorkbenchApi from '@/server/api/workbench';
import { clearEmpty } from '@/utils';
import { workbenchTopAsset, columns } from './source';

export default defineComponent({
  components: {
    CountTo,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      dataNum: {
        avgPush: 1231,
        expiredOrg: 1212,
        formalContractOrg: 12123,
        formalOrgObligor: 431,
        historyContract: 234,
        incrFormalOrg: 250,
        incrTrialOrg: 687,
        lastDayPush: 111,
        trialContractOrg: 222,
        trialOrgObligor: 333,
        willExpireFormalOrg: 444,
        willExpireTrialOrg: 555,
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
      dialogTitle: computed(() => {
        if (state.params.type === '0') return '推送数据导出-试用机构';
        return '推送数据导出-正式机构';
      }),
      date: '',
      params: {
        name: '',
        num: 10,
        page: 1,
        sortColumn: 'DEFAULT',
        sortOrder: '',
        type: '1',
      },
      total: 10,
    });

    // 获取各数量
    const getStatistics = () => {
      WorkbenchApi.getStatistics().then((res) => {
        if (res.data.code === 200) {
          console.log(res.data);
        }
      });
    };

    // 获取列表数据
    const getList = (params) => {
      WorkbenchApi.getList(clearEmpty(params)).then((res) => {
        if (res.data.code === 200) {
          console.log(res.data);
        }
      });
    };

    const onBlur = () => {
      getList(state.params);
    };

    const onKeyup = (e) => {
      if (e.keyCode === 13) {
        getList(state.params);
      }
    };

    const tabClick = () => {
      proxy.$refs.sortTable.clearSort();
      getList(state.params);
    };

    const doExport = () => {
      const { params: { type }, date } = state;
      WorkbenchApi.export(date, type).then((res) => {
        console.log(res.data);
      });
    };

    const sortChange = ({ prop, order }) => {
      const sortField = {
        end: 'EXPIRE',
        lastDayObligor: 'LAST_DAY_OBLIGOR',
        lastDayPush: 'LAST_DAY_NUM',
        lastWeekObligor: 'LAST_WEEK_OBLIGOR',
        lastWeekPush: 'LAST_WEEK_NUM',
      };
      state.params.sortColumn = sortField[prop] || 'DEFAULT';
      state.params.sortOrder = { ascending: 'ASC', descending: 'DESC' }[order];
      getList(state.params);
    };

    const pageChange = (page) => {
      state.params.page = page;
      getList(state.params);
    };

    onMounted(() => {
      // numScroll('#first_left', 121231);
      getStatistics();
      getList(state.params);
    });

    const footerSlot = {
      title: null,
      footer: () => <>
        <span class="dialog-footer">
          <el-button onClick={() => state.dialogVisible = false}>取消</el-button>
          <el-button type="primary" onClick={doExport}>确定</el-button>
        </span>
      </>,
    };
    return {
      state,
      sortChange,
      pageChange,
      onBlur,
      onKeyup,
      tabClick,
      footerSlot,
    };
  },
  render() {
    const { state } = this;
    return (
      <div className="workbench-wrapper">
        <div className="workbench-top-content">
          {
            workbenchTopAsset.map((i) => <div className="workbench-top-content-item" key={i.key}>
              <div className="item-up">
                <div className="left-block"><img src={i.img} alt="" /></div>
                <div className="right-block">
                  <p className="title">{i.title}{i.icon ? <img src={icon} style="width: 14px;margin-left: 5px;"/> : ''}</p>
                  {i.describe
                    ? <p className="describe">
                      <span className="label">{i.describe}</span>
                      <span className="num">{state.dataNum[i.field[2]]}</span>
                    </p>
                    : ''}
                </div>
              </div>
              <div className="item-down">
                <div className="item-down-child">
                  <div className="subtitle">{i.subtitle_left}</div>
                  <div className="num">
                    <NumberScroll id={`${i.id}_left`} num={state.dataNum[i.field[0]]} />
                  </div>
                </div>
                <div className="vertical-line" />
                <div className="item-down-child">
                  <div className="subtitle">{i.subtitle_right}</div>
                  <div className="num">
                    <NumberScroll id={`${i.id}_right`} num={state.dataNum[i.field[1]]} />
                  </div>
                </div>
              </div>
            </div>)
          }
        </div>
        <div className="workbench-container workbench-org-data">
          <div className="workbench-container-head">
            <div className="content-title">机构数据统计</div>
            <el-tabs onTabClick={this.tabClick} v-model={state.params.type}>
              <el-tab-pane label="正式机构" name="1" />
              <el-tab-pane label="试用机构" name="0" />
            </el-tabs>
          </div>
          <div className="workbench-container-operate">
            <el-input
              placeholder="顶级机构名称"
              prefix-icon="el-icon-search"
              v-model_trim={state.params.name}
              onBlur={this.onBlur}
              onKeyup={this.onKeyup}
            />
            <el-button
              type="primary"
              class="button-third"
              icon="iconfont iconyonghuyunying-daochu"
              style="padding: 0 11px"
              onClick={() => state.dialogVisible = true}
            >一键导出
            </el-button>
            <el-dialog
              title={state.dialogTitle}
              close-on-click-modal={false}
              custom-class="export-dialog"
              v-model={state.dialogVisible}
              v-slots={this.footerSlot}
            >
              <el-form-item rules={[{ required: true, message: '请选择推送时间' }]}>
                <span><span style="color: #FD4D4F">*</span>推送时间：</span>
                <el-date-picker type="date" placeholder="请选择" value-format="YYYY-MM" format="YYYY-MM" v-model={this.state.date} />
              </el-form-item>
            </el-dialog>
          </div>
          <div className="workbench-container-table">
            <el-table ref="sortTable" data={state.orgTableData} onSortChange={this.sortChange}>
              {columns.map((i) => <el-table-column {...i} />)}
            </el-table>
            <el-pagination
              onCurrentChange={this.pageChange}
              current-page="page"
              layout="total, prev, pager, next, jumper"
              total={state.total}
            />
          </div>
        </div>
      </div>
    );
  },
});
