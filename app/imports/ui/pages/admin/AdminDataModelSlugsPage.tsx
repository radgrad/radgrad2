import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/datamodel-page/AdminDataModelMenu';
import ListSlugCollectionWidget from '../../components/admin/datamodel-page/ListSlugCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';

const collection = Slugs; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: any): IDescriptionPair[] => [
  { label: 'Name', value: `${item.name}` },
  { label: 'Entity Name', value: `${item.entityName}` },
  { label: 'Entity ID', value: `${item.entityID}` },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: any): string => `${item.name}: ${item.entityName}`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: any): React.ReactNode => (
  <React.Fragment>
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

class AdminDataModelSlugsPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('Reviews.handleAdd(%o)', doc);
    Swal.fire({
      title: 'Add failed',
      text: `Cannot add slugs. ${doc}`,
      icon: 'error',
    });
  };

  private handleCancel = (event) => {
    event.preventDefault();
  };

  private handleDelete = (event) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    Swal.fire({
      title: 'Delete failed',
      text: 'Cannot delete slugs.',
      icon: 'error',
    });
  };

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
  };

  private handleUpdate = (doc) => {
    // console.log('Reviews.handleUpdate doc=%o', doc);
    Swal.fire({
      title: 'Update failed',
      text: `Cannot add slugs. ${doc}`,
      icon: 'error',
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
      <div id="data-model-slugs-page">
        <AdminPageMenuWidget />
        <Grid container stackable style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu />
          </Grid.Column>

          <Grid.Column width={13}>
            <ListSlugCollectionWidget
              collection={collection}
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

        <BackToTopButton />
      </div>
    );
  }
}

export default AdminDataModelSlugsPage;
