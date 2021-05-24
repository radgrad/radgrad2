import React from 'react';
import { Icon } from 'semantic-ui-react';

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
  <span style={{ overflowWrap: 'anywhere' }} >
    {icon ? <Icon className={icon} /> : ''}
    {iconAlternative || ''}
    {title.toUpperCase()} {count ? `(${count})` : ''}
    &nbsp; &nbsp;
    <span style={{ display: 'inline-block' }}>{leftside}</span>
    <span style={{ float: 'right' }}>{rightside}</span>
  </span>
);

export default RadGradTabHeader;
