import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import { IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad'; // eslint-disable-line
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import AddOpportunityInstanceForm from '../../components/admin/AddOpportunityInstanceForm';
import UpdateOpportunityInstanceForm from '../../components/admin/UpdateOpportunityInstanceForm';
import {
  academicTermNameToDoc,
  opportunityNameToSlug,
  profileNameToUsername,
} from '../../components/shared/AdminDataModelHelperFunctions';
import { Slugs } from '../../../api/slug/SlugCollection';

const collection = OpportunityInstances; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: any): IDescriptionPair[] => [
  { label: 'Academic Term', value: AcademicTerms.toString(item.termID) },
  { label: 'Opportunity', value: (Opportunities.findDoc(item.opportunityID)).name },
  { label: 'Verified', value: item.verified.toString() },
  { label: 'Student', value: Users.getFullName(item.studentID) },
  {
    label: 'ICE', value: `${item.ice.i}, ${item.ice.c}, 
        ${item.ice.e}`,
  },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: any): string => {
  const oppName = Opportunities.findDoc(item.opportunityID).name;
  const username = Users.getProfile(item.studentID).username;
  const semester = AcademicTerms.toString(item.termID, true);
  return `${username}-${oppName}-${semester}`;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: any): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash"/> : ''}
    <Icon name="dropdown"/>
    {itemTitleString(item)}
  </React.Fragment>
);

class AdminDataModelOpportunityInstancesPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '' };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('OpportunityInstances.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    const academicTermDoc = academicTermNameToDoc(doc.term);
    const academicTerm = Slugs.getNameFromID(academicTermDoc.slugID);
    const opportunity = opportunityNameToSlug(doc.opportunity);
    const student = profileNameToUsername(doc.student);
    const sponsor = profileNameToUsername(doc.sponsor);
    definitionData.academicTerm = academicTerm;
    definitionData.opportunity = opportunity;
    definitionData.sponsor = sponsor;
    definitionData.student = student;
    if (_.isBoolean(doc.verified)) {
      definitionData.verifed = doc.verifed;
    }
    if (_.isBoolean(doc.retired)) {
      definitionData.retired = doc.retired;
    }
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
  };

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '' });
  };

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
        console.error('Error deleting. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  };

  private handleUpdate = (doc) => {
    // console.log('OpportunityInstances.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.termID = academicTermNameToDoc(doc.academicTerm)._id;
    // console.log(collectionName, updateData);
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
  };

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
              <UpdateOpportunityInstanceForm collection={collection} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AddOpportunityInstanceForm formRef={this.formRef} handleAdd={this.handleAdd}/>
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

export default AdminDataModelOpportunityInstancesPage;
