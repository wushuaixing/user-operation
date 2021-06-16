import WarningIcon from '@/assets/img/warn-icon.png';
import { ElMessageBox } from 'element-plus';
import { h } from 'vue';

const $modalConfirm = (params = {}) => {
  const { text, title, color = '#4E5566' } = params;
  const html = h('div', { class: 'yc-confirm-modal' }, [
    h('div', { class: 'yc-confirm-modal-title' }, [
      h('img', { src: WarningIcon }),
      h('span', title),
    ]),
    (text && h('div', { class: 'yc-confirm-modal-body', style: { color } }, text)),
  ]);
  return ElMessageBox({
    message: html,
    title: null,
    showClose: false,
    dangerouslyUseHTMLString: true,
    showCancelButton: true,
  });
};

export default $modalConfirm;
