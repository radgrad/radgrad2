import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { IDescriptionPair } from '../../../typings/radgrad'; // eslint-disable-line
import AdminCollectionAccordion from './AdminCollectionAccordion';
import AdminPaginationWidget from './AdminPaginationWidget';
import { dataModelActions } from '../../../redux/admin/data-model';

interface IListSlugCollectionWidgetProps {
  collection: BaseCollection;
  findOptions?: object;
  descriptionPairs: (item) => IDescriptionPair[];
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
  items: any[];
  itemTitle: (item) => React.ReactNode;
  dispatch: any;
  pagination: any;
}

const mapStateToProps = (state) => ({
    pagination: state.admin.dataModel.pagination,
  });

class ListSlugCollectionWidget extends React.Component<IListSlugCollectionWidgetProps, {}> {
  constructor(props) {
    super(props);
    // console.log('ListSlugCollectionWidget(%o)', props);
  }

  public render(): React.ReactNode {
    // console.log('ListSlugCollectionWidget.render props=%o', this.props);
    const count = this.props.collection.count();
    const startIndex = this.props.pagination[this.props.collection.getCollectionName()].showIndex;
    const showCount = this.props.pagination[this.props.collection.getCollectionName()].showCount;
    const endIndex = startIndex + showCount;
    const items = _.slice(this.props.items, startIndex, endIndex);
    // console.log('startIndex=%o endIndex=%o items=%o', startIndex, endIndex, items);
    return (
      <Segment padded={true}>
        <Header dividing={true}>{this.props.collection.getCollectionName()} ({count})</Header>
        <Grid>
          <AdminPaginationWidget collection={this.props.collection} setShowIndex={dataModelActions.setCollectionShowIndex}
                                 setShowCount={dataModelActions.setCollectionShowCount}/>
          {_.map(items, (item) => (
            <AdminCollectionAccordion key={item._id} id={item._id} title={this.props.itemTitle(item)}
                                      descriptionPairs={this.props.descriptionPairs(item)}
                                      updateDisabled={true}
                                      deleteDisabled={true}
                                      handleOpenUpdate={this.props.handleOpenUpdate}
                                      handleDelete={this.props.handleDelete}/>
          ))}
        </Grid>
      </Segment>
    );
  }
}

const ListSlugCollectionWidgetCon = connect(mapStateToProps)(ListSlugCollectionWidget);

const ListSlugCollectionWidgetContainer = withTracker((props) => {
  // console.log('ListSlugCollectionWidget withTracker props=%o', props);
  const items = props.collection.find({}, props.findOptions).fetch();
  // console.log('ListSlugCollectionWidget withTracker items=%o', items);
  return {
    items,
  };
})(ListSlugCollectionWidgetCon);
export default ListSlugCollectionWidgetContainer;
