import React from 'react';
import { Icon, Label } from 'semantic-ui-react';

interface NamePillProps {
  name: string;
}

const NamePill: React.FC<NamePillProps> = ({ name }) =>  <Label key={name} size='medium' color='teal' style={{ margin: 6 }}>
  <Icon className='grip vertical'/>
  {name}
</Label>
;

export default NamePill;
