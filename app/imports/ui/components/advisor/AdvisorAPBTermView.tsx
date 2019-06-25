import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Droppable } from 'react-beautiful-dnd';
import { IAdvisorAcademicPlanBuilderWidgetState } from './AdvisorAcademicPlanBuilderWidget'; // eslint-disable-line no-unused-vars
import { getDroppableListStyle } from '../shared/StyleFunctions';
import DraggableCoursePill from '../shared/DraggableCoursePill';

interface IAdvisorAPBTermViewProps {
  termName: string;
  termNumber: number;
  yearNumber: number;
  choiceIndex: number;
  numChoices: number;
}

class AdvisorAPBTermView extends React.Component<IAdvisorAPBTermViewProps, IAdvisorAcademicPlanBuilderWidgetState> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment>
        <Header dividing={true} as="h4">{this.props.termName}</Header>
        <Droppable droppableId={`${this.props.yearNumber}-${this.props.termNumber}`}>
          {(provided, snapshot) => {
            const choices = this.state.choiceList.slice(this.props.choiceIndex, this.props.choiceIndex + this.props.numChoices);
            return (
              <div
                ref={provided.innerRef}
                // style={style}
                style={getDroppableListStyle(snapshot.isDraggingOver)}
              >
                {_.map(choices, (choice, idx) => (
                  <DraggableCoursePill key={choice} index={idx} choice={choice}
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
