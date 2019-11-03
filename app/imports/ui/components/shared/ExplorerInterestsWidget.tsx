import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Grid, Divider, Segment, SegmentGroup } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { IInterest, IProfile, IProfileUpdate } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { Interests } from '../../../api/interest/InterestCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import InterestedProfilesWidget from './InterestedProfilesWidget';
import InterestedRelatedWidget from './InterestedRelatedWidget';
import { URL_ROLES } from '../../../startup/client/routes-config';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { getRoleByUrl } from './RouterHelperFunctions';


interface IExplorerInterestsWidgetProps {
  type: string;
  match: {
    isExact: boolean,
    path: string,
    url: string,
    params: {
      username: string;
      interest: string;
    }
  }
  profile: IProfile;
  interest: IInterest;
  interestedStudents: IProfile[];
  interestedFaculty: IProfile[];
  interestedAlumni: IProfile[];
  interestedMentor: IProfile[];
}

const getObjectsThatHaveInterest = (objects, interestID) => {
  let interested = [];
  _.forEach(objects, (profile) => {
    if (_.includes(profile.interestIDs, interestID)) {
      interested.push(profile);
    }
  });
  interested = _.filter(interested, (profile) => profile.picture && profile.picture !== defaultProfilePicture);
  // only allow 50 students randomly selected.
  for (let i = interested.length - 1; i >= 50; i--) {
    interested.splice(Math.floor(Math.random() * interested.length), 1);
  }
  return interested;
};

const participation = (role, interestID) => {
  const interested = [];
  switch (role) {
    case URL_ROLES.STUDENT:
      return getObjectsThatHaveInterest(StudentProfiles.findNonRetired({ isAlumni: false }), interestID);
    case URL_ROLES.FACULTY:
      return getObjectsThatHaveInterest(FacultyProfiles.findNonRetired(), interestID);
    case URL_ROLES.MENTOR:
      return getObjectsThatHaveInterest(MentorProfiles.findNonRetired(), interestID);
    case URL_ROLES.ALUMNI:
      return getObjectsThatHaveInterest(StudentProfiles.findNonRetired({ isAlumni: true }), interestID);
    default:
      return interested;
  }
};

const getObjectsThatHaveInsterest = (profiles, props: IExplorerInterestsWidgetProps) => getObjectsThatHaveInterest(profiles, props.interest._id);

const getRelatedCourses = (props: IExplorerInterestsWidgetProps) => getObjectsThatHaveInsterest(Courses.findNonRetired(), props);

const getAssociationRelatedCourses = (courses, props: IExplorerInterestsWidgetProps) => {
  const inPlanInstance = CourseInstances.findNonRetired({
    studentID: props.profile.userID, verified: false,
  });
  const inPlanIDs = _.map(inPlanInstance, (value) => value.courseID);

  const completedInstance = CourseInstances.findNonRetired({
    studentID: props.profile.userID, verified: true,
  });
  const completedIDs = _.map(completedInstance, (value) => value.courseID);

  const relatedIDs = _.map(courses, (value) => value._id);
  const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
  const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
  const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

  const relatedCourses = {
    completed: relatedCompletedIDs,
    inPlan: relatedInPlanIDs,
    notInPlan: relatedNotInPlanIDs,
  };
  return relatedCourses;
};

const getRelatedOpportunities = (props: IExplorerInterestsWidgetProps) => getObjectsThatHaveInsterest(Opportunities.findNonRetired(), props);

const getAssociationRelatedOpportunities = (opportunities, props: IExplorerInterestsWidgetProps) => {
  const inPlanInstance = OpportunityInstances.findNonRetired({
    studentID: props.profile.userID, verified: false,
  });
  const inPlanIDs = _.map(inPlanInstance, (value) => value.courseID);

  const completedInstance = OpportunityInstances.findNonRetired({
    studentID: props.profile.userID, verified: true,
  });
  const completedIDs = _.map(completedInstance, (value) => value.courseID);

  const relatedIDs = _.map(opportunities, (value) => value._id);
  const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
  const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
  const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

  const relatedOpportunites = {
    completed: relatedCompletedIDs,
    inPlan: relatedInPlanIDs,
    notInPlan: relatedNotInPlanIDs,
  };
  return relatedOpportunites;
};

