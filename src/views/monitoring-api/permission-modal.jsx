import {
  defineComponent, getCurrentInstance, reactive, ref,
} from 'vue';
import { dateUtils } from '@/utils';
import monitorApi from '@/server/api/monitor-api';
import './style.scss';

const remarkItemList = ['延期', '续约', '赠送服务', '提前终止'];
export default defineComponent({
  data() {
    return {
      dataForm: {
        endDate: '',
        isLimitedDebtorNums: 0,
        limitedDebtorNums: 0,
        isLimitedSearchNums: 0,
        limitedSearchNums: 0,
        orgNames: '',
        remark: '',
        startDate: '',
      },
    };
  },
  setup() {
    // 区分弹窗
    const { proxy } = getCurrentInstance();
    const modalData = reactive({
      visible: false,
      loading: false,
      id: '',
      domain: 'wwwwwwwwwwww',
      recordData: [{
        id: 1111,
        processDate: '2021-9-26',
        remark: 'lalallaal',
      },
      {
        id: 1112,
        processDate: '2021-9-26',
        remark: 'lalallaal',
      },
      ],
    });
    const optionList = ref([]);
    const getDetail = (id) => {
      monitorApi.detail(id).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const {
            id: orgId, domain, records, ...state
          } = data || {};
          modalData.id = orgId;
          modalData.domain = domain;
          modalData.recordData = records;
          proxy.dataForm = state;
        }
      });
    };
    const handleOpen = (row) => {
      // 通过id获取详情信息  获取
      const { id } = row;
      modalData.visible = true;
      modalData.id = id;
      getDetail(id);
    };
    const handleClick = () => {
      proxy.$refs.dataForm.validate((volid) => {
        if (volid) {
          modalData.visible = false;
        }
      });
    };
    const handleClose = () => {
      proxy.$refs.dataForm.resetFields();
      modalData.visible = false;
    };
    // 日期控件做前后限制
    const disabledStartDate = (startDate) => {
      if (proxy.dataForm.endDate) {
        const time = dateUtils.formatStandardDate(proxy.dataForm.endDate);
        return startDate.getTime() > new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const disabledEndDate = (endDate) => {
      if (proxy.dataForm.startDate) {
        const time = dateUtils.formatStandardDate(proxy.dataForm.startDate);
        return endDate.getTime() < new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const modalSlots = {
      footer: () => <>
        <el-button onClick={ handleClose }>取消</el-button>
        <el-button type="primary" onClick={handleClick} loading={modalData.loading}>确定</el-button>
      </>,
    };
    const addRemark = (text) => {
      const { remark } = proxy.dataForm;
      proxy.dataForm.remark += remark ? `\n${text}` : text;
    };
    const remarkList = <div className="remark-items">
      {
        remarkItemList.map((i) => <div className="item" onClick={() => addRemark(i)}>{i}</div>)
      }
    </div>;
    const recordList = <el-timeline class="record-area">
      {
        modalData.recordData.map((i) => <el-timeline-item placement="top" key={i.id} hollow>
          <div className="record-area-time">{`处理时间：${i.processDate}`}</div>
          <div className="record-area-cont">{`备注内容：${i.remark}`}</div>
        </el-timeline-item>)
      }
    </el-timeline>;
    const rule = {};
    return {
      modalData,
      optionList,
      handleClose,
      disabledStartDate,
      disabledEndDate,
      modalSlots,
      handleOpen,
      rule,
      remarkList,
      recordList,
    };
  },
  render() {
    const {
      modalData,
      dataForm,
      handleClose,
      disabledStartDate,
      disabledEndDate,
      modalSlots,
      rule,
      remarkList,
      recordList,
    } = this;
    return (
      <el-dialog
        title="权限管理"
        v-model={modalData.visible}
        onClosed={handleClose}
        width="600px"
        v-slots={modalSlots}
      >
        <el-form
          model={dataForm}
          ref="dataForm"
          rules={rule}
          labelPosition="right"
          class="permission-form"
          labelWidth="166px"
        >
          <el-form-item label="ID：">
            <span>{modalData.id}</span>
          </el-form-item>
          <el-form-item label="域名名称：">
            <span>{modalData.domain || '-'}</span>
          </el-form-item>
          <el-form-item label="合作机构名称：">
            <el-input v-model={dataForm.orgNames} placeholder="请输入合作机构名称" style={{ width: '402px' }}/>
          </el-form-item>
          <el-form-item label="合同起止日期：">
            <div className="update-time">
              <el-form-item prop="startDate">
                <el-date-picker
                  type="date"
                  placeholder="开始日期"
                  v-model={dataForm.startDate}
                  style="width: 190px"
                  disabledDate={disabledStartDate}
                  append-to-body={false}
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              <span className="line" style="margin: 0 4px">至</span>
              <el-form-item prop="endDate">
                <el-date-picker
                  type="date"
                  placeholder="结束日期"
                  v-model={dataForm.endDate}
                  style="width: 190px"
                  disabledDate={disabledEndDate}
                  append-to-body={false}
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="限制查询次数：" prop="isLimitedSearchNums">
            <el-col span={10}>
              <el-radio-group size="medium" v-model={dataForm.isLimitedSearchNums}>
                <el-radio label={0}>不限</el-radio>
                <el-radio label={1}>限制</el-radio>
              </el-radio-group>
            </el-col>
            <el-col span={14} v-show={dataForm.isLimitedSearchNums === 1}>
            <el-form-item label="上限：" labelWidth="87px" prop="limitedSearchNums">
              <el-input-number
                v-model={dataForm.limitedSearchNums}
                autocomplete="off"
                min={0}
                max={999999999}
                style={{ width: '180px' }}/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="限制监控债务人数：" prop="isLimitedDebtorNums">
            <el-col span={10}>
              <el-radio-group v-model={dataForm.isLimitedDebtorNums} size="medium">
                <el-radio label={0}>不限</el-radio>
                <el-radio label={1}>限制</el-radio>
              </el-radio-group>
            </el-col>
            <el-col span={14} v-show={dataForm.isLimitedDebtorNums === 1}>
              <el-form-item label="上限："prop="limitedDebtorNums" labelWidth="87px">
                <el-input-number
                  v-model={dataForm.limitedDebtorNums}
                  autocomplete="off"
                  min={0}
                  max={999999999}
                  style={{ width: '180px' }}/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              v-model={dataForm.remark}
              autosize
              type="textarea"
              placeholder="请输入备注"
              show-word-limit={true}
              maxlength={1000}>
            </el-input>
            {remarkList}
          </el-form-item>
          <el-form-item label="处理记录：">
            {recordList}
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
