import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { IHelpMessage, IOpportunity, IProfile } from '../../../../typings/radgrad';
import { getMenuWidget } from '../utilities/getMenuWidget';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import { Users } from '../../../../api/user/UserCollection';
import { FavoriteOpportunities } from '../../../../api/favorite/FavoriteOpportunityCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import ExplorerOpportunityWidget
  from '../../../components/shared/explorer/item-view/opportunity/ExplorerOpportunityWidget';
import { teaser } from '../../../components/shared/explorer/item-view/utilities/teaser';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';

interface IOpportunityViewPageProps {
  favoriteOpportunities: IOpportunity[];
  helpMessages: IHelpMessage[];
  opportunity: IOpportunity;
  profile: IProfile;
}

const opportunityType = (theOpp: IOpportunity): string => {
  const oppType = theOpp.opportunityTypeID;
  const oppSlug = OpportunityTypes.findSlugByID(oppType);
  return OpportunityTypes.findDocBySlug(oppSlug).name;
};

const academicTerms = (theOpp: IOpportunity): string[] => {
  const termIDs = theOpp.termIDs;
  return _.map(termIDs, (termID) => AcademicTerms.toString(termID));
};

const sponsor = (theOpp: IOpportunity): string => Users.getFullName(theOpp.sponsorID);

const descriptionPairsOpportunities = (theOpp: IOpportunity): { label: string, value: any }[] => [
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
  _.forEach(ois, (oi) => {
    if (oi.verified === true) {
      completed = true;
    }
  });
  return completed;
};

const OpportunityViewPage: React.FC<IOpportunityViewPageProps> = ({ favoriteOpportunities, helpMessages, opportunity, profile }) => {
  const match = useRouteMatch();
  const menuAddedList = _.map(favoriteOpportunities, (item) => ({
    item, count: 1,
  }));
  const descriptionPairs = descriptionPairsOpportunities(opportunity);
  const studentID = profile.userID;
  const completed = isCompleted(opportunity._id, studentID);
  return (
    <div id="opportunity-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <ExplorerMenu menuAddedList={menuAddedList} type="opportunities" />
            </Grid.Column>
            <Grid.Column width={13}>
              <ExplorerOpportunityWidget name={opportunity.name} descriptionPairs={descriptionPairs} item={opportunity} completed={completed} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

const OpportunityViewPageContainer = withTracker(() => {
  const { opportunity, username } = useParams();
  const profile = Users.getProfile(username);
  const favOpps = FavoriteOpportunities.findNonRetired({ studentID: profile.userID });
  const favoriteOpportunities = _.map(favOpps, (f) => Opportunities.findDoc(f.opportunityID));
  const helpMessages = HelpMessages.findNonRetired({});
  const opportunityDoc = Opportunities.findDocBySlug(opportunity);
  return {
    favoriteOpportunities,
    helpMessages,
    opportunity: opportunityDoc,
    profile,
  };
})(OpportunityViewPage);

export default OpportunityViewPageContainer;
