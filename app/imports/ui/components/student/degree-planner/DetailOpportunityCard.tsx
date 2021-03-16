import _ from 'lodash';
import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { OpportunityForecastCollection } from '../../../../startup/client/collections';
import { getUsername } from '../../shared/utilities/router';
import { AcademicTerm, OpportunityInstance, UserInteractionDefine, VerificationRequest, VerificationRequestDefine } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import IceHeader from '../../shared/IceHeader';
import FutureParticipation from '../../shared/explorer/FutureParticipation';
import { defineMethod, removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { buildRouteName } from './DepUtilityFunctions';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import RequestVerificationForm from './RequestVerificationForm';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { cardStyle, contentStyle } from './utilities/styles';
import VerificationRequestStatus from './VerificationRequestStatus';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { Slugs } from '../../../../api/slug/SlugCollection';

interface DetailOpportunityCardProps {
  instance: OpportunityInstance;
  verificationRequests: VerificationRequest[];
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
});

const handleRemove = (selectOpportunityInstance, match) => (event, { value }) => {
  event.preventDefault();
  const collectionName = OpportunityInstances.getCollectionName();
  const instance = value;
  const instanceObject: OpportunityInstance = OpportunityInstances.findDoc({ _id: instance });
  const slugName = OpportunityInstances.getOpportunitySlug(instance);
  removeItMethod.call({ collectionName, instance }, (error) => {
    if (error) {
      console.error(`Remove opportunity instance ${instance} failed.`, error);
    } else {
      Swal.fire({
        title: 'Remove succeeded',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      const academicTerm: AcademicTerm = AcademicTerms.findDoc({ _id: instanceObject.termID });
      const interactionData: UserInteractionDefine = {
        username: getUsername(match),
        type: UserInteractionsTypes.REMOVE_OPPORTUNITY,
        typeData: [academicTerm.term, academicTerm.year, slugName],
      };
      userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
        if (userInteractionError) {
          console.error('Error creating UserInteraction.', userInteractionError);
        }
      });
    }
  });
  selectOpportunityInstance('');
};

const handleVerificationRequest = (instance, match) => (model) => {
  const collectionName = VerificationRequests.getCollectionName();
  const username = getUsername(match);
  const opportunityInstance = instance._id;
  const definitionData: VerificationRequestDefine = {
    student: username,
    opportunityInstance,
  };
  defineMethod.call({ collectionName, definitionData }, (error) => {
    if (error) {
      console.error(`Verification Request define ${definitionData} failed.`);
    } else {
      Swal.fire({
        title: 'Verification request sent.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      const slugID = OpportunityInstances.getOpportunityDoc(opportunityInstance).slugID;
      const slugName = Slugs.getNameFromID(slugID);
      const typeData = [slugName];
      const interactionData: UserInteractionDefine = {
        username,
        type: UserInteractionsTypes.VERIFY_REQUEST,
        typeData,
      };
      userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
        if (userInteractionError) {
          console.error('Error creating UserInteraction.', userInteractionError);
        }
      });
    }
  });
};

const DetailOpportunityCard: React.FC<DetailOpportunityCardProps> = ({ instance, verificationRequests, selectOpportunityInstance }) => {
  const verificationRequeststoShow = verificationRequests.filter((vr) => vr.opportunityInstanceID === instance._id);
  const match = useRouteMatch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const opportunityTerm = AcademicTerms.findDoc(instance.termID);
  const futureP = opportunityTerm.termNumber >= currentTerm.termNumber;
  const verificationRequested = verificationRequeststoShow.length > 0;
  const termName = AcademicTerms.getShortName(instance.termID);
  const opportunity = Opportunities.findDoc(instance.opportunityID);
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };

  const quarter = RadGradProperties.getQuarterSystem();
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired(
    { termNumber: { $gte: currentTerm.termNumber } },
    {
      sort: { termNumber: 1 },
      limit: numTerms,
    },
  );
  const scores = [];
  _.forEach(academicTerms, (term: AcademicTerm) => {
    const id = `${opportunity._id} ${term._id}`;
    const score = OpportunityForecastCollection.find({ _id: id }).fetch() as { count: number }[];
    if (score.length > 0) {
      scores.push(score[0].count);
    } else {
      scores.push(0);
    }
  });

  return (
    <Card.Group itemsPerRow={1}>
      <Card style={cardStyle}>
        <Card.Content style={contentStyle}>
          <IceHeader ice={opportunity.ice} />
          <Card.Header>{opportunity.name}</Card.Header>
        </Card.Content>
        <Card.Content style={contentStyle}>
          {futureP ? (
            <React.Fragment>
              <p>
                <b>Scheduled:</b> {termName}
              </p>
              <FutureParticipation academicTerms={academicTerms} scores={scores} />
              <Button floated="right" basic color="green" value={instance._id} onClick={handleRemove(selectOpportunityInstance, match)} size="tiny">
                Remove
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
                <b>Participated:</b> {termName}
              </p>
              {verificationRequested ? (
                ''
              ) : (
                <Button floated="right" basic color="green" value={instance._id} onClick={handleRemove(selectOpportunityInstance, match)} size="tiny">
                  Remove
                </Button>
              )}
            </React.Fragment>
          )}
        </Card.Content>
        {verificationRequested ? <VerificationRequestStatus request={verificationRequeststoShow[0]} /> : ''}
        {!futureP && !verificationRequested ? (
          <Card.Content style={contentStyle}>
            <RequestVerificationForm handleOnModelChange={handleVerificationRequest(instance, match)} />
          </Card.Content>
        ) : (
          ''
        )}
        <Card.Content style={contentStyle}>
          <p style={textAlignRight}>
            <Link to={buildRouteName(match, opportunity, EXPLORER_TYPE.OPPORTUNITIES)} rel="noopener noreferrer" target="_blank">
              View in Explorer <Icon name="arrow right" />
            </Link>
          </p>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default connect(null, mapDispatchToProps)(DetailOpportunityCard);
