import * as React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoFields from 'uniforms-semantic/AutoFields';
import SubmitField from 'uniforms-semantic/SubmitField';
import BaseCollection from '../../../api/base/BaseCollection';

interface IAdminDataModelUpdateFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class AdminDataModelUpdateForm extends React.Component<IAdminDataModelUpdateFormProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const model = this.props.id ? this.props.collection.findDoc(this.props.id) : undefined;
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm
          ref={this.props.formRef}
          schema={this.props.collection.getUpdateSchema()}
          model={model}
          onSubmit={this.props.handleUpdate}>
          <AutoFields/>
          <p/>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

export default AdminDataModelUpdateForm;
