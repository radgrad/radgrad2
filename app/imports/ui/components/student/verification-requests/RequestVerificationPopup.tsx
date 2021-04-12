import React from 'react';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { Popup, SemanticSIZES } from 'semantic-ui-react';
import { AutoForm } from 'uniforms-semantic';
import { useRouteMatch } from 'react-router-dom';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { OpportunityInstance, UserInteractionDefine, VerificationRequestDefine } from '../../../../typings/radgrad';
import { ButtonAction } from '../../shared/button/ButtonAction';
import { getUsername } from '../../shared/utilities/router';

interface RequestVerificationPopupProps {
  opportunityInstance: OpportunityInstance;
  size?: SemanticSIZES;
}

const handleVerificationRequest = (instance, match) => (model) => {
  // console.log(instance, match, model);
  const collectionName = VerificationRequests.getCollectionName();
  const username = getUsername(match);
  const opportunityInstance = instance._id;
  const documentation = model.documentation;
  const definitionData: VerificationRequestDefine = {
    student: username,
    opportunityInstance,
    documentation,
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

const RequestVerificationPopup: React.FC<RequestVerificationPopupProps> = ({ opportunityInstance, size = 'large' }) => {
  const schema = new SimpleSchema({
    documentation: String,
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const match = useRouteMatch();
  return (
    <Popup
      trigger={
        <ButtonAction onClick={() => true} label='Request Verification' icon='hand point up outline' size={size} />
      }
      content={<AutoForm schema={formSchema} onSubmit={handleVerificationRequest(opportunityInstance, match)} />}
      on='click'
      header='Describe how you participated'
    />
  );
};

export default RequestVerificationPopup;
