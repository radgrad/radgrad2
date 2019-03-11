import * as React from 'react';
import { Accordion, Icon, Button, Grid, Header, Segment, Tab } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import AdminDataModelAccordion from './AdminDataModelAccordion';

function numReferences(term) {
  let references = 0;
  [CourseInstances, OpportunityInstances].forEach((entity) => {
    _.forEach(entity.find().fetch(), (e) => {
      if (e.termID === term._id) {
        references++;
      }
    });
  });
  return references;
}

function descriptionPairs(term) {
  return [
    { label: 'Term', value: AcademicTerms.toString(term._id, false) },
    { label: 'Term Number', value: `${term.termNumber}` },
    { label: 'References', value: `${numReferences(term)}` },
    { label: 'Retired', value: term.retired ? 'True' : 'False' },
  ];
}

interface IListAcademicTermsWidgetProps {
  handleUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
}
class ListAcademicTermsWidget extends React.Component<IListAcademicTermsWidgetProps, {}> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactNode {
    const count = AcademicTerms.count();
    const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
    return (
      <Segment padded={true}>
        <Header dividing={true}>ACADEMIC TERMS ({count})</Header>
        {_.map(terms, (term) => (
          <AdminDataModelAccordion key={term._id} id={term._id} retired={term.retired}
                                   name={AcademicTerms.toString(term._id, false)}
                                   descriptionPairs={descriptionPairs(term)} updateDisabled={false}
                                   deleteDisabled={numReferences(term) > 0} handleUpdate={this.props.handleUpdate}
                                   handleDelete={this.props.handleDelete}/>
        ))}
      </Segment>
    );
  }
}

export default ListAcademicTermsWidget;
