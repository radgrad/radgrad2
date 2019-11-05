import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { Button, Card, Header, Icon, Image, Popup, SemanticCOLORS } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import * as Markdown from 'react-markdown';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import InterestList from '../shared/InterestList';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import StudentOfInterestAdd from './StudentOfInterestAdd';
import { renderLink, getUsername } from '../shared/RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';
import { replaceTermStringNextFour } from '../shared/helper-functions';
import { docToName, docToShortDescription, itemToSlugName } from '../shared/data-model-helper-functions';

interface IStudentOfInterestCardProps {
  type: string;
  canAdd: boolean;
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
  };
  profile: {
    _id: string;
  };
}

const isTypeCourse = (props: IStudentOfInterestCardProps) => props.type === EXPLORER_TYPE.COURSES;

const handleHideStudentInterest = (props: IStudentOfInterestCardProps) => (e) => {
  e.preventDefault();
  const username = getUsername(props.match);
  const profile = Users.getProfile(username);
  const id = props.item._id;
  const collectionName = StudentProfiles.getCollectionName();
  const updateData: any = {};
  updateData.id = profile._id;
  if (isTypeCourse(props)) {
    const studentItems = profile.hiddenCourseIDs;
    studentItems.push(id);
    updateData.hiddenCourses = studentItems;
  } else {
    const studentItems = profile.hiddenOpportunityIDs;
    studentItems.push(id);
    updateData.hiddenOpportunities = studentItems;
  }
  updateMethod.call({ collectionName, updateData }, (error) => {
    if (error) {
      console.log('Error hiding course/opportunity', error);
    }
  });
};

const handleUnHideStudentInterest = (props: IStudentOfInterestCardProps) => (e) => {
  e.preventDefault();
  const username = getUsername(props.match);
  const profile = Users.getProfile(username);
  const id = props.item._id;
  const collectionName = StudentProfiles.getCollectionName();
  const updateData: any = {};
  updateData.id = profile._id;
  if (isTypeCourse(props)) {
    let studentItems = profile.hiddenCourseIDs;
    studentItems = _.without(studentItems, id);
    updateData.hiddenCourses = studentItems;
  } else {
    let studentItems = profile.hiddenOpportunityIDs;
    studentItems = _.without(studentItems, id);
    updateData.hiddenOpportunities = studentItems;
  }
  updateMethod.call({ collectionName, updateData }, (error) => {
    if (error) {
      console.log('Error unhiding course/opportunity', error);
    }
  });
};

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

const hidden = (props: IStudentOfInterestCardProps) => {
  const username = getUsername(props.match);
  let ret = '';
  const profile = Users.getProfile(username);
  if (isTypeCourse(props)) {
    if (_.includes(profile.hiddenCourseIDs, props.item._id)) {
      ret = 'grey';
    }
  } else if (_.includes(profile.hiddenOpportunityIDs, props.item._id)) {
    ret = 'grey';
  }
  return ret;
};

const buildRouteName = (item, type, props: IStudentOfInterestCardProps) => {
  const itemName = itemToSlugName(item);
  const username = props.match.params.username;
  const baseUrl = props.match.url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;
  switch (type) {
    case EXPLORER_TYPE.COURSES:
      return `${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemName}`;
    case EXPLORER_TYPE.OPPORTUNITIES:
      return `${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemName}`;
    default:
      break;
  }
  return '#';
};


const StudentOfInterestCard = (props: IStudentOfInterestCardProps) => {
  const { item, match } = props;
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const hide = hidden(props) as SemanticCOLORS;

  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Header>{itemName}</Header>
        <Card.Meta>
          {itemTerms(props) ? replaceTermStringNextFour(itemTerms(props)) : ''}
        </Card.Meta>
      </Card.Content>

      <Card.Content>
        <Markdown escapeHtml={true} source={`${itemShortDescription}...`}
                  renderers={{ link: (localProps) => renderLink(localProps, match) }}/>
        <InterestList item={item} size='mini'/>
      </Card.Content>

      <Card.Content>
        <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents(item)}/></span>
      </Card.Content>

      {
        <Button.Group className="radgrad-home-buttons center aligned" attached="bottom" widths={3}
                      color={hide || undefined}>
          <Link to={buildRouteName(props.item, props.type, props)}>
            <Button><Icon name="chevron circle right"/><br/>View More</Button>
          </Link>

          {props.canAdd ?
            <StudentOfInterestAdd item={props.item} type={props.type}/>
            : ''
          }

          {
            hidden ?
              <Button onClick={handleUnHideStudentInterest(props)}><Icon name="unhide"/><br/>Unhide</Button>
              :
              <Button onClick={handleHideStudentInterest(props)}><Icon name="hide"/><br/>Hide</Button>
          }
        </Button.Group>
      }
    </Card>
  );
};

export default withRouter(StudentOfInterestCard);
