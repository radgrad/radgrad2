import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

interface RadGradHeaderProps {
  title: string;
  count?: number;
  icon?: string;
  rightside?: React.ReactNode,
  dividing?: boolean;
  style?: Record<string, unknown>;
}

const RadGradHeader: React.FC<RadGradHeaderProps> = ({ title, count, icon, dividing= true, style = {}, rightside }) => (
  <Header style={style} dividing={dividing}>
    {icon ? (<Icon className={icon} />) : ''}
    {title.toUpperCase()} {count ? `(${count})` : ''}
    {rightside ? <span style={{ float: 'right' }}>{rightside}</span> : ''}
  </Header>
);

export default RadGradHeader;
