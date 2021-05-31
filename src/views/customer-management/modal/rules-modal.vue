<template>
  <el-dialog :title="title" :model-value="visible" width="690px">
    <el-form
      :model="rulesForm"
      ref="rulesForm"
      v-bind="rulesFormOptions.options"
      :rules="rulesFormOptions.rules"
    >
      <el-form-item label="ID：" v-if="!isAdd">
        <div>
          {{ rulesForm.id }}
        </div>
      </el-form-item>
      <el-form-item label="顶级合作机构名称：" prop="name">
        <el-input
          v-model="rulesForm.name"
          autocomplete="off"
          maxlength="11"
          placeholder="请输入顶级合作机构名称"
        />
      </el-form-item>
      <el-form-item label="机构类型：" prop="type">
        <el-radio-group v-model="rulesForm.type" size="medium">
          <el-radio :label="0">试用</el-radio>
          <el-radio :label="1">正式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="合同起止日期：" prop="end">
        <el-date-picker
          type="date"
          placeholder="开始日期"
          v-model="rulesForm.start"
          :disabledDate="disabledStartDate"
          style="width: 219px"
        ></el-date-picker>
        <div style="display:inline-block;padding: 0 8px;">至</div>
        <el-date-picker
          type="date"
          placeholder="结束日期"
          :disabledDate="disabledEndDate"
          v-model="rulesForm.end"
          style="width: 219px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="上级机构ID：" :prop="isAdd ? '' : 'parentId'">
        <el-select v-model="rulesForm.parentId" placeholder="请选择上级机构ID" v-if="!isAdd">
          <el-option
            v-for="item in rulesForm.fList"
            :label="item.label"
            :value="item.valyue"
            :key="item.value"
          />
        </el-select>
        <span v-else>{{rulesForm.parentId}}</span>
      </el-form-item>
      <el-form-item label="上级机构名称：" :prop="isAdd ? '' : 'parentName'">
        <el-input
          v-if="!isAdd"
          v-model="rulesForm.parentName"
          autocomplete="off"
          maxlength="11"
          :disabled="true"
          placeholder="请输入顶级合作机构名称"
        />
        <span v-else>{{rulesForm.parentName}}</span>
      </el-form-item>
      <el-form-item
        v-for="item in rulesFormOptions.itemsRaido"
        :label="`${item.label}：`"
        :key="item.val"
        :prop="item.val"
      >
        <el-col :span="10">
          <el-radio-group v-model="rulesForm[item.val]" size="medium">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1" :disabled="item.val === 'isClassifiedLimit'">限制</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="上限："
            label-width="70px"
            :prop="item.num || ''"
            v-if="rulesForm[item.val] === 2"
          >
            <el-input
              v-model="rulesForm[item.num]"
              autocomplete="off"
              maxlength="11"
              placeholder=""
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="资产监控权限：" error="请进行授权" :showMessage="permissionErrormsgShow" required>
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
            <div style="margin: 5px 0"></div>
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
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import AdminApi from "@/server/api/admin";
export default {
  name: "rules-modal",
  nameComment: "客户管理-权限管理弹窗",
  props: {
    title: {
      type: String,
      default: "权限管理"
    },
    formData: {
      type: Object,
      default: () => {},
    },
    isAdd: {
      type: Boolean,
      default: true,
    }
  },
  created() {
    this.rulesForm = Object.assign(this.rulesForm, this.formData);
  },
  watch: {
  },
  data() {
    return {
      visible: false,
      permissionErrormsgShow: false,
      rulesForm: {
        id: "",
        name: "",
        type: 2,
        start: undefined,
        end: undefined,
        parentId: "",
        parentName: "",
        isPortraitLimit: 0,
        isClassifiedLimit: 0,
        isObligorLimit: 0,
        isSubOrgLimit: 0,
        isAccountLimit: 0,
        portraitLimitCount: "",
        obligorLimitCount: "",
        subOrgLimitCount: "",
        accountLimit: "",
      },
      checkList: {
        zcwj: {
          checkAll: true,
          checkedData: ["2", "29", "30", "4", "31", "32", "41", "49", "44", "52", "51"],
          isIndeterminate: false,
          options: ["2", "29", "30", "4", "31", "32", "41", "49", "44", "52", "51"],
        },
        zjgc: {
          checkAll: true,
          checkedData: ["54", "55", "56"],
          isIndeterminate: false,
          options: ["54", "55", "56"],
        },
        fxjk: {
          checkAll: true,
          checkedData: ["39", "42", "40", "50"],
          isIndeterminate: false,
          options: ["39", "42", "40", "50"],
        },
        jyfx: {
          checkAll: true,
          checkedData: ["33", "34", "35", "38", "36", "37"],
          isIndeterminate: false,
          options: ["33", "34", "35", "38", "36", "37"],
        },
        ywgl: {
          checkAll: true,
          checkedData: ["6", "7"],
          isIndeterminate: false,
          options: ["6", "7"],
        },
        hxss: {
          checkAll: true,
          checkedData: ["27"],
          isIndeterminate: false,
          options: ["27"],
        },
        xxss: {
          checkAll: true,
          checkedData: ["12", "13", "18", "25", "28", "42", "46", "47", "48"],
          isIndeterminate: false,
          options: ["12", "13", "18", "25", "28", "42", "46", "47", "48"],
        },
        jggl: {
          checkAll: true,
          checkedData: ["10", "11", "43"],
          isIndeterminate: false,
          options: ["10", "11", "43"],
        },
        dljg: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["35"],
        },
      },
      rulesFormOptions: {
        options: {
          labelPosition: "right",
          labelWidth: "180px",
          destroyOnClose: true,
          class: "rules-modal",
        },
        rules: {
          name: {
            required: true, message: "顶级合作机构名称不允许为空", trigger: "blur",
          },
          type: {
            required: true, message: "请选择机构类型", trigger: "change",
          },
          end: {
            required: true, message: "合同结束日期不允许为空", trigger: "blur",
          },
          parentId: {
            required: true, message: "请选择上级机构ID", trigger: "change",
          },
          parentName: {
            required: true, message: "上级机构名称不允许为空", trigger: "change",
          },
          isPortraitLimit: {
            required: true, message: "请选择限制画像查询次数", trigger: "change",
          },
          isClassifiedLimit: {
            required: true, message: "请选择限制分类搜索次数", trigger: "change",
          },
          isObligorLimit: {
            required: true, message: "请选择限制监控债务人数", trigger: "change",
          },
          isSubOrgLimit: {
            required: true, message: "请选择限制配置子机构数", trigger: "change",
          },
          isAccountLimit: {
            required: true, message: "请选择限制配置账号数", trigger: "change",
          },
          portraitLimitCount: {
            required: true, message: "请输入上限", trigger: "blur",
          },
          obligorLimitCount: {
            required: true, message: "请输入上限", trigger: "blur",
          },
          subOrgLimitCount: {
            required: true, message: "请输入上限", trigger: "blur",
          },
          accountLimit: {
            required: true, message: "请输入上限", trigger: "blur",
          },
        },
        itemsRaido: [
          { label: "限制画像查询次数", val: "isPortraitLimit", num: "portraitLimitCount" },
          { label: "限制分类搜索次数", val: "isClassifiedLimit" },
          { label: "限制监控债务人数", val: "isObligorLimit", num: "obligorLimitCount" },
          { label: "限制配置子机构数", val: "isSubOrgLimit", num: "subOrgLimitCount" },
          { label: "限制配置账号数", val: "isAccountLimit", num: "accountLimit" },
        ],
        itemsChecked: [
          {
            title: "资产挖掘",
            key: "zcwj",
            children: [
              {
                label: "资产拍卖",
                val: "2",
              },
              {
                label: "土地数据",
                val: "29",
              },
              {
                label: "招标中标",
                val: "30",
              },
              {
                label: "代位权",
                val: "4",
              },
              {
                label: "金融资产",
                val: "31",
              },
              {
                label: "动产抵押",
                val: "32",
              },
              {
                label: "无形资产",
                val: "41",
              },
              {
                label: "查解封资产",
                val: "49",
              },
              {
                label: "股权质押",
                val: "44",
              },
              {
                label: "车辆信息",
                val: "52",
              },
              {
                label: "不动产登记",
                val: "51",
              },
            ],
          },
          {
            title: "资产挖掘-在建工程",
            key: "zjgc",
            children: [
              {
                label: "建设单位",
                val: "54",
              },
              {
                label: "中标单位",
                val: "55",
              },
              {
                label: "施工单位",
                val: "56",
              },
            ],
          },
          {
            title: "风险监控",
            key: "fxjk",
            children: [
              {
                label: "涉诉监控",
                val: "39",
              },
              {
                label: "失信记录",
                val: "42",
              },
              {
                label: "企业破产重组",
                val: "40",
              },
              {
                label: "限制高消费",
                val: "50",
              },
            ],
          },
          {
            title: "风险监控-经营风险",
            key: "jyfx",
            children: [
              {
                label: "经营异常",
                val: "33",
              },
              {
                label: "工商变更",
                val: "34",
              },
              {
                label: "严重违法",
                val: "35",
              },
              {
                label: "环保处罚",
                val: "38",
              },
              {
                label: "税收违法",
                val: "36",
              },
              {
                label: "行政处罚",
                val: "37",
              },
            ],
          },
          {
            title: "业务管理",
            key: "ywgl",
            children: [
              {
                label: "业务视图",
                val: "6",
              },
              {
                label: "债务人",
                val: "7",
              },
            ],
          },
          {
            title: "画像搜索",
            key: "hxss",
            children: [
              {
                label: "画像搜索",
                val: "27",
              },
            ],
          },
          {
            title: "信息搜索",
            key: "xxss",
            children: [
              {
                label: "拍卖信息",
                val: "12",
              },
              {
                label: "涉诉信息",
                val: "13",
              },
              {
                label: "文书信息",
                val: "18",
              },
              {
                label: "金融资产",
                val: "25",
              },
              {
                label: "破产重组",
                val: "28",
              },
              {
                label: "失信记录",
                val: "42",
              },
              {
                label: "土地数据",
                val: "46",
              },
              {
                label: "股权质押",
                val: "47",
              },
              {
                label: "动产抵押",
                val: "48",
              },
            ],
          },
          {
            title: "机构管理",
            key: "jggl",
            children: [
              {
                label: "推送设置",
                val: "10",
              },
              {
                label: "账号列表",
                val: "11",
              },
              {
                label: "机构统计",
                val: "43",
              },
            ],
          },
          {
            title: "代理机构",
            key: "dljg",
            children: [
              {
                label: "代理机构",
                val: "35",
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    // 弹窗打开
    open(val) {
      const {domainId, domainName} = val
      this.rulesForm.parentId = domainId
      this.rulesForm.parentName = domainName
      this.visible = true
    },
    close() {
      this.visible = false
    },
    onsubmit() {
      this.$refs['rulesForm'].validate((valid) => {
        if (valid && !this.permissionErrormsgShow) {
          // 获取权限列表数组
          debugger
          let permission = this.getPermission()
          let params = Object.assign({}, this.rulesForm)
          // 处理时间
          params.start && (params.start = this.setTime(params.start))
          params.end && (params.end = this.setTime(params.end))
          params.permissions = permission
          AdminApi.addTopOrg(params).then(res => {
            const {code, message} = res.data
            if (code === 200) {
              this.$message.success("顶级合作机构创建成功!")
              this.$emit("afterSuccessAdd")
              this.visible = false
              // 通过回调函数处理
            } else {
              this.$message.error(message)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 获取权限并形成数组
    getPermission () {
      let arr = []
      for (let key in this.checkList) {
        let obj = {}
        obj.moduleName = key
        obj.permission = this.checkList[key].checkedData
        arr.push(obj)
      }
      return arr
    },

    // 设置时间格式
    setTime (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month <= 9 ? '0' + month : month
      let day = date.getDate()
      day = day <= 9 ? '0' + day : day
      return `${year}${month}${day}`
    },

    handleCheckAllChange(val, key) {
      this.checkList[key].checkedData = val ? this.checkList[key].options : [];
      this.checkList[key].isIndeterminate = false;
      if (val) {
        this.permissionErrormsgShow = false
      } else {
        this.checkPermissionIsSet()
      }
    },

    handleCheckedItemChange(val, key) {
      let count = val.length;
      this.checkList[key].checkAll =
        count === this.checkList[key].options.length;
      this.checkList[key].isIndeterminate =
        count > 0 && count < this.checkList[key].options.length;
      if (!count) {
        this.checkPermissionIsSet()
      } else {
        this.permissionErrormsgShow = false
      }
    },

    // 判断权限是否有没有配置 并设置error显示
    checkPermissionIsSet () {
      let len = 0;
      for (let key in this.checkList) {
        len += this.checkList[key].checkedData.length;
      };
      this.permissionErrormsgShow = !len
    },

    // 时间控件做前后限制
    disabledStartDate (startTime) {
      if (this.rulesForm.end) {
        return startTime.getTime() > this.rulesForm.end.getTime()
      }
    },
    disabledEndDate (endTime) {
      if (this.rulesForm.start) {
        return endTime.getTime() < this.rulesForm.start.getTime()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rules-modal {
  padding-right: 40px;
  .zcjk-rules-box {
    border: 1px solid #C5C7CE;
    padding-left: 16px;
    .zcjk-rules-box-item {
      // border-bottom: 1px solid #e2e4e9;
      &-moduleList {
        padding-left: 24px;
        /deep/ .el-checkbox {
          margin-right: 24px;
          .el-checkbox__input.is-checked + .el-checkbox__label {
            font-weight: 400;
            color: #4E5566;
            font-size: 14px;
            padding-left: 8px;
          }
          .el-checkbox__label {
            padding-left: 8px;
          }
        }
      }
      &-moduleType {
        /deep/ .el-checkbox__label {
          padding-left: 8px;
          font-weight: 600;
          color: #20242E;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
