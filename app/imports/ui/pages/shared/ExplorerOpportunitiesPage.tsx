import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { Users } from '../../../api/user/UserCollection';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import ExplorerOpportunitiesWidget from '../../components/shared/ExplorerOpportunitiesWidget';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ExplorerMenu from '../../components/shared/ExplorerMenu';

interface IExplorerOpportunitiesPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
}

class ExplorerOpportunitiesPage extends React.Component<IExplorerOpportunitiesPageProps> {
  constructor(props) {
    super(props);
  }

  private getRoleByUrl = (): string => {
    const url = this.props.match.url;
    const username = this.props.match.params.username;
    const indexUsername = url.indexOf(username);
    return url.substring(1, indexUsername - 1);
  }

  private renderPageMenuWidget = (): JSX.Element | string => {
    const role = this.getRoleByUrl();
    switch (role) {
      case 'student':
        return <StudentPageMenuWidget/>;
      case 'mentor':
        return <MentorPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return '';
    }
  }

  private getUserIdFromRoute = (): string => {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  /* ####################################### EXPLORER MENU HELPER FUNCTIONS ######################################### */
  private addedOpportunities = (): { item: IOpportunity, count: number }[] => {
    const addedOpportunities = [];
    const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    const userID = this.getUserIdFromRoute();
    const group = this.getRoleByUrl();
    if (group === 'faculty') {
      return _.filter(allOpportunities, o => o.sponsorID === userID);
    }
    if (group === 'student') {
      _.forEach(allOpportunities, (opportunity) => {
        const oi = OpportunityInstances.find({
          studentID: userID,
          opportunityID: opportunity._id,
        }).fetch();
        if (oi.length > 0) {
          addedOpportunities.push({ item: opportunity, count: oi.length });
        }
      });
    }
    return addedOpportunities;
  }

  /* ####################################### EXPLORER OPPORTUNITIES WIDGET HELPER FUNCTIONS ######################### */
  private opportunity = (): IOpportunity => {
    const opportunitySlugName = this.props.match.params.opportunity;
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    return opportunity[0];
  }

  private slugName = (slugID: string): string => Slugs.findDoc(slugID).name;

  private descriptionPairs = (opportunity: IOpportunity): object[] => [
    { label: 'Opportunity Type', value: this.opportunityType(opportunity) },
    { label: 'Semesters', value: this.academicTerms(opportunity) },
    { label: 'Event Date', value: opportunity.eventDate },
    { label: 'Sponsor', value: this.sponsor(opportunity) },
    { label: 'Description', value: opportunity.description },
    { label: 'Interests', value: opportunity.interestIDs },
    { label: 'ICE', value: opportunity.ice },
    { label: 'Teaser', value: this.teaser(opportunity) },
  ]

  private opportunityType = (opportunity: IOpportunity): string => {
    const oppType = opportunity.opportunityTypeID;
    const oppSlug = OpportunityTypes.findSlugByID(oppType);
    return OpportunityTypes.findDocBySlug(oppSlug).name;
  }

  private academicTerms = (opportunity: IOpportunity): string[] => {
    const termIDs = opportunity.termIDs;
    return _.map(termIDs, (termID) => AcademicTerms.toString(termID));
  }

  private sponsor = (opportunity: IOpportunity): string => Users.getFullName(opportunity.sponsorID);

  private teaser = (opportunity: IOpportunity): object => {
    const oppTeaser = Teasers.find({ opportunityID: opportunity._id }).fetch();
    return oppTeaser[0];
  }

  private socialPairs = (opportunity: IOpportunity): object[] => [
    {
      label: 'students', amount: this.numUsers(opportunity),
      value: this.interestedUsers(opportunity),
    },
  ];

  private numUsers = (opportunity: IOpportunity): number => this.interestedUsers(opportunity).length;

  private interestedUsers = (opportunity: IOpportunity): object[] => {
    const interested = [];
    const ci = OpportunityInstances.find({
      opportunityID: opportunity._id,
    }).fetch();
    _.forEach(ci, (c) => {
      if (!_.includes(interested, c.studentID)) {
        interested.push(c.studentID);
      }
    });
    return interested;
  }

  private completed = (): boolean => {
    const opportunitySlugName = this.props.match.params.opportunity;
    let ret = false;
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    const oi = OpportunityInstances.find({
      studentID: this.getUserIdFromRoute(),
      opportunityID: opportunity[0]._id,
      verified: true,
    }).fetch();
    if (oi.length > 0) {
      ret = true;
    }
    return ret;
  }

  private reviewed = (opportunity: IOpportunity) => {
    let ret = false;
    const review = Reviews.find({
      studentID: this.getUserIdFromRoute(),
      revieweeID: opportunity._id,
    }).fetch();
    if (review.length > 0) {
      ret = true;
    }
    return ret;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const helpMessage = HelpMessages.findOne({ routeName: this.props.match.path });

    const addedList = this.addedOpportunities();

    const opportunity = this.opportunity();
    const name = opportunity.name;
    const slug = this.slugName(opportunity.slugID);
    const descriptionPairs = this.descriptionPairs(opportunity);
    const id = opportunity._id;
    const socialPairs = this.socialPairs(opportunity);
    const completed = this.completed();
    const reviewed = this.reviewed(opportunity);
    const role = this.getRoleByUrl();
    return (
      <React.Fragment>
        {this.renderPageMenuWidget()}

        <Grid container={true} stackable={true}>
          <Grid.Row>
            {helpMessage ? <HelpPanelWidget/> : ''}
          </Grid.Row>

          <Grid.Column width={3}>
            <ExplorerMenu menuAddedList={addedList} type={'opportunities'} role={this.getRoleByUrl()}/>
          </Grid.Column>

          <Grid.Column width={13}>
            <ExplorerOpportunitiesWidget name={name} slug={slug} descriptionPairs={descriptionPairs} id={id} role={role}
                                         item={opportunity} socialPairs={socialPairs} completed={completed}
                                         reviewed={reviewed}/>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

const ExplorerOpportunitiesPageCon = withGlobalSubscription(ExplorerOpportunitiesPage);
const ExplorerOpportunitiesPageContainer = withInstanceSubscriptions(ExplorerOpportunitiesPageCon);

export default ExplorerOpportunitiesPageContainer;
