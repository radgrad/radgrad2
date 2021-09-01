import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { Location } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import InterestList from '../../InterestList';
import * as Router from '../../utilities/router';
import { getInternshipKey } from '../../../../../api/internship/import/process-canonical';

const buildExplorerInternshipRoute = (match: Router.MatchProps, internshipKey: string): string => {
  const route = `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERNSHIPS}/${internshipKey}`;
  return Router.buildRouteName(match, route);
};

interface InternshipCardProps {
  internship: {
    _id: string;
    urls: string[];
    position: string;
    description: string;
    lastUploaded?: Date;
    missedUploads?: number;
    interestIDs: string[];
    company?: string;
    location?: Location[];
    contact?: string;
    posted?: string;
    due?: string;
    createdAt: Date;
    updatedAt?: Date;
  };
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const match = useRouteMatch();
  const internshipName = `${internship.position}: ${internship.company}`;
  const internshipShortDescription = internship.description.substring(0, 200);
  return (
    <Card>
      <Card.Content>
        <Card.Header>{internshipName}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Markdown escapeHtml source={internshipShortDescription} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
        {internship.interestIDs ? <InterestList item={internship} size="small" /> : ''}
      </Card.Content>
      <Link to={buildExplorerInternshipRoute(match, getInternshipKey(internship))} className="ui button" id={`see-details-${internshipName}-button`}>
        <Icon name="zoom in" />
        &nbsp; See Details
      </Link>

    </Card>
  );
};

export default InternshipCard;
