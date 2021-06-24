import {
  defineComponent, onMounted, ref, reactive, getCurrentInstance, toRefs,
} from 'vue';
import MyOrgApi from '@/server/api/my-org';

const defaultProps = {
  children: 'subOrg',
  label: 'name',
};
export default defineComponent({
  props: {
    orgId: String,
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const treeData = reactive({
      treeData: [],
    });
    const searchCalue = ref('');
    onMounted(() => {
      // 获取客户使用机构树
      const params = { orgId: props.orgId };
      MyOrgApi.orgTree(params).then((res) => {
        const { code, message, data } = res.data;
        if (code === 200) {
          const { tree } = data;
          treeData.treeData = [tree];
        } else {
          proxy.$message.error(message);
        }
      });
    });
    const remoteMethod = (val) => {
      // 搜索
      console.log(val);
    };
    const handleNodeClick = (node) => {
      console.log(node);
      // 将orgId传递给查询区域
    };
    return {
      ...toRefs(treeData),
      searchCalue,
      remoteMethod,
      handleNodeClick,
    };
  },
  render() {
    const {
      remoteMethod, searchCalue, treeData, handleNodeClick,
    } = this;
    console.log(treeData, '323');
    return (
      <div>
        <el-select
          v-model={searchCalue}
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          remote-method={remoteMethod}>
        </el-select>
        <el-tree
          data={treeData}
          props={defaultProps}
          default-expand-all
          highlight-current
          expand-on-click-node={false}
          node-click={handleNodeClick}>
        </el-tree>
      </div>
    );
  },
});
