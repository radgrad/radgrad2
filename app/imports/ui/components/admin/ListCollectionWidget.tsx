import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import BaseCollection from '../../../api/base/BaseCollection';
import { IDescriptionPair } from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AdminCollectionAccordion from './AdminCollectionAccordion';

interface IListCollectionWidgetProps {
  collection: BaseCollection;
  deleteDisabled: (item) => boolean;
  descriptionPairs: (item) => IDescriptionPair[];
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
  items: any[];
  itemTitle: (item) => React.ReactNode;
  updateDisabled: (item) => boolean;
}

class ListCollectionWidget extends React.Component<IListCollectionWidgetProps, {}> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactNode {
    const count = this.props.collection.count();
    return (
      <Segment padded={true}>
        <Header dividing={true}>{this.props.collection.getCollectionName()} ({count})</Header>
        {_.map(this.props.items, (item) => (
          <AdminCollectionAccordion key={item._id} id={item._id} title={this.props.itemTitle(item)}
                                    descriptionPairs={this.props.descriptionPairs(item)}
                                    updateDisabled={this.props.updateDisabled(item)}
                                    deleteDisabled={this.props.deleteDisabled(item)}
                                    handleOpenUpdate={this.props.handleOpenUpdate}
                                    handleDelete={this.props.handleDelete}/>
        ))}
      </Segment>
    );
  }
}

const ListCollectionWidgetContainer = withTracker((props) => {
  return {
    items: props.collection.find().fetch(),
  };
})(ListCollectionWidget);
export default ListCollectionWidgetContainer;
