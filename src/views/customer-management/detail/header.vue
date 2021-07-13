<template>
  <div>
    <div class="customer-name">{{title}}</div>
    <div class="customer-message">
      <div class="customer-message-useDetail">
        <div class="useDetail-left">
          <div class="item">
            <span class="item-label">机构类型</span>：
            <span>{{customerData.type ? "正式" : "试用"}}</span>
          </div>
          <div class="item">
            <span class="item-label">剩余账号数</span>：
            <span v-if="!customerData.isAccountLimit">不限</span>
            <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restAccountCount, customerData.accountLimitCount)}}
                  </span>/
                  {{customerData.accountLimitCount}}
                </span>
          </div>
          <div class="item">
            <span class="item-label">剩余子机构数</span>：
            <span v-if="!customerData.isSubOrgLimit">不限</span>
            <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restSubOrgCount, customerData.subOrgLimitCount)}}
                  </span>/
                  {{customerData.subOrgLimitCount}}
                </span>
          </div>
        </div>
        <div class="useDetail-right">
          <div class="item">
            <span class="item-label1">剩余画像查询次数</span>：
            <span v-if="!customerData.isPortraitLimit">不限</span>
            <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restPortraitCount, customerData.portraitLimitCount)}}
                  </span>/
                  {{customerData.portraitLimitCount}}
                </span>
          </div>
          <div class="item">
            <span class="item-label1">剩余分类搜索次数</span>：
            <span v-if="!customerData.isClassifiedLimit">不限</span>
            <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restClassifiedCount, customerData.classifiedLimitCount)}}
                  </span>/
                  {{customerData.classifiedLimitCount}}
                </span>
          </div>
          <div class="item">
            <span class="item-label1">剩余监控债务人数</span>：
            <span v-if="!customerData.isObligorLimit">不限</span>
            <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restObligorCount, customerData.obligorLimitCount)}}
                  </span>/
                  {{customerData.obligorLimitCount}}
                </span>
          </div>
        </div>
        <div class="linkAddress">
          <div class="item">
            <span class="item-label">域名网址</span>：
            <a
              class="button-link"
              :href="`https://${customerData.url}${customerData.url ? '.' : ''}yczcjk.com`"
              target='_blank'
            >{{`${customerData.url}${customerData.url ? '.' : ''}yczcjk.com`}}</a>
          </div>
        </div>
      </div>
      <div class="customer-message-timeline time1" v-if="customerData.type && contractRecord.length">
        <span>签约记录：</span>
        <el-timeline class="timeline">
          <el-timeline-item
            v-for="(activity, index) in contractList"
            color="#296DD3"
            :key="index">
            <div>
                  <span>
                    {{activity.text}}
                  </span>
              <span class="open" @click="showContractMessage" v-if="contractRecord.length > 3 && index === contractList.length - 1">
                    <span v-if="showStatus === 'close'">展开<i class="el-icon-arrow-down" style="margin-left: 7px;"></i></span>
                    <span v-else>收起<i class="el-icon-arrow-up" style="margin-left: 7px;"></i></span>
                  </span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div class="customer-message-timeline time2" v-if="delayRecord.length">
        <span>延期记录：</span>
        <el-timeline class="timeline">
          <el-timeline-item
            v-for="(activity, index) in delayList"
            color="#296DD3"
            :key="index">
            <div>
              <span>{{activity.text}}</span>
              <span class="open" @click="showdelayMessage" v-if="delayRecord.length > 3 && index === delayList.length - 1">
                    <span v-if="delayShowStatus === 'close'">展开<i class="el-icon-arrow-down" style="margin-left: 7px;"></i></span>
                    <span v-else>收起<i class="el-icon-arrow-up" style="margin-left: 7px;"></i></span>
                  </span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      customerData: {
        name: '',
        id: 0,
        // 账号数
        isAccountLimit: 0, // 是否限制 0：否  1：是
        accountLimitCount: 0, // 总
        restAccountCount: 0, // 剩余
        // 分类搜索
        isClassifiedLimit: 0,
        classifiedLimitCount: 0,
        restClassifiedCount: 0,
        // 监控债务
        isObligorLimit: 0,
        obligorLimitCount: 0,
        restObligorCount: 0,
        // 画像查询
        isPortraitLimit: 0,
        portraitLimitCount: 0,
        restPortraitCount: 0,
        // 子机构
        isSubOrgLimit: 0,
        subOrgLimitCount: 0,
        restSubOrgCount: 0,
        type: 0,
        url: 'cmbc.yczcjk.com',
      },
      contractShowIndex: 3,
      delayShowIndex: 3,
      showStatus: 'close',
      delayShowStatus: 'close',
      acountList: ['首', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      contractRecord: [
      ],
      delayRecord: [
      ],
    };
  },
  computed: {
    title() {
      return `顶级合作机构：${this.customerData.name} (ID：${this.customerData.id})`;
    },
    contractList() {
      return this.contractRecord.filter((item, index) => index < this.contractShowIndex);
    },
    delayList() {
      return this.delayRecord.filter((item, index) => index < this.delayShowIndex);
    },
  },
  methods: {
    setData(data) {
      const { contractRecord, delayRecord, ...customerData } = data || {};
      this.customerData = customerData;
      if (contractRecord.length) this.contractRecord = this.setRecord(contractRecord, 'qy');
      if (delayRecord.length) this.delayRecord = this.setRecord(delayRecord, 'yq');
    },
    // 判断 限制 数字小于0取0 大于限制数等于限制数
    checkNum(rest, limit) {
      if (rest < 0) return 0;
      if (rest > limit) return limit;
      return rest;
    },
    // 设置签约记录 延期记录
    setRecord(list, type) {
      return type === 'qy'
        ? list.map((item, index) => {
          const text = `${this.acountList[index]}次${index ? '续签' : '签约'}起止日期：${item.start || '-'} 至 ${item.end || '-'}`;
          return Object.assign(item, { text });
        }).reverse()
        : list.map((item, index) => {
          const text = `${this.acountList[index + 1]}次延期时长：${item}日`;
          return Object.assign(item, { text });
        }).reverse();
    },
    // 展开收起
    showContractMessage() {
      this.contractShowIndex = this.showStatus === 'open' ? 3 : this.contractRecord.length;
      this.showStatus = this.contractShowIndex === 3 ? 'close' : 'open';
    },
    showdelayMessage() {
      this.delayShowIndex = this.delayShowStatus === 'open' ? 3 : this.delayRecord.length;
      this.delayShowStatus = this.delayShowIndex === 3 ? 'close' : 'open';
    },
  },
};
</script>
<style lang="scss">
  .customer-name {
    font-weight: 600;
    color: #20242E;
    font-size: 20px;
    line-height: 20px;
    margin-bottom: 24px;
  }
  .customer-message {
    display: flex;
    flex-direction: row;
    &-useDetail {
      width: 34%;
      color: #4E5566;
      font-size: 14px;
      .useDetail-left {
        display: inline-block;
        width: 200px;
      }
      .useDetail-right {
        display: inline-block;
        width: calc(100% - 200px);
      }
      .item {
        line-height: 14px;
        margin-top: 16px;
        &-label {
          width: 85px;
          display: inline-block;
          text-align-last: justify;
        }
        &-label1 {
          width: 115px;
          display: inline-block;
          text-align-last: justify;
        }
        &-bold {
          color: #20242E;
          font-weight: 600;
        }
      }
      .item:first-child {
        margin-top: 0px;
      }
      .linkAddress {
        margin-top: 12px;
      }
    }
    &-timeline {
      font-size: 14px;
      color: #20242E;
      line-height: 14px;
      position: relative;
      .timeline {
        display: inline-grid;
        .open {
          font-size: 14px;
          color: #296DD3;
          cursor: pointer;
          margin-left: 16px;
        }
        .el-timeline-item {
          padding-bottom: 8px !important;
        }
        .el-timeline-item__tail {
          left: 4px;
          top: 7px;
          border-left: 1px solid #E2E4E9;
        }
        .el-timeline-item__node--normal {
          left: 2px;
          width: 6px;
          height: 6px;
          top: 4px;
        }
        .el-timeline-item__wrapper {
          padding-left: 16px;
          top: 0;
        }
      }
    }
    .time1 {
      width: 38%;
    }
    .time2 {
      width: 28%;
    }
  }
</style>
