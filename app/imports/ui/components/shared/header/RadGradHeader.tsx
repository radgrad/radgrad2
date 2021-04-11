import React from 'react';
// @ts-ignore
import { Header, Icon } from 'semantic-ui-react';

interface RadGradHeaderProps {
  text: string;
  count?: number;
  icon?: string;
  dividing?: boolean;
  style?: Record<string, unknown>;
}

const RadGradHeader: React.FC<RadGradHeaderProps> = ({ text, count, icon, dividing, style = {} }) => (
  <Header style={style} dividing={dividing}>
    {icon ? (<Icon className={icon} />) : ''}
    {text.toUpperCase()} {count ? `(${count})` : ''}
  </Header>
);

export default RadGradHeader;
