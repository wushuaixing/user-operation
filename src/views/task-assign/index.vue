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
    <div class="query-content" v-if="tabKey === '2'" :key="tabKey">
      <el-form :inline="true" :model="queryParams" class="query-form">
        <el-form-item label="顶级合作机构名称：">
          <el-input
            v-model="queryParams.orgName"
            placeholder="顶级合作机构名称"
            style="width: 100%"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item label="负责人：">
          <el-select v-model="queryParams.uid">
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
          <el-button type="primary" @click="getList" class="button-first"
            >搜索</el-button
          >
          <el-button type="primary" @click="resetOptions" class="button-fourth"
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
        <el-button
          @click="handleOpenModal('batch')"
          class="button-fourth"
          v-show="isChecked"
        >
          {{ tabKey === "1" ? "分配" : "重新分配" }}
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
          <template #empty>
            <img src="../../assets/img/no_data.png" alt="">
            <p>暂无数据</p>
          </template>
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
            v-if="tabKey === '2'"
          />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="text"
                @click="handleOpenModal('single', scope.row)"
                class="button-link"
              >
                {{ tabKey === "1" ? "分配" : "重新分配" }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="pageChange"
          @size-change="sizeChange"
          background
          :current-page="page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.num"
          layout="total,sizes, prev, pager, next, jumper"
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
          <li>
            <div>顶级合作机构名称：</div>
            <div>
              <p v-for="(item, index) in topOrgNameList" :key="index">
                {{ item }}
                <template
                  v-if="index === (topOrgNameList.length || []) - 1 && multipleSelection.length > 5"
                >
                  <el-button type="text" @click="handleToggle" v-if="toggle"
                    >展开<i class="iconfont iconxia-xian"></i
                  ></el-button>
                  <el-button type="text" @click="handleToggle" v-else
                    >收起<i class="iconfont iconshang-xian"></i
                  ></el-button>
                </template>
              </p>
            </div>
          </li>
          <li>
            <div>机构类型：</div>
            <div>正式</div>
          </li>
          <li>
            <div>机构负责人：</div>
            <div>
              <el-select
                v-model="modalParams.uid"
                placeholder="请选择机构负责人"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                >
                </el-option>
              </el-select>
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
      taskAssignTabs,
      toggle: true,
      toBeAllocatedNum: 0,
      column: taskAssignColumn,
      isChecked: false,
      tabKey: "1",
      tableData: [],
      userList: [],
      multipleSelection: [],
      page: 1,
      total: 0,
      loading: false,
      params: {
        orderField: "",
        sortOrder: "",
        num: 10,
      },
      queryParams: {
        orgName: "",
        uid: "",
      },
      modalParams: {
        idList: [],
        uid: "",
      },

      topOrgNameList: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.simpleUserList();
      this.getList();
    },
    simpleUserList() {
      AdminApi.simpleUserList().then((res) => {
        const { data } = res.data || {};
        this.userList = [...data];
      });
    },
    getList() {
      this.loading = true;
      const params = {
        ...toRaw(this.params),
        ...toRaw(this.queryParams),
        page: this.page,
      };
      AdminApi.distributeList(Number(this.tabKey), params)
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
        .then(() => {
          const isGetNum = this.tabKey === "1";
          isGetNum &&
            AdminApi.getNum().then((res) => {
              const { data } = res.data || {};
              this.toBeAllocatedNum = data;
            });
        })
        .finally(() => (this.loading = false));
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
    //pageSize 改变
    sizeChange(num) {
      this.params = {
        ...this.params,
        num,
      };
      this.getList();
    },

    //tab切换 && 清空搜索条件
    resetOptions() {
      this.page = 1;
      this.isChecked = false;
      const { clearSelection, clearSort } = this.$refs.multipleTable;
      clearSelection();
      clearSort();
      this.queryParams = {
        orgName: "",
        uid: "",
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
        const { id, orgName } = toRaw(val);
        this.topOrgNameList = [orgName];
        this.modalParams.idList = [id];
      } else {
        if ((this.multipleSelection || []).length) {
          this.visible = true;
          this.modalParams.idList = this.multipleSelection.map((i) => i.id);
          const list = this.multipleSelection.map((i) => i.orgName);
          this.topOrgNameList = list.slice(0,5);
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
        uid: "",
      };
    },
    onsubmit() {
      const params = toRaw(this.modalParams);
      const { uid } = params;
      if (uid) {
        AdminApi.distribute(params).then((res) => {
          const { code } = res.data || {};
          if (code === 200) {
            this.$message.success({
              message: "添加成功",
              duration: 1000,
              onClose: () => {
                this.visible = false;
                this.isChecked = false;
                this.$refs.multipleTable.clearSelection();
                this.getList();
              },
            });
            this.visible = false;
          } else {
            this.$message.error("请求出错");
          }
        });
      } else {
        this.$message.warning("请选择机构负责人");
      }
    },
    handleToggle() {
      const list = this.multipleSelection.map((i) => i.orgName);
      if (this.toggle) {
        this.topOrgNameList = list;
      } else {
        this.topOrgNameList = list.slice(0, 5);
      }
      this.toggle = !this.toggle;
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
        .org-num {
          padding-right: 25px;
        }
        .obligor-num {
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
