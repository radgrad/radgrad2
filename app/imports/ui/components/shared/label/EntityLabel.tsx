import React from 'react';
import { Label, SemanticSIZES, Icon, SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export interface EntityLabelPublicProps {
  slug: string,
  userID?: string;
  size?: SemanticSIZES;
  style?: Record<string, unknown>;
  rightside?: string;
}

interface EntityLabelProps {
  slug: string;
  inProfile: boolean;
  icon: SemanticICONS;
  size?: SemanticSIZES;
  route?: string;
  name: string;
  style?: Record<string, unknown>;
  rightside?: string;
}

export const EntityLabel: React.FC<EntityLabelProps> = ({ slug, inProfile, icon, size = 'large' as SemanticSIZES, route, name, style = {}, rightside = '' }) => {
  const color = inProfile ? 'green' : 'grey' as SemanticCOLORS;
  // eslint-disable-next-line no-param-reassign
  style.margin = '2px';
  if (route) {
    return (
      <Label as={Link} key={slug} size={size} to={route} color={color} style={style}>
        <Icon name={icon}/>
        {name}
        {rightside}
      </Label>
    );
  }
  // If no route, return just the default label.
  return (
    <Label key={slug} size={size} color={color} style={style}>
      <Icon name={icon}/>
      {name}
      {rightside}
    </Label>
  );
};
