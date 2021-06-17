import React from 'react';
import { SemanticCOLORS, SemanticSIZES } from 'semantic-ui-react';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../typings/radgrad';
import { itemToSlugName } from '../utilities/data-model';
import { MatchProps } from '../utilities/router';
import * as Router from '../utilities/router';
import { ButtonLink } from './ButtonLink';

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
  return (<ButtonLink url={url} label='View In Explorer'  rel='noopener noreferrer' size={size} color={color} style={style} />);
};
