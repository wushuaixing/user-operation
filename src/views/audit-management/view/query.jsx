import {
  defineComponent,
} from 'vue';
import { AUCTION_STATUS, IMPORTANT_TYPE, PUSH_STATUS } from '@/static';
import queryModule from '@/views/audit-management/business/query';

export default defineComponent({
  setup() {
    const { formState, onSerch, resetForm } = queryModule();
    return () => (
      <div className="content-right-query">
        <el-form inline={true} model={formState} class="content-right-query-form" ref='queryForm'>
          <div className="line">
            <el-form-item label="客户使用机构：" prop='conSumerName'>
              <el-input
                v-model={formState.conSumerName}
                placeholder="客户使用机构名称"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="债务人：" prop='obName'>
              <el-input
                v-model={formState.obName}
                placeholder="姓名/公司名称"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="证件号：" prop='obNumber'>
              <el-input
                v-model={formState.obNumber}
                placeholder="身份证号/统一社会信用代码"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="匹配类型：" prop='important'>
              <el-select v-model={formState.important} placeholder="请选择" style={{ width: '96px' }}>
                {
                  IMPORTANT_TYPE.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                }
              </el-select>
            </el-form-item>
            <el-form-item class="switch" onClick={() => formState.isOpen = !formState.isOpen}>
              <span v-show={!formState.isOpen}>展开选项<i className="el-icon-arrow-down switch-icon" /></span>
              <span v-show={formState.isOpen}>收起选项<i className="el-icon-arrow-up switch-icon" /></span>
            </el-form-item>
          </div>
          <div className="line" v-show={formState.isOpen}>
            <el-form-item label="标题：" prop='parsingTitle'>
              <el-input
                v-model={formState.parsingTitle}
                placeholder="拍卖信息标题"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="负责人/机构：" prop='orgName'>
              <el-input
                v-model={formState.orgName}
                placeholder="负责人/机构名称"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="匹配时间：" prop="createTimeStart" style={{ marginRight: 0 }}>
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model={formState.createTimeStart}
                style="width: 135px"
              />
            </el-form-item>
            <el-form-item label="至" prop="createTimeEnd" class="time-end">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model={formState.createTimeEnd}
                style="width: 135px"
              />
            </el-form-item>
            <el-form-item label="拍卖状态：" prop='pmStatus'>
              <el-select v-model={formState.pmStatus} placeholder="请选择" style={{ width: '96px' }}>
                {
                  AUCTION_STATUS.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                }
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop='status'>
              <el-select v-model={formState.status} placeholder="请选择" style={{ width: '96px' }}>
                {
                  PUSH_STATUS.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                }
              </el-select>
            </el-form-item>
          </div>
          <div className="line">
            <el-form-item label="审核时间：" prop="approveTimeStart" style={{ marginRight: 0 }}>
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model={formState.approveTimeStart}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="至" prop="approveTimeEnd" class="time-end">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model={formState.approveTimeEnd}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="开拍时间：" prop="startStart" style={{ marginRight: 0 }}>
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model={formState.startStart}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="至" prop="startEnd" class="time-end">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model={formState.startEnd}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="更新时间：" prop="updateTimeStart" style={{ marginRight: 0 }}>
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model={formState.updateTimeStart}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="至" prop="updateTimeEnd" class="time-end">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model={formState.updateTimeEnd}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" onClick={onSerch} class="button-first" style="padding: 8px 21px">搜索</el-button>
              <el-button type="primary" onClick={resetForm} class="button-fourth" style="padding: 8px 11px">清空搜索条件</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    );
  },
});
