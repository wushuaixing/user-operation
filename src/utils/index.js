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
  // for (const key in params) {
  //   urlPlus = `${urlPlus + key}=${params[key]}&`;
  // }
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
  // 获取当日日期
  getTodayDate(ifmoment = false) {
    return ifmoment ? moment() : moment().format('YYYY-MM-DD');
  },
  formatMomentToStandardDate(m) {
    return m.format('YYYY-MM-DD');
  },
  // 补全日期 arr
  formatDateComplete(arr) {
    // 如果是纯数字
    if (typeof arr.join('') === 'number' && !Number.isNaN(arr.join(''))) {
      return arr.join('').substring(0, 8);
    }
    const temp = arr.map((text, i) => {
      if (text.length === 1 && i !== 0) {
        return `0${text}`;
      }
      if (text.length > 2 && i > 0) {
        return text.substring(0, 2);
      }
      return text;
    });
    return temp.join('').substring(0, 8);
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

export {
  clearEmpty, queryApi, dateUtils, fileDownload, clone,
};
