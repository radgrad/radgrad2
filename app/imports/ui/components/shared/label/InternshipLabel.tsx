import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../utilities/router';
import { EntityLabel, EntityLabelPublicProps } from './EntityLabel';
import { Internships } from '../../../../api/internship/InternshipCollection';

const InternshipLabel: React.FC<EntityLabelPublicProps> = ({ slug, userID, size, style, rightside }) => {
  const inProfile = false;
  const match = useRouteMatch();
  let route = `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERNSHIPS}/${slug}`;
  const name = Internships.findDoc(slug).name;
  if (userID) {
    route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERNSHIPS}/${slug}`);
  }
  return (
    <EntityLabel slug={slug} inProfile={inProfile} icon='tags' name={name} route={route} size={size} style={style} rightside={rightside}/>
  );
};

export default InternshipLabel;