import moment from 'moment';
import React from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Divider, Grid, Segment, List } from 'semantic-ui-react';
import BaseCollection from '../../../../../../api/base/BaseCollection';
import { Reviews } from '../../../../../../api/review/ReviewCollection';
import { ROLE } from '../../../../../../api/role/Role';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import { StudentProfiles } from '../../../../../../api/user/StudentProfileCollection';
import { AcademicTerm, BaseProfile, Interest, Opportunity, OpportunityType, Profile, Review } from '../../../../../../typings/radgrad';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import IceHeader from '../../../IceHeader';
import DeleteItemButton from '../../../manage/DeleteItemButton';
import EditOpportunityButton from '../../../manage/opportunity/EditOpportunityButton';
import UserLabel from '../../../profile/UserLabel';
import RadGradHeader from '../../../RadGradHeader';
import TeaserVideo from '../../../TeaserVideo';
import FutureParticipation from '../../FutureParticipation';
import ExplorerReviewWidget from '../ExplorerReviewWidget';

interface ExplorerOpportunitiesProps {
  opportunity: Opportunity;
  itemReviews: Review[];
  completed: boolean;
  profile: Profile;
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
  opportunities: Opportunity[];
}

const review = (opportunity: Opportunity, profile): Review => {
  const user = StudentProfiles.findByUsername(profile);
  const reviews = Reviews.findNonRetired({
    studentID: user.userID,
    revieweeID: opportunity._id,
  });
  if (reviews.length > 0) {
    return reviews[0];
  }
  return null;
};

const teaserUrlHelper = (opportunity: Opportunity): string => {
  const oppTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID });
  if (oppTeaser.length > 1) { // TODO do we need this?
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};

const ExplorerOpportunity: React.FC<ExplorerOpportunitiesProps> = ({ opportunity, opportunityTypes, opportunities, terms, interests, sponsors, completed, itemReviews, profile }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const compactRowStyle = { paddingTop: 3, paddingBottom: 3 };
  const gridStyle = { paddingLeft: 17, paddingTop: 10, paddingBottom: 17 };
  const { username } = useParams();
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID }).length > 0;
  const isStudent = profile.role === ROLE.STUDENT;
  const isSponsor = profile.userID === opportunity.sponsorID;
  const showManageButtons = isSponsor || profile.role === ROLE.ADMIN;

  const eventListItem = (date, label) => (date ? <List.Item key='${label}'>{moment(date).format('LL')}:  {label}</List.Item> : '');

  return (
    <div id="explorerOpportunityWidget">
      <Segment className="container" style={segmentStyle}>
        {hasTeaser ? <TeaserVideo id={teaserUrlHelper(opportunity)} /> : ''}
        <Markdown escapeHtml linkTarget="_blank" source={opportunity.description} />
        <Grid stackable style={gridStyle}>
          <Grid.Row style={compactRowStyle}>
            <strong style={{ paddingTop: '4px' }}>ICE:</strong>&nbsp;<IceHeader ice={opportunity.ice} size='large' />
          </Grid.Row>
          <Grid.Row style={compactRowStyle}>
            <strong style={{ paddingTop: '5px' }}>Sponsor:</strong> &nbsp; <UserLabel username={opportunity.sponsorID}/>
          </Grid.Row>
          <Grid.Row style={compactRowStyle}>
            {opportunity.eventDate1 ? <strong>Dates:</strong> : ''}
            <List bulleted>
              {eventListItem(opportunity.eventDate1, opportunity.eventDateLabel1)}
              {eventListItem(opportunity.eventDate2, opportunity.eventDateLabel2)}
              {eventListItem(opportunity.eventDate3, opportunity.eventDateLabel3)}
              {eventListItem(opportunity.eventDate4, opportunity.eventDateLabel4)}
            </List>
          </Grid.Row>
          <Grid.Row style={compactRowStyle}>
            <strong>Last Update:</strong> &nbsp; {BaseCollection.getLastUpdatedFromDoc(opportunity)}
          </Grid.Row>
          {showManageButtons ? <Grid.Row><EditOpportunityButton opportunity={opportunity} sponsors={sponsors} interests={interests} opportunityTypes={opportunityTypes}/> <DeleteItemButton item={opportunity} type={PROFILE_ENTRY_TYPE.OPPORTUNITY} /></Grid.Row> : ''}
        </Grid>
      </Segment>

      <Segment>
        <RadGradHeader icon="users" title='STUDENTS PARTICIPATING BY SEMESTER' dividing={false} />
        <Divider />
        <FutureParticipation item={opportunity} />
      </Segment>

      {isStudent ? (
        <Segment>
          <StudentExplorerReviewWidget itemToReview={opportunity} userReview={review(opportunity, username)} completed={completed} reviewType="opportunity" itemReviews={itemReviews} />
        </Segment>
      ) : (
        <Segment><ExplorerReviewWidget itemReviews={itemReviews} reviewType="opportunity" /></Segment>
      )}
    </div>
  );
};

export default ExplorerOpportunity;
