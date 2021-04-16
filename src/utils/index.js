import moment from "moment";

/**
 * 去除对象中空值
 * @param obj
 * @returns {*}
 */
const clearEmpty = (obj) => {
  if (typeof obj === "object") {
    const l = Object.keys(obj);
    const _obj = {
      ...obj,
    };
    l.forEach((item) => {
      if (_obj[item] === "" || _obj[item] === undefined || _obj[item] === null)
        delete _obj[item];
      else if (typeof _obj[item] === "string")
        _obj[item] = _obj[item].replace(/^\s+|\s+$/g, "");
    });
    return _obj;
  }
  return obj;
};

const queryApi = (searchParams) => {
  const params = clearEmpty(searchParams) || {};
  let urlPlus = "";
  for (const key in params) {
    urlPlus = `${urlPlus + key}=${params[key]}&`;
  }
  return urlPlus.substring(0, urlPlus.length - 1);
};

const dateUtils = {
  // 时间戳转换为标准日期
  formatStandardDate(timeStamp) {
    return timeStamp === "" ||
      timeStamp === "--" ||
      timeStamp === undefined ||
      timeStamp === null
      ? timeStamp
      : moment(timeStamp).format("YYYY-MM-DD");
  },
  // 获取当日日期
  getTodayDate(ifmoment = false) {
    return ifmoment ? moment() : moment().format("YYYY-MM-DD");
  },
  formatMomentToStandardDate(m) {
    return m.format("YYYY-MM-DD");
  },
  // 补全日期 arr
  formatDateComplete(arr) {
    // 如果是纯数字
    if (typeof arr.join("") === "number" && !Number.isNaN(arr.join(""))) {
      return arr.join("").substring(0, 8);
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
    return temp.join("").substring(0, 8);
  },
};

export { clearEmpty, queryApi, dateUtils };
