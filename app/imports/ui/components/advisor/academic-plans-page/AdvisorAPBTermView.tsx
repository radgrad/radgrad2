import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import { Droppable } from 'react-beautiful-dnd';
import { getDroppableListStyle } from '../../shared/StyleFunctions';
import DraggableCoursePill from '../../shared/DraggableCoursePill';
import * as AcademicPlanUtilities from '../../../../api/degree-plan/AcademicPlanUtilities';
import {
  buildPlanAreaDraggableId,
  buildPlanAreaDroppableId,
} from './AcademicPlanBuilderUtilities';

interface IAdvisorAPBTermViewProps {
  termName: string;
  termNumber: number;
  yearNumber: number;
  choiceList: string[];
  coursesPerTerm: number[];
}

const AdvisorAPBTermView = (props: IAdvisorAPBTermViewProps) => (
  <Segment>
    <Header dividing as="h4">{props.termName}</Header>
    <Droppable droppableId={buildPlanAreaDroppableId(props.yearNumber, props.termNumber)}>
      {(provided, snapshot) => {
        const choices = AcademicPlanUtilities.getPlanChoicesRaw(props.coursesPerTerm, props.choiceList, props.termNumber);
        // console.log(choices);
        // if (choices.length > 0) {
        //   console.log(choices, getPlanChoiceFromDraggableId(choices[0]));
        // }
        return (
          <div
            ref={provided.innerRef}
            // style={style}
            style={getDroppableListStyle(snapshot.isDraggingOver)}
          >
            {_.map(choices, (choice, idx) => (
              <DraggableCoursePill
                key={choice}
                index={idx}
                choice={choice}
                draggableId={buildPlanAreaDraggableId(choice)}
                satisfied
                studentID="fakeID"
              />
            ))}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>

  </Segment>
);

export default AdvisorAPBTermView;
