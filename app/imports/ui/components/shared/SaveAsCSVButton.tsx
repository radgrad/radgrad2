import * as React from 'react';
import { Button, Message, Header } from 'semantic-ui-react';
import * as _ from 'lodash';
import { moment } from 'meteor/momentjs:moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { IAcademicTerm, ICourse } from '../../../typings/radgrad'; // eslint-disable-line
import { Courses } from '../../../api/course/CourseCollection';
import { CourseScoreboard, OpportunityScoreboard } from '../../../startup/client/collections';
import { databaseFileDateFormat } from '../../pages/admin/AdminDumpDatabasePage';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

interface ISaveAsCSVButtonProps {
  showMessage: boolean;
  scoreboardType: 'courses' | 'opportunity';
}

interface ISaveAsCSVButtonState {
  isSaving: boolean;
  results: string;
  successOrError: string;
}

class SaveAsCSVButton extends React.Component<ISaveAsCSVButtonProps, ISaveAsCSVButtonState> {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      results: '',
      successOrError: 'error',
    };
  }

  private handleSaveAsCSV = (event: any): void => {
    event.preventDefault();
    this.setState({ isSaving: true });
    const { scoreboardType } = this.props;
    if (scoreboardType === 'courses') {
      this.setCourseScoreboardResults();
    } else {
      this.setOpportunityScoreboardResults();
    }
    const zip = new ZipZap();
    const dir = `${scoreboardType}-scoreboard`;
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
    zip.file(fileName, this.state.results);
    zip.saveAs(`${dir}.zip`);
    this.setState({ isSaving: false });
  }

  private setCourseScoreboardResults = (): void => {
    const currentTerm: IAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const start = currentTerm.termNumber;
    const isQuarterSystem = RadGradSettings.findOne({}).quarterSystem;
    const limit = isQuarterSystem ? 12 : 9;
    const end = start + limit;
    const academicTerms = AcademicTerms.findNonRetired({ termNumber: { $gte: start, $lt: end } },
      { sort: { semesterNumber: 1 } });
    const courses = Courses.findNonRetired({ number: { $ne: 'other' } }, { sort: { number: 1 } });
    let results = '';
    const headerArr = ['Course'];
    _.forEach(academicTerms, (s) => {
      headerArr.push(AcademicTerms.getShortName(s._id));
    });
    results += headerArr.join(',');
    results += '\r\n';
    _.forEach(courses, (c: ICourse) => {
      results += `${c.num},`;
      _.forEach(academicTerms, (s: IAcademicTerm) => {
        const id = `${c._id} ${s._id}`;
        const scoreItem: any = CourseScoreboard.findOne({ _id: id });
        results += scoreItem ? `${scoreItem.count},` : '0,';
      });
      results += '\r\n';
    });
    this.setState({ results: results, successOrError: 'success' });
  }

  private setOpportunityScoreboardResults = (): void => {
    const currentTerm: IAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const start = currentTerm.termNumber;
    const end = start + 9;
    const academicTerms = AcademicTerms.findNonRetired({ semesterNumber: { $gte: start, $lt: end } },
      { sort: { semesterNumber: 1 } });
    const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    let results = '';
    const headerArr = ['Opportunity'];
    _.forEach(academicTerms, (s) => {
      headerArr.push(AcademicTerms.getShortName(s._id));
    });
    results += headerArr.join(',');
    results += '\r\n';
    _.forEach(opportunities, (c) => {
      results += `${c.name},`;
      _.forEach(academicTerms, (s) => {
        const id = `${c._id} ${s._id}`;
        const scoreItem: any = OpportunityScoreboard.findOne({ _id: id });
        results += scoreItem ? `${scoreItem.count},` : '0,';
      });
      results += '\r\n';
    });
    this.setState({ results: results, successOrError: 'success' });
  }

  private isHidden = (): boolean => {
    const results = this.state.results;
    return results === '';
  }

  private scoreboardHeader = (): string => {
    const { scoreboardType } = this.props;
    if (scoreboardType === 'courses') {
      return 'Course Scoreboard CSV';
    }
    return 'Opportunity Scoreboard CSV';
  }

  public errorMessage = (): string => {
    const successOrError = this.state.successOrError;
    return successOrError === 'error' ? this.state.results : '';
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { isSaving, results, successOrError } = this.state;
    const { showMessage } = this.props;
    const isHidden = this.isHidden();
    const isSuccessful = successOrError === 'success';
    return (
      <React.Fragment>
        <Button basic={true} green={true} loading={isSaving ? true : undefined} disabled={isSaving ? true : undefined}
                onClick={this.handleSaveAsCSV}>
          Save as CSV
        </Button>

        {
          showMessage &&
          <React.Fragment>
            <Message hidden={isHidden ? true : undefined} success={isSuccessful ? true : undefined}
                     error={isSuccessful ? undefined : true}>
              <Header>{this.scoreboardHeader()}</Header>
              <pre>{results}</pre>
            </Message>
            {this.errorMessage()}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default SaveAsCSVButton;
