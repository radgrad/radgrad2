import React from 'react';
import { Icon, Label } from 'semantic-ui-react';
import { DraggableColors } from './utilities/styles';

interface NamePillProps {
  name: string;
  color: DraggableColors;
  icon?: string;
}

const NamePill: React.FC<NamePillProps> = ({ name, color, icon }) => (
  <Label key={name} size="medium" style={{ margin: 6, backgroundColor: color }}>
    <Icon className="grip vertical" />
    {icon ? <Icon className={icon} /> : ''}
    {name}
  </Label>
);
export default NamePill;
