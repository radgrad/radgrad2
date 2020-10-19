import React from 'react';
import { Image, Divider, Grid, Header, Icon } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import _ from 'lodash';
import { IOpportunity, ISlug } from '../../../../typings/radgrad';
import { docToShortDescription } from '../data-model-helper-functions';
import IceHeader from '../IceHeader';
import { buildExplorerSlugRoute, IMatchProps, renderLink } from '../RouterHelperFunctions';
import InterestList from '../InterestList';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { replaceTermString } from '../helper-functions';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';
import { StudentParticipations } from '../../../../api/public-stats/StudentParticipationCollection';

// Certain parts of pages don't show other information such students participating, logo, opportunity, type, and academic terms
export interface IOpportunityInformationItemConfiguration {
  showLogo: boolean;
  showMetadata: boolean;
  showStudentsParticipating: boolean;
}

interface IOpportunityItemWidgetProps {
  match: IMatchProps;
  informationConfiguration: IOpportunityInformationItemConfiguration;
  opportunity: IOpportunity;
}

const getOpportunityType = (opportunity: IOpportunity): string => {
  const oppType = opportunity.opportunityTypeID;
  const oppSlug = OpportunityTypes.findSlugByID(oppType);
  return OpportunityTypes.findDocBySlug(oppSlug).name;
};

const getOpportunityAcademicTerms = (opportunity: IOpportunity): string[] => {
  const termIDs = opportunity.termIDs;
  return _.map(termIDs, (termID) => AcademicTerms.toString(termID));
};

const getNumberOfStudentsParticipating = (opportunity: IOpportunity): number => {
  const participatingStudents = StudentParticipations.findDoc({ itemID: opportunity._id });
  return participatingStudents.itemCount;
};

const OpportunityInformationItem = (props: IOpportunityItemWidgetProps) => {
  const { match, informationConfiguration, opportunity } = props;

  const interestListStyle: React.CSSProperties = {
    marginTop: '5px',
  };

  const numberOfStudentsParticipating = getNumberOfStudentsParticipating(props.opportunity);
  const opportunityICE = opportunity.ice;
  const opportunityType = getOpportunityType(opportunity);
  const opportunityShortDescription = docToShortDescription(opportunity);
  const opportunityAcademicTerms = getOpportunityAcademicTerms(opportunity);
  const academicTerms = replaceTermString(opportunityAcademicTerms);
  const opportunitySlugDoc: ISlug = Slugs.findOne({ _id: opportunity.slugID });
  const opportunitySlug = opportunitySlugDoc.name;
  return (
    <Grid.Row>
      <Grid columns={informationConfiguration.showLogo ? 2 : undefined}>
        {/* Opportunity Logo */}
        {informationConfiguration.showLogo ? (
          <Grid.Column width={3}>
            {/* TODO: See issue-274 */}
            <Image src="/images/radgrad_logo.png" />
          </Grid.Column>
        ) : ''}

        {/* Opportunity Information */}
        <Grid.Column width={informationConfiguration.showLogo ? 13 : undefined}>
          {/* Header (Name and ICE Points) */}
          <Grid.Row columns={2}>
            <Header as="h3">
              <Link
                to={buildExplorerSlugRoute(match, EXPLORER_TYPE.OPPORTUNITIES, opportunitySlug)}
              >
                {opportunity.name.toUpperCase()}
              </Link>
              <IceHeader ice={opportunityICE} />
            </Header>
          </Grid.Row>

          {/* Metadata (Opportunity Type and Academic Terms) */}
          {informationConfiguration.showMetadata ? (
            <>
              <Grid.Row>
                <b>Opportunity Type: </b> {opportunityType}
              </Grid.Row>
              <Grid.Row>
                <b>Academic Terms: </b> {academicTerms}
              </Grid.Row>
            </>
          ) : ''}

          {/* Description */}
          <Grid.Row>
            <Markdown
              escapeHtml
              source={`${opportunityShortDescription}...`}
              renderers={{ link: (p) => renderLink(p, match) }}
            />
          </Grid.Row>

          {/* Misc (Related Interest Labels and Students Participating) */}
          <Grid.Row>
            <Grid>
              <Grid.Column
                width={informationConfiguration.showStudentsParticipating ? 11 : undefined}
                style={interestListStyle}
              >
                <InterestList size="mini" item={opportunity} />
              </Grid.Column>
              {informationConfiguration.showStudentsParticipating ? (
                <Grid.Column width={5} verticalAlign="bottom" textAlign="right">
                  <Icon size="large" name="user circle" />
                  <b>{numberOfStudentsParticipating} students are participating</b>
                </Grid.Column>
              ) : ''}
            </Grid>
          </Grid.Row>
        </Grid.Column>
      </Grid>
      <Divider />
    </Grid.Row>
  );
};

export default withRouter(OpportunityInformationItem);
