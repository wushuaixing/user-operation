import {
  defineComponent, reactive, getCurrentInstance, onMounted, Teleport,
} from 'vue';
import { dateUtils } from '@/utils';
import './style.scss';

export default defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup() {
    const { proxy } = getCurrentInstance();
    const pickerDate = reactive({
      time: '',
      start: '',
      end: '',
      isLefe: false,
      dom: <div/>,
    });
    const dateRange = [{
      text: '近一个月及以后',
      value: (() => {
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        return [start, start];
      })(),
    }, {
      text: '近三个月及以后',
      value: (() => {
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        return [start, start];
      })(),
    }, {
      text: '近半年及以后',
      value: (() => {
        const start = new Date();
        start.setMonth(start.getMonth() - 6);
        return [start, start];
      })(),
    }];
    const updateTime = () => {
      const dom = document.getElementById('pickerTime');
      if (dom) {
        pickerDate.dom = <Teleport to="#pickerTime">
          <input
            value={pickerDate.start}
            placeholder="开始时间"
            class="input-style left"
          />
          <input
            value={pickerDate.end}
            placeholder="结束时间"
            class="input-style right"
          />
        </Teleport>;
      }
    };
    const setTime = () => {
      if (pickerDate.time && pickerDate.time.length) {
        pickerDate.start = dateUtils.formatStandardDate(pickerDate.time[0]);
        pickerDate.end = dateUtils.formatStandardDate(pickerDate.time[1]);
      } else {
        pickerDate.start = '';
        pickerDate.end = '';
      }
      updateTime();
      proxy.$emit('update:modelValue', [pickerDate.start, pickerDate.end]);
    };
    onMounted(() => {
      document.querySelector('.yc-query-date-picker').setAttribute('id', 'pickerTime');
      const dom = document.querySelectorAll('.el-picker-panel__shortcut');
      dom.forEach((item) => {
        item.addEventListener('click', () => {
          pickerDate.end = '';
          updateTime();
          proxy.$emit('update:modelValue', [pickerDate.start, pickerDate.end]);
        });
      });
      updateTime();
    });
    return {
      pickerDate,
      setTime,
      dateRange,
      updateTime,
    };
  },
  render() {
    const {
      pickerDate, setTime, dateRange, modelValue, updateTime,
    } = this;
    const value = modelValue || ['', ''];
    const [timeStart, timeEnd] = value;
    if (timeStart && timeEnd) {
      pickerDate.time = [new Date(timeStart), new Date(timeEnd)];
    } else if (!timeStart && !timeEnd) {
      pickerDate.time = '';
    } else {
      pickerDate.time = [new Date(timeStart), new Date(timeStart)];
    }
    pickerDate.start = timeStart;
    pickerDate.end = timeEnd;
    updateTime();
    return (
      <div className="yc-query-date">
        <el-date-picker
          v-model={pickerDate.time}
          type="daterange"
          unlink-panels
          style={{ width: '286px' }}
          class="yc-query-date-picker"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          popper-class="date-picker-kp"
          shortcuts={dateRange}
          onChange={setTime}/>
        {pickerDate.dom}
      </div>
    );
  },
});
