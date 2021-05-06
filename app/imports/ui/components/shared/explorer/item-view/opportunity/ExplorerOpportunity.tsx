import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { AcademicTerms } from '../../../../../../api/academic-term/AcademicTermCollection';
import { OpportunityTypes } from '../../../../../../api/opportunity/OpportunityTypeCollection';
import { getFutureEnrollmentSingleMethod } from '../../../../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../../../startup/both/RadGradForecasts';
import {
  AcademicTerm,
  BaseProfile,
  Interest,
  Opportunity,
  OpportunityType, Profile,
  Review,
} from '../../../../../../typings/radgrad';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import { Reviews } from '../../../../../../api/review/ReviewCollection';
import IceHeader from '../../../IceHeader';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import DeleteOpportunityButton from '../../../manage/opportunity/DeleteOpportunityButton';
import EditOpportunityButton from '../../../manage/opportunity/EditOpportunityButton';
import FutureParticipation from '../../FutureParticipation';
import TeaserVideo from '../../../TeaserVideo';
import { Users } from '../../../../../../api/user/UserCollection';
import ExplorerReviewWidget from '../ExplorerReviewWidget';
import { ROLE } from '../../../../../../api/role/Role';

interface ExplorerOpportunitiesWidgetProps {
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

const review = (opportunity: Opportunity, profile: Profile): Review => {
  const reviews = Reviews.findNonRetired({
    studentID: profile.userID,
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

const ExplorerOpportunity: React.FC<ExplorerOpportunitiesWidgetProps> = ({ opportunity, opportunityTypes, opportunities, terms, interests, sponsors, completed, itemReviews, profile }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const fiveMarginTopStyle = { marginTop: '5px' };
  const compactRowStyle = { paddingTop: 2, paddingBottom: 2 };
  const match = useRouteMatch();
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID }).length > 0;
  const isStudent = profile.role === ROLE.STUDENT;
  const isSponsor = profile.userID === opportunity.sponsorID;
  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: opportunity._id, type: ENROLLMENT_TYPE.OPPORTUNITY })
        .then((result) => setData(result))
        .catch((error) => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, opportunity._id]);
  let academicTerms = [];
  let scores = [];
  if (data?.enrollment) {
    academicTerms = data.enrollment.map((entry) => AcademicTerms.findDoc(entry.termID));
    scores = data.enrollment.map((entry) => entry.count);
  }
  const opportunityType = OpportunityTypes.findDoc(opportunity.opportunityTypeID).name;
  const opportunityTermNames = opportunity.termIDs.map((id) => AcademicTerms.toString(id));
  const opportunitySponsorName = Users.getFullName(opportunity.sponsorID);
  const dateStrings = [];
  if (opportunity.eventDate1) {
    dateStrings.push(moment(opportunity.eventDate1).format('MM/DD/YYYY'));
  }
  if (opportunity.eventDate2) {
    dateStrings.push(moment(opportunity.eventDate2).format('MM/DD/YYYY'));
  }
  if (opportunity.eventDate3) {
    dateStrings.push(moment(opportunity.eventDate3).format('MM/DD/YYYY'));
  }
  if (opportunity.eventDate4) {
    dateStrings.push(moment(opportunity.eventDate4).format('MM/DD/YYYY'));
  }
  // console.log(profile.userID, opportunity._id, opportunity.name);
  return (
    <div id="explorerOpportunityWidget">
      <Segment padded className="container" style={segmentStyle}>
        {hasTeaser ? <TeaserVideo id={teaserUrlHelper(opportunity)} /> : ''}
        <Grid stackable style={fiveMarginTopStyle}>
          <Grid.Row columns="equal" style={compactRowStyle}>
            <Grid.Column>
              <strong>Opportunity Type:</strong>&nbsp; {opportunityType}
            </Grid.Column>
            <Grid.Column>
              <strong>Dates:</strong>&nbsp;{opportunity.eventDate1 ? dateStrings.join(', ') : 'N/A'}
            </Grid.Column>
            <Grid.Column>
              <IceHeader ice={opportunity.ice} size='large' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns="equal" style={compactRowStyle}>
            <Grid.Column>
              <strong>Academic Terms:</strong>&nbsp; {opportunityTermNames.join(', ')}
            </Grid.Column>
            <Grid.Column>
              <strong>Sponsor:</strong>&nbsp;{opportunitySponsorName}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Markdown allowDangerousHtml source={opportunity.description} />
          </Grid.Row>
          {isSponsor ? <Grid.Row><EditOpportunityButton opportunity={opportunity} sponsors={sponsors} terms={terms} interests={interests} opportunityTypes={opportunityTypes}/> <DeleteOpportunityButton opportunity={opportunity} /></Grid.Row> : ''}
        </Grid>
      </Segment>

      <Segment textAlign="center">
        <Header>STUDENTS PARTICIPATING BY SEMESTER</Header>
        <Divider />
        <FutureParticipation academicTerms={academicTerms} scores={scores} />
      </Segment>

      {isStudent ? (
        <Segment>
          <StudentExplorerReviewWidget itemToReview={opportunity} userReview={review(opportunity, match)} completed={completed} reviewType="opportunity" itemReviews={itemReviews} />
        </Segment>
      ) : (
        <Segment><ExplorerReviewWidget itemReviews={itemReviews} reviewType="opportunity" /></Segment>
      )}
    </div>
  );
};

export default ExplorerOpportunity;
