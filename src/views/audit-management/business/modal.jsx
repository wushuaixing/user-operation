import { reactive } from 'vue';
import { ModalTitle } from '@/static/fn';
import { NOPUSH_TIPS, PUSH_TIPS, RECALL_REASON } from '@/static';

const modalModule = () => {
  const modalState = reactive({
    type: '',
    visible: false,
    remark: '',
    noPushRemark: '',
    important: '',
    pushRemark: '',
    recallReason: '', // 召回原因类型 1 误点击 2 备注填错 3 审核出错 9 其他
  });
  // 点击确定
  const handleClick = () => {
    const { type } = modalState;
    if (type === 'push') {
      modalState.type = 'pushConfirm';
    } else {
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
  const openModal = (type) => {
    modalState.type = type;
    modalState.visible = true;
    console.log(modalState.type);
  };
  // 填充内容
  const handleFill = (key, val) => {
    modalState[key] = `${val}\n${modalState[key]}`.slice(0, 1024);
  };
  // 召回弹窗
  const RecallModal = () => {
    const text = {
      title: '确认召回本条信息吗？',
      text: '点击确定，本条信息将被召回到结构化匹配列表中',
    };
    return <div className='recall-modal'>
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
            placeholder="请输入内容"
            v-model={modalState.remark}/>
          <span className='val-length'>{modalState.remark.length}/1024</span>
        </div>
      </div>
    </div>;
  };
  // 不推送弹窗
  const NoPushModal = () => {
    const text = {
      title: '确认不推送该条资产信息吗？',
      text: '点击确定，该条资产监控信息将不被推送给用户',
    };
    return <div className='no-push-modal'>
      <ModalTitle {...text}/>
      <div className="no-push-modal-body">
        <div className="no-push-modal-body-title">
          <span className='label'>拍卖标题：</span>
          <span>姜修平所有的深喉口固定台式压力机等设备一宗</span>
        </div>
        <div className="no-push-modal-body-remark">
          <span className='label'>审核备注：</span>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入审核备注"
            maxLength={1024}
            v-model={modalState.noPushRemark}
          />
          <span className='val-length'>{modalState.noPushRemark.length}/1024</span>
        </div>
        <div className="no-push-modal-body-tips">
          <span className='label'>默认备注：</span>
          <div className="tips-box">
            {NOPUSH_TIPS.map((i, index) => <p key={index} onClick={() => handleFill('noPushRemark', i)}>{i}</p>)}
          </div>
        </div>
      </div>
    </div>;
  };
  // 推送弹窗
  const PushModal = () => <div className='push-modal'>
    <div className="push-modal-header">
      <span>推送</span>
      <span onClick={() => modalState.visible = false}>X</span>
    </div>
    <div className="push-modal-body">
      <div className="push-modal-body-title flex">
        <span className='label'>拍卖标题：</span>
        <span>姜修平所有的深喉口固定台式压力机等设备一宗姜修平所有的深喉口固定台式压力机等设备一宗</span>
      </div>
      <div className="push-modal-body-desc flex">
        <span className='label'>审核备注：</span>
        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model={modalState.pushRemark}/>
        <span className='val-length'>{modalState.pushRemark.length}/1024</span>
      </div>
      <div className="push-modal-body-type flex">
        <span className='label'>系统匹配：</span>
        <span>精准匹配</span>
      </div>
      <div className="push-modal-body-level flex">
        <span className='label'>推送等级：</span>
        <el-radio-group v-model={modalState.important}>
          <el-radio label="0">模糊 </el-radio>
          <el-radio label="1">精准 </el-radio>
        </el-radio-group>
      </div>
      <div className="push-modal-body-tips flex">
        <span className='label'>默认备注：</span>
        <div className="tips-box">
          {PUSH_TIPS.map((i) => <div key={i.key} className='tips-box-item'>
            <div className="title">{i.title}</div>
            {
              i.desc.map((j, index) => <p key={`${i.key}${index}`} onClick={() => handleFill('pushRemark', j)}>{j}</p>)
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
          <span>精确</span>
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
    footer: () => <>
      <el-button onClick={handleCancel}>{modalState.type === 'pushConfirm' ? '上一步' : '取消'}</el-button>
      <el-button type="primary" onClick={handleClick}>{modalState.type === 'push' ? '下一步' : '确定'}</el-button>
    </>,
  };
  return {
    modalState, modalSlots, openModal, modalHtml,
  };
};
export default modalModule;
