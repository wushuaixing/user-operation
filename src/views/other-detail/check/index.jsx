import {
  defineComponent, reactive, toRaw,
} from 'vue';
import BreadCrumb from '@/components/bread-crumb/index.vue';
import { partData } from '@/static/fn';
import { roleInfoColumn } from '@/static/column';
import './style.scss';

const Item = (props) => {
  const { url, key, val } = props;
  switch (key) {
    case 'title':
      return <a href={url} target='_blank'>{val}</a>;
    case 'buildingArea':
      return <span className='area-field'>{val} m<sup>2</sup></span>;
    case 'landArea':
      return <span className='area-field'>{val} m<sup>2</sup></span>;
    case 'ah':
      if (!val.length) return '-';
      return ((val || []).map((i) => <p key={i}>{i.value}</p>));
    case 'wsUrl':
      if (!val.length) return '-';
      return ((val || []).map((i) => <p><a key={i} href={i} target='_blank'>{i.value}</a></p>));
    default:
      return val;
  }
};

const Part = (props) => {
  const {
    label, parentKey, list, width,
  } = props;
  return <div className="part" key={parentKey} style={{ width }}>
    <h4>{label}</h4>
    <ul>
      {
        list.map((i) => <li key={i.key} className={i.key}>
          <div>{i.lable}：</div>
          <div>
            <Item {...i}></Item>
          </div>
        </li>)
      }
    </ul>
  </div>;
};

export default defineComponent({

  setup() {
    const state = reactive({
      ah: [{ val: '1111111111111111111', lable: '1' }, { val: '2222222222222222222', lable: '1' }, { val: '3333333333333333333', lable: '1' }],
      remark: '退回备注退回备注退回备注退回备注退回备注', // 退回备注
      buildingArea: 1111111.00, // 建筑面积(-1初始值)
      collateral: 0, // 抵押情况 1 无抵押 2 有抵押 0 未知
      houseType: 2, // 房产类型 0 未知 1 商用 2 住宅 3 工业
      id: 11082481,
      isBack: false, // 是否退回过 0未退回 1退回过
      landArea: 2222222.00, // 土地面积
      obligors: [
        {
          birthday: '11111111', gender: '1', label_type: '1', name: 'a', notes: '备注1', number: '111111111111111111', system: null, type: '1',
        },
        {
          birthday: '22222222', gender: '2', label_type: '2', name: 'b', notes: '备注2', number: '222222222222222222', system: null, type: '2',
        },
        {
          birthday: '33333333', gender: '0', label_type: '3', name: 'c', notes: '备注3', number: '333333333333333333', system: null, type: '3',
        },
        {
          birthday: '44444444', gender: '0', label_type: '5', name: 'd', notes: '备注4', number: '444444444444444444', system: null, type: '5',
        }], //
      priorityPrice: 34242342432.00, // 优先受偿额
      title: '（破）衡阳市蒸湘区杨柳综合市场1号楼301-5至301-19房', //
      url: 'https://susong-item.taobao.com/auction/636365861493.htm',
      wsFindStatus: 1, // 文书查找状态 0 未找到文书 1 找到文书
      wsInAttach: 1, // 文书是否在附件中 0 否 1 是
      wsUrl: [{ value: 'aaaaaaaaaaaaaaaaaa' }, { value: 'bbbbbbbbbbbbbbbb' }, { value: 'cccccccccccccccccccc' }],
      status: 1, // 拍卖状态（1:即将开始，3:拍卖中，5:成功交易，7:失败，9:终止, 11:撤回）
    });
    console.log((toRaw(state.ah)));
    const data = partData({ ...state });
    const { obligors } = state;
    return { data, obligors };
  },
  render() {
    const { data, obligors } = this;
    return (
      <div className="yc-newpage-contaner">
        <section className="main-wrapper structure-check-wrapper">
          <BreadCrumb text='结构化校验/详情' />
          <div className="main-content">
            <div className="main-content-top">
              <el-button type="primary" class="button-first action-button">退回</el-button>
              {data.map((i) => <Part {...i}></Part>)}
            </div>
            <div className="main-content-btm">
                <div className="part">
                  <h4>角色信息</h4>
                  <el-table
                    data={obligors}
                    style="width: 100%"
                    row-key={(val) => val.id}
                  >
                    {
                      roleInfoColumn.map((i) => <el-table-column prop={i.prop} label={i.label} key={i.class} min-width={i.width}/>)
                    }
                  </el-table>
                </div>
            </div>
          </div>
        </section>
      </div>
    );
  },
});
