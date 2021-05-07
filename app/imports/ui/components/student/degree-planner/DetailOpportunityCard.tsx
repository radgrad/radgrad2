import React, { useEffect, useState } from 'react';
import { Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getFutureEnrollmentSingleMethod } from '../../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../startup/both/RadGradForecasts';
import { useStickyState } from '../../../utilities/StickyState';
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
import * as RouterUtils from '../../shared/utilities/router';

interface DetailOpportunityCardProps {
  instance: OpportunityInstance;
  verificationRequests: VerificationRequest[];
}

const DetailOpportunityCard: React.FC<DetailOpportunityCardProps> = ({ instance, verificationRequests }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedOpportunity, setSelectedOpportunity] = useStickyState('Planner.selectedOpportunity', '');
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

  const handleRemove =  (event, { value }) => {
    event.preventDefault();
    const collectionName = OpportunityInstances.getCollectionName();
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
    setSelectedOpportunity('');
  };

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
              <FutureParticipation academicTerms={academicTerms} scores={scores} narrow />
              {/* @ts-ignore */}
              <ButtonAction value={instance._id} onClick={handleRemove}
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
                  <ButtonAction value={instance._id} onClick={handleRemove}
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

export default DetailOpportunityCard;
