<template>
  <el-dialog title="权限管理" :model-value="visible" width="700px">
    <el-form
      :model="rulesForm"
      ref="rulesForm"
      v-bind="rulesFormOptions.options"
      :rules="rulesFormOptions.rules"
    >
      <el-form-item label="ID：" v-if="!isAdd">
        <div>
          {{ rulesForm.a }}
        </div>
      </el-form-item>
      <el-form-item label="顶级合作机构名称：" prop="b">
        <el-input
          v-model="rulesForm.b"
          autocomplete="off"
          maxlength="11"
          placeholder="请输入顶级合作机构名称"
        />
      </el-form-item>
      <el-form-item label="机构类型：" prop="c">
        <el-radio-group v-model="rulesForm.c" size="medium">
          <el-radio :label="1">试用</el-radio>
          <el-radio :label="2">正式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="合同起止日期：" prop="e">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="rulesForm.d"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="rulesForm.e"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="上级机构ID：" :prop="isAdd ? '' : 'f'">
        <el-select v-model="rulesForm.f" placeholder="请选择上级机构ID" v-if="!isAdd">
          <el-option
            v-for="item in rulesForm.fList"
            :label="item.label"
            :value="item.valyue"
            :key="item.value"
          />
        </el-select>
        <span v-else>{{rulesForm.f}}</span>
      </el-form-item>
      <el-form-item label="上级机构名称：" :prop="isAdd ? '' : 'g'">
        <el-input
          v-if="!isAdd"
          v-model="rulesForm.g"
          autocomplete="off"
          maxlength="11"
          placeholder="请输入顶级合作机构名称"
        />
        <span v-else>{{rulesForm.g}}</span>
      </el-form-item>
      <el-form-item
        v-for="item in rulesFormOptions.itemsRaido"
        :label="`${item.label}:`"
        :key="item.val"
        :prop="item.val"
      >
        <el-col :span="10">
          <el-radio-group v-model="rulesForm[item.val]" size="medium">
            <el-radio :label="1">不限</el-radio>
            <el-radio :label="2" :disabled="item.val === 'j'">限制</el-radio>
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
              :indeterminate="checkList[item.key].isIndeterminate"
              v-model="checkList[item.key].checkAll"
              @change="(val) => handleCheckAllChange(val, item.key)"
              >{{ item.title }}</el-checkbox
            >
            <div style="margin: 5px 0"></div>
            <el-checkbox-group
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
        <el-button @click="permissionErrormsgShow = false">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "rules-modal",
  nameComment: "客户管理-权限管理弹窗",
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Boolean,
      default: true,
    }
  },
  created() {
    this.rulesForm = Object.assign(this.rulesForm, this.formData);
    if (this.isAdd) {
      let { customerName, id } = this.$route.params;
      this.rulesForm.f = id;
      this.rulesForm.g = customerName
    }
  },
  data() {
    return {
      permissionErrormsgShow: true,
      rulesForm: {
        a: "",
        b: "",
        c: 2,
        d: "",
        e: "",
        f: "",
        g: "",
        h: "",
        i: 1,
        j: 1,
        k: 1,
        l: 1,
        m: 1,
        numi: "",
        numk: "",
        numl: "",
        numm: "",
      },
      checkList: {
        a: {
          checkAll: true,
          checkedData: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
          isIndeterminate: false,
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
        },
        b: {
          checkAll: true,
          checkedData: ["1", "2", "3"],
          isIndeterminate: false,
          options: ["1", "2", "3"],
        },
        c: {
          checkAll: true,
          checkedData: ["1", "2", "3", "4"],
          isIndeterminate: false,
          options: ["1", "2", "3", "4"],
        },
        d: {
          checkAll: true,
          checkedData: ["1", "2", "3", "4", "5", "6"],
          isIndeterminate: false,
          options: ["1", "2", "3", "4", "5", "6"],
        },
        e: {
          checkAll: true,
          checkedData: ["1", "2", "3", "4", "5", "6"],
          isIndeterminate: false,
          options: ["1", "2", "3", "4", "5", "6"],
        },
        f: {
          checkAll: true,
          checkedData: ["1", "2"],
          isIndeterminate: false,
          options: ["1", "2"],
        },
        g: {
          checkAll: true,
          checkedData: ["1"],
          isIndeterminate: false,
          options: ["1"],
        },
        h: {
          checkAll: true,
          checkedData: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          isIndeterminate: false,
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        },
        i: {
          checkAll: true,
          checkedData: ["1", "2", "3"],
          isIndeterminate: false,
          options: ["1", "2", "3"],
        },
        j: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1"],
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
          b: {
            required: true, message: "顶级合作机构名称不允许为空", trigger: "blur",
          },
          c: {
            required: true, message: "请选择机构类型", trigger: "change",
          },
          e: {
            required: true, message: "合同结束日期不允许为空", trigger: "blur",
          },
          f: {
            required: true, message: "请选择上级机构ID", trigger: "change",
          },
          g: {
            required: true, message: "上级机构名称不允许为空", trigger: "change",
          },
          i: {
            required: true, message: "请选择限制画像查询次数", trigger: "change",
          },
          j: {
            required: true, message: "请选择限制分类搜索次数", trigger: "change",
          },
          k: {
            required: true, message: "请选择限制监控债务人数", trigger: "change",
          },
          l: {
            required: true, message: "请选择限制配置子机构数", trigger: "change",
          },
          m: {
            required: true, message: "请选择限制配置账号数", trigger: "change",
          },
          numi: {
            required: true, message: "请输入上限", trigger: "blur",
          },
          numk: {
            required: true, message: "请输入上限", trigger: "blur",
          },
          numl: {
            required: true, message: "请输入上限", trigger: "blur",
          },
          numm: {
            required: true, message: "请输入上限", trigger: "blur",
          },
        },
        itemsRaido: [
          { label: "限制画像查询次数", val: "i", num: "numi" },
          { label: "限制分类搜索次数", val: "j" },
          { label: "限制监控债务人数", val: "k", num: "numk" },
          { label: "限制配置子机构数", val: "l", num: "numl" },
          { label: "限制配置账号数", val: "m", num: "numm" },
        ],
        itemsChecked: [
          {
            title: "资产挖掘",
            key: "a",
            children: [
              {
                label: "资产拍卖",
                val: "1",
              },
              {
                label: "土地数据",
                val: "2",
              },
              {
                label: "招标中标",
                val: "3",
              },
              {
                label: "代位权",
                val: "4",
              },
              {
                label: "金融资产",
                val: "5",
              },
              {
                label: "动产抵押",
                val: "6",
              },
              {
                label: "无形资产",
                val: "7",
              },
              {
                label: "查解封资产",
                val: "8",
              },
              {
                label: "股权质押",
                val: "9",
              },
              {
                label: "车辆信息",
                val: "10",
              },
              {
                label: "不动产登记",
                val: "11",
              },
            ],
          },
          {
            title: "资产挖掘-在建工程",
            key: "b",
            children: [
              {
                label: "建设单位",
                val: "1",
              },
              {
                label: "中标单位",
                val: "2",
              },
              {
                label: "施工单位",
                val: "3",
              },
            ],
          },
          {
            title: "风险监控",
            key: "c",
            children: [
              {
                label: "涉诉监控",
                val: "1",
              },
              {
                label: "失信记录",
                val: "2",
              },
              {
                label: "企业破产重组",
                val: "3",
              },
              {
                label: "限制高消费",
                val: "4",
              },
            ],
          },
          {
            title: "风险监控-经营风险",
            key: "d",
            children: [
              {
                label: "经营异常",
                val: "1",
              },
              {
                label: "工商变更",
                val: "2",
              },
              {
                label: "严重违法",
                val: "3",
              },
              {
                label: "环保处罚",
                val: "4",
              },
              {
                label: "税收违法",
                val: "5",
              },
              {
                label: "行政处罚",
                val: "6",
              },
            ],
          },
          {
            title: "风险监控-经营风险",
            key: "e",
            children: [
              {
                label: "经营异常",
                val: "1",
              },
              {
                label: "工商变更",
                val: "2",
              },
              {
                label: "严重违法",
                val: "3",
              },
              {
                label: "环保处罚",
                val: "4",
              },
              {
                label: "税收违法",
                val: "5",
              },
              {
                label: "行政处罚",
                val: "6",
              },
            ],
          },
          {
            title: "业务管理",
            key: "f",
            children: [
              {
                label: "业务视图",
                val: "1",
              },
              {
                label: "债务人",
                val: "2",
              },
            ],
          },
          {
            title: "画像搜索",
            key: "g",
            children: [
              {
                label: "画像搜索",
                val: "1",
              },
            ],
          },
          {
            title: "信息搜索",
            key: "h",
            children: [
              {
                label: "拍卖信息",
                val: "1",
              },
              {
                label: "涉诉信息",
                val: "2",
              },
              {
                label: "文书信息",
                val: "3",
              },
              {
                label: "金融资产",
                val: "4",
              },
              {
                label: "破产重组",
                val: "5",
              },
              {
                label: "失信记录",
                val: "6",
              },
              {
                label: "土地数据",
                val: "7",
              },
              {
                label: "股权质押",
                val: "8",
              },
              {
                label: "动产抵押",
                val: "9",
              },
            ],
          },
          {
            title: "机构管理",
            key: "i",
            children: [
              {
                label: "推送设置",
                val: "1",
              },
              {
                label: "账号列表",
                val: "2",
              },
              {
                label: "机构统计",
                val: "3",
              },
            ],
          },
          {
            title: "代理机构",
            key: "j",
            children: [
              {
                label: "代理机构",
                val: "1",
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    onsubmit() {
      this.$refs['rulesForm'].validate((valid) => {
        if (valid && !this.permissionErrormsgShow) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCheckAllChange(val, key) {
      this.checkList[key].checkedData = val ? this.checkList[key].options : [];
      this.checkList[key].isIndeterminate = false;
      if (val) {
        this.checkPermissionIsSet()
      } else {
        this.permissionErrormsgShow = false
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
    // 判断权限是否没有配置 并设置error显示
    checkPermissionIsSet () {
      let len = 0;
      for (let key in this.checkList) {
        len += this.checkList[key].checkedData.length;
      };
      this.permissionErrormsgShow = !len
    },
  },
};
</script>

<style lang="scss">
.rules-modal {
  padding-right: 40px;
  .zcjk-rules-box-item {
    border-bottom: 1px solid #e2e4e9;
  }
}
</style>
