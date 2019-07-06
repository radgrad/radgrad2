import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withRouter } from 'react-router-dom';
import { getDroppableListStyle } from './StyleFunctions';
import DraggablePlanChoicePill from './DraggablePlanChoicePill';
import * as PlanChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';
import { isPlanChoiceSatisfied } from '../../../api/degree-plan/AcademicPlanUtilities';
import SatisfiedPlanChoicePill from './SatisfiedPlanChoicePill';

interface IAcademicPlanTermViewProps {
  title: string;
  id: string;
  choices: string[];
  studentID: string;
  takenSlugs: string[];
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const AcademicPlanTermView = (props: IAcademicPlanTermViewProps) => {
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };

  return (
    <Segment style={noPaddingStyle}>
      <Header dividing={true}>{props.title}</Header>
      <Droppable droppableId={`${props.id}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getDroppableListStyle(snapshot.isDraggingOver)}
          >
            {_.map(props.choices, (choice, index) => {
              const satisfied = isPlanChoiceSatisfied(choice, props.takenSlugs);
              if (PlanChoiceUtils.isSingleChoice(choice) && !PlanChoiceUtils.isXXChoice(choice)) {
                return (
                  <DraggablePlanChoicePill key={index} choice={choice} index={index} studentID={props.studentID}
                                           satisfied={satisfied}/>
                );
              }
              return (
                <SatisfiedPlanChoicePill key={index} choice={choice} satisfied={satisfied}/>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Segment>
  );
};

export default withRouter(AcademicPlanTermView);
