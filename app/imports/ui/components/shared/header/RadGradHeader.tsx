import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

interface RadGradHeaderProps {
  text: string;
  count?: number;
  icon?: string;
  dividing?: boolean;
}

const RadGradHeader: React.FC<RadGradHeaderProps> = ({ text, count, icon, dividing }) => (
  <Header dividing={dividing}>
    {icon ? (<Icon className={icon} />) : ''}
    {text.toUpperCase()} {count ? `(${count})` : ''}
  </Header>
);

export default RadGradHeader;
