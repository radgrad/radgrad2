import React from 'react';
import { Button, SemanticCOLORS, SemanticSIZES } from 'semantic-ui-react';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';

interface ButtonActionProps {
  onClick: () => void,
  label: string
  icon?: string
  size?: SemanticSIZES;
  color?: SemanticCOLORS;
  style?: Record<string, unknown>;
}

export const ButtonAction: React.FC<ButtonActionProps> = ({ onClick, label, icon  = 'thumbs up outline', size = 'large', color, style = {} }) => (
  <Button id={COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_BUTTON} style={style} size={size} color={color} onClick={onClick} content={label} labelPosition='right' icon={icon}/>
);
