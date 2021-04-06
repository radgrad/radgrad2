import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { OpportunityInstance, UserInteractionDefine, VerificationRequestDefine } from '../../../../typings/radgrad';
import { ButtonAction } from '../../shared/button/ButtonAction';
import AcademicTermLabel from '../../shared/label/AcademicTermLabel';
import { opportunityIdToName } from '../../shared/utilities/data-model';
import { getUsername } from '../../shared/utilities/router';

interface StudentUnverifiedOpportunityItemProps {
  opportunityInstance: OpportunityInstance;
}

const handleVerificationRequest = (instance, match) => (model) => {
  console.log(instance, match, model);
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

const StudentUnverifiedOpportunityItem: React.FC<StudentUnverifiedOpportunityItemProps> = ({ opportunityInstance }) => {
  const match = useRouteMatch();
  const term = AcademicTerms.findDoc(opportunityInstance.termID);
  const slug = Slugs.getNameFromID(term.slugID);
  const name = AcademicTerms.toString(opportunityInstance.termID, false);
  const opportunityName = opportunityIdToName(opportunityInstance.opportunityID);
  return (
    <Grid.Row columns='three'>
      <Grid.Column>
        <AcademicTermLabel slug={slug} name={name} />
      </Grid.Column>
      <Grid.Column floated='left'>
        <Header>{opportunityName}</Header>
      </Grid.Column>
      <Grid.Column>
        <ButtonAction onClick={handleVerificationRequest(opportunityInstance, match)} label='Request Verification' icon='hand point up outline' />
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentUnverifiedOpportunityItem;
