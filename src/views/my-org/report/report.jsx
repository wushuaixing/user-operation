import {
  reactive, defineComponent, getCurrentInstance, onMounted,
} from 'vue';
import MyOrgApi from '@/server/api/my-org';
import { dateUtils } from '@/utils';
import main from './main';
import './style.scss';

export default defineComponent({
  data() {
    return {
      reportForm: {
        id: '',
        start: undefined,
        end: undefined,
      },
    };
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const checkList = reactive({
      zcwj: {
        checkAll: true,
        checkedData: ['1', '2,3,4', '5,6,7,8', '9,10,11', '12', '13', '14', '15,16,17', '18', '19', '23'],
        isIndeterminate: false,
        options: ['1', '2,3,4', '5,6,7,8', '9,10,11', '12', '13', '14', '15,16,17', '18', '19', '20,21,22', '23', '666'],
      },
      fxck: {
        checkAll: true,
        checkedData: ['24', '25', '26', '27', '28'],
        isIndeterminate: false,
        options: ['24', '25', '26', '27', '28', '29,30,31', '32,33,34,35,36,37'],
      },
    });
    const report = reactive({
      reportVisible: false,
      orgId: 0,
      title: '',
      optionList: [],
    });
    const msg = reactive({
      buttonLoading: false,
    });

    const open = ({ id, name = '' }) => {
      report.reportVisible = true;
      report.orgId = id;
      report.title = `客户报告-${name}`;
      // 通过id获取机构列表
      MyOrgApi.subOrgList(id).then((res) => {
        const { code, data, message } = res.data || {};
        if (code === 200) {
          const list = data.length ? [...data] : [];
          list.unshift({ id, value: name });
          report.optionList = list;
          proxy.reportForm.id = id;
        } else {
          proxy.$message.error(message);
        }
      });
    };
    const close = () => {
      proxy.$refs.reportForm.resetFields();
      proxy.reportForm.start = '';
      proxy.reportForm.end = '';
      report.reportVisible = false;
      if (msg.buttonLoading) msg.buttonLoading = false;
    };

    // 权限模块-全选
    const handleCheckAllChange = (val, key) => {
      checkList[key].checkedData = val ? checkList[key].options : [];
      checkList[key].isIndeterminate = false;
    };
    // 权限模块-单选
    const handleCheckedItemChange = (val, key) => {
      const count = val.length;
      checkList[key].checkAll = count === checkList[key].options.length;
      checkList[key].isIndeterminate = count > 0 && count < checkList[key].options.length;
    };
    // 日期控件做前后限制
    const disabledStartDate = (startTime) => {
      if (proxy.reportForm.end) {
        const time = dateUtils.formatStandardDate(proxy.reportForm.end);
        return startTime.getTime() > new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const disabledEndDate = (endTime) => {
      if (proxy.reportForm.start) {
        const time = dateUtils.formatStandardDate(proxy.reportForm.start);
        return endTime.getTime() < new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const setEndTime = () => {
      proxy.reportForm.end = new Date();
    };
    const handleFocus = () => {
      const dom = document.querySelectorAll('.el-picker-panel__shortcut');
      dom.forEach((item) => {
        item.addEventListener('click', () => setEndTime());
      });
    };
    const handleBlur = () => {
      const dom = document.querySelectorAll('.el-picker-panel__shortcut');
      dom.forEach((item) => {
        item.removeEventListener('click', () => setEndTime());
      });
    };
    onMounted(() => {

    });
    const download = (baseString, fileName) => {
      const str = window.atob(baseString.replace(/-/g, '+').replace(/_/g, '/'));
      const ia = new Uint8Array(str.length);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < str.length; i++) {
        ia[i] = str.charCodeAt(i);
      }
      const blod = new Blob([ia], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // 创建a标签
      const elink = document.createElement('a');
      elink.style.display = 'none';
      elink.setAttribute('download', fileName);
      elink.href = URL.createObjectURL(blod);
      document.body.appendChild(elink);
      elink.click();
      window.URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink); // 移除a标签
    };
    // 点击确定
    const handlereport = () => {
      proxy.$refs.reportForm.validate((valid) => {
        if (valid) {
          const params = {
            start: dateUtils.formatStandardDate(proxy.reportForm.start),
            end: dateUtils.formatStandardDate(proxy.reportForm.end),
            id: proxy.reportForm.id,
          };
          const { fxck, zcwj } = checkList;
          const list = [...fxck.checkedData, ...zcwj.checkedData];
          const { typeArr } = main();
          params.dataTypes = list.join(',').split(',').map((i) => typeArr[i]);
          params.orgName = report.optionList.filter((res) => res.id === params.id)[0].value;
          const modalMsg = proxy.$message.warning({
            message: '正在下载，请稍等...',
            duration: 1000,
          });
          msg.buttonLoading = true;
          MyOrgApi.exportOther(params).then((res) => {
            msg.buttonLoading = false;
            const { code = 200, data, message = '导出失败' } = res.data || {};
            if (code === 200) {
              const fileName = `${params.id}${params.orgName}_${dateUtils.formatStandardDate(new Date())}`;
              download(data, fileName);
              report.reportVisible = false;
            } else {
              proxy.$message.error(message);
            }
          }, () => {
            msg.buttonLoading = false;
            modalMsg.close();
          });
        }
      });
    };
    const modalSlots = {
      title: null,
      footer: () => <>
        <el-button onClick={ close }>取消</el-button>
        <el-button type="primary" onClick={handlereport} loading={msg.buttonLoading}>确定</el-button>
      </>,
    };

    return {
      checkList,
      report,
      open,
      close,
      handleCheckAllChange,
      handleCheckedItemChange,
      handlereport,
      modalSlots,
      msg,
      disabledStartDate,
      disabledEndDate,
      handleFocus,
      handleBlur,
    };
  },
  render() {
    const {
      checkList,
      reportForm,
      report,
      close,
      modalSlots,
      handleCheckAllChange,
      handleCheckedItemChange,
      disabledStartDate,
      disabledEndDate,
      handleFocus,
      handleBlur,
    } = this;
    const { shortcuts, reportFormOptions, reportRules } = main();
    const { title, reportVisible = false } = report;
    return (
      <el-dialog
        title={title}
        v-model={reportVisible}
        onClosed={ close }
        width="712px"
        custom-class="report-dialog-class"
        destroy-on-close
        v-slots={modalSlots}
      >
        <el-form
          model={reportForm}
          ref="reportForm"
          labelPosition="right"
          labelWidth="166px"
          rules={reportRules}
          class="report-modal-form"
        >
          <el-form-item label="机构名称：" prop="id">
            <el-select style="width: 514px" v-model={reportForm.id} key={reportForm.id}>
              {report.optionList.map((i) => (
                <el-option key={i.id} value={i.id} label={i.value} />
              ))}
            </el-select>
          </el-form-item>
          <el-form-item label="更新时间：" class="time-report-form">
            <div className="update-time">
              <el-form-item prop="start">
                <el-date-picker
                  type="date"
                  placeholder="开始时间"
                  v-model={reportForm.start}
                  style="width: 242px"
                  shortcuts={shortcuts}
                  disabledDate={disabledStartDate}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  append-to-body={false}
                />
              </el-form-item>
              <span className="line" style="margin: 0 8px">至</span>
              <el-form-item prop="end">
                <el-date-picker
                  type="date"
                  placeholder="结束时间"
                  v-model={reportForm.end}
                  style="width: 242px"
                  disabledDate={disabledEndDate}
                  append-to-body={false}
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="全部数据类型：" rules={[{ required: true }]} class="all-data-type">
          <div className="zcjk-rules-box">
            {
              reportFormOptions.itemsChecked.map((item) => (
                <div
                  className="zcjk-rules-box-item"
                  key={item.title}
                >
                  <el-checkbox
                    class="zcjk-rules-box-item-moduleType"
                    indeterminate={checkList[item.key].isIndeterminate}
                    v-model={checkList[item.key].checkAll}
                    onChange={(val) => handleCheckAllChange(val, item.key)}
                    >{ item.title }</el-checkbox
                  >
                  <el-checkbox-group
                    class="zcjk-rules-box-item-moduleList"
                    v-model={checkList[item.key].checkedData}
                    onChange={(val) => handleCheckedItemChange(val, item.key)}
                  >
                    {
                      item.children.map((child) => (
                        <el-checkbox
                          label={child.val}
                          key={child.val}
                          disabled={child.label === '电子报'}
                          >{ child.label }
                        </el-checkbox>
                      ))
                    }
                  </el-checkbox-group>
                </div>
              ))
            }
          </div>
        </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
