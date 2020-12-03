import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Header, Grid, Divider, Segment, SegmentGroup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import _ from 'lodash';
import { ICourse, IInterest, IOpportunity, IProfile } from '../../../../../../typings/radgrad';
import { CourseInstances } from '../../../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../../../api/opportunity/OpportunityInstanceCollection';
import InterestedProfilesWidget from './InterestedProfilesWidget';
import InterestedRelatedWidget from './InterestedRelatedWidget';
import FavoritesButton from '../FavoritesButton';
import * as Router from '../../../utilities/router';
import { explorerInterestWidget } from '../../../shared-widget-names';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import { FAVORITE_TYPE } from '../../../../../../api/favorite/FavoriteTypes';
import TeaserVideo from '../../../TeaserVideo';
import { FavoriteInterests } from '../../../../../../api/favorite/FavoriteInterestCollection';

interface IExplorerInterestsWidgetProps {
  profile: IProfile;
  interest: IInterest;
  opportunities: IOpportunity[];
  courses: ICourse[];
}

const getObjectsThatHaveInterest = (objects, interestID: string) => _.filter(objects, (obj) => _.includes(obj.interestIDs, interestID));

const getRelatedCourses = (courses: ICourse[], interestID: string) => getObjectsThatHaveInterest(courses, interestID);

const getAssociationRelatedCourses = (courses: ICourse[], studentID: string) => {
  const inPlanInstances = CourseInstances.findNonRetired({
    studentID, verified: false,
  });
  const inPlanIDs = _.uniq(_.map(inPlanInstances, 'courseID'));

  const completedInstance = CourseInstances.findNonRetired({
    studentID, verified: true,
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

const getRelatedOpportunities = (opportunities: IOpportunity[], interestID: string) => getObjectsThatHaveInterest(opportunities, interestID);

const getAssociationRelatedOpportunities = (opportunities: IOpportunity[], studentID: string) => {
  const inPlanInstances = OpportunityInstances.find({
    studentID, verified: false,
  }).fetch();
  const inPlanIDs = _.uniq(_.map(inPlanInstances, 'opportunityID'));

  const completedInstances = OpportunityInstances.find({
    studentID, verified: true,
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

const getBaseURL = (match) => {
  const split = match.url.split('/');
  const temp = [];
  temp.push(split[0]);
  temp.push(split[1]);
  temp.push(split[2]);
  temp.push(split[3]);
  return temp.join('/');
};

const ExplorerInterestWidget: React.FC<IExplorerInterestsWidgetProps> = ({ profile, interest, courses, opportunities }) => {
  // console.log('ExplorerInterestWidget', props);
  const interestID = interest._id;
  const relatedCourses = getAssociationRelatedCourses(getRelatedCourses(courses, interestID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(getRelatedOpportunities(opportunities, interestID), profile.userID);
  const teaser = Teasers.findNonRetired({ targetSlugID: interest.slugID });
  const hasTeaser = teaser.length > 0;
  const match = useRouteMatch();
  const added = FavoriteInterests.findNonRetired({ userID: profile.userID, interestID }).length > 0;
  return (
    <div id={explorerInterestWidget}>
      <SegmentGroup>
        <Segment>
          <Header>
            {interest.name}
            <FavoritesButton
              type={FAVORITE_TYPE.INTEREST}
              studentID={profile.userID}
              item={interest}
              added={added}
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
                    source={interest.description}
                    renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
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
                <Markdown escapeHtml source={interest.description} />
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
            isStudent={Router.getRoleByUrl(match) === 'student'}
            baseURL={getBaseURL(match)}
          />
        </Grid.Column>

        <Grid.Column width={6}>
          <InterestedProfilesWidget
            interest={interest}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ExplorerInterestWidget;
