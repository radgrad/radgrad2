import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BaseCollection from '../../../api/base/BaseCollection';

interface IAdminDataModelAddFormProps {
  collection: BaseCollection;
  formRef: any;
  handleAdd: (doc) => any;
}

class AdminDataModelAddForm extends React.Component<IAdminDataModelAddFormProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add {this.props.collection.getType()}</Header>
        <AutoForm
        ref={this.props.formRef}
        onSubmit={this.props.handleAdd}
        schema={this.props.collection.getDefineSchema()}/>
      </Segment>
    );
  }
}

export default AdminDataModelAddForm;
