import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const tabKey = ref(1); // 1已推送 0客户未读
    const unReadNum = ref(0);

  },
  render() {
    const { unReadNum } = this;
    return (
      <div>
        <el-tabs type="border-card">
          <el-tab-pane label="消息中心"/>
          <el-tab-pane>
            <template v-slots="label">
            <span>{`(${unReadNum})`}</span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    );
  },
});
