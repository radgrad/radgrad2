import React from 'react';
import { Button, SemanticCOLORS, SemanticSIZES } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

interface ButtonLinkProps {
  url: string;
  label: string;
  size?: SemanticSIZES;
  color?: SemanticCOLORS;
  style?: Record<string, unknown>;
  icon?: string;
  rel?: string;
  target?: string;
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ url, label, size = 'large', color, style = {}, rel, target, icon = 'arrow alternate circle right' }) => (
  <Button style={style} size={size} color={color} as={Link} to={url} rel={rel} target={target} icon={icon} labelPosition='right' content={label}/>
);
