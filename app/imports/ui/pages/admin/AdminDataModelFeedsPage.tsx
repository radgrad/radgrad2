import * as React from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { IAdminDataModelPageState, IDescriptionPair, IFeedDefine } from '../../../typings/radgrad'; // eslint-disable-line
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Users } from '../../../api/user/UserCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AddFeedForm from '../../components/admin/AddFeedForm';
import UpdateFeedForm from '../../components/admin/UpdateFeedForm';
import {
  academicTermNameToSlug,
  courseNameToSlug,
  opportunityNameToSlug,
  profileNameToUsername,
} from '../../components/shared/data-model-helper-functions';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import { ReduxTypes } from '../../../redux'; // eslint-disable-line

const collection = Feeds; // the collection to use.

interface IAdminDataModelFeedsPageProps {
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
}

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
    {
      label: 'Picture',
      value: `![${item.picture}](${item.picture})`,
    },
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
const itemTitleString = (item: any): string => `${item.feedType} ${item.description}`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: any): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

const mapStateToProps = (state: ReduxTypes.State): object => ({
  isCloudinaryUsed: state.shared.cloudinary.adminDataModelFeeds.isCloudinaryUsed,
  cloudinaryUrl: state.shared.cloudinary.adminDataModelFeeds.cloudinaryUrl,
});

class AdminDataModelFeedsPage extends React.Component<IAdminDataModelFeedsPageProps, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('Feeds.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData: IFeedDefine = doc; // create the definitionData may need to modify doc's values
    definitionData.feedType = doc.feedType;
    switch (doc.feedType) {
      case Feeds.NEW_USER:
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_COURSE:
        definitionData.course = courseNameToSlug(doc.course);
        break;
      case Feeds.NEW_COURSE_REVIEW:
        definitionData.course = courseNameToSlug(doc.course);
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_LEVEL:
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_OPPORTUNITY:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        break;
      case Feeds.NEW_OPPORTUNITY_REVIEW:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.VERIFIED_OPPORTUNITY:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        definitionData.user = profileNameToUsername(doc.user);
        definitionData.academicTerm = academicTermNameToSlug(doc.academicTerm);
        break;
      default:
        break;
    }
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.formRef.current.reset();
      }
    });
  }

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
  }

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
          icon: 'error',
        });
        console.error('Error deleting AcademicTerm. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
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
    const updateData: any = doc;
    updateData.id = doc._id;
    updateData.feedType = doc.feedType;
    updateData.users = doc.userIDs;
    updateData.opportunity = opportunityNameToSlug(doc.opportunity);
    const { isCloudinaryUsed, cloudinaryUrl } = this.props;
    if (isCloudinaryUsed) {
      updateData.picture = cloudinaryUrl;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
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
        <AdminPageMenuWidget />
        <Grid container stackable style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu />
          </Grid.Column>

          <Grid.Column width={13}>
            {this.state.showUpdateForm ? (
              <UpdateFeedForm
                collection={collection}
                id={this.state.id}
                formRef={this.formRef}
                handleUpdate={this.handleUpdate}
                handleCancel={this.handleCancel}
                itemTitleString={itemTitleString}
              />
            ) : (
              <AddFeedForm formRef={this.formRef} handleAdd={this.handleAdd} />
            )}
            <ListCollectionWidget
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
        <Confirm
          open={this.state.confirmOpen}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirmDelete}
          header="Delete Feed?"
        />

        <BackToTopButton />
      </div>
    );
  }
}

export default connect(mapStateToProps)(AdminDataModelFeedsPage);
