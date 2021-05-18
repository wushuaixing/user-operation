<template>
  <div class="yc-newpage-contaner">
    <section class="main-wrapper document-search-wrapper">
      <BreadCrumb text="文书搜索" />
      <el-form :inline="true" :model="params" class="query-form">
        <el-form-item label="全文：" class="content-input">
          <el-input
            v-model="params.content"
            placeholder="姓名、公司、地址关键词等"
            style="width: 100%"
            @keyup.enter="onSubmit"
          ></el-input>
        </el-form-item>
        <div class="records" v-if="recordsList.length">
          <span class="title">最近搜索：</span>
          <div class="records-box">
            <span
              v-for="item in recordsList"
              :key="item"
              @click="handleFill(item)"
            >
              {{ item }}
            </span>
            <el-tooltip
              effect="dark"
              content="清空最近搜索记录"
              placement="top"
            >
              <i
                @click="clearRecords"
                @mouseover="iconHover = true"
                @mouseleave="iconHover = false"
                ><img :src="iconHover ? clearHoverIcon : clearIcon" alt=""
              /></i>
            </el-tooltip>
          </div>
        </div>
        <el-form-item label="案号：">
          <el-input
            v-model="params.ah"
            placeholder="案号"
            @keyup.enter="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item label="法院：">
          <el-input
            v-model="params.court"
            placeholder="法院"
            @keyup.enter="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item label="链接：">
          <el-input
            v-model="params.url"
            placeholder="文书源链接"
            @keyup.enter="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="primary" @click="resetForm">清空搜索条件</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" style="width: 100%" v-loading="loading">
        <el-table-column label="发布日期" width="180">
          <template #default="scope">
            {{ $filters.show_(scope.row.publishTime) }}
          </template>
        </el-table-column>
        <el-table-column label="标题" width="180">
          <template #default="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.title"
              placement="top"
            >
              <div class="yc-ellipsis">
                <router-link :to="toDetail(scope.row)">
                  {{ scope.row.title }}
                </router-link>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="案号" width="180">
          <template #default="scope">
            {{ $filters.show_(scope.row.ah) }}
          </template>
        </el-table-column>
        <el-table-column label="相关人员" width="180">
          <template #default="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.appellors"
              placement="top"
            >
              <div class="yc-ellipsis">
                {{ $filters.show_(scope.row.appellors) }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="法院" width="180">
          <template #default="scope">
            {{ $filters.show_(scope.row.court) }}
          </template>
        </el-table-column>
        <el-table-column label="案由" width="180">
          <template #default="scope">
            {{ $filters.show_(scope.row.reason) }}
          </template>
        </el-table-column>
        <el-table-column label="案件类型" width="180">
          <template #default="scope">
            {{ $filters.show_(scope.row.caseType) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="pageChange"
        background
        :current-page="page"
        layout="total, prev, pager, next, jumper"
        :total="total > 10000 ? 10000 : total"
        hide-on-single-page
      >
      </el-pagination>
    </section>
  </div>
</template>

<script>
import BreadCrumb from "@/components/bread-crumb";
import { toRaw } from "vue";
import CommonApi from "@/server/api/common";
import clearIcon from "@/assets/img/records_del.jpg";
import clearHoverIcon from "@/assets/img/records_del_hover.jpg";

let storage = window.localStorage;
export default {
  name: "documentSearch",
  nameComment:'文书搜索',
  data() {
    return {
      page: 1,
      clearIcon,
      clearHoverIcon,
      params: {
        content: "",
        ah: "",
        court: "",
        url: "",
      },
      dataList: [],
      recordsList: [],
      total: 0,
      loading: false,
      iconHover: false,
      toDetail: (params) => {
        const { wenshuId, wid } = params;
        const { content } = this.params;
        return `/documentDetail/${wenshuId}/${wid}/${
          content ? content : "content"
        }`;
      },
    };
  },
  components: {
    BreadCrumb,
  },
  created() {
    const records = JSON.parse(storage.getItem("records")) || [];
    this.recordsList = records;
    document.title = "文书搜索";
  },
  methods: {
    onSubmit() {
      const params = toRaw(this.params);
      const t = (str = "", flag) =>
        flag ? str.trim() : str.trim().replace(/\s+/g, " ");
      Object.keys(params).forEach(
        (key) => (params[key] = t(params[key], key !== "content"))
      );
      const { content } = params;
      let records = JSON.parse(storage.getItem("records")) || [];
      t(content) && records.unshift(t(content));
      const uniqueRecords = [...new Set(records)];
      storage.setItem("records", JSON.stringify(uniqueRecords.slice(0, 9)));
      this.params = {
        ...params,
      };
      this.page = 1;
      this.recordsList = uniqueRecords;
      this.getTableList();
    },
    getTableList() {
      const params = {
        ...toRaw(this.params),
        page: this.page,
      };
      this.loading = true;
      CommonApi.documentSearch(params)
        .then((res) => {
          const { data, code, page, total } = res.data || {};
          if (code === 200) {
            this.total = total;
            this.page = page;
            this.dataList = data;
          } else {
            this.$message.warning("请求出错");
          }
        })
        .finally((this.loading = false));
    },
    resetForm() {
      this.params = {
        content: "",
        ah: "",
        court: "",
        url: "",
      };
      this.getTableList();
    },
    pageChange(page) {
      this.page = parseInt(page);
      this.getTableList();
    },
    handleFill(content) {
      this.params = {
        ...this.params,
        content,
      };
      this.getTableList();
    },
    clearRecords() {
      storage.removeItem("records");
      this.iconHover = false;
      this.recordsList = [];
    },
  },
};
</script>

<style lang="scss">
.document-search-wrapper {
  .query-form {
    padding: 20px;

    .el-input__inner {
      width: 260px;
    }

    .content-input {
      width: 100%;

      .el-form-item__content {
        width: calc(100% - 54px);

        .el-input__inner {
          width: 100% !important;
        }
      }
    }

    .records {
      display: flex;
      font-size: 12px;
      line-height: 20px;
      padding-left: 40px;

      .title {
        min-width: 60px;
      }

      &-box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        span {
          padding: 0 8px;
          background-color: #edeff3;
          margin: 0 12px 12px 0;
          border-radius: 2px;
          color: #4e5566;
          display: inline-block;
        }

        img {
          width: 16px;
          margin-bottom: 6px;
        }
      }
    }
  }
}
</style>
