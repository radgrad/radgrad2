import React from 'react';
import { Icon, Label, SemanticCOLORS } from 'semantic-ui-react';

interface NamePillProps {
  name: string;
  color: string;
}

const NamePill: React.FC<NamePillProps> = ({ name, color }) =>  <Label key={name} size='medium' style={{ margin: 6, backgroundColor: color }}>
  <Icon className='grip vertical'/>
  {name}
</Label>
;

export default NamePill;
