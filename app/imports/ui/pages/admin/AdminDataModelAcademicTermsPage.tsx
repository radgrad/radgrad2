import * as React from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import {
  IAcademicTerm, // eslint-disable-line
  IAcademicTermDefine, // eslint-disable-line
  IAdminDataModelPageState, // eslint-disable-line
  IDescriptionPair, // eslint-disable-line
} from '../../../typings/radgrad';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/AdminDataModelAddForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { setCollectionShowIndex, setCollectionShowCount } from '../../../redux/admin/data-model/actions';

function numReferences(term) {
  let references = 0;
  [CourseInstances, OpportunityInstances].forEach((entity) => {
    _.forEach(entity.find().fetch(), (e) => {
      if (e.termID === term._id) {
        references++;
      }
    });
  });
  _.forEach(Opportunities.find().fetch(), (e) => {
    if (_.includes(e.termIDs, term._id)) {
      references++;
    }
  });
  return references;
}

function descriptionPairs(term: IAcademicTerm): IDescriptionPair[] {
  return [
    { label: 'Term', value: AcademicTerms.toString(term._id, false) },
    { label: 'Term Number', value: `${term.termNumber}` },
    { label: 'References', value: `${numReferences(term)}` },
    { label: 'Retired', value: term.retired ? 'True' : 'False' },
  ];
}

const itemTitle = (term: IAcademicTerm): React.ReactNode => (
    <React.Fragment>
      {term.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {AcademicTerms.toString(term._id, false)}
    </React.Fragment>
  );

const itemTitleString = (term) => AcademicTerms.toString(term._id, false);

class AdminDataModelAcademicTermsPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = AcademicTerms.getCollectionName();
    const definitionData: IAcademicTermDefine = doc;
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
    this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
  }

  private handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    this.setState({ confirmOpen: true, id: inst.id });
  }

  private handleConfirmDelete = () => {
    // console.log('AcademicTerm.handleConfirmDelete state=%o', this.state);
    const collectionName = AcademicTerms.getCollectionName();
    const instance = this.state.id;
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
      this.setState({ confirmOpen: false, id: '' });
    });
  }

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate = (doc) => {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = AcademicTerms.getCollectionName();
    const updateData: { id?: string, retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating AcademicTerm. %o', error);
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

  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    const findOptions = {
      sort: { termNumber: 1 },
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
              <AdminDataModelUpdateForm collection={AcademicTerms} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AdminDataModelAddForm collection={AcademicTerms} formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}
            <ListCollectionWidget collection={AcademicTerms}
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
        <Confirm open={this.state.confirmOpen} onCancel={this.handleCancel} onConfirm={this.handleConfirmDelete} header="Delete Academic Term?"/>

        <BackToTopButton/>
      </div>
    );
  }
}

export default AdminDataModelAcademicTermsPage;
