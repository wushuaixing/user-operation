import moment from 'moment';
/**
 * 去除对象中空值
 * @param obj
 * @returns {*}
 */
const clearEmpty = (obj) => {
  if (typeof obj === 'object') {
    const l = Object.keys(obj);
    const dynamicObj = {
      ...obj,
    };
    l.forEach((item) => {
      if (dynamicObj[item] === '' || dynamicObj[item] === undefined || dynamicObj[item] === null) delete dynamicObj[item];
      else if (typeof dynamicObj[item] === 'string') dynamicObj[item] = dynamicObj[item].replace(/^\s+|\s+$/g, '');
    });
    return dynamicObj;
  }
  return obj;
};

const queryApi = (searchParams) => {
  const params = clearEmpty(searchParams) || {};
  let urlPlus = '';
  Object.keys(params).forEach((key) => {
    urlPlus = `${urlPlus + key}=${params[key]}&`;
  });
  return urlPlus.substring(0, urlPlus.length - 1);
};

const dateUtils = {
  // 时间戳转换为标准日期
  formatStandardDate(timeStamp) {
    return timeStamp === ''
      || timeStamp === '--'
      || timeStamp === undefined
      || timeStamp === null
      ? timeStamp
      : moment(timeStamp).format('YYYY-MM-DD');
  },
};

// 文件下载处理
const fileDownload = (res) => {
  const { data } = res;
  // 创建blob对象
  const blod = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  // 从返回数据中获取文件名称
  let fileName = res.headers['content-disposition'].split('"')[1];
  // 由于中文出现乱码 需要转码
  fileName = decodeURIComponent(fileName).replace(/(.xlsx)/g, '');
  // 创建a标签
  const elink = document.createElement('a');
  elink.style.display = 'none';
  elink.setAttribute('download', fileName);
  elink.href = URL.createObjectURL(blod);
  document.body.appendChild(elink);
  elink.click();
  window.URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink); // 移除a标签
};

const clone = (obj) => {
  let o;
  // 如果  他是对象object的话  , 因为null,object,array  也是'object';
  if (typeof obj === 'object') {
    // 如果  他是空的话
    if (obj === null) {
      o = null;
    } else {
      // 如果  他是数组arr的话
      // eslint-disable-next-line no-lonely-if
      if (obj instanceof Array) {
        o = [];
        for (let i = 0, len = obj.length; i < len; i += 1) {
          o.push(clone(obj[i]));
        }
      } else {
        // 如果  他是对象object的话
        o = {};
        // for (const j in obj) {
        //   o[j] = clone(obj[j]);
        // }
        Object.keys(obj).forEach((j) => {
          o[j] = clone(obj[j]);
        });
      }
    }
  } else {
    o = obj;
  }
  return o;
};

const floatFormat = (str) => {
  const num = parseFloat(str);
  if (Number.isNaN(num) || Array.isArray(str)) return '-';
  const result = Number(num.toFixed(2)).toLocaleString();
  if (!result.split('.')[1]) return `${result}.00`;
  return result;
};

export {
  clearEmpty, queryApi, dateUtils, fileDownload, clone, floatFormat,
};
