import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, AutoFields, SubmitField } from 'uniforms-semantic';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line

interface IAdminDataModelUpdateFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const AdminDataModelUpdateForm = (props: IAdminDataModelUpdateFormProps) => {
  const model = props.id ? props.collection.findDoc(props.id) : undefined;
  return (
    <Segment padded>
      <Header dividing>
Update
        {props.collection.getType()}
:
        {props.itemTitleString(model)}
      </Header>
      <AutoForm
        ref={props.formRef}
        schema={props.collection.getUpdateSchema()}
        model={model}
        onSubmit={props.handleUpdate}
      >
        <AutoFields autoField={undefined} element={undefined} fields={undefined} omitFields={undefined} />
        <p />
        <SubmitField className="" inputRef={undefined} disabled={false} value={undefined} />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default AdminDataModelUpdateForm;
