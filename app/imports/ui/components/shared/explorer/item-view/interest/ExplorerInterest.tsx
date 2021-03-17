import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Header, Grid, Divider, Segment, SegmentGroup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import _ from 'lodash';
import { Course, Interest, Opportunity, Profile } from '../../../../../../typings/radgrad';
import { CourseInstances } from '../../../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../../../api/opportunity/OpportunityInstanceCollection';
import InterestedProfiles from './InterestedProfiles';
import InterestedRelated from './InterestedRelated';
import AddToProfileButton from '../AddToProfileButton';
import * as Router from '../../../utilities/router';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import TeaserVideo from '../../../TeaserVideo';
import { ProfileInterests } from '../../../../../../api/user/profile-entries/ProfileInterestCollection';

interface ExplorerInterestsWidgetProps {
  profile: Profile;
  interest: Interest;
  opportunities: Opportunity[];
  courses: Course[];
}

const getObjectsThatHaveInterest = (objects, interestID: string) => objects.filter((obj) => _.includes(obj.interestIDs, interestID));

const getRelatedCourses = (courses: Course[], interestID: string) => getObjectsThatHaveInterest(courses, interestID);

const getAssociationRelatedCourses = (courses: Course[], studentID: string) => {
  const inPlanInstances = CourseInstances.findNonRetired({
    studentID,
    verified: false,
  });
  const inPlanIDs = _.uniq(inPlanInstances.map((plan) => plan.courseID));

  const completedInstance = CourseInstances.findNonRetired({
    studentID,
    verified: true,
  });
  const completedIDs = _.uniq(completedInstance.map((inst) => inst.courseID));

  const relatedIDs = _.uniq(courses.map((course) => course._id));
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

const getRelatedOpportunities = (opportunities: Opportunity[], interestID: string) => getObjectsThatHaveInterest(opportunities, interestID);

const getAssociationRelatedOpportunities = (opportunities: Opportunity[], studentID: string) => {
  const inPlanInstances = OpportunityInstances.find({
    studentID,
    verified: false,
  }).fetch();
  const inPlanIDs = _.uniq(inPlanInstances.map((inst) => inst.opportunityID));

  const completedInstances = OpportunityInstances.find({
    studentID,
    verified: true,
  }).fetch();
  const completedIDs = _.uniq(completedInstances.map((inst) => inst.opportunityID));

  const relatedIDs = _.uniq(opportunities.map((o) => o._id));
  const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
  const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
  const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

  const relatedOpportunities = {
    completed: relatedCompletedIDs,
    inPlan: relatedInPlanIDs,
    notInPlan: relatedNotInPlanIDs,
  };
  return relatedOpportunities;
};

const ExplorerInterest: React.FC<ExplorerInterestsWidgetProps> = ({ profile, interest, courses, opportunities }) => {
  const interestID = interest._id;
  const teaser = Teasers.findNonRetired({ targetSlugID: interest.slugID });
  const hasTeaser = teaser.length > 0;
  const match = useRouteMatch();
  const added = ProfileInterests.findNonRetired({ userID: profile.userID, interestID }).length > 0;
  return (
    <div id="explorerInterestWidget">
      <SegmentGroup>
        <Segment>
          <Header>
            {interest.name}
            <AddToProfileButton type={PROFILE_ENTRY_TYPE.INTEREST} studentID={profile.userID} item={interest} added={added} />
          </Header>
          <Divider />
          {hasTeaser ? (
            <Grid columns={2} stackable>
              <Grid.Column width={9}>
                <div>
                  <b>Description: </b>
                </div>
                <div>
                  <Markdown escapeHtml source={interest.description} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
                </div>
              </Grid.Column>
              <Grid.Column width={6}>
                <b>Teaser:</b>
                <TeaserVideo id={teaser && teaser[0] && teaser[0].url} />
              </Grid.Column>
            </Grid>
          ) : (
            <React.Fragment>
              <div>
                <b>Description: </b>
              </div>
              <div>
                <Markdown escapeHtml source={interest.description} />
              </div>
            </React.Fragment>
          )}
        </Segment>
        <InterestedProfiles interest={interest} />
      </SegmentGroup>
    </div>
  );
};

export default ExplorerInterest;
