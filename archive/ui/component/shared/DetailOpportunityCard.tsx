import React from 'react';
import { Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { DegreePlannerStateNames } from '../../../../app/imports/ui/pages/student/StudentDegreePlannerPage';
import { useStickyState } from '../../../../app/imports/ui/utilities/StickyState';
import { ButtonAction } from '../../../../app/imports/ui/components/shared/button/ButtonAction';
import { ButtonLink } from '../../../../app/imports/ui/components/shared/button/ButtonLink';
import { ViewInExplorerButtonLink } from '../../../../app/imports/ui/components/shared/button/ViewInExplorerButtonLink';
import { OpportunityInstance, VerificationRequest } from '../../../../app/imports/typings/radgrad';
import { AcademicTerms } from '../../../../app/imports/api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../../app/imports/api/opportunity/OpportunityCollection';
import FutureParticipationButton from '../../../../app/imports/ui/components/shared/FutureParticipationButton';
import IceHeader from '../../../../app/imports/ui/components/shared/IceHeader';
import { removeItMethod } from '../../../../app/imports/api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../../app/imports/api/opportunity/OpportunityInstanceCollection';
import { EXPLORER_TYPE } from '../../../../app/imports/ui/layouts/utilities/route-constants';
import { TabbedProfileEntryNames } from '../../../../app/imports/ui/components/student/degree-planner/TabbedProfileEntries';
import { cardStyle, contentStyle } from '../../../../app/imports/ui/components/student/degree-planner/utilities/styles';
import VerificationRequestStatus from '../../../../app/imports/ui/components/student/degree-planner/VerificationRequestStatus';
import * as RouterUtils from '../../../../app/imports/ui/components/shared/utilities/router';
import RadGradAlert from '../../../../app/imports/ui/utilities/RadGradAlert';

interface DetailOpportunityCardProps {
  instance: OpportunityInstance;
  verificationRequests: VerificationRequest[];
}

const DetailOpportunityCard: React.FC<DetailOpportunityCardProps> = ({ instance, verificationRequests }) => {
  const [, setSelectedCiID] = useStickyState(DegreePlannerStateNames.selectedCiID, '');
  const [, setSelectedOiID] = useStickyState(DegreePlannerStateNames.selectedOiID, '');
  const [, setSelectedProfileTab] = useStickyState(DegreePlannerStateNames.selectedProfileTab, '');
  const verificationRequestsToShow = verificationRequests.filter((vr) => vr.opportunityInstanceID === instance._id);
  const match = useRouteMatch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const opportunityTerm = AcademicTerms.findDoc(instance.termID);
  const futureP = opportunityTerm.termNumber >= currentTerm.termNumber;
  const verificationRequested = verificationRequestsToShow.length > 0;
  const termName = AcademicTerms.getShortName(instance.termID);
  const opportunity = Opportunities.findDoc(instance.opportunityID);

  const handleRemove = () => {
    const collectionName = OpportunityInstances.getCollectionName();
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => {
        RadGradAlert.success('Remove succeeded');
        setSelectedCiID('');
        setSelectedOiID('');
        setSelectedProfileTab(TabbedProfileEntryNames.profileOpportunities);
      })
      .catch((error) => console.error(`Remove opportunity instance ${instance} failed.`, error));
  };

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
              <FutureParticipationButton item={opportunity} />
              <ButtonAction onClick={handleRemove} icon="trash alternate outline" label="Remove" style={cardStyle} size="small" />
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
                  <ButtonAction onClick={handleRemove} icon="trash alternate outline" label="Remove" style={cardStyle} size="small" />
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
