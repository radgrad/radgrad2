import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import BaseCollection from '../../../../api/base/BaseCollection';
import { DescriptionPair } from '../../../../typings/radgrad';
import { useStickyState } from '../../../utilities/StickyState';
import AdminCollectionAccordion from './AdminCollectionAccordion';
import AdminPaginationWidget from './AdminPaginationWidget';

interface ListCollectionWidgetProps {
  collection: BaseCollection;
  descriptionPairs: (item) => DescriptionPair[];
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
  items: any[];
  itemTitle: (item) => React.ReactNode;
}

const ListCollectionWidget: React.FC<ListCollectionWidgetProps> = ({ collection, items, descriptionPairs, handleDelete, handleOpenUpdate, itemTitle }) => {

  const count = collection.count();
  const collectionName = collection.getCollectionName();
  const [startIndex] = useStickyState(`Pagination.${collectionName}.index`, 0);
  const [showCount] = useStickyState(`Pagination.${collectionName}.count`, 25);
  const endIndex = startIndex + showCount;
  const itemsToShow = _.slice(items, startIndex, endIndex);
  return (
    <Segment padded>
      <Header dividing>
        {collection.getCollectionName()}({count})
      </Header>
      <Grid>
        <AdminPaginationWidget collection={collection}  />
        {itemsToShow.map((item) => (
          <AdminCollectionAccordion
            key={item._id}
            id={item._id}
            title={itemTitle(item)}
            descriptionPairs={descriptionPairs(item)}
            updateDisabled={false}
            deleteDisabled={false}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
          />
        ))}
      </Grid>
    </Segment>
  );
};

export default ListCollectionWidget;
