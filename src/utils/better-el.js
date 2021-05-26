import WarningIcon from "@/assets/img/warn-icon.png";
import { ElMessageBox } from "element-plus";

const $modalConfirm = (params = {}) => {
  const { text, title } = params;
  const _html = (
    <div class="yc-confirm-modal">
      <div class="yc-confirm-modal-title">
        <img src={WarningIcon} alt="" />
        <span>{title}</span>
      </div>
      {text && <div className="yc-confirm-modal-body">{text}</div>}
    </div>
  );
  return ElMessageBox({
    message: _html,
    title: null,
    showClose: false,
    dangerouslyUseHTMLString: true,
    showCancelButton: true,
  });
};

export { $modalConfirm };
