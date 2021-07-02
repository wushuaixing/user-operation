import {
  defineComponent, onMounted, reactive, getCurrentInstance,
} from 'vue';
import MyOrgApi from '@/server/api/my-org';
import './style.scss';

const defaultProps = {
  children: 'subOrg',
  label: 'name',
};
const selectSlots = {
  prefix: () => <span className="iconfont iconsousuo"></span>,
};
export default defineComponent({
  props: {
    orgId: String,
  },
  emits: ['treeNodeClick'],
  setup(props) {
    const { proxy } = getCurrentInstance();
    const treeData = reactive({
      treeData: [],
      searchList: [],
      searchValue: '',
    });
    // 遍历树 深度
    const filterTree = (node, value) => {
      if (node.name.indexOf(value) > -1) treeData.searchList.push(node);
      if (node.subOrg.length) {
        node.subOrg.forEach((item) => filterTree(item, value));
      }
    };
    // 高亮树节点
    const highLight = (id) => {
      // 根据当前选中的子机构进行 树的选中
      proxy.$nextTick(() => {
        const { setCurrentKey } = proxy.$refs.monitorTree;
        setCurrentKey(id);
      });
    };
    onMounted(() => {
      const dom = document.getElementById('orgSelect');
      dom.setAttribute('maxLength', 100);
      // 获取客户使用机构树
      const params = { orgId: props.orgId };
      MyOrgApi.orgTree(params).then((res) => {
        const { code, message, data } = res.data;
        if (code === 200) {
          const { tree } = data;
          treeData.treeData = [tree];
          proxy.$emit('treeNodeClick', tree.id, 'init');
          highLight(tree.id);
          filterTree(tree, '');
        } else {
          proxy.$message.error(message);
        }
      });
    });
    const remoteMethod = (val) => {
      // 搜索
      treeData.searchList = [];
      const key = val.replace(/\s+/g, '');
      filterTree(treeData.treeData[0], key);
    };
    const handleNodeClick = (node) => {
      // 将orgId传递给查询区域
      treeData.searchValue = node.id;
      proxy.$emit('treeNodeClick', node.id);
    };
    const resetList = () => {
      treeData.searchList = [];
      filterTree(treeData.treeData[0], '');
    };
    return {
      treeData,
      remoteMethod,
      handleNodeClick,
      resetList,
    };
  },
  render() {
    const {
      treeData, handleNodeClick, remoteMethod, resetList,
    } = this;
    return (
      <div className="monitor-tree">
        <el-select
          class="monitor-tree-select"
          id="orgSelect"
          v-slots={selectSlots}
          v-model={treeData.searchValue}
          filterable
          remote
          remote-method={remoteMethod}
          onVisibleChange={resetList}
          placeholder="请输入机构名称">
          {
            treeData.searchList.map((item) => <el-option key={item.id} label={item.name} value={item.id}/>)
          }
        </el-select>
        <el-tree
          class="monitor-tree-tree"
          data={treeData.treeData}
          props={defaultProps}
          ref="monitorTree"
          node-key="id"
          default-expand-all
          highlight-current
          expand-on-click-node={false}
          onNodeClick={handleNodeClick}>
        </el-tree>
      </div>
    );
  },
});
