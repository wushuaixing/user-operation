import {
  reactive, defineComponent, getCurrentInstance,
} from 'vue';
import MyOrgApi from '@/server/api/my-org';
import { dateUtils, fileDownload } from '@/utils';
import main from './main';
import './style.scss';

export default defineComponent({
  data() {
    return {
      reportForm: {
        time: '',
        id: '',
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

    const timeChange = (val) => {
      console.log(val, proxy.reportForm.time, '3');
    };
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
      proxy.reportForm.time = '';
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

    // 点击确定
    const handlereport = () => {
      proxy.$refs.reportForm.validate((valid) => {
        if (valid) {
          const params = {
            start: dateUtils.formatStandardDate(proxy.reportForm.time[0]),
            end: dateUtils.formatStandardDate(proxy.reportForm.time[1]),
            id: report.orgId,
          };
          const { fxck, zcwj } = checkList;
          const list = [...fxck.checkedData, ...zcwj.checkedData];
          params.list = list.join(',').split(',');
          const modalMsg = proxy.$message.warning({
            message: '正在下载，请稍等...',
            duration: 1000,
          });
          msg.buttonLoading = true;
          MyOrgApi.exportOther(params).then((res) => {
            msg.buttonLoading = false;
            const { code = 200, message = '导出失败' } = res.data || {};
            if (code === 200) {
              fileDownload(res);
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
      timeChange,
      handleCheckAllChange,
      handleCheckedItemChange,
      handlereport,
      modalSlots,
      msg,
    };
  },
  render() {
    const {
      checkList,
      reportForm,
      report,
      timeChange,
      close,
      modalSlots,
      handleCheckAllChange,
      handleCheckedItemChange,
    } = this;
    const { shortcuts, reportFormOptions } = main();
    const { title, reportVisible = false } = report;
    return (
      <el-dialog
        title={title}
        v-model={reportVisible}
        onClosed={ close }
        width="638px"
        destroy-on-close
        v-slots={modalSlots}
      >
        <el-form
          model={reportForm}
          ref="reportForm"
          labelPosition="right"
          labelWidth="138px"
          class="report-modal-form"
        >
          <el-form-item label="机构名称：" prop="id" rules={[
            { required: true, message: '请选择机构名称', trigger: 'change' },
          ]}>
            <el-select style="width: 468px" v-model={reportForm.id} key={reportForm.id}>
              {report.optionList.map((i) => (
                <el-option key={i.id} value={i.id} label={i.value} />
              ))}
            </el-select>
          </el-form-item>
          <el-form-item label="更新时间：" prop="time" rules={[{ required: true, message: '请选择更新时间', trigger: 'change' }]}>
            <el-date-picker
              style={{ width: '468px' }}
              v-model={reportForm.time}
              class="report-date"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              onChange={timeChange}
              shortcuts={shortcuts}
            />
            </el-form-item>
          <el-form-item label="全部数据类型：" rules={[{ required: true }]}>
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
