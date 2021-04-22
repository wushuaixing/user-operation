import { dateUtils } from "@/utils";

const filters = {
  show_(val) {
    if (!val) return "-";
    return val;
  },
  date_(val) {
    if (!val) return "-";
    return dateUtils.formatStandardDate(val);
  },
};

export default filters;