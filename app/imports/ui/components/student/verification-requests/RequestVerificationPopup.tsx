import React from 'react';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { Popup, SemanticSIZES } from 'semantic-ui-react';
import { AutoForm, SubmitField, TextField } from 'uniforms-semantic';
import { useRouteMatch } from 'react-router-dom';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { OpportunityInstance, VerificationRequestDefine } from '../../../../typings/radgrad';
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
  defineMethod.callPromise({ collectionName, definitionData })
    .catch((error) => {
      console.error(`Verification Request define ${definitionData} failed.`);
    })
    .then(() => { RadGradAlert.success('Verification request sent.');});
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
        <ButtonAction onClick={() => true} label='Request Verification' icon='hand point up outline' size={size} id={COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_BUTTON} />
      }
      content={<AutoForm schema={formSchema} onSubmit={handleVerificationRequest(opportunityInstance, match)} ><TextField name='documentation' id={COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_INPUT} /><SubmitField id={COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_SUBMIT} /></AutoForm>}
      on='click'
      header='Describe how you participated'
    />
  );
};

export default RequestVerificationPopup;
