<template>
  <div class="customer-management-container">
    <div class="query-content">
      <el-form :inline="true" :model="queryParams" class="query-form">
        <el-form-item label="机构名称：" style="width: 300px">
          <el-input
            v-model="queryParams.orgName"
            placeholder="请输入机构名称"
          />
        </el-form-item>
        <el-form-item label="合同结束日期：">
          <el-date-picker
            v-model="queryParams.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="顶级合作机构状态：">
          <el-select v-model="queryParams.status" style="width: 150px">
            <el-option
              v-for="item in Object.keys(topOrgStatus)"
              :key="item"
              :label="topOrgStatus[item]"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类型：">
          <el-select v-model="queryParams.type" style="width: 150px">
            <el-option
              v-for="item in Object.keys(orgType)"
              :key="item"
              :label="orgType[item]"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button type="primary" @click="handleClear"
            >清空搜索条件</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content">
      <div class="main-content-left">
        <!-- <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="isActive === index ? 'green' : ''"
            @click="handleItemClick(index, activity.content)"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline> -->
        <CustomerTree
          ref="CustomerTree"
          :totalOrgNum="totalOrgNum"
          :totalOperatedOrgNum="totalOperatedOrgNum"
          :activities="activities"
          @handleClick="customerTreeClick"
        ></CustomerTree>
      </div>
      <div class="main-content-right">
        <BreadCrumb
          :text="title"
          :editable="true"
          btnText="创建域名机构"
          @handleClick="addOrgVisible = true"
        >
          <template v-slot:detail>
            <div class="customer-detail">
              <div class="customer-detail-left">
                <div class="link">
                  <span>二级域名:</span>
                  <a href="" @click="linkTo()">{{customerObj.link}}</a>
                </div>
                <div class="link">
                  <span>创建时间:</span>
                  <span>{{customerObj.createTime}}</span>
                </div>
              </div>
              <div class="customer-detail-right">
                <div class="customer num1">
                  <div class="customer-type">
                    <div class="img">
                      <img src="../../assets/img/icon.png"/>
                    </div>
                    顶级合作机构(家)</div>
                  <div class="customer-num">{{customerObj.total}}</div>
                </div>
                <div class="divider"></div>
                <div class="customer num2">
                  <div class="customer-type">正式机构(家)</div>
                  <div class="customer-num">{{customerObj.officialNum}}</div>
                </div>
                <div class="divider" style="margin-right: 31px;"></div>
                <div class="customer num3">
                  <div class="customer-type">试用机构(家)</div>
                  <div class="customer-num">{{customerObj.tryOutNum}}</div>
                </div>
              </div>
            </div>
          </template>
        </BreadCrumb>
        <div class="table-content">
          <div class="table-content-btn">
            <el-button type="primary" @click="isChecked = !this.isChecked">{{
              batchHandleText
            }}</el-button>
            <el-button type="primary" @click="handleExport">导出</el-button>
          </div>
          <div class="table-contend-body">
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="(val) => (this.multipleSelection = val)"
              @sort-change="handleSortChange"
              v-loading="loading"
              :row-key="(val) => val.id"
            >
              <el-table-column
                type="selection"
                v-if="isChecked"
                width="55"
                :reserve-selection="true"
              />
              <el-table-column
                v-for="item in column"
                :prop="item.prop"
                :label="item.label"
                :sortable="item.sort"
                :width="item.width"
                :key="item.label"
              />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="text"
                    @click="handleAction(scope.row, 'rules')"
                  >
                    权限管理
                  </el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button
                    type="text"
                    @click="handleAction(scope.row, 'logs')"
                    >操作日志
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="pageChange"
              background
              :current-page="page"
              layout="total, prev, pager, next, jumper"
              :total="total"
            />
          </div>
        </div>
        <el-dialog
          title="创建域名机构"
          v-model="addOrgVisible"
          @close="resetAddOrgForm"
          width="500px"
        >
          <el-form
            :model="addOrgForm"
            ref="addOrgForm"
            v-bind="addOrgFormOptions.options"
            :rules="addOrgFormOptions.rules"
          >
            <el-form-item label="二级域名：" prop="url">
              <el-input
                v-model="addOrgForm.url"
                autocomplete="off"
                maxlength="20"
                placeholder="请输入二级域名"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="机构名称：" prop="name">
              <el-input
                v-model="addOrgForm.name"
                autocomplete="off"
                maxlength="11"
                placeholder="请输入机构名称"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="addOrgVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleAddOrg">确 定</el-button>
            </span>
          </template>
        </el-dialog>
        <RulesModal
          :formData="rulesForm"
          :visible="rulesModalVisible"
          @close="rulesModalVisible = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { topOrgStatus, orgType, SORTER_TYPE } from "@/utils/static";
