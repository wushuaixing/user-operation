import orgData from '@/assets/img/org_data.png';
import newAddDebtor from '@/assets/img/newadd_debtor.png';
import corOrg from '@/assets/img/cor_org.png';
import outDate from '@/assets/img/outdate.png';
import monitorDebtor from '@/assets/img/monitor_debtor.png';

const workbenchTopAsset = [
  {
    img: orgData,
    title: '正式机构数据推送量',
    describe: '',
    subtitle_left: '昨日数据推送量',
    subtitle_right: '近半年日均推送量',
    key: 1,
  },
  {
    img: newAddDebtor,
    title: '昨日新增债务人',
    describe: '',
    subtitle_left: '正式机构',
    subtitle_right: '试用机构',
    key: 2,
  },
  {
    img: corOrg,
    title: '合作机构数',
    describe: '历史合作机构总数：',
    subtitle_left: '正式机构',
    subtitle_right: '试用机构',
    key: 3,
  },
  {
    img: outDate,
    title: '即将过期机构数',
    describe: '过期两个月内机构总数：',
    subtitle_left: '正式机构',
    subtitle_right: '试用机构',
    key: 4,
  },
  {
    img: monitorDebtor,
    title: '监控债务人数',
    describe: '',
    subtitle_left: '正式机构',
    subtitle_right: '试用机构',
    key: 5,
  },
];
const columns = [
  {
    prop: 'orgName',
    label: '顶级合作机构',
    align: 'left',
    key: 1,
  },
  {
    prop: 'endDate',
    label: '合同结束日期',
    align: 'left',
    sortable: 'custom',
    key: 2,
  },
  {
    prop: 'newAddDebtor',
    label: '昨日新增债务人数',
    align: 'center',
    sortable: 'custom',
    key: 3,
  },
  {
    prop: 'yesterdayNum',
    label: '昨日推送量',
    align: 'center',
    sortable: 'custom',
    key: 4,
  },
  {
    prop: 'lastWeekDebtor',
    label: '上周新增债务人数',
    align: 'center',
    sortable: 'custom',
    key: 5,
  },
  {
    prop: 'lastWeekNum',
    label: '上周推送量',
    align: 'center',
    sortable: 'custom',
    key: 6,
  },
];
export {
  workbenchTopAsset,
  columns,
};
