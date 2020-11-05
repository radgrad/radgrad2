import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import Markdown from 'react-markdown';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import InterestList from '../../../../components/shared/InterestList';
import WidgetHeaderNumber from '../../../../components/shared/WidgetHeaderNumber';
import { EXPLORER_TYPE } from '../../../../../startup/client/route-constants';
import { StudentParticipations } from '../../../../../api/public-stats/StudentParticipationCollection';
import { replaceTermStringNextFour } from '../../../../components/shared/helper-functions';
import { docToName, docToShortDescription, itemToSlugName } from '../../../../components/shared/data-model-helper-functions';
import * as Router from '../../../../components/shared/RouterHelperFunctions';

interface IStudentOfInterestCardProps {
  type: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  item: {
    _id: string;
    name: string;
  };
}

const isTypeCourse = (props: IStudentOfInterestCardProps) => props.type === EXPLORER_TYPE.COURSES;

// This was originally in a ui/utilities/template-helpers.js (radgrad1) file called opportunitySemesters
// Should move it to one if one is made - Gian.
const opportunityTerms = (opportunityInstance) => {
  const academicTermIDs = opportunityInstance.termIDs;
  const upcomingAcademicTerms = _.filter(academicTermIDs, termID => AcademicTerms.isUpcomingTerm(termID));
  return _.map(upcomingAcademicTerms, termID => AcademicTerms.toString(termID));
};

const itemTerms = (props: IStudentOfInterestCardProps) => {
  let ret = [];
  if (isTypeCourse(props)) {
    // do nothing
  } else {
    ret = opportunityTerms(props.item);
  }
  return ret;
};

const numberStudents = (item) => {
  const participatingStudents = StudentParticipations.findDoc({ itemID: item._id });
  return participatingStudents.itemCount;
};

const buildRouteName = (props: IStudentOfInterestCardProps) => {
  const itemName = itemToSlugName(props.item);
  switch (props.type) {
    case EXPLORER_TYPE.COURSES:
      return Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemName}`);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemName}`);
    default:
      break;
  }
  return '#';
};

const StudentOfInterestCard = (props: IStudentOfInterestCardProps) => {
  const { item, match } = props;
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);

  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
        <Card.Meta>
          {itemTerms(props) ? replaceTermStringNextFour(itemTerms(props)) : ''}
        </Card.Meta>
      </Card.Content>

      <Card.Content>
        <Markdown
          escapeHtml
          source={`${itemShortDescription}...`}
          renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
        />
        <InterestList item={item} size="mini" />
      </Card.Content>

      <Card.Content>
        <span>
          STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents(item)} />
        </span>
      </Card.Content>

      <Link to={buildRouteName(props)}>
        <Button attached="bottom" fluid>
          <Icon name="chevron circle right" />
          <br />
          View More
        </Button>
      </Link>
    </Card>
  );
};

export default withRouter(StudentOfInterestCard);
