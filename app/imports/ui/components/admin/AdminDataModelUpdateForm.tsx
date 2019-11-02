import * as React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoFields from 'uniforms-semantic/AutoFields';
import SubmitField from 'uniforms-semantic/SubmitField';
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
    <Segment padded={true}>
      <Header dividing={true}>Update {props.collection.getType()}: {props.itemTitleString(model)}</Header>
      <AutoForm
        ref={props.formRef}
        schema={props.collection.getUpdateSchema()}
        model={model}
        onSubmit={props.handleUpdate}>
        <AutoFields/>
        <p/>
        <SubmitField/>
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default AdminDataModelUpdateForm;
