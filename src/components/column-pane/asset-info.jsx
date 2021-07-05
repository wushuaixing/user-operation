import { ASSETS_INFO } from '@/static';
import './style.scss';

const AssetInfo = (props) => <div className='asset-info'>
  <ul>
    {
      ASSETS_INFO.map((i) => (
        <li className='asset-info-item'>
          <span className='asset-info-item-label'>{i.lable}：</span>
          <span className='asset-info-item-detail'>{props[i.key] || '-'} </span>
        </li>
      ))
    }
  </ul>
  { props.important === 1 ? <svg class="icon jz" aria-hidden="true" style="font-size: 37px;">
    <use xlink:href="#iconjingzhun" />
  </svg> : ''}
</div>;
export default AssetInfo;
