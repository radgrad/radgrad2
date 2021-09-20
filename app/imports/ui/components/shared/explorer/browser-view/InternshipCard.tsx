import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import moment from 'moment';
import { Internship } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import InterestList from '../../InterestList';
import * as Router from '../../utilities/router';
import { getInternshipKey } from '../../../../../api/internship/import/process-canonical';

const buildExplorerInternshipRoute = (match: Router.MatchProps, internshipKey: string): string => {
  const route = `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERNSHIPS}/${internshipKey}`;
  return Router.buildRouteName(match, route);
};

interface InternshipCardProps {
  internship: Internship;
  // internship: {
  //   _id: string;
  //   urls: string[];
  //   position: string;
  //   description: string;
  //   lastScraped?: Date;
  //   missedUploads?: number;
  //   interestIDs: string[];
  //   company?: string;
  //   location?: Location[];
  //   contact?: string;
  //   posted?: string;
  //   due?: string;
  //   createdAt: Date;
  //   updatedAt?: Date;
  // };
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const match = useRouteMatch();
  const internshipName = `${internship.position}: ${internship.company}`;
  const internshipShortDescription = internship.description.substring(0, 200);
  let expiredLabel;
  if (internship.missedUploads > 4) {
    expiredLabel = 'Expired';
  }
  if (internship.missedUploads > 8) {
    expiredLabel = 'Retired';
  }
  return (
    <Card>
      <Card.Content>
        <Card.Header>{internshipName}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Markdown escapeHtml source={internshipShortDescription} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
        {internship.interestIDs ? <InterestList item={internship} size="small" /> : ''}
        <strong>{expiredLabel}</strong>
        <strong>Last seen:</strong>{moment(internship.lastScraped).format('MM/DD/YYYY')}
      </Card.Content>
      <Link to={buildExplorerInternshipRoute(match, getInternshipKey(internship))} className="ui button" id={`see-details-${internshipName}-button`}>
        <Icon name="zoom in" />
        &nbsp; See Details
      </Link>

    </Card>
  );
};

export default InternshipCard;
