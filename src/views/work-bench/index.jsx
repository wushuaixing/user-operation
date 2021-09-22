import { defineComponent, reactive } from 'vue';
import './style.scss';
import orgData from '@/assets/img/org_data.png';
import newAddDebtor from '@/assets/img/newadd_debtor.png';
import corOrg from '@/assets/img/cor_org.png';
import monitorDebtor from '@/assets/img/monitor_debtor.png';
import outDate from '@/assets/img/outdate.png';

export default defineComponent({
  setup() {
    const state = reactive({
      workbenchTopAsset: [
        {
          img: orgData,
          title: '正式机构数据推送量',
          describe: '',
          subtitle_left: '昨日数据推送量',
          subtitle_right: '近半年日均推送量',
        },
        {
          img: newAddDebtor,
          title: '昨日新增债务人',
          describe: '',
          subtitle_left: '正式机构',
          subtitle_right: '试用机构',
        },
        {
          img: corOrg,
          title: '合作机构数',
          describe: '历史合作机构总数：',
          subtitle_left: '正式机构',
          subtitle_right: '试用机构',
        },
        {
          img: outDate,
          title: '即将过期机构数',
          describe: '过期两个月内机构总数：',
          subtitle_left: '正式机构',
          subtitle_right: '试用机构',
        },
        {
          img: monitorDebtor,
          title: '监控债务人数',
          describe: '',
          subtitle_left: '正式机构',
          subtitle_right: '试用机构',
        },
      ],
      orgTableData: [
        {
          orgName: 'a机构',
          endDate: '2021-09-22',
          newAddDebtor: 123,
          yesterdayNum: 123,
          lastWeekDebtor: 12,
          lastWeekNum: 124,
        },
        {
          orgName: 'a机构',
          endDate: '2021-09-22',
          newAddDebtor: 123,
          yesterdayNum: 123,
          lastWeekDebtor: 12,
          lastWeekNum: 124,
        },
        {
          orgName: 'a机构',
          endDate: '2021-09-22',
          newAddDebtor: 123,
          yesterdayNum: 123,
          lastWeekDebtor: 12,
          lastWeekNum: 124,
        },
        {
          orgName: 'a机构',
          endDate: '2021-09-22',
          newAddDebtor: 123,
          yesterdayNum: 123,
          lastWeekDebtor: 12,
          lastWeekNum: 124,
        },
        {
          orgName: 'a机构',
          endDate: '2021-09-22',
          newAddDebtor: 123,
          yesterdayNum: 123,
          lastWeekDebtor: 12,
          lastWeekNum: 124,
        },
      ],
    });
    const toExport = () => {
      console.log('导出了...');
    };
    return { state, toExport };
  },
  render() {
    return (
      <div className="workbench-wrapper">
        <div className="workbench-top-content">
          {
            this.state.workbenchTopAsset.map((i) => <div className="workbench-top-content-item">
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
          </div>
          <div className="workbench-container-operate">
            <el-input
              placeholder="顶级机构名称"
              prefix-icon="el-icon-search"
            >
            </el-input>
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
            <el-table data={this.state.orgTableData} style="width: 100%">
              <el-table-column prop="orgName" label="顶级合作机构" />
              <el-table-column prop="endDate" label="合同结束日期" />
              <el-table-column prop="newAddDebtor" label="昨日新增债务人数" align="center" />
              <el-table-column prop="yesterdayNum" label="昨日推送量" align="center" />
              <el-table-column prop="lastWeekDebtor" label="上周新增债务人数" align="center" />
              <el-table-column prop="lastWeekNum" label="上周推送量" align="center" />
            </el-table>
          </div>
        </div>
        <div className="workbench-container workbench-login-data">
          <div className="workbench-container-head">
            <div className="content-title">平台账号登录数量统计</div>
          </div>
        </div>
      </div>
    );
  },
});
