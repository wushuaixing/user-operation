<template>
  <el-dialog
    :title="title"
    v-model="reportVisible"
    @close="close"
    width="638px"
    destroy-on-close
  >
    <el-form
      :model="reportForm"
      ref="reportForm"
      v-bind="reportFormOptions.options"
    >
      <el-form-item label="更新时间：" prop="time" :rules="[{ required: true, message: '请选择更新时间', trigger: 'change',},]">
        <el-date-picker
          v-model="reportForm.time"
          key="report-date1"
          style="width: 468px"
          class="report-date"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :shortcuts="shortcuts"
          @change="timeChange"
        />
        <el-input style="display: none"></el-input>
      </el-form-item>
      <el-form-item label="全部数据类型：">
        <div class="zcjk-rules-box">
          <div
            class="zcjk-rules-box-item"
            v-for="item in reportFormOptions.itemsChecked"
            :key="item.title"
          >
            <el-checkbox
              class="zcjk-rules-box-item-moduleType"
              disabled
              :indeterminate="checkList[item.key].isIndeterminate"
              v-model="checkList[item.key].checkAll"
              @change="(val) => handleCheckAllChange(val, item.key)"
            >{{ item.title }}</el-checkbox
            >
            <el-checkbox-group
              class="zcjk-rules-box-item-moduleList"
              v-model="checkList[item.key].checkedData"
              @change="(val) => handleCheckedItemChange(val, item.key)"
            >
              <el-checkbox
                v-for="child in item.children"
                :label="child.val"
                disabled
                :key="child.val"
              >{{ child.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
            <span class="dialog-footer">
              <el-button @click="reportVisible = false">取 消</el-button>
              <el-button type="primary" @click="handlereport">确 定</el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  ref, reactive, defineComponent, getCurrentInstance,
} from 'vue';
import MyOrgApi from '@/server/api/my-org';
import { dateUtils, fileDownload } from '@/utils';

const shortcuts = [{
  text: '最近一天',
  value: (() => {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24);
    return [start, end];
  })(),
}, {
  text: '最近一周',
  value: (() => {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    return [start, end];
  })(),
}, {
  text: '最近一个月',
  value: (() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return [start, end];
  })(),
}];
export default defineComponent({
  data() {
    return {
      time: '',
    };
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const reportFormOptions = {
      options: {
        labelPosition: 'right',
        labelWidth: '138px',
        class: 'report-modal-form',
      },
      rules: {
        time: [
          {
            required: true, message: '请选择更新时间', trigger: 'change',
          },
        ],
      },
      itemsChecked: [
        {
          title: '资产挖掘',
          key: 'zcwj',
          children: [
            {
              label: '资产拍卖',
              val: '1',
            },
            {
              label: '土地信息',
              val: '2',
            },
            {
              label: '无形资产',
              val: '3',
            },
            {
              label: '代位权',
              val: '4',
            },
            {
              label: '股权质押',
              val: '5',
            },
            {
              label: '动产抵押',
              val: '6',
            },
            {
              label: '查解封资产',
              val: '7',
            },
            {
              label: '在建工程',
              val: '8',
            },
            {
              label: '不动产登记',
              val: '9',
            },
            {
              label: '车辆信息',
              val: '10',
            },
            {
              label: '金融资产',
              val: '11',
            },
            {
              label: '招投标',
              val: '12',
            },
          ],
        },
        {
          title: '风险参考',
          key: 'fxck',
          children: [
            {
              label: '破案重组',
              val: '13',
            },
            {
              label: '失信记录',
              val: '14',
            },
            {
              label: '限制高消费',
              val: '15',
            },
            {
              label: '诉讼立案',
              val: '16',
            },
            {
              label: '经营风险',
              val: '17',
            },
          ],
        },
      ],
    };
    const checkList = {
      zcwj: {
        checkAll: true,
        checkedData: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        isIndeterminate: false,
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      },
      fxck: {
        checkAll: true,
        checkedData: ['13', '14', '15', '16', '17'],
        isIndeterminate: false,
        options: ['13', '14', '15', '16', '17'],
      },
    };

    const reportForm = reactive({
      time: '',
    });
    const timeChange = (val) => {
      console.log(val, reportForm.time, '2');
    };
    const reportVisible = ref(false);
    const orgId = ref(0);
    const title = ref('');

    const open = ({ id, name = '' }) => {
      proxy.$nextTick(() => {
        reportVisible.value = true;
        orgId.value = id;
        title.value = `客户报告-${name}`;
      });
    };
    const close = () => {
      proxy.$refs.reportForm.resetFields();
      reportVisible.value = false;
    };

    // 权限模块-全选
    const handleCheckAllChange = (val, key) => {
      this.checkList[key].checkedData = val ? this.checkList[key].options : [];
      this.checkList[key].isIndeterminate = false;
    };
    // 权限模块-单选
    const handleCheckedItemChange = (val, key) => {
      const count = val.length;
      this.checkList[key].checkAll = count === this.checkList[key].options.length;
      this.checkList[key].isIndeterminate = count > 0 && count < this.checkList[key].options.length;
    };

    // 点击确定
    const handlereport = () => {
      proxy.$refs.reportForm.validate((valid) => {
        if (valid) {
          const params = {
            start: dateUtils.formatStandardDate(reportForm.time[0]),
            end: dateUtils.formatStandardDate(reportForm.time[1]),
            id: orgId.value,
          };
          MyOrgApi.exportOther(params).then((res) => {
            fileDownload(res, true);
          });
        }
      });
    };

    const setData = () => {

    };
    return {
      reportFormOptions,
      checkList,
      reportForm,
      timeChange,
      shortcuts,
      reportVisible,
      orgId,
      title,
      open,
      close,
      handleCheckAllChange,
      handleCheckedItemChange,
      handlereport,
      setData,
    };
  },
});

</script>
<style lang="scss">
  .report-modal-form {
    .el-form-item__content {
      .report-date {
        .el-range__icon {
          line-height: 24px;
        }
        .el-range-separator {
          line-height: 24px;
        }
        .el-range__close-icon {
          line-height: 24px;
        }
      }
    }
    .zcjk-rules-box {
      padding: 5px 0 16px 16px;
      width: 450px;
      border-radius: 2px;
      border: 1px solid #c5c7ce;
      &-item {
        line-height: 20px !important;
        &-moduleType {
          font-weight: bold;
          margin: 8px 0;
          .el-checkbox__label{
            color: #20242E!important;
          }
        }
        .el-checkbox {
          min-width: 105px;
          line-height: 20px !important;
          margin-right: 0;
          &__label {
            padding-left: 8px;
          }
        }
        &-moduleList {
          padding-left: 22px;
          .el-checkbox__label{
            color: #4E5566!important;
          }
        }
      }
    }
  }
</style>
