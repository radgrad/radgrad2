import _ from 'lodash';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, Icon } from 'semantic-ui-react';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { OpportunityScoreboard } from '../../../../startup/client/collections';
import { getUsername } from '../../shared/utilities/router';
import {
  IAcademicTerm,
  IOpportunityInstance,
  IUserInteractionDefine,
  IVerificationRequest,
  IVerificationRequestDefine,
} from '../../../../typings/radgrad';
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
import VerificationRequestStatus from './VerificationRequestStatus';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { Users } from '../../../../api/user/UserCollection';

interface IDetailOpportunityCardProps {
  instance: IOpportunityInstance;
  requests: IVerificationRequest[];
  // eslint-disable-next-line react/no-unused-prop-types
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
});

const handleRemove = (props: IDetailOpportunityCardProps, match) => (event, { value }) => {
  event.preventDefault();
  const collectionName = OpportunityInstances.getCollectionName();
  const instance = value;
  const instanceObject: IOpportunityInstance = OpportunityInstances.findDoc({ _id: instance });
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
      const academicTerm: IAcademicTerm = AcademicTerms.findDoc({ _id: instanceObject.termID });
      const interactionData: IUserInteractionDefine = {
        username: getUsername(match),
        type: UserInteractionsTypes.REMOVEOPPORTUNITY,
        typeData: [academicTerm.term, academicTerm.year, slugName],
      };
      userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
        if (userInteractionError) {
          console.error('Error creating UserInteraction.', userInteractionError);
        }
      });
    }
  });
  props.selectOpportunityInstance('');
};

const handleVerificationRequest = (props: IDetailOpportunityCardProps, match) => (model) => {
  const collectionName = VerificationRequests.getCollectionName();
  const username = getUsername(match);
  const opportunityInstance = props.instance._id;
  const definitionData: IVerificationRequestDefine = {
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
      const interactionData: IUserInteractionDefine = {
        username,
        type: UserInteractionsTypes.VERIFYREQUEST,
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

const DetailOpportunityCard = (props: IDetailOpportunityCardProps) => {
  const match = useRouteMatch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const opportunityTerm = AcademicTerms.findDoc(props.instance.termID);
  const futureP = opportunityTerm.termNumber >= currentTerm.termNumber;
  const verificationRequested = props.requests.length > 0;
  const termName = AcademicTerms.getShortName(props.instance.termID);
  const opportunity = Opportunities.findDoc(props.instance.opportunityID);
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };

  const quarter = RadGradProperties.getQuarterSystem();
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired({ termNumber: { $gte: currentTerm.termNumber } }, {
    sort: { termNumber: 1 },
    limit: numTerms,
  });
  const scores = [];
  _.forEach(academicTerms, (term: IAcademicTerm) => {
    const id = `${opportunity._id} ${term._id}`;
    const score = OpportunityScoreboard.find({ _id: id }).fetch() as { count: number }[];
    if (score.length > 0) {
      scores.push(score[0].count);
    } else {
      scores.push(0);
    }
  });

  return (
    <Card.Group itemsPerRow={1}>
      <Card>
        <Card.Content>
          <IceHeader ice={opportunity.ice} />
          <Card.Header>{opportunity.name}</Card.Header>
        </Card.Content>
        <Card.Content>
          {futureP ?
            (
              <React.Fragment>
                <p>
                  <b>Scheduled:</b> {termName}
                </p>
                <FutureParticipation academicTerms={academicTerms} scores={scores} />
                <Button
                  floated="right"
                  basic
                  color="green"
                  value={props.instance._id}
                  onClick={handleRemove(props, match)}
                  size="tiny"
                >
                  Remove
                </Button>
              </React.Fragment>
            )
            :
            (
              <React.Fragment>
                <p>
                  <b>Participated:</b> {termName}
                </p>
                {verificationRequested ?
                  ''
                  :
                  (
                    <Button
                      floated="right"
                      basic
                      color="green"
                      value={props.instance._id}
                      onClick={handleRemove(props, match)}
                      size="tiny"
                    >
                      Remove
                    </Button>
                  )}
              </React.Fragment>
            )}
        </Card.Content>
        {verificationRequested ? <VerificationRequestStatus request={props.requests[0]} /> : ''}
        {!futureP && !verificationRequested ?
          (
            <Card.Content>
              <RequestVerificationForm handleOnModelChange={handleVerificationRequest(props, match)} />
            </Card.Content>
          )
          : ''}
        <Card.Content>
          <p style={textAlignRight}>
            <Link
              to={buildRouteName(match, opportunity, EXPLORER_TYPE.OPPORTUNITIES)}
              rel="noopener noreferrer"
              target="_blank"
            >
              View in Explorer <Icon name="arrow right" />
            </Link>
          </p>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

const DetailOpportunityCardCon = withTracker((props) => {
  const { username } = useParams();
  const studentID = Users.getProfile(username).userID;
  const opportunityInstanceID = props.instance._id;
  const requests = VerificationRequests.findNonRetired({ studentID, opportunityInstanceID });
  return {
    requests,
  };
})(DetailOpportunityCard);

const DetailOpportunityCardConnected = connect(null, mapDispatchToProps)(DetailOpportunityCardCon);
export default DetailOpportunityCardConnected;
