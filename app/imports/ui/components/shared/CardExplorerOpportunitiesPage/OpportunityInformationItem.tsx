import React from 'react';
import { Image, Divider, Grid, Header } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import _ from 'lodash';
import { IOpportunity, ISlug } from '../../../../typings/radgrad';
import { docToShortDescription } from '../data-model-helper-functions';
import IceHeader from '../IceHeader';
import { buildExplorerRouteName, IMatchProps, renderLink } from '../RouterHelperFunctions';
import InterestList from '../InterestList';
import OpportunityStudentsParticipatingWidget from '../../student/OpportunityStudentsParticipatingWidget';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { replaceTermString } from '../helper-functions';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';

interface IOpportunityItemWidgetProps {
  match: IMatchProps;
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

const OpportunityInformationItem = (props: IOpportunityItemWidgetProps) => {
  const { match, opportunity } = props;
  const opportunityICE = opportunity.ice;
  const opportunityType = getOpportunityType(opportunity);
  const opportunityShortDescription = docToShortDescription(opportunity);
  const opportunityAcademicTerms = getOpportunityAcademicTerms(opportunity);
  const academicTerms = replaceTermString(opportunityAcademicTerms);
  const opportunitySlugDoc: ISlug = Slugs.findOne({ _id: opportunity.slugID });
  const opportunitySlug = opportunitySlugDoc.name;
  return (
    <Grid.Row>
      <Grid columns={2}>
        {/* Opportunity Logo */}
        <Grid.Column width={3}>
          {/* TODO: See issue-274 */}
          <Image src="/images/radgrad_logo.png" />
        </Grid.Column>

        {/* Opportunity Information */}
        <Grid.Column width={13}>
          {/* Header (Name and ICE Points) */}
          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as="h3">
                <Link
                  to={buildExplorerRouteName(match, EXPLORER_TYPE.OPPORTUNITIES, opportunitySlug)}
                >
                  {opportunity.name.toUpperCase()}
                </Link>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <IceHeader ice={opportunityICE} />
            </Grid.Column>
          </Grid.Row>

          {/* Metadata (Opportunity Type and Academic Terms) */}
          <Grid.Row>
            <b>Opportunity Type: </b> {opportunityType}
          </Grid.Row>
          <Grid.Row>
            <b>Academic Terms: </b> {academicTerms}
          </Grid.Row>

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
              <Grid.Column width={14} floated="left">
                <InterestList size="mini" item={opportunity} />
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <OpportunityStudentsParticipatingWidget opportunity={opportunity} />
              </Grid.Column>
            </Grid>
          </Grid.Row>
        </Grid.Column>
      </Grid>
      <Divider />
    </Grid.Row>
  );
};

export default withRouter(OpportunityInformationItem);
