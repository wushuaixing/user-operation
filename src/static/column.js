//账号管理列表
const accountManagementColumn = [
  {
    prop: "id",
    label: "ID",
    width: "190",
    sort: false,
    align:'left',
    class:'id',
  },
  {
    prop: "phone",
    label: "账号",
    width: "256",
    sort: false,
    align:'left',
    class:'phone',
  },
  {
    prop: "name",
    label: "姓名",
    width: "188",
    sort: false,
    align:'left',
    class:'name',
  },
  {
    prop: "orgNum",
    label: "负责顶级机构数",
    width: "262",
    sort: "custom",
    align:'center',
    class:'org-num',
  },
  {
    prop: "obligorNum",
    label: "债务人数",
    width: "320",
    sort: "custom",
    align:'center',
    class:'obligor-num',
  },
];

//账号管理列表
const taskAssignColumn = [
  {
    prop: "id",
    label: "ID",
    sort: false,
    align:'left',
    class:'id',
  },
  {
    prop: "orgName",
    label: "顶级合作机构",
    sort: false,
    align:'left',
    class:'org-name',
  },
  {
    prop: "type",
    label: "机构类型",
    sort: false,
    align:'left',
    class:'type',
  },
  {
    prop: "orgNum",
    label: "客户使用机构数",
    sort: "custom",
    align:'center',
    class:'org-num',
  },
  {
    prop: "obligorNum",
    label: "债务人数",
    sort: "custom",
    align:'center',
    class:'obligor-num',
  },
];

export { accountManagementColumn, taskAssignColumn };
