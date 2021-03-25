import React from 'react';
import {Label, SemanticSIZES, Icon, SemanticCOLORS, SemanticICONS} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {Profile} from '../../../../typings/radgrad';

export interface EntityLabelPublicProps {
  slug: string,
  profile?: Profile;
  size?: SemanticSIZES;
}

interface EntityLabelProps {
  slug: string;
  inProfile: boolean;
  icon: SemanticICONS;
  size?: SemanticSIZES;
  route?: string;
  name: string;
}

export const EntityLabel: React.FC<EntityLabelProps> = ({slug, inProfile, icon, size = 'Large' as SemanticSIZES, route, name}) => {
  const color = inProfile ? 'green' : 'grey' as SemanticCOLORS;
  if (route) {
    return (
      <Label as={Link} key={slug} size={size} to={route} color={color}>
        <Icon name={icon}/>
        {name}
      </Label>
    );
  }
  // If no route, return just the default label.
  return (
    <Label key={slug} size={size} color={color}>
      <Icon name={icon}/>
      {name}
    </Label>
  );
};
