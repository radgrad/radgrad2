import * as React from 'react';
import * as _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Menu, Popup } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';

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
  profile: object;
  courseInstances: object[];
  opportunityInstances: object[];
  currentTerm: {
    year: number;
  }
}

class StudentOfInterestAdd extends React.Component<IStudentOfInterestAddProps> {
  constructor(props) {
    super(props);
  }

  private getUsername = () => this.props.match.params.username;

  private typeCourse = () => this.props.type === 'courses';

  private nextYears = (amount) => {
    const nextYears = [];
    const { currentTerm } = this.props;
    // const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    let currentYear = currentTerm.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  }

  private yearTerms = (year) => [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];

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
    const academicTermIDs = opportunityInstance.termIDs;
    const upcomingAcademicTerms = _.filter(academicTermIDs, termID => AcademicTerms.isUpcomingTerm(termID));
    return _.map(upcomingAcademicTerms, termID => AcademicTerms.toString(termID));
  }

  private handleAddToPlan = (e) => {
    e.preventDefault();
    const term = e.target.text;
    const { item } = this.props;
    const itemSlug = Slugs.findDoc({ _id: item.slugID });
    const termSplit = term.split(' ');
    const termSlug = `${termSplit[0]}-${termSplit[1]}`;
    const username = this.getUsername();

    if (this.typeCourse()) {
      const definitionData = {
        academicTerm: termSlug,
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
        academicTerm: termSlug,
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
            <Popup
              trigger={
                <Button>
                  <Icon name="plus"/><br/>Add to Plan
                </Button>
              }
              on="click"
            >
              {/* TODO: fluid popup transition hidden */}
              <Popup.Content>
                <Menu size="mini" secondary={true} vertical={true}>
                  {
                    nextYears.map((year, index) => (
                      <React.Fragment key={index}>
                        {/* TODO: fluid popup transition hidden */}
                        <Popup
                          trigger={
                            <Menu.Item as="a" className={`${this.props.item} chooseSemester`}>
                              {year}
                            </Menu.Item>
                          }
                          on="click"
                        >
                          <Popup.Content>
                            <Menu size="mini" secondary={true} vertical={true}>
                              {
                                this.yearTerms(year).map((term) => (
                                  <Menu.Item as="a" className={`${this.props.item}`}
                                             key={index}
                                             onClick={this.handleAddToPlan}>
                                    {term}
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
            <Popup
              trigger={
                <Button>
                  <Icon name="plus"/><br/>Add to Plan
                </Button>
              }
              on="click"
            >
              {/* TODO: fluid popup transition hidden */}
              <Popup.Content position="right center">
                <Menu size="mini" secondary={true} vertical={true}>
                  {
                    this.itemTerms().map((term, index) => (
                      <Menu.Item
                        key={index}
                        as="a" className={`${this.props.item}`} onClick={this.handleAddToPlan}>
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

const StudentOfInterestAddCon = withTracker(() => {
  const courseInstances = CourseInstances.findNonRetired();
  const opportunityInstances = OpportunityInstances.findNonRetired();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  return {
    courseInstances,
    opportunityInstances,
    currentTerm,
  };
})(StudentOfInterestAdd);
const StudentOfInterestAddContainer = withRouter(StudentOfInterestAddCon);
export default StudentOfInterestAddContainer;
