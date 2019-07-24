import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line no-unused-vars
import { IDescriptionPair } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import AdminPaginationWidget from './AdminPaginationWidget';
import { Users } from '../../../api/user/UserCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import AdminDataModelAccordion from './AdminDataModelAccordion';
import { setCollectionShowIndex, setCollectionShowCount } from '../../../redux/admin/data-model/actions';

interface IListOpportunitiesWidgetProps {
  collection: BaseCollection;
  findOptions?: object;
  descriptionPairs: (item) => IDescriptionPair[];
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
  items: any[];
  itemTitle: (item) => React.ReactNode;
  dispatch: any;
  pagination: any;
  match: {
    params: {
      username: string;
    };
  };
}

const mapStateToProps = (state) => ({
  pagination: state.admin.dataModel.pagination,
});

class ListOpportunitiesWidget extends React.Component<IListOpportunitiesWidgetProps, {}> {
  constructor(props) {
    super(props);
    // console.log('ListOpportunitiesWidget(%o)', props);
  }

  private getUserIdFromRoute() {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  private count() {
    return Opportunities.find({ sponsorID: { $ne: this.getUserIdFromRoute() } }).count();
  }

  private isInRole() {
    const userID = this.getUserIdFromRoute();
    return Roles.userIsInRole(userID, [ROLE.FACULTY]);
  }

  facultyOpportunities() {
    // console.log('stuff ', Opportunities.find({ sponsorID: this.getUserIdFromRoute() }, { sort: { name: 1 } }).fetch());
    return Opportunities.find({ sponsorID: this.getUserIdFromRoute() }, { sort: { name: 1 } }).fetch();
  }

  private facultyCount() {
    return Opportunities.find({ sponsorID: this.getUserIdFromRoute() }).count();
  }

  private titleICE(opportunity) {
    return ` (ICE: ${opportunity.ice.i}/${opportunity.ice.c}/${opportunity.ice.e})`;
  }

  private retired(opportunity) {
    return opportunity.retired;
  }

  private slugName(slugID) {
    return ` (${Slugs.findDoc(slugID).name})`;
  }

  public render(): React.ReactNode {
    // console.log('ListOpportunitiesWidget.render props=%o', this.props);
    const count = this.count();
    const facultyCounter = this.facultyCount();
    const startIndex = this.props.pagination[this.props.collection.getCollectionName()].showIndex;
    const showCount = this.props.pagination[this.props.collection.getCollectionName()].showCount;
    const endIndex = startIndex + showCount;
    const items = _.slice(this.props.items, startIndex, endIndex);
    const factoryOpp = this.facultyOpportunities();
    // console.log('startIndex=%o endIndex=%o items=%o', startIndex, endIndex, items);
    return (
      <Segment padded={true}>
        {
          this.isInRole() ?
            <div>
              <Header dividing={true}> YOUR OPPORTUNITIES ({facultyCounter}) </Header>
              {_.map(factoryOpp, (item) => (
                <AdminDataModelAccordion key={item._id} id={item._id} retired={this.retired(item)} name={item.name}
                                         slug={this.slugName(item.slugID)}
                                         descriptionPairs={this.props.descriptionPairs(item)}
                                         updateDisabled={false}
                                         deleteDisabled={false}
                                         handleOpenUpdate={this.props.handleOpenUpdate}
                                         handleDelete={this.props.handleDelete}
                                         additionalTitleInfo={this.titleICE(item)}/>
              ))}
              <Header dividing={true}> ALL OTHER OPPORTUNITIES ({count})</Header> <br/>
            </div>
            : <Header dividing={true}>OPPORTUNITIES ({count})</Header>
        }

        <Grid>
          <AdminPaginationWidget collection={this.props.collection} setShowIndex={setCollectionShowIndex}
                                 setShowCount={setCollectionShowCount}/>
          {_.map(items, (item) => (
            <AdminDataModelAccordion key={item._id} id={item._id} retired={this.retired(item)} name={item.name}
                                     slug={this.slugName(item.slugID)}
                                     descriptionPairs={this.props.descriptionPairs(item)}
                                     updateDisabled={true}
                                     deleteDisabled={true}
                                     handleOpenUpdate={this.props.handleOpenUpdate}
                                     handleDelete={this.props.handleDelete}
                                     additionalTitleInfo={this.titleICE(item)}/>
          ))}
        </Grid>
      </Segment>
    );
  }
}

const ListOpportunitiesWidgetCon = connect(mapStateToProps)(ListOpportunitiesWidget);

const ListOpportunitiesWidgetContainer = withTracker((props) => {
  // console.log('ListOpportunitiesWidget withTracker props=%o', props);
  const items = props.collection.find({}, props.findOptions).fetch();
  // console.log('ListOpportunitiesWidget withTracker items=%o', items);
  return {
    items,
  };
})(ListOpportunitiesWidgetCon);
export default withRouter(ListOpportunitiesWidgetContainer);
