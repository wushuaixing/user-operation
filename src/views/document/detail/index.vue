<template>
  <div class="yc-newpage-contaner">
    <section class="main-wrapper document-detail-wrapper">
      <div class="container-main">
        <header>
          <h1>{{ data.title }}</h1>
          <p>发布日期：{{ $filters.formatDate(data.publishTime) }}</p>
        </header>
        <div class="yc-line" />
        <div v-html="data.content" class="html-template" />
      </div>
      <div class="container-right">
        <div class="title">基本信息</div>
        <ul>
          <li v-for="item in basicInfo" :key="item.key">
            <div>{{ item.label }}：</div>
            <div>{{ $filters.undefinedShow(data[item.key]) }}</div>
          </li>
          <li>
            <div>当事人：</div>
            <div>
              <p :class="toggle ? '' : 'appellors'">
                {{ $filters.undefinedShow(data.appellors) }}
              </p>
              <p
                v-if="ellipsisBtnVisible"
                @click="toggle = !toggle"
                class="toggle-btn"
              >
                {{ toggle ? "收起" : "展开" }}
              </p>
            </div>
          </li>
        </ul>
        <p class="title" style="margin: 20px 0 12px 0">源链接</p>
        <a :href="data.url" target="_blank" style="font-size: 12px;line-height: 16px;display: inline-block">
          {{ data.url }}
        </a>
        <p style="text-align: right;margin-top: 18px" >
          <el-button type="primary" @click="copys" class="button-fourth" >复制链接</el-button>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import CommonApi from '@/server/api/common';
import copy from 'copy-to-clipboard';
import { DOCUMENT_DETAIL } from '@/static/index';
import {
  reactive, toRefs, onMounted, getCurrentInstance,
} from 'vue';

export default {
  name: 'documentDetail',
  nameComment: '文书详情',
  setup() {
    const { ctx } = getCurrentInstance();
    const state = reactive({
      data: {},
      ellipsisBtnVisible: false,
      toggle: false,
      basicInfo: DOCUMENT_DETAIL,
    });
    const copys = () => {
      const { url } = state.data;
      copy(url);
      ctx.$message.success('复制成功');
    };
    onMounted(() => {
      const {
        query: {
          wenshuId, wid, ah, court, url, content,
        },
      } = ctx.$root.$route;
      const params = {
        ah, court, url, content,
      };
      CommonApi.wenshuDetail(wenshuId, wid, params).then((res) => {
        const { code, data } = res.data || {};
        const { title } = data || {};
        if (code === 200) {
          const { appellors } = data;
          state.data = data;
          document.title = title;
          state.ellipsisBtnVisible = appellors && appellors.length > 32;
        } else {
          ctx.$message.error(res.data.message);
        }
      });
    });
    return { ...toRefs(state), copys };
  },
};
</script>

<style lang="scss">
.document-detail-wrapper {
  padding: 50px 40px 40px;
  box-sizing: border-box;
  .container-main {
    width: 924px;
    header {
      p {
        margin: 20px 0 30px;
        line-height: 16px;
        font-size: 16px;
        color: #7D8699;
      }
    }
    .html-template {
      padding-top: 30px;
    }
  }
  .container-right {
    z-index: 2;
    box-shadow: 0 1px 6px 0 rgba(0, 16, 43, 0.17);
    width: 236px;
    min-height: 370px;
    position: fixed;
    top: 156px;
    right: 0;
    margin-right: calc((100% - 1200px) / 2);
    padding: 20px;
    box-sizing: border-box;
    word-break: break-all;

    .title {
      font-size: 16px;
      color: #293038;
      font-weight: bold;
      line-height: 16px;
      margin-bottom: 14px;
    }

    ul {
      li {
        display: flex;
        line-height: 16px;
        margin-bottom: 8px;

        div {
          font-size: 12px;

          &:first-child {
            min-width: 60px;
            color: #808387;
            text-align: right;
          }
          .toggle-btn {
            margin-top: 4px;
            display: inline-block;
            color: #296dd3;
          }
        }

        .appellors {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
