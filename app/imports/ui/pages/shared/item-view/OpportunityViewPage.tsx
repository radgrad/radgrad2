import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Watermark } from '@hirohe/react-watermark';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { ROLE } from '../../../../api/role/Role';
import { AdvisorProfiles } from '../../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../../api/user/FacultyProfileCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import {
  AcademicTerm,
  BaseProfile,
  Interest,
  Opportunity,
  OpportunityType,
  Profile,
  Review,
} from '../../../../typings/radgrad';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import RelatedCareerGoals from '../../../components/shared/RelatedCareerGoals';
import RelatedCourses from '../../../components/shared/RelatedCourses';
import RelatedInterests from '../../../components/shared/RelatedInterests';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { Users } from '../../../../api/user/UserCollection';
import { ProfileOpportunities } from '../../../../api/user/profile-entries/ProfileOpportunityCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import ExplorerOpportunity
  from '../../../components/shared/explorer/item-view/opportunity/ExplorerOpportunity';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';

interface OpportunityViewPageProps {
  profileOpportunities: Opportunity[];
  itemReviews: Review[];
  opportunity: Opportunity;
  profile: Profile;
  // for the EditOpportunityButton
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
  opportunities: Opportunity[];
}

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
  sponsors,
  terms,
  interests,
  opportunityTypes,
  opportunities,
}) => {
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
  const headerPaneButton = profile.role === ROLE.STUDENT ?
    <AddToProfileButton type={PROFILE_ENTRY_TYPE.OPPORTUNITY} studentID={profile.userID}
                        item={opportunity} added={added} inverted floated="left" /> : undefined;
  return (
    <PageLayout id={PAGEIDS.OPPORTUNITY} headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage}
                headerPaneButton={headerPaneButton}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <RelatedInterests item={opportunity} />
            <RelatedCourses courses={relatedCourses} userID={profile.userID} />
            <RelatedCareerGoals careerGoals={relatedCareerGoals} userID={profile.userID} />
          </Grid.Column>
          <Grid.Column width={13}>
            {opportunity.retired ? (
                <Watermark text="Retired" textColor='red' textSize={48}>
                  <ExplorerOpportunity opportunity={opportunity}
                                       opportunityTypes={opportunityTypes}
                                       opportunities={opportunities}
                                       interests={interests}
                                       sponsors={sponsors}
                                       terms={terms} completed={completed}
                                       itemReviews={itemReviews}
                                       profile={profile} />
                </Watermark>) :
              <ExplorerOpportunity opportunity={opportunity} opportunityTypes={opportunityTypes}
                                   opportunities={opportunities} interests={interests} sponsors={sponsors}
                                   terms={terms} completed={completed} itemReviews={itemReviews} profile={profile} />
            }
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
  const sponsorID = Users.getProfile(username).userID;
  const opportunities = Opportunities.find({ sponsorID }, { sort: { name: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}).fetch();
  const advisors = AdvisorProfiles.find({}).fetch();
  const sponsorDocs = _.union(faculty, advisors);
  const sponsors = _.sortBy(sponsorDocs, ['lastName', 'firstName']);
  const allTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  const after = currentTermNumber - 8;
  const before = currentTermNumber + 16;
  const terms = allTerms.filter((t) => t.termNumber >= after && t.termNumber <= before);
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const opportunityTypes = OpportunityTypes.find({}, { sort: { name: 1 } }).fetch();
  return {
    profileOpportunities,
    itemReviews,
    opportunity: opportunityDoc,
    profile,
    sponsors,
    terms,
    interests,
    opportunityTypes,
    opportunities,
  };
})(OpportunityViewPage);

export default OpportunityViewPageContainer;
