import React from 'react';
import { Icon } from 'semantic-ui-react';
import { headerText } from '../../utilities/HeaderText';

interface RadGradTabHeaderProps {
  title: string;
  count?: number;
  icon?: string;
  iconAlternative?: React.ReactNode,
  leftside?: React.ReactNode,
  rightside?: React.ReactNode,
  style?: Record<string, unknown>;
  key?: string;
}

const RadGradTabHeader: React.FC<RadGradTabHeaderProps> = ({
  title,
  count,
  icon,
  iconAlternative,
  style = {},
  leftside = '',
  rightside = '',
  key = title,
}) => (
  <>
    {icon ? <Icon className={icon} /> : ''}
    {iconAlternative || ''}
    {headerText(title)} {count ? `(${count})` : ''}
    &nbsp; &nbsp;
    <span style={{ display: 'inline-block' }}>{leftside}</span>
    <span style={{ float: 'right' }}>{rightside}</span>
  </>
);

export default RadGradTabHeader;
