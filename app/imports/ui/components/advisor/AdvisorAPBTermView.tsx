import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Droppable } from 'react-beautiful-dnd';
import { IAdvisorAcademicPlanBuilderWidgetState } from './AdvisorAcademicPlanBuilderWidget'; // eslint-disable-line no-unused-vars
import { getDroppableListStyle } from '../shared/StyleFunctions';
import DraggableCoursePill from '../shared/DraggableCoursePill';
import * as AcademicPlanUtilities from '../../../api/degree-plan/AcademicPlanUtilities';

interface IAdvisorAPBTermViewProps {
  termName: string;
  termNumber: number;
  yearNumber: number;
  choiceList: string[];
  coursesPerTerm: number[];
}

class AdvisorAPBTermView extends React.Component<IAdvisorAPBTermViewProps, IAdvisorAcademicPlanBuilderWidgetState> {
  constructor(props) {
    super(props);
    // console.log('TermView %o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    // console.log('TermView %o', this.props);
    return (
      <Segment>
        <Header dividing={true} as="h4">{this.props.termName}</Header>
        <Droppable droppableId={`plan-${this.props.yearNumber}-${this.props.termNumber}`}>
          {(provided, snapshot) => {
            const choices = AcademicPlanUtilities.getPlanChoicesRaw(this.props.coursesPerTerm, this.props.choiceList, this.props.termNumber);
            // console.log(choices);
            return (
              <div
                ref={provided.innerRef}
                // style={style}
                style={getDroppableListStyle(snapshot.isDraggingOver)}
              >
                {_.map(choices, (choice, idx) => (
                  <DraggableCoursePill key={choice} index={idx} choice={choice} draggableId={`planchoice-${choice}`}
                                       satisfied={true} studentID="fakeID"/>))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>

      </Segment>
    );
  }
}

export default AdvisorAPBTermView;
