<template>
  <el-dialog
    :title="isAdd ? '创建顶级合作机构' : '权限管理'"
    v-model="visible"
    width="666px"
    @close="close"
    custom-class="rules-modal"
  >
    <el-form
      :model="rulesForm"
      ref="rulesForm"
      v-bind="rulesFormOptions.options"
      :rules="rulesFormOptions.rules"
    >
      <el-form-item label="ID：" v-if="!isAdd" style="margin: -8px 0 10px">
        <div>
          {{ $filters._show(rulesForm.id) }}
        </div>
      </el-form-item>
      <el-form-item
        label="顶级合作机构名称："
        prop="name"
        style="margin-bottom: 11px"
      >
        <el-input
          v-model="rulesForm.name"
          autocomplete="off"
          maxlength="100"
          placeholder="请输入机构名称"
          style="width: 468px"
          @blur="handleNameBlur"
        />
      </el-form-item>
      <el-form-item label="机构类型：" prop="type" style="margin-bottom: 11px">
        <el-radio-group v-model="rulesForm.type" size="medium">
          <el-radio :label="0" :disabled="!isAdd && disabledType === 1"
            >试用</el-radio
          >
          <el-radio :label="1">正式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="合同起止日期：" style="margin-bottom: 10px" required>
        <el-col :span="11">
          <el-form-item prop="start">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="rulesForm.start"
              style="width: 219px"
              :disabledDate="disabledStartDate"
            />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="margin: 0 10px">-</el-col>
        <el-col :span="11">
          <el-form-item prop="end">
            <el-date-picker
              type="date"
              placeholder="结束日期"
              v-model="rulesForm.end"
              style="width: 219px"
              :disabledDate="disabledEndDate"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        label="是否延期或续签："
        v-if="isContractTypeDisplay"
        prop="contractType"
      >
        <el-radio-group v-model="rulesForm.contractType" size="medium">
          <el-radio :label="1">延期</el-radio>
          <el-radio :label="2">签约</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="上级机构ID："
        :prop="isAdd ? '' : 'parentId'"
        :style="{ margin: isAdd ? 0 : '20px 0' }"
      >
        <el-select
          v-model="rulesForm.parentId"
          placeholder="请选择上级机构ID"
          v-if="!isAdd"
        >
          <el-option
            v-for="item in parentOrg"
            :label="item.id"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
        <span v-else>{{ $filters._show(rulesForm.parentId) }}</span>
      </el-form-item>
      <el-form-item
        label="上级机构名称："
        :prop="isAdd ? '' : 'parentName'"
        :style="{ marginBottom: isAdd ? 0 : '10px' }"
      >
        <el-input
          v-if="!isAdd"
          :modelValue="dynamicParentName"
          autocomplete="off"
          maxlength="11"
          :disabled="true"
          placeholder="请输入上级机构名称"
        />
        <span v-else>{{ $filters._show(rulesForm.parentName) }}</span>
      </el-form-item>
      <el-form-item
        v-for="item in rulesFormOptions.itemsRaido"
        :label="`${item.label}：`"
        :key="item.val"
        :prop="item.val"
        :style="{ marginBottom: rulesForm[item.val] ? '10px' : 0 }"
      >
        <el-col :span="10">
          <el-radio-group v-model="rulesForm[item.val]" size="medium">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1" :disabled="item.val === 'isClassifiedLimit'"
              >限制</el-radio
            >
          </el-radio-group>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="上限："
            label-width="70px"
            :prop="item.num || ''"
            v-if="rulesForm[item.val] === 1"
          >
            <el-input-number
              v-model="rulesForm[item.num]"
              autocomplete="off"
              :min="rulesForm[item.limit] || 0"
              :max="9999999999"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="资产监控权限：" style="margin-top: 11px">
        <div class="zcjk-rules-box">
          <div
            class="zcjk-rules-box-item"
            v-for="item in rulesFormOptions.itemsChecked"
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
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import AdminApi from "@/server/api/admin";
import { rulesFormOptions, rulesForm, checkList } from "./data";
import { dateUtils, clone } from "@/utils";
export default {
  name: "rules-modal",
  nameComment: "客户管理-权限管理弹窗",
  emits: ["getData"],
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {},
  data() {
    return {
      visible: false,
      isAdd: false,
      disabledType: "",
      endTime: "",
      parentOrg: [],
      rulesForm,
      checkList: clone(checkList),
      rulesFormOptions,
    };
  },

  methods: {
    // 弹窗打开
    open(params = {}, isAdd) {
      if (isAdd) {
        const { domainId, domainName } = params;
        this.rulesForm = {
          ...this.rulesForm,
          parentId: domainId,
          parentName: domainName,
        };
      } else {
        const { permissions = [], ...rest } = params;
        const { id, type, end, start } = rest;
        this.disabledType = type;
        this.endTime = end;
        this.getCheckList(permissions);
        this.rulesForm = {
          ...rest,
          start: start ? new Date(start) : "",
          end: new Date(end),
        };
        AdminApi.selectParentOrgList(id).then((res) => {
          const { code, data = [] } = res.data || {};
          if (code === 200) {
            this.parentOrg = data;
          } else {
            this.$message.error("请求错误");
          }
        });
      }
      this.isAdd = isAdd;
      this.visible = true;
    },
    // 弹窗关闭
    close() {
      this.$refs["rulesForm"].resetFields();
      this.rulesForm = rulesForm;
      this.checkList = clone(checkList);
    },
    // 提交
    onsubmit() {
      this.$refs["rulesForm"].validate((valid) => {
        if (valid) {
          const permissions = this.getPermission();
          const _time = (val) => dateUtils.formatStandardDate(val);
          const {
            end,
            start,
            isPortraitLimit,
            isObligorLimit,
            isSubOrgLimit,
            isAccountLimit,
            portraitLimitCount,
            obligorLimitCount,
            subOrgLimitCount,
            accountLimitCount,
          } = this.rulesForm;
          const params = {
            ...this.rulesForm,
            permissions,
            end: _time(end),
            start: _time(start),
            portraitLimitCount: isPortraitLimit ? portraitLimitCount : 0,
            obligorLimitCount: isObligorLimit ? obligorLimitCount : 0,
            subOrgLimitCount: isSubOrgLimit ? subOrgLimitCount : 0,
            accountLimitCount: isAccountLimit ? accountLimitCount : 0,
          };
          const sign = this.isAdd ? "add" : "edit";
          const text = this.isAdd ? "顶级合作机构创建成功" : "修改成功";
          AdminApi.addAndEditRules(params, sign).then((res) => {
            const { code, message } = res.data || {};
            if (code === 200) {
              this.$message.success({
                message: text,
                onClose: () => {
                  this.visible = false;
                  this.$emit("getData");
                },
              });
            } else {
              this.$message.error(message);
            }
          });
        }
      });
    },

    // 提交时处理 权限数组
    getPermission() {
      let arr = [];
      for (let key in this.checkList) {
        let obj = {};
        obj.moduleName = key;
        obj.permission = this.checkList[key].checkedData;
        arr.push(obj);
      }
      return arr;
    },
    // 回显时处理 权限数组
    getCheckList(arr = []) {
      arr.forEach((i) => {
        const list = i.permission || [];
        this.checkList[i.moduleName].checkedData = list.map((j) =>
          j.toString()
        );
        this.handleCheckedItemChange(list, i.moduleName);
      });
    },

    // 权限模块-全选
    handleCheckAllChange(val, key) {
      this.checkList[key].checkedData = val ? this.checkList[key].options : [];
      this.checkList[key].isIndeterminate = false;
    },
    // 权限模块-单选
    handleCheckedItemChange(val, key) {
      let count = val.length;
      this.checkList[key].checkAll =
        count === this.checkList[key].options.length;
      this.checkList[key].isIndeterminate =
        count > 0 && count < this.checkList[key].options.length;
    },
    // 姓名失焦去除所有空格
    handleNameBlur() {
      const { name } = this.rulesForm;
      this.rulesForm.name = name.replace(/\s+/g, "");
    },
    // 时间控件做前后限制
    disabledStartDate(startTime) {
      const endTime = this.rulesForm.end;
      if (!startTime || !endTime) return false;
      const _endTime = new Date(endTime).valueOf();
      return startTime.valueOf() > _endTime;
    },
    disabledEndDate(endTime) {
      const startTime = this.isAdd ? this.rulesForm.start : this.endTime;
      if (!endTime || !startTime) return false;
      const _startTime = new Date(startTime).valueOf() - 86400000;
      return endTime.valueOf() <= _startTime;
    },
  },
  computed: {
    // 上级机构名称(随上级机构Id联动)
    dynamicParentName() {
      const { parentId } = this.rulesForm;
      return ((this.parentOrg || []).filter((i) => i.id === parentId)[0] || {})
        .value;
    },
    // 是否延期或续签 (随合同结束日期 || 机构类型 联动)
    isContractTypeDisplay() {
      const { type } = this.rulesForm;
      const isOvertime =
        new Date(this.rulesForm.end).valueOf() >
        new Date(this.endTime).valueOf();
      return !this.isAdd && isOvertime && type === 1;
    },
  },
};
</script>

<style lang="scss">
.rules-modal {
  &-form {
    padding-right: 32px;
    .el-form-item {
      &__content {
        line-height: 32px !important;
      }
      &__label {
        line-height: 32px !important;
      }
    }
    .zcjk-rules-box {
      padding: 7px 16px 16px;
      border-radius: 2px;
      border: 1px solid #c5c7ce;
      &-item {
        &-moduleType {
          font-weight: bold;
        }
        .el-checkbox {
          min-width: 82px;
          margin-right: 20px;
          line-height: 20px !important;
          &__label {
            padding-left: 8px;
          }
        }
        &-moduleList {
          padding-left: 22px;
        }
      }
    }
  }
  .el-dialog__body {
    padding-top: 24px !important;
  }
}
</style>
