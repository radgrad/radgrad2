import * as React from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad'; // eslint-disable-line
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AddHelpMessageForm from '../../components/admin/AddHelpMessageForm';
import UpdateHelpMessageForm from '../../components/admin/UpdateHelpMessageForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { setCollectionShowIndex, setCollectionShowCount } from '../../../redux/admin/data-model/actions';

const collection = HelpMessages; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: any): IDescriptionPair[] => [
  { label: 'Route Name', value: item.routeName },
  { label: 'Title', value: item.title },
  { label: 'Text', value: item.text },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: any): string => `${item.routeName}`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: any): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash"/> : ''}
    <Icon name="dropdown"/>
    {itemTitleString(item)}
  </React.Fragment>
);

class AdminDataModelHelpMessagesPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('HelpMessages.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc; // create the definitionData may need to modify doc's values
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.formRef.current.reset();
      }
    });
  };

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
  };

  private handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    this.setState({ confirmOpen: true, id: inst.id });
  }

  private handleConfirmDelete = () => {
    // console.log('AcademicTerm.handleConfirmDelete state=%o', this.state);
    const collectionName = collection.getCollectionName();
    const instance = this.state.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error deleting AcademicTerm. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
    });
  };

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  };

  private handleUpdate = (doc) => {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc;
    updateData.id = doc._id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        // TODO: Uncomment this after done with issue-113
        // this.setState({ showUpdateForm: false, id: '' });
      }
    });
  };

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const paddedStyle = {
      paddingTop: 20,
    };
    const findOptions = {
      sort: { name: 1 }, // determine how you want to sort the items in the list
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={13}>
            {this.state.showUpdateForm ? (
              <UpdateHelpMessageForm collection={collection} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AddHelpMessageForm formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}
            <ListCollectionWidget collection={collection}
                                  findOptions={findOptions}
                                  descriptionPairs={descriptionPairs}
                                  itemTitle={itemTitle}
                                  handleOpenUpdate={this.handleOpenUpdate}
                                  handleDelete={this.handleDelete}
                                  setShowIndex={setCollectionShowIndex}
                                  setShowCount={setCollectionShowCount}
            />
          </Grid.Column>
        </Grid>
        <Confirm open={this.state.confirmOpen} onCancel={this.handleCancel} onConfirm={this.handleConfirmDelete} header="Delete Help Message?"/>

        <BackToTopButton/>
      </div>
    );
  }
}

export default AdminDataModelHelpMessagesPage;
