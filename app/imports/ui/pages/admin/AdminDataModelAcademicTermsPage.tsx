import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Bert } from 'meteor/themeteorchef:bert';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import {
  IAcademicTerm,
  IAcademicTermDefine,
  IAdminDataModelPageState,
  IDescriptionPair,
} from '../../../typings/radgrad';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import {
  setCollectionShowCount,
  setCollectionShowIndex,
} from '../../../redux/actions/paginationActions';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/AdminDataModelAddForm';
import UpdateAcademicTermWidget from '../../components/admin/UpdateAcademicTermWidget';

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

const itemTitle = (term: IAcademicTerm): React.ReactNode => {
  return (
    <React.Fragment>
      {term.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {AcademicTerms.toString(term._id, false)}
    </React.Fragment>
  );
};

const itemTitleString = (term) => {
  return AcademicTerms.toString(term._id, false);
};

class AdminDataModelAcademicTermsPage extends React.Component<{}, IAdminDataModelPageState> {
  private formRef;

  constructor(props) {
    super(props);
    this.handleOpenUpdate = this.handleOpenUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = { showUpdateForm: false, id: '' };
    this.formRef = React.createRef();
  }

  private handleOpenUpdate(evt, inst) {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleAdd(doc) {
    console.log('handleAdd(%o)', doc);
    const collectionName = AcademicTerms.getCollectionName();
    const definitionData: IAcademicTermDefine = doc;
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
      } else {
        Bert.alert({ type: 'success', message: 'Add succeeded' });
        this.formRef.current.reset();
      }
    });
  }

  private handleUpdate(doc) {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = AcademicTerms.getCollectionName();
    const updateData: { id?: string, retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Bert.alert({ type: 'danger', message: `Update failed: ${error.message}` });
        console.error('Error in updating AcademicTerm. %o', error);
      } else {
        Bert.alert({ type: 'success', message: 'Update succeeded' });
      }
      this.setState({ showUpdateForm: false, id: '' });
    });
  }

  private handleDelete(event, inst) {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    const collectionName = AcademicTerms.getCollectionName();
    const instance = inst.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Bert.alert({ type: 'danger', message: `Update failed: ${error.message}` });
        console.error('Error deleting AcademicTerm. %o', error);
      } else {
        Bert.alert({ type: 'success', message: 'Delete succeeded' });
      }
    });
  }

  private handleCancel(event) {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '' });
  }

  public render() {
    const paddedStyle = {
      paddingTop: 20,
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

export default AdminDataModelAcademicTermsPage;
