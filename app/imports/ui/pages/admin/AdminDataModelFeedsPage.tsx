import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
// import { Collection } from '../../../api/collection/Collection';
// import { ICollection, IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad';
// import { Slugs } from '../../../api/slug/SlugCollection'; // if needed.
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';  // this should be replaced by specific UpdateForm
import { IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Users } from '../../../api/user/UserCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AddFeedForm from '../../components/admin/AddFeedForm';

const collection = Feeds; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: any): IDescriptionPair[] => {
  const users = [];
  _.forEach(item.userIDs, (id) => {
    users.push(Users.getFullName(id));
  });
  let opportunityName = '';
  if (item.opportunityID) {
    opportunityName = Opportunities.findDoc(item.opportunityID).name;
  }
  let courseName = '';
  if (item.courseID) {
    const course = Courses.findDoc(item.courseID);
    courseName = `${course.number}: ${course.shortName}`;
  }
  let academicTerm = '';
  if (item.academicTermID) {
    academicTerm = AcademicTerms.toString(item.academicTermID);
  }
  return [
    { label: 'Feed Type', value: item.feedType },
    { label: 'Description', value: item.description },
    { label: 'Timestamp', value: item.timestamp.toString() },
    { label: 'Picture',
      value: `![${item.picture}](${item.picture})` },
    { label: 'Users', value: users.toString() },
    { label: 'Opportunity', value: opportunityName },
    { label: 'Course', value: courseName },
    { label: 'Academic Term', value: academicTerm },
    { label: 'Retired', value: item.retired ? 'True' : 'False' },
  ];
};

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: any): string => {
  return `${item.feedType} ${item.description}`;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: any): React.ReactNode => {
  return (
    <React.Fragment>
      {item.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {itemTitleString(item)}
    </React.Fragment>
  );
};

class AdminDataModelFeedsPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '' };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    console.log('Feeds.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = {}; // create the definitionData may need to modify doc's values
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
  }

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '' });
  }

  private handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    const collectionName = collection.getCollectionName();
    const instance = inst.id;
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
    });
  }

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate = (doc) => {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = {}; // create the updateData object from the doc.
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
  }

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
              <AdminDataModelUpdateForm collection={collection} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AddFeedForm formRef={this.formRef} handleAdd={this.handleAdd}/>
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
      </div>
    );
  }
}

export default AdminDataModelFeedsPage;
