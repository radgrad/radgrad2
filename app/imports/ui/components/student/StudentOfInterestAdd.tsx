import * as React from 'react';
import * as _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Menu, Popup } from 'semantic-ui-react';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IStudentOfInterestAddProps {
  item: any;
  type: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

// TODO: How to implement adding to plan with Academic Terms instead of semesters
class StudentOfInterestAdd extends React.Component<IStudentOfInterestAddProps> {
  constructor(props) {
    super(props);
  }

  private getUsername = () => this.props.match.params.username;

  private typeCourse = () => this.props.type === 'courses';

  private nextYears = (amount) => {
    const nextYears = [];
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    let currentYear = currentTerm.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  }

  // TODO: How to convert this into Academic Terms?
  private yearSemesters = (year) => [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];

  // FIXME: In the original radgrad code, in the HTML file the code call is "itemSemesters item" but the itemSemesters
  //        function does not take a parameter.
  private itemTerms = () => {
    let ret = [];
    if (this.typeCourse()) {
      // do nothing
    } else {
      ret = this.opportunityTerms(this.props.item);
    }
    return ret.slice(0, 8);
  }

  // This was originally in a ui/utilities/template-helpers.js (radgrad1) file called opportunitySemesters
  // Should move it to one if one is made - Gian.
  private opportunityTerms(opportunityInstance) {
    const academicTermIDs = opportunityInstance.semesterIDs;
    const upcomingAcademicTerms = _.filter(academicTermIDs, termID => AcademicTerms.isUpcomingTerm(termID));
    return _.map(upcomingAcademicTerms, termID => AcademicTerms.toString(termID));
  }

  private handleAddToPlan = (e) => {
    e.preventDefault();
    const semester = e.target.text;
    const { item } = this.props;
    const itemSlug = Slugs.findDoc({ _id: item.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = this.getUsername();
    if (this.typeCourse()) {
      const definitionData = {
        semester: semSlug,
        course: itemSlug,
        verified: false,
        note: item.number,
        grade: 'B',
        student: username,
      };
      defineMethod.call({ collectionName: 'CourseInstanceCollection', definitionData }, (error) => {
        if (error) {
          console.log('Error defining CourseInstance', error);
        }
      });
    } else {
      const definitionData = {
        semester: semSlug,
        opportunity: itemSlug.name,
        verified: false,
        student: username,
      };
      defineMethod.call({ collectionName: 'OpportunityInstanceCollection', definitionData }, (error) => {
        if (error) {
          console.log('Error defining CourseInstance', error);
        }
      });
    }
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const nextYears = this.nextYears(4);

    return (
      <React.Fragment>
        {
          this.typeCourse() ?
            <Popup trigger={
              <Button>
                <Icon name="plus"/><br/>Add to Plan
              </Button>
            }>
              {/* FIXME: the Popups are disappearing immediately */}
              {/* TODO: fluid popup transition hidden */}
              <Popup.Content>
                <Menu size="mini" secondary={true} vertical={true}>
                  {
                    nextYears.map((year, index) => (
                      <React.Fragment key={index}>
                        <Menu.Item as="a" className={`${this.props.item} chooseSemester`}>
                          {year}
                        </Menu.Item>
                        {/* TODO: fluid popup transition hidden */}
                        <Popup>
                          <Popup.Content>
                            <Menu size="mini" secondary={true} vertical={true}>
                              {
                                this.yearSemesters(year).map((semester) => (
                                  <Menu.Item as="a" className={`${this.props.item}`} key={index}>
                                    {semester}
                                  </Menu.Item>
                                ))
                              }
                            </Menu>
                          </Popup.Content>
                        </Popup>
                      </React.Fragment>
                    ))
                  }
                </Menu>
              </Popup.Content>
            </Popup>
            :
            <Popup trigger={
              <Button>
                <Icon name="plus"/><br/>Add to Plan
              </Button>
            }>
              {/* FIXME: the Popups are disappearing immediately */}
              {/* TODO: fluid popup transition hidden */}
              <Popup.Content position="right center">
                <Menu size="mini" secondary={true} vertical={true}>
                  {
                    this.itemTerms().map((term, index) => (
                      <Menu.Item key={index} as="a" className={`${this.props.item}`} onClick={this.handleAddToPlan}>
                        {term}
                      </Menu.Item>
                    ))
                  }
                </Menu>
              </Popup.Content>
            </Popup>
        }
      </React.Fragment>
    );
  }
}

export default withRouter(StudentOfInterestAdd);
