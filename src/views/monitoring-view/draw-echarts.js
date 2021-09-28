/* eslint-disable */
import * as echarts from 'echarts';

const drawEcharts = (dataList, el) => {
  const obj = {};
  const series = [];
  const base = {
    matchNum: {
      name: '匹配数据量',
      color: ['#3180EC', '#5BB4F7']
    }
  }
  for (const key1 in dataList[0]) {
    obj[key1] = [];
  }
  dataList.forEach((item) => {
    for (const key2 in item) {
      obj[key2].push(item[key2]);
    }
  });
  for (const key3 in obj) {
    const temp = {
      name: '匹配数据量',
      type: 'line',
      stack: 'Total',
      symbol: 'circle',
      symbolSize: 7,
      showSymbol: false,
      itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#3180EC' },
        { offset: 1, color: '#5BB4F7' },
      ]),
    },
      lineStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3180EC' },
          { offset: 1, color: '#5BB4F7' },
        ]),
      },
      data: obj[key3],
    }
    series.push(temp)
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    legend: {
      data: ['匹配数据量', '推送数据量'],
      top: 16,
      right: 24,
      itemGap: 40,
      lineStyle: {
        width: 0,
      },
      textStyle: {
        fontSize: 14,
        color: '#4E5566',
      },
      selectedMode: false,
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: obj.x,
    },
    yAxis: {
      type: 'value',
    },
    series,
  };
  const chartDom = document.getElementById(el);
  const myChart = echarts.init(chartDom);
  myChart.setOption(option);
};
export default drawEcharts;
