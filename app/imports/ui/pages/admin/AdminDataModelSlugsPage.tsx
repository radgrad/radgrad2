import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import ListSlugCollectionWidget from '../../components/admin/datamodel/ListSlugCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { DescriptionPair, Slug } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getDatamodelCount } from './utilities/datamodel';
import PageLayout from '../PageLayout';

const collection = Slugs; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Slug): DescriptionPair[] => [
  { label: 'Name', value: `${item.name}` },
  { label: 'Entity Name', value: `${item.entityName}` },
  { label: 'Entity ID', value: `${item.entityID}` },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: Slug): string => `${item.name}: ${item.entityName}`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: Slug): React.ReactNode => (
  <React.Fragment>
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelSlugsPageProps {
  items: Slug[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelSlugsPage: React.FC<AdminDataModelSlugsPageProps> = (props) => {
  const handleDelete = (event) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    Swal.fire({
      title: 'Delete failed',
      text: 'Cannot delete slugs.',
      icon: 'error',
    });
  };

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
  };

  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <PageLayout id="data-model-slugs-page" headerPaneTitle="Slugs">
      <ListSlugCollectionWidget
        collection={collection}
        findOptions={findOptions}
        descriptionPairs={descriptionPairs}
        itemTitle={itemTitle}
        handleOpenUpdate={handleOpenUpdate}
        handleDelete={handleDelete}
        setShowIndex={dataModelActions.setCollectionShowIndex}
        setShowCount={dataModelActions.setCollectionShowCount}
        items={props.items}
      />
    </PageLayout>
  );
};

const AdminDataModelSlugsPageContainer = withTracker(() => {
  const items = Slugs.find({}).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
  };
})(AdminDataModelSlugsPage);

export default AdminDataModelSlugsPageContainer;
