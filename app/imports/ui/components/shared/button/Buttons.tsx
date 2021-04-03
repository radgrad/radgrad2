import React from 'react';
import { Button, SemanticCOLORS, SemanticSIZES } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../typings/radgrad';
import { itemToSlugName } from '../utilities/data-model';
import { MatchProps } from '../utilities/router';
import * as Router from '../utilities/router';

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

export const ButtonLink: React.FC<ButtonLinkProps> = ({ url, label, size = 'large', color, style = {}, rel, target }) => (
  <Button style={style} size={size} color={color} as={Link} to={url} rel={rel} target={target} icon='arrow alternate circle right' labelPosition='right' content={label}/>
);

interface ButtonActionProps {
  onClick: () => void,
  label: string
  icon?: string
  size?: SemanticSIZES;
  color?: SemanticCOLORS;
  style?: Record<string, unknown>;
}

export const ButtonAction: React.FC<ButtonActionProps> = ({ onClick, label, icon  = 'thumbs up outline', size = 'large', color, style = {} }) => (
  <Button style={style} size={size} color={color} onClick={onClick} content={label} labelPosition='right' icon={icon}/>
);

interface ViewInExplorerButtonLinkProps {
  match: MatchProps;
  type: string;
  item?: Opportunity | Course | Interest | CareerGoal;
  size?: SemanticSIZES;
  color?: SemanticCOLORS;
  style?: Record<string, unknown>;
}

export const ViewInExplorerButtonLink: React.FC<ViewInExplorerButtonLinkProps> = ({ match, type, item, size, color, style }) => {
  const itemSlug = itemToSlugName(item);
  let url = '';
  if (item) {
    url = Router.buildExplorerSlugRoute(match, type, itemSlug);
  } else {
    url = Router.buildExplorerRoute(match, type);
  }
  return (<ButtonLink url={url} label='View In Explorer'  rel='noopener noreferrer' target='_blank'  size={size} color={color} style={style} />);
};
