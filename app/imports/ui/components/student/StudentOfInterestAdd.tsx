import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

interface IStudentOfInterestAddProps {
  item: object;
  type: string;
}

// TODO: How to implement adding to plan with Academic Terms instead of semesters
class StudentOfInterestAdd extends React.Component<IStudentOfInterestAddProps> {
  constructor(props) {
    super(props);
  }

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

  private yearSemesters = (year) => [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    // const nextFourYears = this.nextYears(4);

    return (
        <div>
          {
            this.typeCourse() ?
                <Button>

                </Button>
                :
                <Button>

                </Button>
          }
        </div>
    );
  }
}

export default StudentOfInterestAdd;
