import WarningIcon from '@/assets/img/warn-icon.png';
import { ElMessageBox } from 'element-plus';

const $modalConfirm = (params = {}) => {
  const { text, title, color = '#4E5566' } = params;
  const html = (
    <div class="yc-confirm-modal">
      <div class="yc-confirm-modal-title">
        <img src={WarningIcon} alt="" />
        <span>{title}</span>
      </div>
      {text && <div className="yc-confirm-modal-body" style={{ color }}>{text}</div>}
    </div>
  );
  return ElMessageBox({
    message: html,
    title: null,
    showClose: false,
    dangerouslyUseHTMLString: true,
    showCancelButton: true,
  });
};

export default $modalConfirm;