import BreadCrumb from "@/components/bread-crumb";
import { taskAssignColumn } from "@/static/column";
import { toRaw } from "vue";
import AdminApi from "@/server/api/admin";
import RulesModal from "@/views/customer-management/modal/rules-modal";
import CustomerTree from "./component/CustomerTree";
export default {
  name: "customerManagement",
  nameComment: "客户管理",
  components: {
    RulesModal,
    BreadCrumb,
    CustomerTree,
  },
  data() {
    return {
      queryParams: {
        orgName: "",
        time: "",
        status: "",
        type: "",
      },
      title: "全部",
      topOrgStatus,
      orgType,
      tableData: [],
      multipleSelection: [],
      loading: false,
      isChecked: false,
      column: taskAssignColumn,
      page: 1,
      total: 0,
      isActive: 0,
      activities: [ // 域名机构列表
        {
          id: 1,
          name: "台州银行域名机构",
          operatedOrgNum: 1,
          orgNum: 3
        },
        {
          id: 2,
          name: "杭州银行域名机构",
          operatedOrgNum: 2,
          orgNum: 4
        },
        {
          id: 3,
          name: "溫州银行域名机构",
          operatedOrgNum: 3,
          orgNum: 5
        },
      ],
      totalOrgNum: 12, // 总机构数
      totalOperatedOrgNum: 6, // 总合作中机构数
      customerObj: { // 选中的域名机构对象
        link: 'cmbc.yczcjk.com',
        createTime: '2019-12-21',
        total: 12,
        officialNum: 8,
        tryOutNum: 4
      },
      addOrgVisible: false,
      rulesModalVisible: false,
      addOrgForm: {
        url: "",
        name: "",
      },
      rulesForm: {
        a: "2112111ID",
        b: "顶级合作机构名称",
      },
      addOrgFormOptions: {
        options: {
          labelPosition: "right",
          labelWidth: "120px",
          destroyOnClose: true,
          class: "add-org-modal",
        },
        rules: {
          url: [
            { required: true, message: "请输入二级域名", trigger: "change" },
          ],
          name: [
            { required: true, message: "请输入机构名称", trigger: "change" },
          ],
        },
      },
    };
  },
  created() {
    this.getList();
    // let name = [
    //   "河北省",
    //   "山西省",
    //   "辽宁省",
    //   "吉林省",
    //   "黑龙江省",
    //   "江苏省",
    //   "浙江省",
    //   "安徽省",
    //   "福建省",
    //   "江西省",
    //   "山东省",
    //   "河南省",
    //   "湖北省",
    //   "湖南省",
    //   "广东省",
    //   "海南省",
    //   "四川省",
    //   "贵州省",
    //   "云南省",
    //   "陕西省",
    //   "甘肃省",
    //   "青海省",
    //   "台湾省",
    // ];
    // for (let i = 0; i < name.length; i++) {
    //   let obj = {
    //     content: `${name[i]}银行域名机构(${Math.random().toString()[5]}/${
    //       Math.random().toString()[8]
    //     })`,
    //   };
    //   this.activities = [...this.activities, obj];
    // }
  },
  mounted() {
  },
  watch: {
    $route() {
      // 对路由变化作出响应...
      // this.title = to.params.customerName
    },
  },
  methods: {
    getList() {
      this.loading = true;
      console.log(toRaw(this.queryParams));
      const params = {
        ...toRaw(this.queryParams),
        page: this.page,
      };
      AdminApi.getUsersList(params)
        .then((res) => {
          const { code, data } = res.data || {};
          if (code === 200) {
            const { list, page, total } = data || {};
            this.tableData = list;
            this.total = total;
            this.page = page;
          } else {
            this.$message.error("请求出错");
          }
        })
        .finally((this.loading = false));
    },
    //排序
    handleSortChange({ prop, order }) {
      this.isChecked = false;
      this.page = 1;
      this.queryParams = {
        orderField: SORTER_TYPE[prop],
        sortOrder: SORTER_TYPE[order],
      };
      this.getList();
    },
    //翻页
    pageChange(page) {
      this.page = parseInt(page);
      this.getList();
    },
    //（取消）批量管理
    handleBatchCheck(isChecked) {
      this.isChecked = isChecked;
      if (!isChecked) this.$refs.multipleTable.clearSelection();
    },
    handleAction(params, sign) {
      if (sign === "rules") {
        this.rulesModalVisible = true;
      }
      console.log(params, sign);
    },
    //清空搜索条件
    handleClear() {
      this.page = 1;
      this.isChecked = false;
      const { clearSelection, clearSort } = this.$refs.multipleTable;
      clearSelection();
      clearSort();
      this.queryParams = {
        orgName: "",
        user: "",
      };
      this.getList();
    },
    //域名机构切换
    handleItemClick(index, title) {
      this.isActive = index;
      this.title = title;
    },
    handleAddOrg() {
      this.$refs["addOrgForm"].validate((valid) => {
        if (valid) {
          console.log(toRaw(this.addOrgForm));
        }
      });
    },
    handleExport() {
      this.$confirm(
        "点击确定，将为您导出选中的所有信息",
        "点击确定，将为您导出选中的所有信息",
        {
          type: "warning",
        }
      )
        .then(() => {
          this.$message.success("导出成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetAddOrgForm() {
      this.$refs["addOrgForm"].resetFields();
    },
    // 左侧树点击事件
    customerTreeClick(val, obj) {
      // 通过路由控制，改变右侧表格数据
      if (val && val === 'all') {
        this.title = `全部机构（${this.operatedOrgNum}/${this.orgNum}）`;
        this.$router.push('/customerManagement');
      } else {
        this.title = `${obj.name}（ID：${obj.id}）`
        this.$router.push(`/customerManagement/${obj.name}/${obj.id}`);
      }
    },
    // 域名地址跳转
    linkTo () {

    },
  },
  computed: {
    batchHandleText: function () {
      return this.isChecked ? "取消批量管理" : "批量管理";
    },
  },
};
</script>

<style lang="scss">
.customer-management-container {
  background-color: #f0f2f5 !important;
  .query-content {
    background: #fff;
    margin-bottom: 20px;
    .query-form {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .el-form-item {
        margin: 22px 10px 22px;
      }
    }
  }
  .main-content {
    display: flex;
    &-left {
      min-height: 79vh;
      background: #fff;
      min-width: 320px;
      margin-right: 20px;
      padding: 20px;
    }
    &-right {
      flex: 1 !important;
      width: 500px;
      background-color: #fff;
      .customer-detail {
        display: flex;
        justify-content: space-between;
        padding-top: 12px;
        padding-bottom: 21px;
        &-left {
          width: calc(100% - 450px);
          font-size: 14px;
          color: #4E5566;
          .link {
            line-height: 14px;
            a {
              color: #296DD3;
            }
            span:first-child {
              margin-right: 11px;
            }
          }
          .link:last-child {
            margin-top: 16px;
          }
        }
        &-right {
          width: 450px;
          text-align: right;
          .customer {
            display: inline-block;
            text-align: center;
            &-type {
              color: #4E5566;
              font-size: 14px;
              line-height: 14px;
              .img {
                display: inline;
                vertical-align: text-bottom;
                cursor: pointer;
              }
            }
            &-num {
              color: #20242E;
              line-height: 22px;
              font-size: 22px;
              margin-top: 10px;
            }
          }
          .num1 {
            width: 180px;
          }
          .num2 {
            width: 147px;
          }
          .num3 {
            width: 82px;
            text-align: center;
          }
          .divider {
            display: inline-block;
            vertical-align: super;
            width: 1px;
            height: 28px;
            background:#E2E4E9;
          }
        }
      }
      .table-content {
        padding: 20px;
        &-btn {
          margin-bottom: 20px;
          width: 400px !important;
        }
      }
    }
  }
}
.add-org-modal {
  padding-right: 40px;
}
</style>
