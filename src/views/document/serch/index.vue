<template>
  <div class="yc-newpage-contaner">
    <section class="main-wrapper document-search-wrapper">
      <BreadCrumb text="文书搜索" />
      <div class="main-content">
        <div class="query-content">
          <el-form :inline="true" :model="params" class="query-form" ref="queryForm">
            <el-form-item label="全文：" class="content-input" prop="content">
              <el-input
                v-model="params.content"
                placeholder="姓名、公司、地址关键词等"
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
                  class="cursor-pointer"
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
                    class="cursor-pointer"
                  ><img :src="iconHover ? clearHoverIcon : clearIcon" alt=""
                  /></i>
                </el-tooltip>
              </div>
            </div>
            <el-form-item label="案号：" prop="ah">
              <el-input
                v-model="params.ah"
                placeholder="案号"
                @keyup.enter="onSubmit"
              ></el-input>
            </el-form-item >
            <el-form-item label="法院：" prop="court">
              <el-input
                v-model="params.court"
                placeholder="法院"
                @keyup.enter="onSubmit"
              ></el-input>
            </el-form-item>
            <el-form-item label="链接：" prop="url">
              <el-input
                v-model="params.url"
                placeholder="文书源链接"
                @keyup.enter="onSubmit"
              ></el-input>
            </el-form-item>
            <el-form-item style="float: right;margin-right: 0">
              <el-button type="primary" @click="onSubmit" class="button-first" style="padding: 8px 21px">搜索</el-button>
              <el-button type="primary" @click="resetForm" class="button-fourth" style="padding: 8px 11px">清空搜索条件</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-content">
          <el-table :data="dataList" style="width: 100%" v-loading="loading"  :row-key="({wenshuId,wid}) => `${wenshuId}${wid}`">
            <template #empty>
              <img src="../../../assets/img/no_data.png" alt="" />
              <p>暂无数据</p>
            </template>
            <el-table-column label="发布日期" min-width="9.8%">
              <template #default="scope">
                {{ $filters.undefinedShow(scope.row.publishTime) }}
              </template>
            </el-table-column>
            <el-table-column label="标题" min-width="22%">
              <template #default="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.title"
                  placement="top"
                  :disabled="(scope.row.title||'').length<35"
                >
                  <div class="yc-ellipsis-two">
                    <span @click="toDetail(scope.row)" class="button-link cursor-pointer">
                      {{ scope.row.title || '详情' }}
                    </span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="案号" min-width="17.7%">
              <template #default="scope">
                {{ $filters.undefinedShow(scope.row.ah) }}
              </template>
            </el-table-column>
            <el-table-column label="相关人员" min-width="19.3%">
              <template #default="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.appellors"
                  placement="top"
                  :disabled="(scope.row.appellors||'').length<26"
                >
                  <div class="yc-ellipsis-two  cursor-pointer">
                    {{ $filters.undefinedShow(scope.row.appellors) }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="法院" min-width="16.1%">
              <template #default="scope">
                {{ $filters.undefinedShow(scope.row.court) }}
              </template>
            </el-table-column>
            <el-table-column label="案由" min-width="8.1%">
              <template #default="scope">
                {{ $filters.undefinedShow(scope.row.reason) }}
              </template>
            </el-table-column>
            <el-table-column label="案件类型" min-width="8.1%">
              <template #default="scope">
                {{ $filters.undefinedShow(scope.row.caseType) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @current-change="pageChange"
          background
          :current-page="page"
          layout="total, prev, pager, next, jumper"
          :total="total > 10000 ? 10000 : total"
          :hide-on-single-page="total === 0"
          :key="page"
        >
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import BreadCrumb from '@/components/bread-crumb/index.vue';
import { toRefs, onMounted } from 'vue';
import { recordModule, mainModule } from './business';

const storage = window.localStorage;
export default {
  name: 'documentSearch',
  nameComment: '文书搜索',
  components: {
    BreadCrumb,
  },
  setup() {
    const {
      state, toDetail, getTableList, resetForm, pageChange, handleFill,
    } = mainModule();
    const { recordState, clearRecords, onSubmit } = recordModule(state, getTableList);
    onMounted(() => {
      const records = JSON.parse(storage.getItem('records')) || [];
      recordState.recordsList = records;
      document.title = '文书搜索';
    });
    return {
      ...toRefs(state),
      ...toRefs(recordState),
      toDetail,
      onSubmit,
      getTableList,
      resetForm,
      pageChange,
      handleFill,
      clearRecords,
    };
  },
};

</script>

<style lang="scss">
.document-search-wrapper {
  .main-content{
    padding:0 20px 20px;
  }
  .yc-bread-crumb{
    min-height: 56px;
    &-title{
      height: 56px;
    }
  }
  .query-form {
    padding-top: 20px;
    .el-form-item{
      margin-bottom: 14px;
    }
    .el-input__inner {
      width: 260px;
    }
    .content-input {
      width: 100%;
      .el-form-item__content {
        width: calc(100% - 42px);
        .el-input__inner {
          width: 100% !important;
          height: 40px;
        }
      }
    }

    .records {
      display: flex;
      font-size: 12px;
      line-height: 18px;
      padding:0 0 5px 40px;
      margin-top: -2px;
      .title {
        min-width: 60px;
        color: #4e5566;
      }
      &-box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        span {
          padding: 0 8px;
          background-color: #edeff3;
          margin: 0 11px 11px 0;
          border-radius: 2px;
          color: #4e5566;
          display: inline-block;
          border: 1px solid #edeff3;
          &:hover{
            border: 1px solid #296dd3;
            color: #296dd3;
          }
        }
        img {
          width: 16px;
          margin-bottom: 6px;
        }
      }
    }
  }
  .table-content{
    padding-top: 20px;
  }
}
</style>
