import { reactive, getCurrentInstance } from 'vue';
import { ModalTitle } from '@/static/fn';
import {
  NOPUSH_TIPS, PUSH_TIPS, RECALL_REASON, MATCH_TYPE,
} from '@/static';
import CommonApi from '@/server/api/common';

const modalModule = (getTableList) => {
  const { proxy } = getCurrentInstance();
  const modalState = reactive({
    type: '',
    visible: false,
    remark: '',
    noPushRemark: '',
    important: '1',
    pushRemark: '',
    recallReason: '', // 召回原因类型 1 误点击 2 备注填错 3 审核出错 9 其他
    title: '',
    importants: '',
    currentStatus: '',
    tableType: '',
  });
  // 点击确定
  const handleClick = () => {
    const {
      type, id, remark, noPushRemark, important, pushRemark, recallReason, currentStatus,
    } = modalState;
    const obj = type === 'noPush' ? { status: 5, remark: noPushRemark } : { status: 1, remark: pushRemark };
    const params = type === 'reCall' ? { id, recallReason, remark } : {
      approveStatus: obj.status, id, important, remark: obj.remark, currentStatus,
    };
    if (type === 'push') {
      modalState.type = 'pushConfirm';
    } else {
      CommonApi.auditAction(type, params).then((res) => {
        const { code } = res.data || {};
        if (code === 200) {
          proxy.$message.success('操作成功');
          getTableList();
        } else if (code === 6005) {
          proxy.$message.warning({
            message: '数据状态变更，为您刷新当前列表',
            duration: 1500,
            onClose: () => {
              getTableList();
            },
          });
        } else {
          proxy.$message.error('请求错误');
        }
      });
      modalState.visible = false;
    }
  };
  // 点击取消
  const handleCancel = () => {
    const { type } = modalState;
    if (type === 'pushConfirm') {
      modalState.type = 'push';
    } else {
      modalState.visible = false;
    }
  };
  // 打开弹窗
  const openModal = (type, {
    parsingTitle, important, id, tableType,
  }) => {
    modalState.visible = true;
    modalState.type = type;
    modalState.currentStatus = tableType === '3' ? 5 : 0;
    const isSame = modalState.id === id && tableType === modalState.tableType;
    if (type === 'push') {
      modalState.title = parsingTitle;
      modalState.importants = important;
      modalState.pushRemark = isSame ? modalState.pushRemark : '';
      modalState.important = isSame ? modalState.important : important.toString();
    } else if (type === 'noPush') {
      modalState.title = parsingTitle;
      modalState.noPushRemark = isSame ? modalState.noPushRemark : '';
    } else {
      modalState.remark = isSame ? modalState.remark : '';
      modalState.recallReason = isSame ? modalState.recallReason : '';
    }
    modalState.tableType = tableType;
    modalState.id = id;
  };
  // 填充内容
  const handleFill = (key, val) => {
    modalState[key] = `${val}\n${modalState[key]}`.slice(0, 1000);
  };
  // 召回弹窗
  const RecallModal = () => {
    const text = {
      title: '确认召回本条信息吗？',
      text: '点击确定，本条信息将被召回到结构化匹配列表中',
    };
    return <div className='recall-modal' key={modalState.id}>
      <ModalTitle {...text}/>
      <div className="recall-modal-body">
        <div className="recall-modal-body-type">
          <span className='label'>召回原因类型：</span>
          <el-radio-group v-model={modalState.recallReason}>
            {
              RECALL_REASON.map((i) => (<el-radio label={i.val}>{i.label}</el-radio>))
            }
          </el-radio-group>
        </div>
        <div className="recall-modal-body-desc">
          <span className='label'>召回原因描述：</span>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入召回原因描述"
            maxLength={1000}
            v-model={modalState.remark}/>
          <span className='val-length'>{modalState.remark.length}/1000</span>
        </div>
      </div>
    </div>;
  };
  // 不推送弹窗
  const NoPushModal = () => {
    const text = {
      title: '确认不推送该条资产信息吗？',
      text: '点击确定，该条资产监控信息将不被推送给客户',
    };
    return <div className='no-push-modal'>
      <ModalTitle {...text}/>
      <div className="no-push-modal-body">
        <div className="no-push-modal-body-title">
          <span className='label'>拍卖标题：</span>
          <span>{modalState.title}</span>
        </div>
        <div className="no-push-modal-body-remark">
          <span className='label'>审核备注：</span>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入审核备注"
            maxLength={1000}
            v-model={modalState.noPushRemark}
          />
          <span className='val-length'>{modalState.noPushRemark.length}/1000</span>
        </div>
        <div className="no-push-modal-body-tips">
          <span className='label'>默认备注：</span>
          <div className="tips-box">
            {NOPUSH_TIPS.map((i, index) => <p key={index} onClick={() => handleFill('noPushRemark', i)} className='cursor-pointer'>{i}</p>)}
          </div>
        </div>
      </div>
    </div>;
  };
  // 推送弹窗
  const PushModal = () => <div className='push-modal'>
    <div className="push-modal-header">
      <span>推送</span>
      <span onClick={() => modalState.visible = false} className='cursor-pointer'><i className='el-icon el-icon-close'></i></span>
    </div>
    <div className="push-modal-body">
      <div className="push-modal-body-title flex">
        <span className='label'>拍卖标题：</span>
        <span>{modalState.title}</span>
      </div>
      <div className="push-modal-body-desc flex">
        <span className='label'>审核备注：</span>
        <el-input
          type="textarea"
          autosize
          placeholder="请输入审核备注"
          maxLength={1000}
          v-model={modalState.pushRemark}/>
        <span className='val-length'>{modalState.pushRemark.length}/1000</span>
      </div>
      <div className="push-modal-body-type flex">
        <span className='label'>系统匹配：</span>
        <span>{MATCH_TYPE[modalState.importants]}匹配</span>
      </div>
      <div className="push-modal-body-level flex">
        <span className='label'>推送等级：</span>
        <el-radio-group v-model={modalState.important}>
          <el-radio label="1">精确 </el-radio>
          <el-radio label="0">模糊 </el-radio>
        </el-radio-group>
      </div>
      <div className="push-modal-body-tips flex">
        <span className='label'>默认备注：</span>
        <div className="tips-box">
          {PUSH_TIPS.map((i) => <div key={i.key} className='tips-box-item'>
            <div className="title">{i.title}</div>
            {
              i.desc.map((j, index) => <p key={`${i.key}${index}`} onClick={() => handleFill('pushRemark', j)} className='cursor-pointer'>{j}</p>)
            }
          </div>)}
        </div>
      </div>
    </div>
  </div>;
  // 推送弹窗确认
  const PushConfirmModal = () => {
    const text = {
      title: '确认推送该条资产信息吗？',
      text: '点击确定，该条资产监控信息将被推送给客户',
    };
    return <div className='push-confirm-modal'>
      <ModalTitle {...text}/>
      <div className="push-confirm-modal-body">
        <div className='push-confirm-modal-body-level'>
          <span className='label'>推送等级：</span>
          <span>{MATCH_TYPE[modalState.important]}</span>
        </div>
        <div className='push-confirm-modal-body-remark'>
          <span className="label">审核备注：</span>
          <div>{modalState.pushRemark || '-'}</div>
        </div>
      </div>
    </div>;
  };
  const modalHtml = {
    push: <PushModal/>,
    noPush: <NoPushModal/>,
    reCall: <RecallModal/>,
    pushConfirm: <PushConfirmModal/>,
  };
  // 弹窗底部按钮
  const modalSlots = {
    title: null,
    footer: () => <div>
      <el-button onClick={handleCancel}>{modalState.type === 'pushConfirm' ? '上一步' : '取消'}</el-button>
      <el-button type="primary" onClick={handleClick}>{modalState.type === 'push' ? '下一步' : '确定'}</el-button>
    </div>,
  };
  return {
    modalState, modalSlots, openModal, modalHtml,
  };
};
export default modalModule;
