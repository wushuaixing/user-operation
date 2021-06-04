import { dateUtils } from '@/utils';

const filters = {
  undefinedShow(val) {
    if (!val) return '-';
    return val;
  },
  formatDate(val) {
    if (!val) return '-';
    return dateUtils.formatStandardDate(val);
  },
};

export default filters;
