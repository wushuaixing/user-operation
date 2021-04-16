<template>
  <div class="yc-newpage-contaner">
    <section class="main-wrapper document-detail-wrapper">
      <div class="container-main">
        <header>
          <h1>{{ data.title }}</h1>
          <p>发布日期：{{ $filters.date_(data.publishTime) }}</p>
        </header>
        <div class="yc-line" />
        <div v-html="data.content" class="html-template" />
      </div>
      <div class="container-right">
        <div class="title">基本信息</div>
        <ul>
          <li v-for="item in basicInfo" :key="item.key">
            <div>{{ item.label }}：</div>
            <div>{{ $filters.show_(data[item.key]) }}</div>
          </li>
          <li>
            <div>当事人：</div>
            <div>
              <p :class="toggle ? '' : 'appellors'">
                {{ $filters.show_(data.appellors) }}
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
        <p class="title">源链接</p>
        <a :href="data.url" target="_blank">
          {{ data.url }}
        </a>
        <p style="text-align: right">
          <el-button type="primary" @click="copy">复制链接</el-button>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import CommonApi from "@/server/api/common";
import copy from "copy-to-clipboard";

export default {
  name: "documentDetail",
  data() {
    return {
      data: {},
      ellipsisBtnVisible: false,
      toggle: false,
      basicInfo: [
        {
          label: "审理法院",
          key: "court",
        },
        {
          label: "案件类型",
          key: "caseType",
        },
        {
          label: "案由",
          key: "reason",
        },
        {
          label: "审理程序",
          key: "trialRound",
        },
        {
          label: "裁判日期",
          key: "trialDate",
        },
      ],
    };
  },
  created() {
    const {
      params: { content, wenshuId, wid },
    } = this.$route;
    CommonApi.wenshuDetail(wenshuId, wid, { content }).then((res) => {
      const { code, data } = res.data || {};
      const { title } = data || {};
      if (code === 200) {
        const { appellors } = data;
        this.data = data;
        document.title = title;
        this.ellipsisBtnVisible = appellors && appellors.length > 32;
      } else {
        this.$message.error(res.data.message);
      }
    });
  },
  methods: {
    copy() {
      const { url } = this.data;
      copy(url);
      this.$message.success("复制成功");
    },
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
    top: 150px;
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
