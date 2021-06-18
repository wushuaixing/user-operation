<template>
  <div class="yc-container data-audit-container">
    <BreadCrumb text="审核管理" />
  </div>
</template>

<script>
import BreadCrumb from '@/components/bread-crumb/index.vue';

export default {
  name: 'dataAudit',
  nameComment: '审核管理',
  components: {
    BreadCrumb,
  },
};
</script>

<style lang="scss">
.data-audit-container{
  padding-top: 16px !important;
  margin: 20px;
}
</style>
