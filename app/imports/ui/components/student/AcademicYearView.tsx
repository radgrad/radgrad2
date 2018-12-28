import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid } from 'semantic-ui-react';
import { IAcademicYear } from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AcademicTermViewContainer from './AcademicTermView';

interface IAcademicYearViewProps {
  academicYear: IAcademicYear;
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
}

class AcademicYearView extends React.Component<IAcademicYearViewProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const termIDs = this.props.academicYear.termIDs;
    const terms = _.map(termIDs, (id) => AcademicTerms.findDoc(id));
    return (
      <Grid.Column stretched={true}>
        {_.map(terms, (term) => (
          <AcademicTermViewContainer key={term._id} term={term} studentID={this.props.studentID}
                            handleClickCourseInstance={this.props.handleClickCourseInstance}
                            handleClickOpportunityInstance={this.props.handleClickOpportunityInstance}/>
        ))}
      </Grid.Column>
    );
  }
}

export default AcademicYearView;
