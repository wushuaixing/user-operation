import {
  defineComponent, getCurrentInstance, reactive, ref, nextTick,
} from 'vue';
import { dateUtils, fileDownload } from '@/utils';
import MyOrgApi from '@/server/api/my-org';
import main from './main';
import './style.scss';

export default defineComponent({
  data() {
    return {
      dataForm: {
        start: undefined,
        end: undefined,
        endTime: undefined,
        id: '',
      },
    };
  },
  setup() {
    // 区分弹窗
    const isData = ref(true);
    const { proxy } = getCurrentInstance();
    const { rules: rule } = main();
    const modalData = reactive({
      visible: false,
      loading: false,
      orgId: '',
      optionList: [],
    });
    // 弹窗打开
    const handleOpen = (flag, row) => {
      isData.value = flag === 'data';
      const { id, name } = row;
      modalData.visible = true;
      // 通过id获取机构列表
      MyOrgApi.subOrgList(id).then((res) => {
        const { code, data, message } = res.data || {};
        if (code === 200) {
          const list = [...data];
          list.unshift({ id, value: name });
          modalData.optionList = list;
          nextTick(() => {
            proxy.dataForm.id = id;
          });
        } else {
          proxy.$message.error(message);
        }
      });
    };
    const exportAction = (params) => {
      const param = { ...params };
      ['start', 'end', 'endTime'].forEach((i) => {
        if (param[i]) param[i] = dateUtils.formatStandardDate(param[i]);
      });
      param.orgName = modalData.optionList.filter((i) => i.id === param.id)[0].value;
      if (!isData.value) {
        param.end = param.endTime;
        delete param.endTime;
      }
      const api = isData.value ? () => MyOrgApi.exportIntegratedData(param) : () => MyOrgApi.exportOrgAccount(param);
      api().then((res) => {
        const { code = 200, message = '导出失败' } = res.data || {};
        if (code === 200) {
          modalData.loading = false;
          fileDownload(res);
          modalData.visible = false;
        } else {
          proxy.$message.error(message);
        }
      });
    };
    const handleClick = () => {
      proxy.$refs.dataForm.validate((volid) => {
        if (volid) {
          modalData.loading = true;
          exportAction(proxy.dataForm);
        }
      });
    };
    const handleClose = () => {
      proxy.dataForm.start = undefined;
      proxy.dataForm.end = undefined;
      proxy.dataForm.endTime = undefined;
      proxy.$refs.dataForm.resetFields();
      modalData.loading = false;
      modalData.visible = false;
    };
    // 日期控件做前后限制
    const disabledStartDate = (startTime) => {
      if (proxy.dataForm.end) {
        const time = dateUtils.formatStandardDate(proxy.dataForm.end);
        return startTime.getTime() > new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const disabledEndDate = (endTime) => {
      if (proxy.dataForm.start) {
        const time = dateUtils.formatStandardDate(proxy.dataForm.start);
        return endTime.getTime() < new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const modalSlots = {
      footer: () => <>
        <el-button onClick={ handleClose }>取消</el-button>
        <el-button type="primary" onClick={handleClick} loading={modalData.loading}>确定</el-button>
      </>,
    };
    return {
      isData,
      modalData,
      handleClose,
      disabledStartDate,
      disabledEndDate,
      modalSlots,
      handleOpen,
      rule,
    };
  },
  render() {
    const {
      isData,
      modalData,
      dataForm,
      handleClose,
      disabledStartDate,
      disabledEndDate,
      modalSlots,
      rule,
    } = this;
    const Title = isData ? '综合数据导出' : '账号使用情况导出';
    return (
      <el-dialog
        title={Title}
        v-model={modalData.visible}
        onClosed={handleClose}
        width="500px"
        v-slots={modalSlots}
      >
        <el-form
          model={dataForm}
          ref="dataForm"
          rules={rule}
          labelPosition="right"
          labelWidth="118px"
          className="data-modal-form"
        >
          <el-form-item label="机构名称：" prop="id">
            <el-select style="width: 342px" v-model={dataForm.id} key={dataForm.id}>
              {modalData.optionList.map((i) => (
                <el-option key={i.id} value={i.id} label={i.value} />
              ))}
            </el-select>
          </el-form-item>
            <el-form-item label="更新时间：" v-show={isData} class="time-form">
              <div className="update-time">
                <el-form-item prop={isData ? 'start' : ''}>
                  <el-date-picker
                    type="date"
                    placeholder="开始时间"
                    v-model={dataForm.start}
                    style="width: 158px"
                    disabledDate={disabledStartDate}
                    append-to-body={false}
                  />
                </el-form-item>
                <span className="line" style="margin: 0 6px">至</span>
                <el-form-item prop={isData ? 'end' : ''}>
                  <el-date-picker
                    type="date"
                    placeholder="结束时间"
                    v-model={dataForm.end}
                    style="width: 158px"
                    disabledDate={disabledEndDate}
                    append-to-body={false}
                  />
                </el-form-item>
              </div>
            </el-form-item>
          <el-form-item label="截止日期：" prop={!isData ? 'endTime' : ''} v-show={!isData}>
            <el-date-picker
              type="date"
              placeholder="截止日期"
              v-model={dataForm.endTime}
              style="width: 342px"
              append-to-body={false}
            />
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
