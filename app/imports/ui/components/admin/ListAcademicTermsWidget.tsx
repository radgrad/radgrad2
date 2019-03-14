import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import AdminDataModelAccordion from './AdminDataModelAccordion';
import { IAcademicTerm, IDescriptionPair } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

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

interface IListAcademicTermsWidgetProps {
  terms: IAcademicTerm[];
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
}

class ListAcademicTermsWidget extends React.Component<IListAcademicTermsWidgetProps, {}> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactNode {
    const count = this.props.terms.length;
    const terms = this.props.terms;
    return (
      <Segment padded={true}>
        <Header dividing={true}>ACADEMIC TERMS ({count})</Header>
        {_.map(terms, (term) => (
          <AdminDataModelAccordion key={term._id} id={term._id} retired={term.retired}
                                   name={AcademicTerms.toString(term._id, false)}
                                   descriptionPairs={descriptionPairs(term)} updateDisabled={false}
                                   deleteDisabled={true} handleOpenUpdate={this.props.handleOpenUpdate}
                                   handleDelete={this.props.handleDelete}/>
        ))}
      </Segment>
    );
  }
}

const ListAcademicTermsWidgetContainer = withTracker((props) => {
  return {
    terms: AcademicTerms.find().fetch(),
  };
})(ListAcademicTermsWidget);

export default ListAcademicTermsWidgetContainer;
