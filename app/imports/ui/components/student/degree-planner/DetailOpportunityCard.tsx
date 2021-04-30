import React, { useEffect, useState } from 'react';
import { Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { getFutureEnrollmentSingleMethod } from '../../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../startup/both/RadGradForecasts';
import { ButtonAction } from '../../shared/button/ButtonAction';
import { ButtonLink } from '../../shared/button/ButtonLink';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import { OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';
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
  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: opportunity._id, type: ENROLLMENT_TYPE.OPPORTUNITY })
        .then((result) => setData(result))
        .catch((error) => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, opportunity._id]);
  let academicTerms = [];
  let scores = [];
  if (data?.enrollment) {
    academicTerms = data.enrollment.map((entry) => AcademicTerms.findDoc(entry.termID));
    scores = data.enrollment.map((entry) => entry.count);
  }

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
