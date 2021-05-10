<template>
  <el-dialog title="权限管理" :model-value="visible" width="700px">
    <el-form
      :model="rulesForm"
      ref="rulesForm"
      v-bind="rulesFormOptions.options"
      :rules="rulesFormOptions.rules"
    >
      <el-form-item label="ID：">
        <div>
          {{ rulesForm.a }}
        </div>
      </el-form-item>
      <el-form-item label="顶级合作机构名称：">
        <el-input
          v-model="rulesForm.b"
          autocomplete="off"
          maxlength="11"
          placeholder="请输入顶级合作机构名称"
        />
      </el-form-item>
      <el-form-item label="机构类型：">
        <el-radio-group v-model="rulesForm.c" size="medium">
          <el-radio :label="1">不限</el-radio>
          <el-radio :label="2">限制</el-radio>>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="合同起止日期：">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="rulesForm.d"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="rulesForm.e"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="上级机构ID：">
        <el-select v-model="rulesForm.f" placeholder="请选择上级机构ID">
          <el-option
            v-for="item in rulesForm.fList"
            :label="item.label"
            :value="item.valyue"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上级机构名称：">
        <el-input
          v-model="rulesForm.g"
          autocomplete="off"
          maxlength="11"
          placeholder="请输入顶级合作机构名称"
        />
      </el-form-item>
      <el-form-item
        v-for="item in rulesFormOptions.itemsRaido"
        :label="`${item.label}:`"
        :key="item.val"
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
            v-if="rulesForm[item.val] === 2"
          >
            <el-input
              v-model="rulesForm.gg"
              autocomplete="off"
              maxlength="11"
              placeholder=""
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="资产监控权限：">
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
        <el-button @click="addOrgVisible = false">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "rules-modal",
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.rulesForm = this.formData;
  },
  data() {
    return {
      rulesForm: {
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        f: "",
        g: "",
        h: "",
        i: "",
        j: "",
        k: "",
        l: "",
        m: "",
      },
      checkList: {
        a: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
        },
        b: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1", "2", "3"],
        },
        c: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1", "2", "3", "4"],
        },
        d: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1", "2", "3", "4", "5", "6"],
        },
        e: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1", "2", "3", "4", "5", "6"],
        },
        f: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1", "2"],
        },
        g: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1"],
        },
        h: {
          checkAll: false,
          checkedData: [],
          isIndeterminate: false,
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        },
        i: {
          checkAll: false,
          checkedData: [],
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
        rules: {},
        itemsRaido: [
          { label: "限制画像查询次数", val: "i" },
          { label: "限制分类搜索次数", val: "j" },
          { label: "限制监控债务人数", val: "k" },
          { label: "限制配置子机构数", val: "l" },
          { label: "限制配置账号数", val: "m" },
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
      console.log(this.rulesForm);
    },
    handleCheckAllChange(val, key) {
      this.checkList[key].checkedData = val ? this.checkList[key].options : [];
      this.checkList[key].isIndeterminate = false;
    },
    handleCheckedItemChange(val, key) {
      let count = val.length;
      this.checkList[key].checkAll =
        count === this.checkList[key].options.length;
      this.checkList[key].isIndeterminate =
        count > 0 && count < this.checkList[key].options.length;
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
