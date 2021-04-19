import React from 'react';
import { Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { OpportunityForecastCollection } from '../../../../startup/client/collections';
import { ButtonAction } from '../../shared/button/ButtonAction';
import { ButtonLink } from '../../shared/button/ButtonLink';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import { getUsername } from '../../shared/utilities/router';
import {
  AcademicTerm,
  OpportunityInstance,
  UserInteractionDefine,
  VerificationRequest,
} from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import IceHeader from '../../shared/IceHeader';
import FutureParticipation from '../../shared/explorer/FutureParticipation';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { cardStyle, contentStyle } from './utilities/styles';
import VerificationRequestStatus from './VerificationRequestStatus';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import * as RouterUtils from '../../shared/utilities/router';

interface DetailOpportunityCardProps {
  instance: OpportunityInstance;
  verificationRequests: VerificationRequest[];
  selectOpportunityInstance: (opportunityInstanceID: string) => void;
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

const DetailOpportunityCard: React.FC<DetailOpportunityCardProps> = ({
  instance,
  verificationRequests,
  selectOpportunityInstance,
}) => {
  const verificationRequestsToShow = verificationRequests.filter((vr) => vr.opportunityInstanceID === instance._id);
  const match = useRouteMatch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const opportunityTerm = AcademicTerms.findDoc(instance.termID);
  const futureP = opportunityTerm.termNumber >= currentTerm.termNumber;
  const verificationRequested = verificationRequestsToShow.length > 0;
  const termName = AcademicTerms.getShortName(instance.termID);
  const opportunity = Opportunities.findDoc(instance.opportunityID);
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
  academicTerms.forEach((term: AcademicTerm) => {
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
              {/* @ts-ignore */}
              <ButtonAction value={instance._id} onClick={handleRemove(selectOpportunityInstance, match)}
                            icon="trash alternate outline" label="Remove" style={cardStyle} size="small" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
                <b>Participated:</b> {termName}
              </p>
              {verificationRequested ? (
                ''
              ) : (
                <React.Fragment>
                  {/* @ts-ignore */}
                  <ButtonAction value={instance._id} onClick={handleRemove(selectOpportunityInstance, match)}
                                icon="trash alternate outline" label="Remove" style={cardStyle} size="small" />
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {verificationRequested ? <VerificationRequestStatus request={verificationRequestsToShow[0]} /> : ''}
          {!futureP && !verificationRequested ? (
            <ButtonLink url={RouterUtils.buildRouteName(match, '/student-verification')} label='Request verification'
                        style={cardStyle} size="small" />
          ) : (
            ''
          )}
          <ViewInExplorerButtonLink match={match} type={EXPLORER_TYPE.OPPORTUNITIES} item={opportunity}
                                    style={cardStyle} size="small" />
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default connect(null, mapDispatchToProps)(DetailOpportunityCard);
