import {
  defineComponent, reactive, getCurrentInstance, onMounted,
} from 'vue';
import { dateUtils } from '@/utils';
import './style.scss';

export default defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup() {
    const { proxy } = getCurrentInstance();
    console.log(proxy);
    const pickerDate = reactive({
      time: '',
      start: '',
      end: '',
      isLefe: false,
    });
    const dateRange = [{
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
    const setTime = () => {
      if (pickerDate.time && pickerDate.time.length) {
        pickerDate.start = dateUtils.formatStandardDate(pickerDate.time[0]);
        pickerDate.end = dateUtils.formatStandardDate(pickerDate.time[1]);
      } else {
        pickerDate.start = '';
        pickerDate.end = '';
      }
      proxy.$emit('update:modelValue', [pickerDate.start, pickerDate.end]);
    };
    const setFocus = () => {
      proxy.$refs.pickerStartTime.blur();
      document.querySelector('.pickerDate1').querySelectorAll('input')[0].focus();
    };
    onMounted(() => {
      const dom = document.querySelectorAll('.el-picker-panel__shortcut');
      dom.forEach((item) => {
        item.addEventListener('click', () => {
          pickerDate.end = '';
          proxy.$emit('update:modelValue', [pickerDate.start, pickerDate.end]);
        });
      });
    });
    return {
      pickerDate,
      setTime,
      dateRange,
      setFocus,
    };
  },
  render() {
    const {
      pickerDate, setTime, dateRange, modelValue, setFocus,
    } = this;
    const [timeStart, timeEnd] = modelValue;
    if (timeStart && timeEnd) {
      pickerDate.time = [new Date(timeStart), new Date(timeEnd)];
    } else if (!timeStart && !timeEnd) {
      pickerDate.time = '';
    } else {
      pickerDate.time = [new Date(timeStart), new Date(timeStart)];
    }
    pickerDate.start = timeStart;
    pickerDate.end = timeEnd;
    return (
      <div className="yc-query-date">
        <el-date-picker
          v-model={pickerDate.time}
          class="pickerDate1"
          type="daterange"
          unlink-panels
          style={{ width: '286px' }}
          class="yc-query-date-picker"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          shortcuts={dateRange}
          onChange={setTime}
        >
        </el-date-picker>
        <el-input
          v-model={pickerDate.start}
          class="input-style left"
          ref="pickerStartTime"
          onFocus={setFocus}
          placeholder="开始时间"
        />
        <el-input
          v-model={pickerDate.end}
          class="input-style right"
          placeholder="结束时间"
        />
      </div>
    );
  },
});
