<template>
  <el-dialog
    title="创建域名机构"
    v-model="reportVisible"
    @close="close"
    width="638px"
  >
    <el-form
      :model="reportForm"
      ref="reportForm"
      v-bind="reportFormOptions.options"
      :rules="reportFormOptions.rules"
    >
      <el-form-item label="更新时间：" prop="time">
        <el-date-picker
          v-model="reportForm.time"
          style="width: 468px"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
        >
        </el-date-picker>
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

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import MyOrgApi from '@/server/api/my-org';

export default defineComponent({
  setup() {
    const shortcuts = [{
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
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      })(),
    }, {
      text: '最近三个月',
      value: (() => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      })(),
    }];
    const reportFormOptions = {
      options: {
        labelPosition: 'right',
        labelWidth: '138px',
        destroyOnClose: true,
        class: 'report-modal-form',
      },
      rules: {
        time: {
          required: true,
          message: '请选择更新时间',
          trigger: 'change',
        },
      },
      itemsChecked: [
        {
          title: '资产挖掘',
          key: 'zcwj',
          children: [
            {
              label: '资产拍卖',
              val: '2',
            },
            {
              label: '土地数据',
              val: '29',
            },
            {
              label: '招标中标',
              val: '30',
            },
            {
              label: '代位权',
              val: '4',
            },
            {
              label: '金融资产',
              val: '31',
            },
            {
              label: '动产抵押',
              val: '32',
            },
            {
              label: '无形资产',
              val: '41',
            },
            {
              label: '查解封资产',
              val: '49',
            },
            {
              label: '股权质押',
              val: '44',
            },
            {
              label: '车辆信息',
              val: '52',
            },
            {
              label: '不动产登记',
              val: '51',
            },
          ],
        },
        {
          title: '资产挖掘-在建工程',
          key: 'zjgc',
          children: [
            {
              label: '建设单位',
              val: '54',
            },
            {
              label: '中标单位',
              val: '55',
            },
            {
              label: '施工单位',
              val: '56',
            },
          ],
        },
      ],
    };
    const checkList = {
      zcwj: {
        checkAll: true,
        checkedData: [
          '2',
          '29',
          '30',
          '4',
          '31',
          '32',
          '41',
          '49',
          '44',
          '52',
          '51',
        ],
        isIndeterminate: false,
        options: ['2', '29', '30', '4', '31', '32', '41', '49', '44', '52', '51'],
      },
      zjgc: {
        checkAll: true,
        checkedData: ['54', '55', '56'],
        isIndeterminate: false,
        options: ['54', '55', '56'],
      },
    };
    const reportForm = reactive({
      time: '',
    });
    const reportVisible = ref(true);
    const orgId = ref(0);

    const open = (id) => {
      reportVisible.value = true;
      orgId.value = id;
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
      const params = {
        time: '',
      };
      MyOrgApi.exportOther(params).then(() => {

      });
    };

    const setData = () => {

    };
    return {
      reportFormOptions,
      checkList,
      reportForm,
      reportVisible,
      shortcuts,
      orgId,
      open,
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
          min-width: 100px;
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
