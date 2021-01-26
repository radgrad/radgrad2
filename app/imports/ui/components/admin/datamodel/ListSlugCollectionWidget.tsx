import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import BaseCollection from '../../../../api/base/BaseCollection';
import { DescriptionPair } from '../../../../typings/radgrad';
import AdminCollectionAccordion from './AdminCollectionAccordion';
import AdminPaginationWidget from './AdminPaginationWidget';
import { dataModelActions } from '../../../../redux/admin/data-model';
import { RootState } from '../../../../redux/types';

interface ListSlugCollectionWidgetProps {
  collection: BaseCollection;
  findOptions?: { [key: string]: unknown };
  descriptionPairs: (item) => DescriptionPair[];
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
  items: any[];
  itemTitle: (item) => React.ReactNode;
  pagination: any;
}

const mapStateToProps = (state: RootState) => ({
  pagination: state.admin.dataModel.pagination,
});

const ListSlugCollectionWidget: React.FC<ListSlugCollectionWidgetProps> = ({ collection, findOptions, descriptionPairs, handleDelete, handleOpenUpdate, items, itemTitle, pagination }) => {
  // console.log('ListSlugCollectionWidget.render props=%o', props);
  const count = collection.count();
  const startIndex = pagination[collection.getCollectionName()].showIndex;
  const showCount = pagination[collection.getCollectionName()].showCount;
  const endIndex = startIndex + showCount;
  const itemsToShow = _.slice(items, startIndex, endIndex);
  // console.log('startIndex=%o endIndex=%o items=%o', startIndex, endIndex, items);
  return (
    <Segment padded>
      <Header dividing>
        {collection.getCollectionName()} ({count})
      </Header>
      <Grid>
        <AdminPaginationWidget collection={collection} setShowIndex={dataModelActions.setCollectionShowIndex} setShowCount={dataModelActions.setCollectionShowCount} />
        {_.map(itemsToShow, (item) => (
          <AdminCollectionAccordion key={item._id} id={item._id} title={itemTitle(item)} descriptionPairs={descriptionPairs(item)} updateDisabled deleteDisabled handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} />
        ))}
      </Grid>
    </Segment>
  );
};

const ListSlugCollectionWidgetCon = connect(mapStateToProps)(ListSlugCollectionWidget);
export default ListSlugCollectionWidgetCon;
