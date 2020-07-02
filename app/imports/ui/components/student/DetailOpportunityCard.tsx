import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, Icon } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { getUserIdFromRoute, getUsername, IMatchProps } from '../shared/RouterHelperFunctions';
import { IOpportunityInstance, IVerificationRequest, IVerificationRequestDefine } from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import IceHeader from '../shared/IceHeader';
import FutureParticipation from '../shared/FutureParticipation';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { buildRouteName } from './DepUtilityFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import RequestVerificationForm from './RequestVerificationForm';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import VerificationRequestStatus from './VerificationRequestStatus';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import { UserInteractionsDataType, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IDetailOpportunityCardProps {
  match: IMatchProps;
  instance: IOpportunityInstance;
  requests: IVerificationRequest[];
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
});

const handleRemove = (props: IDetailOpportunityCardProps) => (event, { value }) => {
  event.preventDefault();
  const collectionName = OpportunityInstances.getCollectionName();
  const instance = value;
  removeItMethod.call({ collectionName, instance }, (error) => {
    if (error) {
      console.error(`Remove courseInstance ${instance} failed.`, error);
    } else {
      Swal.fire({
        title: 'Remove succeeded',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      // TODO: UserInteraction remove planned course.
    }
  });
  props.selectOpportunityInstance('');
};

const handleVerificationRequest = (props: IDetailOpportunityCardProps) => (model) => {
  const collectionName = VerificationRequests.getCollectionName();
  const username = getUsername(props.match);
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
      const typeData = Slugs.getNameFromID(OpportunityInstances.getOpportunityDoc(opportunityInstance).slugID);
      const interactionData: UserInteractionsDataType = {
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
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const opportunityTerm = AcademicTerms.findDoc(props.instance.termID);
  const futureP = opportunityTerm.termNumber >= currentTerm.termNumber;
  const verificationRequested = props.requests.length > 0;
  const termName = AcademicTerms.getShortName(props.instance.termID);
  const opportunity = Opportunities.findDoc(props.instance.opportunityID);
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };
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
                <FutureParticipation item={opportunity} type="courses" />
                <Button
                  floated="right"
                  basic
                  color="green"
                  value={props.instance._id}
                  onClick={handleRemove(props)}
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
                      onClick={handleRemove(props)}
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
              <RequestVerificationForm handleOnModelChange={handleVerificationRequest(props)} />
            </Card.Content>
          )
          : ''}
        <Card.Content>
          <p style={textAlignRight}>
            <Link
              to={buildRouteName(props.match, opportunity, EXPLORER_TYPE.OPPORTUNITIES)}
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

const DetailOpportunityCardCon = withRouter(withTracker((props) => {
  const studentID = getUserIdFromRoute(props.match);
  const opportunityInstanceID = props.instance._id;
  const requests = VerificationRequests.find({ studentID, opportunityInstanceID }).fetch();
  return {
    requests,
  };
})(DetailOpportunityCard));

const DetailOpportunityCardConnected = connect(null, mapDispatchToProps)(DetailOpportunityCardCon);
export default DetailOpportunityCardConnected;
