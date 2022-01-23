import React from 'react';
import { Button, SemanticCOLORS, SemanticSIZES } from 'semantic-ui-react';

interface ButtonActionProps {
  onClick: () => void,
  label: string
  icon?: string
  size?: SemanticSIZES;
  color?: SemanticCOLORS;
  style?: Record<string, unknown>;
  id: string;
}

export const ButtonAction: React.FC<ButtonActionProps> = ({ onClick, label, icon  = 'thumbs up outline', size = 'large', color, style = {}, id }) => (
  <Button id={id} style={style} size={size} color={color} onClick={onClick} content={label} labelPosition='right' icon={icon}/>
);