const getBaseURL = (props: IExplorerInterestsWidgetProps) => {
  const split = props.match.url.split('/');
  const temp = [];
  temp.push(split[0]);
  temp.push(split[1]);
  temp.push(split[2]);
  temp.push(split[3]);
  return temp.join('/');
};

const handleClick = (props: IExplorerInterestsWidgetProps) => () => {
  // how do we know to add the interest or remove it.
  // get the user's interestIDs
  // if props.interest._id is in the interestIDs remove it.
  let interests = [];
  if (_.includes(props.profile.interestIDs, props.interest._id)) {
    // remove it.
    interests = _.difference(props.profile.interestIDs, [props.interest._id]);
  } else {
    // add it.
    interests = _.concat(props.profile.interestIDs, [props.interest._id]);
  }
  const role = getRoleByUrl(props.match);
  let collectionName;
  switch (role) {
    case URL_ROLES.FACULTY:
      collectionName = FacultyProfiles.getCollectionName();
      break;
    case URL_ROLES.MENTOR:
      collectionName = MentorProfiles.getCollectionName();
      break;
    case URL_ROLES.STUDENT:
      collectionName = StudentProfiles.getCollectionName();
      break;
    default:
      collectionName = StudentProfiles.getCollectionName();
  }
  const updateData: IProfileUpdate = {};
  updateData.id = props.profile._id;
  updateData.interests = interests;
  updateMethod.call({ collectionName, updateData }, (error) => {
    if (error) {
      Swal.fire({
        title: 'Update failed',
        text: error.message,
        type: 'error',
      });
      console.error('Error in updating. %o', error);
    } else {
      Swal.fire({
        title: 'Update succeeded',
        type: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
};

const checkInterestStatus = (props: IExplorerInterestsWidgetProps): string => {
  if (_.includes(props.profile.interestIDs, props.interest._id)) {
    return 'Remove from Interests';
  }
  return 'Add to Interests';
};

const ExplorerInterestsWidget = (props: IExplorerInterestsWidgetProps) => {
  const relatedCourses = getAssociationRelatedCourses(getRelatedCourses(props), props);
  const relatedOpportunities = getAssociationRelatedOpportunities(getRelatedOpportunities(props), props);

  /**
   * ToDo polish this UI
   * ToDo add functionality for button
   */
  return (
    <div>
      <SegmentGroup>
        <Segment>
          <Header>{props.interest.name}<Button
            attatched='top'
            floated='right'
            size='mini'
            content={checkInterestStatus(props)}
            onClick={handleClick(props)}/></Header>
          <Divider/>
          <div>
            <b>Description: </b>
          </div>
          <div>
            <Markdown escapeHtml={true} source={props.interest.description}/>
          </div>
        </Segment>
      </SegmentGroup>
      <Grid stackable columns={2}>
        <Grid.Column width={10}>
          <InterestedRelatedWidget relatedCourses={relatedCourses} relatedOpportunities={relatedOpportunities}
                                   isStudent={getRoleByUrl(props.match) === 'student'} baseURL={getBaseURL(props)}/>
        </Grid.Column>
        <Grid.Column width={6}>
          <InterestedProfilesWidget interest={props.interest} students={props.interestedStudents}
                                    faculty={props.interestedFaculty}
                                    alumni={props.interestedAlumni} mentors={props.interestedMentor}/>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const ExplorerInterestsWidgetCon = withTracker(({ match }) => {
  const username = match.params.username;
  const profile = Users.getProfile(username);
  const entityID = Slugs.getEntityID(match.params.interest, 'Interest');
  const interest = Interests.findDoc(entityID);
  const interestedStudents = participation(URL_ROLES.STUDENT, entityID);
  const interestedFaculty = participation(URL_ROLES.FACULTY, entityID);
  const interestedAlumni = participation(URL_ROLES.ALUMNI, entityID);
  const interestedMentor = participation(URL_ROLES.MENTOR, entityID);
  return {
    profile,
    interest,
    interestedStudents,
    interestedFaculty,
    interestedMentor,
    interestedAlumni,
  };
})(ExplorerInterestsWidget);

const ExplorerInterestsWidgetContainer = withRouter(ExplorerInterestsWidgetCon);

export default ExplorerInterestsWidgetContainer;
