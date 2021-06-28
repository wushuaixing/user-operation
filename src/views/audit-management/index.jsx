import {
  defineComponent, reactive, onMounted, getCurrentInstance, toRaw,
} from 'vue';

import './style.scss';
import MyOrgApi from '@/server/api/my-org';
import { auditTabs, ModalTitle } from '@/static/fn';
import {
  AUCTION_STATUS, IMPORTANT_TYPE, PUSH_STATUS,
} from '@/static/index';
import { auditColumn } from '@/static/column';
import { floatFormat } from '@/utils';
import {
  selectSlots, timeLineSlots, columnHtml,
} from './data';

const option = [{ label: '正式', val: 1 }, { label: '试用', val: 0 }];
const text = {
  title: '确认召回本条信息吗？',
  text: '点击确定，本条信息将被召回到结构化匹配列表中',
};
export default defineComponent({

  setup() {
    const { proxy } = getCurrentInstance();
    const treeState = reactive({
      type: 1,
      allList: [],
      treeSelectVal: '',
      treeList: [],
    });
    const formState = reactive({
      approveTimeEnd: '2021-01-01', // 审核结束时间
      approveTimeStart: '2021-01-01', // 审核开始时间
      conSumerName: '', // 客户使用机构
      createTimeEnd: '2021-01-01', // 匹配结束时间
      createTimeStart: '2021-01-01', // 匹配开始时间
      important: '', // 匹配类型 0-模糊匹配、1-精确匹配
      num: 20, // 每页条数，默认20 ,示例值(20)
      obName: '', // 债务人
      obNumber: '', // 证件号
      orgId: '', // 机构id
      orgName: '', // 负责人/机构名称
      orgType: '', // 机构类型 0 试用 1 正式
      page: 1, //
      parsingTitle: '', // 标题
      pmStatus: '', // 拍卖状态 1:'即将开始', 3:'进行中',5:'已成交',7:'已流拍',9:'中止',11:'撤回'
      sortColumn: '', // 排序字段,可用值:AUCTIONTIME,UPDATETIME
      sortOrder: '', // 排序顺序,可用值:ASC,DESC
      startEnd: '2021-01-01', // 开拍开始时间 ,示例值(2021-01-01)
      startStart: '2021-01-01', // 开拍开始时间 ,示例值(2021-01-01)
      status: '', // 状态 0未推送 1已推送 5不推送 2已召回 3已退回 4已修改
      tableType: '1', // 查询列表标签 1:结构化匹配 2:已推送 3:不推送 4:客户未读 5:召回
      updateTimeEnd: '2021-01-01', // 更新结束时间 ,示例值(2021-01-01)
      updateTimeStart: '2021-01-01', // 更新开始时间 ,示例值(2021-01-01)
    });
    const tableState = reactive({
      tableList: [{
        obName: '姜修平(19760719 男)', // 债务人
        obNumber: '372801197607198314', // 证件号
        address: '山东省临沂市鼓楼区', // 所在省份
        orgName: '保全李四', // 负责人/机构
        updateTime: '2020-07-14 15:48', // 更新时间

        conSumerName: '【一级】资产保全部', // 客户使用机构

        reason: [{
          role: -1,
          hl: ['工程质量\n\t好\n\n\t外观\n\t外墙涂料\n\n\t新旧程度\n\t成新率为85%\n\n\t物业服务\n\t无物'
          + '业管理\n\n\t使用及维护状况\n\t较好\n\n\t小区概况\n\t小区住宅底商房地产\n\n\t特殊景观\n\t无\n\n\n（三）权益状况描述与分析\n权益状况表\n\t项目\n\t描述与分析\n\n\t用途\n\t商业用房\n\n\t规划条件\n\t商业用房\n\n\t所有权\n\t<em>王</em><em>霞</em>、蔡龙\n\n\t土地使用权\n\t<em>王</em><em'],
          name: '王霞',
        }], // 审核备注&匹配备注
        recallRemark: '', // 召回备注
        approveTime: '2020-07-14', // 审核时间
        auctionId: 0, // 资产ID
        shenHeRemark: '审核备注',
        createTime: '2020-07-14', // 匹配时间
        id: 0, //
        level: 0, // 层级 1 顶级域名机构 2 顶级虚拟机构
        orgId: '', // 机构id

        parsingTitle: '姜修平所有的深喉口固定台式压力机等设备一宗', // 标题
        url: 'www.baidu.com', //
        court: '临沂市河东区人民法院', // 处置机关
        province: '河南省', // 省份名称
        start: '2020-07-14 15:48', // 开拍时间
        consultPrice: floatFormat(423423), // 评估价格
        status: 1, // 状态 0未推送 1已推送 5不推送 2已召回 3已退回 4已修改
        pmStatus: 3, // 拍卖状态 1:'即将开始', 3:'进行中',5:'已成交',7:'已流拍',9:'中止',11:'撤回'
        initialPrice: floatFormat(6456654), // 起拍价格
      }],
    });
    const tabChange = (isClear) => {
      const { allList } = treeState;
      treeState.treeList = allList.filter((i) => i.type === treeState.type);
      if (isClear === 'clear') {
        treeState.treeSelectVal = '';
        proxy.$router.push('/auditManagement');
      }
    };
    const treeItemChange = (val, sign) => {
      const { treeList, type } = toRaw(treeState);
      if (sign === 'query' && val) {
        if (!(treeList.filter((i) => i.id === val) || []).length) {
          treeState.type = option.find((i) => i.val !== type).val;
          tabChange();
        }
      }
      treeState.treeSelectVal = val;
      proxy.$router.push(`/auditManagement${val && '/'}${val}`);
    };
    const getAllList = () => {
      const params = { page: 1, num: 50 };
      const { id } = proxy.$route.params;
      MyOrgApi.myOrgList({ type: 1, ...params }).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { myOrgList: { list } } = data || {};
          treeState.allList = list.map((i) => ({ id: i.id, name: i.name, type: 1 })) || [];
        } else {
          proxy.$message.error('请求出错');
        }
      });
      MyOrgApi.myOrgList({ type: 0, ...params }).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { myOrgList: { list } } = data || {};
          treeState.allList = [...toRaw(treeState.allList), ...list.map((i) => ({ id: i.id, name: i.name, type: 0 }))];
          tabChange();
          treeItemChange(Number(id) || '', 'query');
        } else {
          proxy.$message.error('请求出错');
        }
      });
    };
    const onSerch = () => {
      console.log(toRaw(formState));
    };
    const resetForm = () => {
      proxy.$refs.queryForm.resetFields();
    };
    const toDetail = (id) => {
      window.open(`/structureCheck/${id}`, '_blank');
    };
    const modalState = reactive({
      visible: false,
      value: '',
    });
    const ColumnAction = ({ id }) => {
      const { tableType } = formState;
      const fn = Number(tableType) % 2 !== 0;
      return <div className='action-column'>
        <el-button type="text" class='button-link top' onClick={() => toDetail(id)}>结构化校验</el-button>
        {fn && <el-button type="primary" class='button-fourth middle' >推送</el-button>}
        {fn && tableType !== '3' && <el-button type="primary" class='button-fourth btm' >不推送</el-button>}
        {tableType === '4' && <el-button type="primary" class='button-fourth btm' onClick = {() => modalState.visible = true}>召回</el-button>}
      </div>;
    };
    const handleClick = () => {
      modalState.visible = false;
    };
    const modalSlots = {
      title: null,
      footer: () => <>
        <el-button onClick={handleClick}>取 消</el-button>
        <el-button type="primary" onClick={handleClick}>确定</el-button>
      </>,
    };
    onMounted(() => {
      getAllList();
      document.title = '审核管理';
    });
    return {
      treeState,
      treeItemChange,
      tabChange,
      formState,
      onSerch,
      resetForm,
      tableState,
      ColumnAction,
      modalState,
      modalSlots,
    };
  },
  render() {
    const {
      treeState,
      formState,
      treeItemChange,
      tabChange,
      onSerch,
      resetForm,
      tableState,
      ColumnAction,
      modalState,
      modalSlots,
    } = this;
    console.log('render');
    const type = { 0: '试用', 1: '正式' };
    const list = this.treeState.allList.map((i) => ({ ...i, name: `${i.name}（${type[i.type]}` }));
    return (
        <div className="yc-container audit-management-container">
            <div className="content-left">
              <div className="content-left-tree">
                <div className="content-left-tree-query">
                  <el-select v-model={treeState.treeSelectVal} filterable placeholder="请选择" v-slots={selectSlots} style={{ width: '100%', marginBottom: '16px' }} popper-class='content-left-tree-query-select' >
                    {
                      list.map((i) => <el-option key={i.id} label={i.name} value={i.id} onClick={() => treeItemChange(i.id, 'query')}></el-option>)
                    }
                  </el-select>
                </div>
                <div className="content-left-tree-tabs">
                    <div className="content-left-tree-tabs-content">
                      <el-radio-group v-model={treeState.type} onChange={() => tabChange('clear')}>
                        {
                          option.map((i) => <el-radio-button label={i.val} key={i.val}>{ i.label}</el-radio-button>)
                        }
                      </el-radio-group>
                    </div>
                </div>
                <div className="content-left-tree-list">
                    <div className="content-left-tree-list-title" onClick={() => treeItemChange('')}>
                      <svg className="icon" aria-hidden="true" style={{ width: '18px', height: '18px', marginRight: '8px' }}>
                        <use xlink:href="#iconyonghuyunying-quanbushiyongjigou"></use>
                      </svg>
                      <span className={!treeState.treeSelectVal ? 'active' : ''}>全部{type[treeState.type]}机构</span>
                    </div>
                    <div className='content-left-tree-list-content'>
                      <el-timeline>
                        {
                          treeState.treeList.map((i) => (
                            <el-timeline-item
                              key={i.id}
                              v-slots={timeLineSlots}
                              onClick={() => treeItemChange(i.id)}
                              className={`${treeState.treeSelectVal === i.id ? 'active' : ''} el-timeline-item` }
                            >
                              {i.name}
                            </el-timeline-item>))
                        }
                      </el-timeline>
                    </div>
                </div>
              </div>
            </div>
            <div className="content-right">
              <div className="content-right-query">
                <el-form inline={true} model={formState} class="content-right-query-form" ref='queryForm'>
                  <div className="line">
                    <el-form-item label="客户使用机构：" prop='conSumerName'>
                      <el-input
                        v-model={formState.conSumerName}
                        placeholder="客户使用机构名称"
                        style={{ width: '220px' }}
                        maxlength="100"
                      />
                    </el-form-item>
                    <el-form-item label="债务人：" prop='obName'>
                      <el-input
                        v-model={formState.obName}
                        placeholder="姓名/公司名称"
                        style={{ width: '220px' }}
                        maxlength="100"
                      />
                    </el-form-item>
                    <el-form-item label="证件号：" prop='obNumber'>
                      <el-input
                        v-model={formState.obNumber}
                        placeholder="身份证号/统一社会信用代码"
                        style={{ width: '220px' }}
                        maxlength="100"
                      />
                    </el-form-item>
                    <el-form-item label="匹配类型：" prop='important'>
                      <el-select v-model={formState.important} placeholder="请选择" style={{ width: '96px' }}>
                        {
                          IMPORTANT_TYPE.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                        }
                      </el-select>
                    </el-form-item>
                  </div>
                  <div className="line">
                    <el-form-item label="标题：" prop='parsingTitle'>
                      <el-input
                        v-model={formState.parsingTitle}
                        placeholder="拍卖信息标题"
                        style={{ width: '220px' }}
                        maxlength="100"
                      />
                    </el-form-item>
                    <el-form-item label="负责人/机构：" prop='orgName'>
                      <el-input
                        v-model={formState.orgName}
                        placeholder="负责人/机构名称"
                        style={{ width: '220px' }}
                        maxlength="100"
                      />
                    </el-form-item>
                    <el-form-item label="匹配时间：" prop="createTimeStart" style={{ marginRight: 0 }}>
                      <el-date-picker
                        type="date"
                        placeholder="开始时间"
                        v-model={formState.createTimeStart}
                        style="width: 135px"
                      />
                    </el-form-item>
                    <el-form-item label="至" prop="createTimeEnd" class="time-end">
                      <el-date-picker
                        type="date"
                        placeholder="结束时间"
                        v-model={formState.createTimeEnd}
                        style="width: 135px"
                      />
                    </el-form-item>
                    <el-form-item label="拍卖状态：" prop='pmStatus'>
                      <el-select v-model={formState.pmStatus} placeholder="请选择" style={{ width: '96px' }}>
                        {
                          AUCTION_STATUS.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                        }
                      </el-select>
                    </el-form-item>
                    <el-form-item label="状态：" prop='status'>
                      <el-select v-model={formState.status} placeholder="请选择" style={{ width: '96px' }}>
                        {
                          PUSH_STATUS.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                        }
                      </el-select>
                    </el-form-item>
                  </div>
                  <div className="line">
                    <el-form-item label="审核时间：" prop="approveTimeStart" style={{ marginRight: 0 }}>
                      <el-date-picker
                        type="date"
                        placeholder="开始时间"
                        v-model={formState.approveTimeStart}
                        style="width: 135px"
                      />
                    </el-form-item>
                    <el-form-item label="至" prop="approveTimeEnd" class="time-end">
                      <el-date-picker
                        type="date"
                        placeholder="结束时间"
                        v-model={formState.approveTimeEnd}
                        style="width: 130px"
                      />
                    </el-form-item>
                    <el-form-item label="开拍时间：" prop="startStart" style={{ marginRight: 0 }}>
                      <el-date-picker
                        type="date"
                        placeholder="开始时间"
                        v-model={formState.startStart}
                        style="width: 130px"
                      />
                    </el-form-item>
                    <el-form-item label="至" prop="startEnd" class="time-end">
                      <el-date-picker
                        type="date"
                        placeholder="结束时间"
                        v-model={formState.startEnd}
                        style="width: 130px"
                      />
                    </el-form-item>
                    <el-form-item label="更新时间：" prop="updateTimeStart" style={{ marginRight: 0 }}>
                      <el-date-picker
                        type="date"
                        placeholder="开始时间"
                        v-model={formState.updateTimeStart}
                        style="width: 130px"
                      />
                    </el-form-item>
                    <el-form-item label="至" prop="updateTimeEnd" class="time-end">
                      <el-date-picker
                        type="date"
                        placeholder="结束时间"
                        v-model={formState.updateTimeEnd}
                        style="width: 120px"
                      />
                    </el-form-item>
                    <el-form-item style="float: right">
                      <el-button type="primary" onClick={onSerch} class="button-first" style="padding: 8px 21px">搜索</el-button>
                      <el-button type="primary" onClick={resetForm} class="button-fourth" style="padding: 8px 11px">清空搜索条件</el-button>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
              <div className="content-right-table">
                  <div className="content-right-table-tabs">
                    <el-tabs v-model={formState.tableType}>
                      {
                        auditTabs(23, 2).map((i) => (
                          <el-tab-pane
                            label={i.label}
                            name={i.name}
                            key={i.name}
                          />
                        ))
                      }
                    </el-tabs>
                  </div>
                <div className="content-right-table-list">
                  <el-table
                    data={tableState.tableList}
                    v-loading={tableState.loading}
                  >
                    {
                      auditColumn.map((i) => (
                        <el-table-column label={i.label} key={i.prop} min-width={i.width} className ={i.prop} v-slots={(scope) => <div className='column-item-content'>{columnHtml(scope.row, formState.tableType)[i.prop]}</div>}/>
                      ))
                    }
                    <el-table-column label="操作" min-width='10%' v-slots={(scope) => <ColumnAction {...scope.row}/>}/>
                  </el-table>
                </div>
              </div>
            </div>
            <div className="content-modal yc-custom-modal">
              <el-dialog
                v-model={modalState.visible}
                width="556px"
                destroy-on-close
                show-close={false}
                v-slots={modalSlots}
                lock-scroll={false}
              >
                <ModalTitle {...text}/>
                <div className="yc-custom-modal-body">
                  <div className='label'>召回原因描述：</div>
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入内容"
                    v-model={modalState.value}>
                  </el-input>
                </div>
              </el-dialog>
            </div>
        </div>
    );
  },
});
