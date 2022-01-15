import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerm, BaseProfile, Interest, Opportunity, OpportunityType } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import ManageOpportunitiesTabs from '../../components/shared/manage/opportunity/ManageOpportunitiesTabs';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Manage Opportunities';
const headerPaneBody = `
In RadGrad, opportunities are activities outside of regular coursework that enable students to earn "Innovation" and "Experience" points. When students pick an opportunity, they associate it with a specific academic term (Fall, Spring, or Summer).

For faculty, the most important reason to create opportunities is because it provides a mechanism for you to advertise your research projects to students. Advertising your research projects as opportunities has the following advantages to you:

  1. By specifying one or more "interests" (i.e. disciplinary areas) associated with your research project, RadGrad can recommend your project to students who have also specified those interest areas.

  2. Because students earn myICE points for completing opportunities, and because we recommend you award the maximum number of Innovation points for participating in a research project for each academic term, students who wish to achieve the higher levels in RadGrad will almost certainly need to participate in a faculty research project.

  3. Students can pick your research project for multiple academic terms and earn Innovation points for each academic term.

  4. If you want to, you can offer the student the ability to enroll in an independent study course with you in addition to this opportunity. That gives the student the ability to earn both Innovation and Competency points for the same work.

Taken together, these advantages increase the odds that you will connect with qualified, motivated students when you specify one or more of your research projects as opportunities.

Students do not automatically earn points just for adding one of your opportunities to their degree plan. In order to get the points, they must ask you to "verify" their participation. If you do not feel they participated enough to warrant the points at the end of an academic term, you do not have to verify their participation.

Unless your project entails regular contact and interaction with industry professionals, your opportunity should not provide any Experience points.

You can review the existing opportunities listed below to see how points are currently awarded so that you can define your opportunity consistently.
`;

interface ManageOpportunitiesPageProps {
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
  opportunities: Opportunity[];
}

const ManageOpportunitiesPage: React.FC<ManageOpportunitiesPageProps> = ({
  sponsors,
  interests,
  terms,
  opportunityTypes,
  opportunities,
}) => (
  <PageLayout id={PAGEIDS.MANAGE_OPPORTUNITIES} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <ManageOpportunitiesTabs sponsors={sponsors} terms={terms} interests={interests}
      opportunityTypes={opportunityTypes} opportunities={opportunities} />
  </PageLayout>
);

export default withTracker(() => {
  const { username } = useParams();
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
    sponsors,
    terms,
    interests,
    opportunityTypes,
    opportunities,
  };
})(ManageOpportunitiesPage);
