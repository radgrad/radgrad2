import React from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Grid, Divider, Segment, SegmentGroup, Embed } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { IInterest, IProfile } from '../../../typings/radgrad';
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
import InterestedProfilesWidget from './InterestedProfilesWidget';
import InterestedRelatedWidget from './InterestedRelatedWidget';
import { URL_ROLES } from '../../../startup/client/route-constants';
import FavoritesButton from './FavoritesButton';
import * as Router from './RouterHelperFunctions';
import { profileGetInterestIDs } from './data-model-helper-functions';
import { explorerInterestWidget } from './shared-widget-names';
import { Teasers } from '../../../api/teaser/TeaserCollection';

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
  const interested = [];
  _.forEach(objects, (profile) => {
    if (_.includes(profileGetInterestIDs(profile), interestID)) {
      interested.push(profile);
    }
  });
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

const ExplorerInterestsWidget = (props: IExplorerInterestsWidgetProps) => {
  const relatedCourses = getAssociationRelatedCourses(getRelatedCourses(props), props);
  const relatedOpportunities = getAssociationRelatedOpportunities(getRelatedOpportunities(props), props);
  const teaser = Teasers.findNonRetired({ targetSlugID: props.interest.slugID });
  const hasTeaser = teaser.length > 0;
  /**
   * ToDo polish this UI
   * ToDo add functionality for button
   */
  return (
    <div id={explorerInterestWidget}>
      <SegmentGroup>
        <Segment>
          <Header>
            {props.interest.name}
            <FavoritesButton
              type="interest"
              studentID={props.profile.userID}
              item={props.interest}
            />
          </Header>
          <Divider />
          {hasTeaser ? (
            <Grid columns={2} stackable>
              <Grid.Column width={9}>
                <div>
                  <b>Description: </b>
                </div>
                <div>
                  <Markdown
                    escapeHtml
                    source={props.interest.description}
                    renderers={{ link: (localProps) => Router.renderLink(localProps, props.match) }}
                  />
                </div>
              </Grid.Column>
              <Grid.Column width={7}>
                <b>Teaser:</b>
                <Embed
                  active
                  autoplay={false}
                  source="youtube"
                  id={teaser && teaser[0] && teaser[0].url}
                />
              </Grid.Column>
            </Grid>
) : (
  <React.Fragment>
    <div>
      <b>Description: </b>
    </div>
    <div>
      <Markdown escapeHtml source={props.interest.description} />
    </div>
  </React.Fragment>
)}
        </Segment>
      </SegmentGroup>
      <Grid stackable columns={2}>
        <Grid.Column width={10}>
          <InterestedRelatedWidget
            relatedCourses={relatedCourses}
            relatedOpportunities={relatedOpportunities}
            isStudent={Router.getRoleByUrl(props.match) === 'student'}
            baseURL={getBaseURL(props)}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <InterestedProfilesWidget
            interest={props.interest}
            students={props.interestedStudents}
            faculty={props.interestedFaculty}
            alumni={props.interestedAlumni}
            mentors={props.interestedMentor}
          />
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
