import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import UpdateAcademicTermWidget from '../../components/admin/UpdateAcademicTermWidget';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { IAcademicTerm, IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import {
  setCollectionShowCount,
  setCollectionShowIndex,
} from '../../../redux/actions/paginationActions';

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

class AdminDataModelAcademicTermsPage extends React.Component<{}, IAdminDataModelPageState> {
  constructor(props) {
    super(props);
    this.handleOpenUpdate = this.handleOpenUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = { showUpdateForm: false, id: '' };
  }

  private handleOpenUpdate(evt, inst) {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
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
        console.error('Error in updating AcademicTerm. %o', error);
      }
      this.setState({ showUpdateForm: false, id: '' });
    });
  }

  private handleDelete(event, inst) {
    event.preventDefault();
    console.log('handleDelete inst=%o', inst);
    const collectionName = AcademicTerms.getCollectionName();
    const instance = inst.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.error('Error deleting AcademicTerm. %o', error);
      }
    });
  }

  private handleCancel(event, instance) {
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

          <Grid.Column width={4}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={12}>
            {this.state.showUpdateForm ? (<UpdateAcademicTermWidget model={AcademicTerms.findDoc(this.state.id)}
                                                                    handleCancel={this.handleCancel}
                                                                    handleUpdate={this.handleUpdate}/>) : ''}
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
