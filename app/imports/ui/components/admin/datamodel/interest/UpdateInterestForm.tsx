import React from 'react';
import _ from 'lodash';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';
import { Slugs } from '../../../../../api/slug/SlugCollection';
import { docToName } from '../../../shared/utilities/data-model';
import { IInterestType } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';

interface IUpdateInterestFormProps {
  interestTypes: IInterestType[];
  collection: BaseCollection;
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateInterestForm: React.FC<IUpdateInterestFormProps> = ({ interestTypes, collection, id, formRef, handleCancel, handleUpdate, itemTitleString }) => {
  const interestTypeNames = _.map(interestTypes, docToName);
  const model = collection.findDoc(id);
  model.slug = Slugs.getNameFromID(model.slugID);
  model.interestType = InterestTypes.findDoc(model.interestTypeID).name;
  const schema = new SimpleSchema({
    name: { type: String, optional: true },
    slug: { type: String, optional: true },
    interestType: {
      type: String,
      allowedValues: interestTypeNames,
      defaultValue: interestTypeNames[0],
      optional: true,
    },
    description: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {collection.getType()}
        :
        {itemTitleString(model)}
      </Header>
      <AutoForm
        schema={formSchema}
        onSubmit={handleUpdate}
        ref={formRef}
        showInlineError
        model={model}
      >
        <Form.Group widths="equal">
          <TextField name="slug" disabled />
          <TextField name="name" />
          <SelectField name="interestType" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateInterestForm;
