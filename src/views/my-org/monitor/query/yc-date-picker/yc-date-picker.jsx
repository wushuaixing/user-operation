import {
  defineComponent, reactive, getCurrentInstance, nextTick,
} from 'vue';
import './style.scss';

const dateRange = () => [{
  text: '最近一个月',
  value: (() => {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return [start, start];
  })(),
}, {
  text: '最近三个月',
  value: (() => {
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    return [start, start];
  })(),
}, {
  text: '最近半年',
  value: (() => {
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    return [start, start];
  })(),
}];
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    console.log(proxy);
    const pickerDate = reactive({
      time: '',
      start: '',
      end: '',
    });
    const setFocus = () => {
      nextTick(() => {
        console.log(document.querySelector('#pickerDate'));
        // document.querySelector('#pickerDate').querySelector('input')[0].focus();
      });
    };
    return {
      pickerDate,
      setFocus,
    };
  },
  render() {
    const { pickerDate, setFocus } = this;
    return (
      <div className="yc-query-date">
        <el-date-picker
          v-model={pickerDate.time}
          id="pickerDate"
          type="daterange"
          align="right"
          unlink-panels
          style={{ width: '286px' }}
          class="yc-query-date-picker"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          shortcuts={dateRange()}
        >
        </el-date-picker>
        <el-input
          class="input-style left"
          placeholder="开始时间"
          onFocus={setFocus}
          v-model={pickerDate.start}/>
        <el-input
          class="input-style right"
          placeholder="结束时间"
          onFocus={setFocus}
          v-model={pickerDate.end}/>
      </div>
    );
  },
});
