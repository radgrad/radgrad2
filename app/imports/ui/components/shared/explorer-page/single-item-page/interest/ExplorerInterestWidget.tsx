import React from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Grid, Divider, Segment, SegmentGroup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { ICourse, IInterest, IOpportunity, IProfile } from '../../../../../../typings/radgrad';
import { Interests } from '../../../../../../api/interest/InterestCollection';
import { CourseInstances } from '../../../../../../api/course/CourseInstanceCollection';
import { Users } from '../../../../../../api/user/UserCollection';
import { Courses } from '../../../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import InterestedProfilesWidget from './InterestedProfilesWidget';
import InterestedRelatedWidget from './InterestedRelatedWidget';
import FavoritesButton from '../FavoritesButton';
import * as Router from '../../../utilities/router';
import { explorerInterestWidget } from '../../../shared-widget-names';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import { FAVORITE_TYPE } from '../../../../../../api/favorite/FavoriteTypes';
import TeaserVideo from '../../../TeaserVideo';

interface IExplorerInterestsWidgetProps {
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
  // eslint-disable-next-line react/no-unused-prop-types
  opportunities: IOpportunity[];
  // eslint-disable-next-line react/no-unused-prop-types
  courses: ICourse[];
}

const getObjectsThatHaveInterest = (objects, props: IExplorerInterestsWidgetProps) => _.filter(objects, (obj) => _.includes(obj.interestIDs, props.interest._id));

const getRelatedCourses = (props: IExplorerInterestsWidgetProps) => getObjectsThatHaveInterest(props.courses, props);

const getAssociationRelatedCourses = (courses, props: IExplorerInterestsWidgetProps) => {
  const inPlanInstances = CourseInstances.findNonRetired({
    studentID: props.profile.userID, verified: false,
  });
  const inPlanIDs = _.uniq(_.map(inPlanInstances, 'courseID'));

  const completedInstance = CourseInstances.findNonRetired({
    studentID: props.profile.userID, verified: true,
  });
  const completedIDs = _.uniq(_.map(completedInstance, 'courseID'));

  const relatedIDs = _.uniq(_.map(courses, '_id'));
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

const getRelatedOpportunities = (props: IExplorerInterestsWidgetProps) => getObjectsThatHaveInterest(props.opportunities, props);

const getAssociationRelatedOpportunities = (opportunities, props: IExplorerInterestsWidgetProps) => {
  const inPlanInstances = OpportunityInstances.find({
    studentID: props.profile.userID, verified: false,
  }).fetch();
  const inPlanIDs = _.uniq(_.map(inPlanInstances, 'opportunityID'));

  const completedInstances = OpportunityInstances.find({
    studentID: props.profile.userID, verified: true,
  }).fetch();
  const completedIDs = _.uniq(_.map(completedInstances, 'opportunityID'));

  const relatedIDs = _.uniq(_.map(opportunities, '_id'));
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

const ExplorerInterestWidget = (props: IExplorerInterestsWidgetProps) => {
  // console.log('ExplorerInterestWidget', props);
  const relatedCourses = getAssociationRelatedCourses(getRelatedCourses(props), props);
  const relatedOpportunities = getAssociationRelatedOpportunities(getRelatedOpportunities(props), props);
  const teaser = Teasers.findNonRetired({ targetSlugID: props.interest.slugID });
  const hasTeaser = teaser.length > 0;

  return (
    <div id={explorerInterestWidget}>
      <SegmentGroup>
        <Segment>
          <Header>
            {props.interest.name}
            <FavoritesButton
              type={FAVORITE_TYPE.INTEREST}
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
                <TeaserVideo id={teaser && teaser[0] && teaser[0].url} />
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
          {/* TODO fix this; make sure to test for students and  faculty */}
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
  const opportunities = Opportunities.find({}).fetch();
  const courses = Courses.find({}).fetch();
  return {
    profile,
    interest,
    opportunities,
    courses,
  };
})(ExplorerInterestWidget);

const ExplorerInterestsWidgetContainer = withRouter(ExplorerInterestsWidgetCon);
export default ExplorerInterestsWidgetContainer;
