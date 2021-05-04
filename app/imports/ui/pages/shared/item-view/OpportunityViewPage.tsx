import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import { Opportunity, Profile, Review } from '../../../../typings/radgrad';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import RelatedCareerGoals from '../../../components/shared/RelatedCareerGoals';
import RelatedCourses from '../../../components/shared/RelatedCourses';
import RelatedInterests from '../../../components/shared/RelatedInterests';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { getMenuWidget } from '../utilities/getMenuWidget';
import { Users } from '../../../../api/user/UserCollection';
import { ProfileOpportunities } from '../../../../api/user/profile-entries/ProfileOpportunityCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import ExplorerOpportunity
  from '../../../components/shared/explorer/item-view/opportunity/ExplorerOpportunity';
import { teaser } from '../../../components/shared/explorer/item-view/utilities/teaser';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';

interface OpportunityViewPageProps {
  profileOpportunities: Opportunity[];
  itemReviews: Review[];
  opportunity: Opportunity;
  profile: Profile;
}

const opportunityType = (theOpp: Opportunity): string => {
  const oppType = theOpp.opportunityTypeID;
  const oppSlug = OpportunityTypes.findSlugByID(oppType);
  return OpportunityTypes.findDocBySlug(oppSlug).name;
};

const academicTerms = (theOpp: Opportunity): string[] => {
  const termIDs = theOpp.termIDs;
  return termIDs.map((termID) => AcademicTerms.toString(termID));
};

const sponsor = (theOpp: Opportunity): string => Users.getFullName(theOpp.sponsorID);

const descriptionPairsOpportunities = (theOpp: Opportunity): { label: string; value: any }[] => [
  { label: 'Opportunity Type', value: opportunityType(theOpp) },
  { label: 'Academic Terms', value: academicTerms(theOpp) },
  { label: 'Event Date', value: theOpp.eventDate },
  { label: 'Sponsor', value: sponsor(theOpp) },
  { label: 'Description', value: theOpp.description },
  { label: 'Interests', value: theOpp.interestIDs },
  { label: 'ICE', value: theOpp.ice },
  { label: 'Teaser', value: teaser(theOpp) },
];

const isCompleted = (opportunityID: string, studentID: string): boolean => {
  const ois = OpportunityInstances.findNonRetired({ opportunityID, studentID });
  let completed = false;
  ois.forEach((oi) => {
    if (oi.verified === true) {
      completed = true;
    }
  });
  return completed;
};

const OpportunityViewPage: React.FC<OpportunityViewPageProps> = ({
  profileOpportunities,
  itemReviews,
  opportunity,
  profile,
}) => {
  const match = useRouteMatch();
  const menuAddedList = profileOpportunities.map((item) => ({
    item,
    count: 1,
  }));
  const descriptionPairs = descriptionPairsOpportunities(opportunity);
  const studentID = profile.userID;
  const completed = isCompleted(opportunity._id, studentID);
  const headerPaneTitle = opportunity.name;
  const headerPaneImage = 'header-opportunities.png';
  const added = ProfileOpportunities.findNonRetired({
    studentID: profile.userID,
    opportunityID: opportunity._id,
  }).length > 0;
  const relatedCourses = Opportunities.findRelatedCourses(opportunity._id);
  const relatedCareerGoals = Opportunities.findRelatedCareerGoals(opportunity._id);
  return (
    <PageLayout id={PAGEIDS.OPPORTUNITY} headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage}
                headerPaneButton={<AddToProfileButton type={PROFILE_ENTRY_TYPE.OPPORTUNITY} studentID={profile.userID}
                                                      item={opportunity} added={added} inverted floated="left" />}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <RelatedInterests item={opportunity} />
            <RelatedCourses courses={relatedCourses} userID={profile.userID} />
            <RelatedCareerGoals careerGoals={relatedCareerGoals} userID={profile.userID} />
          </Grid.Column>
          <Grid.Column width={13}>
            <ExplorerOpportunity name={opportunity.name} descriptionPairs={descriptionPairs} item={opportunity}
                                 completed={completed} itemReviews={itemReviews} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

const OpportunityViewPageContainer = withTracker(() => {
  const { opportunity, username } = useParams();
  const profile = Users.getProfile(username);
  const favOpps = ProfileOpportunities.findNonRetired({ studentID: profile.userID });
  const profileOpportunities = favOpps.map((f) => Opportunities.findDoc(f.opportunityID));
  const opportunityDoc = Opportunities.findDocBySlug(opportunity);
  const itemReviews = Reviews.findNonRetired({ revieweeID: opportunityDoc._id });
  return {
    profileOpportunities,
    itemReviews,
    opportunity: opportunityDoc,
    profile,
  };
})(OpportunityViewPage);

export default OpportunityViewPageContainer;
