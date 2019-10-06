import * as React from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { IAdminDataModelPageState, IDescriptionPair, ITeaser } from '../../../typings/radgrad'; // eslint-disable-line
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { makeYoutubeLink } from './datamodel-utilities';
import AddTeaserForm from '../../components/admin/AddTeaserForm';
import UpdateTeaserForm from '../../components/admin/UpdateTeasersForm';
import {
  docToSlugName,
  interestNameToSlug,
  slugNameAndTypeToName,
} from '../../components/shared/AdminDataModelHelperFunctions';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { Slugs } from '../../../api/slug/SlugCollection';

const collection = Teasers; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: ITeaser): IDescriptionPair[] => [
  { label: 'Description', value: item.description },
  { label: 'Author', value: item.author },
  { label: 'Duration', value: item.duration },
  { label: 'Interests', value: _.sortBy(Interests.findNames(item.interestIDs)) },
  { label: 'Youtube ID', value: makeYoutubeLink(item.url) },
  { label: 'Target Slug', value: Slugs.findDoc(item.targetSlugID).name },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: ITeaser): string => {
  const slugName = docToSlugName(item);
  const title = `${item.title} (${slugName})`;
  return title;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: ITeaser): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash"/> : ''}
    <Icon name="dropdown"/>
    {itemTitleString(item)}
  </React.Fragment>
);

class AdminDataModelTeasersPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('Teasers.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    definitionData.interests = _.map(doc.interests, interestNameToSlug);
    definitionData.targetSlug = slugNameAndTypeToName(doc.targetSlug);
    definitionData.url = doc.youtubeID;
    // definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
    // console.log(collectionName, definitionData);
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
        console.error('Error deleting. %o', error);
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
    // console.log('Teasers.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.interests = _.map(doc.interests, interestNameToSlug);
    updateData.targetSlug = slugNameAndTypeToName(doc.targetSlug);
    // console.log(collectionName, updateData);
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
        this.setState({ showUpdateForm: false, id: '' });
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
              <UpdateTeaserForm collection={collection} id={this.state.id} formRef={this.formRef}
                                handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                itemTitleString={itemTitleString}/>
            ) : (
              <AddTeaserForm formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}
            <ListCollectionWidget collection={collection}
                                  findOptions={findOptions}
                                  descriptionPairs={descriptionPairs}
                                  itemTitle={itemTitle}
                                  handleOpenUpdate={this.handleOpenUpdate}
                                  handleDelete={this.handleDelete}
                                  setShowIndex={dataModelActions.setCollectionShowIndex}
                                  setShowCount={dataModelActions.setCollectionShowCount}
            />
          </Grid.Column>
        </Grid>
        <Confirm open={this.state.confirmOpen} onCancel={this.handleCancel} onConfirm={this.handleConfirmDelete} header="Delete Teaser?"/>

        <BackToTopButton/>
      </div>
    );
  }
}

export default AdminDataModelTeasersPage;
