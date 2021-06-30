import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Icon } from 'semantic-ui-react';
import RadGradAlert from '../../utilities/RadGradAlert';
import ListSlugCollectionWidget from '../../components/admin/datamodel/ListSlugCollectionWidget';
import { DescriptionPair, Slug } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import { PAGEIDS } from '../../utilities/PageIDs';
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

const AdminDataModelSlugsPage: React.FC<AdminDataModelSlugsPageProps> = ({ items }) => {
  const handleDelete = (event) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    RadGradAlert.failure('Delete Failed', 'Cannot delete slugs');
  };

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
  };

  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_SLUGS} headerPaneTitle="Slugs">
      <ListSlugCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
    </PageLayout>
  );
};

export default withTracker(() => {
  const items = Slugs.find({}, { sort: { entityName: 1 } }).fetch();
  return {
    items,
  };
})(AdminDataModelSlugsPage);
