import React from 'react';
import { Header, Icon } from 'semantic-ui-react';
import { headerText } from '../../utilities/HeaderText';

interface RadGradHeaderProps {
  title: string;
  count?: number;
  icon?: string;
  leftside?: React.ReactNode,
  rightside?: React.ReactNode,
  dividing?: boolean;
  style?: Record<string, unknown>;
}

const RadGradHeader: React.FC<RadGradHeaderProps> = ({ title, count, icon, dividing = true, style = {}, leftside = '', rightside = '' }) => (
  <Header style={style} dividing={dividing}>
    <div>
      {icon ? (<Icon className={icon} />) : ''}
      &nbsp;
      {headerText(title)} {count ? `(${count})` : ''}
      &nbsp; &nbsp;
      <span style={{ display: 'inline-block' }}>{leftside}</span>
      <span style={{ float: 'right' }}>{rightside}</span>
    </div>
  </Header>
);

export default RadGradHeader;
