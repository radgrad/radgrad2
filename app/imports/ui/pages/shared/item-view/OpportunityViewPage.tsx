import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import { AdvisorProfiles } from '../../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../../api/user/FacultyProfileCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import { AcademicTerm, BaseProfile, Interest, Internship, Opportunity, OpportunityType, Profile, RelatedCoursesOrOpportunities, Review, Teaser } from '../../../../typings/radgrad';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import RelatedCareerGoals from '../../../components/shared/RelatedCareerGoals';
import RelatedCourses from '../../../components/shared/RelatedCourses';
import RelatedInterests from '../../../components/shared/RelatedInterests';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { Users } from '../../../../api/user/UserCollection';
import { ProfileOpportunities } from '../../../../api/user/profile-entries/ProfileOpportunityCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import ExplorerOpportunity from '../../../components/shared/explorer/item-view/opportunity/ExplorerOpportunity';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { getAssociationRelatedCourses } from '../utilities/getExplorerRelatedMethods';
import RelatedInternships from '../../../components/shared/RelatedInternships';
import { Internships } from '../../../../api/internship/InternshipCollection';

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
  review: Review[];
  teaser: Teaser[];
}

const isCompleted = (opportunityID: string, userID: string): boolean => {
  const ois = OpportunityInstances.findNonRetired({ opportunityID, studentID: userID });
  let completed = false;
  ois.forEach((oi) => {
    if (oi.verified === true) {
      completed = true;
    }
  });
  return completed;
};

const getRelatedInternships = (opportunity: Opportunity) => {
  const internships = Internships.find().fetch();
  return internships.filter((internship: Internship) => internship.interestIDs.filter(x => opportunity.interestIDs.includes(x)).length > 0);
};

const OpportunityViewPage: React.FC<OpportunityViewPageProps> = ({ profileOpportunities, itemReviews, opportunity, profile, sponsors, terms, interests, opportunityTypes, opportunities, review, teaser }) => {
  const userID = profile.userID;
  const completed = isCompleted(opportunity._id, userID);
  const headerPaneTitle = opportunity.name;
  const headerPaneImage = opportunity.picture;
  const added =
    ProfileOpportunities.findNonRetired({
      userID: profile.userID,
      opportunityID: opportunity._id,
    }).length > 0;
  const relatedCourses: RelatedCoursesOrOpportunities = getAssociationRelatedCourses(Opportunities.findRelatedCourses(opportunity._id), profile.userID);
  const relatedCareerGoals = Opportunities.findRelatedCareerGoals(opportunity._id);
  const relatedInternships = getRelatedInternships(opportunity);
  const headerPaneButton = <AddToProfileButton type={PROFILE_ENTRY_TYPE.OPPORTUNITY} userID={profile.userID} item={opportunity} added={added} inverted floated="left" />;
  return (
    <PageLayout id={PAGEIDS.OPPORTUNITY} headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage} headerPaneButton={headerPaneButton}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedInterests item={opportunity} />
            <RelatedCareerGoals careerGoals={relatedCareerGoals} userID={profile.userID} />
            <RelatedCourses relatedCourses={relatedCourses} profile={profile} />
            <RelatedInternships internships={relatedInternships} userID={profile.userID} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerOpportunity
              opportunity={opportunity}
              opportunityTypes={opportunityTypes}
              opportunities={opportunities}
              interests={interests}
              sponsors={sponsors}
              terms={terms}
              completed={completed}
              itemReviews={itemReviews}
              profile={profile}
              review={review}
              teaser={teaser}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { opportunity, username } = useParams();
  const profile = Users.getProfile(username);
  const favOpps = ProfileOpportunities.findNonRetired({ userID: profile.userID });
  const profileOpportunities = favOpps.map((f) => Opportunities.findDoc(f.opportunityID));
  const opportunityDoc = Opportunities.findDocBySlug(opportunity);
  const itemReviews = Reviews.findNonRetired({ revieweeID: opportunityDoc._id, visible: true });
  const review = Reviews.findNonRetired({ revieweeID: opportunityDoc._id, visible: true, studentID: profile.userID });
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
  const teaser = Teasers.findNonRetired({ targetSlugID: opportunityDoc.slugID });
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
    review,
    teaser,
  };
})(OpportunityViewPage);
