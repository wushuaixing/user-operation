<template>
  <div class="yc-container task-assign-container">
    <header>
      <el-tabs v-model="tabKey">
        <el-tab-pane
          v-for="item in taskAssignTabs(toBeAllocatedNum)"
          :label="item.label"
          :name="item.name"
          :key="item.name"
        />
      </el-tabs>
    </header>
    <div class="query-content" v-if="tabKey === '1'" :key="tabKey">
      <el-form :inline="true" :model="queryParams" class="query-form">
        <el-form-item label="顶级合作机构名称：">
          <el-input
            v-model="queryParams.orgName"
            placeholder="顶级合作机构名称"
            style="width: 100%"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item label="债务人类别：">
          <el-select v-model="queryParams.user">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button type="primary" @click="resetOptions"
            >清空搜索条件</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-btn">
        <el-button
          type="primary"
          v-if="!isChecked"
          @click="handleBatchCheck(true)"
          class="button-third"
          icon="iconfont iconyonghuyunying-piliangguanli"
        >
          批量管理
        </el-button>
        <el-button
          type="primary"
          v-else
          @click="handleBatchCheck(false)"
          class="button-second"
          >取消批量管理</el-button
        >
        <el-button @click="handleOpenModal('batch')" class="button-fourth">
          {{ tabKey === "0" ? "分配" : "重新分配" }}
        </el-button>
      </div>
      <div class="table-content-body">
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
            :key="item.class"
            :align="item.align"
            :class-name="item.class"
          />
          <el-table-column
            prop="userName"
            label="负责人"
            v-if="tabKey === '1'"
          />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="text"
                @click="handleOpenModal('single', scope.row)"
              >
                {{ tabKey === "0" ? "分配" : "重新分配" }}
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
    <div class="modal-content">
      <el-dialog
        title="分配"
        v-model="visible"
        @close="handleCloseModal"
        width="500px"
      >
        <ul>
          <li v-for="item in modalOptions" :key="item.label">
            <div>{{ item.label }}：</div>
            <div>
              <template v-if="item.type === 'p'">
                <p
                  v-for="(childItem, childIndex) in item.list"
                  :key="childIndex"
                >
                  {{ childItem }}
                </p>
              </template>
              <template v-else>
                <el-select
                  v-model="modalParams.user"
                  placeholder="请选择机构负责人"
                >
                  <el-option
                    v-for="childItem in item.list"
                    :key="childItem"
                    :label="childItem"
                    :value="childItem"
                  />
                </el-select>
              </template>
            </div>
          </li>
        </ul>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="onsubmit">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { SORTER_TYPE, taskAssignTabs } from "@/utils/static";
import { taskAssignColumn } from "@/static/column";
import AdminApi from "@/server/api/admin";
import { toRaw } from "vue";
export default {
  name: "index",
  nameComment: "顶级机构分配",
  data() {
    return {
      visible: false,
      toBeAllocatedNum: 30,
      taskAssignTabs,
      column: taskAssignColumn,
      isChecked: false,
      tabKey: "0",
      tableData: [],
      userList: [],
      multipleSelection: [],
      page: 1,
      total: 0,
      loading: false,
      params: {
        orderField: "",
        sortOrder: "",
      },
      queryParams: {
        orgName: "",
        user: "",
      },
      modalParams: {
        idList: [],
        user: "",
      },
      modalOptions: [
        {
          label: "顶级合作机构名称",
          list: [],
          type: "p",
        },
        {
          label: "机构类型",
          list: ["正式"],
          type: "p",
        },
        {
          label: "机构负责人",
          list: ["方鹏程", "蒋欣", "袁姗姗"],
          type: "select",
        },
      ],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.getUserList();
      this.getList();
    },
    getUserList() {
      const all = { id: "", value: "全部" };
      AdminApi.simpleListUser().then((res) => {
        const { data } = res.data || {};
        this.userList = [all, ...data];
      });
    },
    getList() {
      this.loading = true;
      const params = {
        ...toRaw(this.params),
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
      this.params = {
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
    //tab切换 && 切换搜索条件
    resetOptions() {
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
    //（取消）批量管理
    handleBatchCheck(isChecked) {
      this.isChecked = isChecked;
      if (!isChecked) this.$refs.multipleTable.clearSelection();
    },
    //（重新）分配弹窗开启
    handleOpenModal(sign, val) {
      if (sign === "single") {
        this.isChecked = false;
        this.$refs.multipleTable.clearSelection();
        this.visible = true;
        const { id, phone } = toRaw(val);
        this.modalOptions[0].list = [phone];
        this.modalParams.idList = [id];
      } else {
        if (this.multipleSelection.length) {
          this.visible = true;
          this.modalParams.idList = this.multipleSelection.map((i) => i.id);
          this.modalOptions[0].list = this.multipleSelection.map(
            (i) => i.phone
          );
        } else {
          this.$message.warning("未选中数据");
        }
      }
    },
    //（重新）分配弹窗关闭
    handleCloseModal() {
      this.visible = false;
      this.modalParams = {
        idList: [],
        user: "",
      };
    },
    onsubmit() {
      console.log(this.modalParams);
    },
  },
  watch: {
    tabKey() {
      this.resetOptions();
    },
  },
};
</script>

<style lang="scss">
.task-assign-container {
  .table-content {
    &-btn {
      margin: 0px 0 12px 0;
    }
    &-body {
      tbody {
        .normal-errorNum {
          padding-right: 25px;
        }
        .not-include-errrorNum {
          padding-right: 18px;
        }
      }
    }
  }
  .modal-content {
    .el-dialog__body {
      ul {
        padding-left: 36px;
        li {
          display: flex;
          line-height: 14px;
          margin-bottom: 24px;
          div {
            &:first-child {
              min-width: 126px;
              text-align: right;
            }
            &:last-child {
              p {
                margin-bottom: 12px;
                &:last-child {
                  margin-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
