import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { complexChoiceToArray } from '../../../../api/degree-plan/PlanChoiceUtilities';
import { getDroppableListStyle } from './utilities/styles';
import DraggablePlanChoicePill from './DraggablePlanChoicePill';
import * as PlanChoiceUtils from '../../../../api/degree-plan/PlanChoiceUtilities';
import { isPlanChoiceSatisfied } from '../../../../api/degree-plan/AcademicPlanUtilities';
import SatisfiedPlanChoicePill from './SatisfiedPlanChoicePill';

interface IAcademicPlanTermViewProps {
  title: string;
  id: string;
  choices: string[];
  studentID: string;
  takenSlugs: string[];
}

const AcademicPlanTermView = (props: IAcademicPlanTermViewProps) => {
  // console.log('AcademicPlanTermView', props);
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };

  return (
    <Segment style={noPaddingStyle}>
      <Header dividing>{props.title}</Header>
      <Droppable droppableId={`${props.id}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getDroppableListStyle(snapshot.isDraggingOver)}
          >
            {_.map(props.choices, (choice, index) => {
              const satisfied = isPlanChoiceSatisfied(choice, props.takenSlugs);
              const stripped = PlanChoiceUtils.stripCounter(choice);
              const courseSlugs = complexChoiceToArray(stripped);
              if (courseSlugs.length === 1 && !PlanChoiceUtils.isXXChoice(choice)) {
                return (
                  <DraggablePlanChoicePill
                    key={index}
                    choice={choice}
                    name={PlanChoiceUtils.buildSimpleName(choice)}
                    index={index}
                    studentID={props.studentID}
                    satisfied={satisfied}
                  />
                );
              }
              if (courseSlugs.length === 2) {
                return (
                  <div key={index}>
                    <DraggablePlanChoicePill choice={courseSlugs[0]} index={10 * index} studentID={props.studentID} satisfied={satisfied} name={PlanChoiceUtils.buildSimpleName(courseSlugs[0])} />
                    Or
                    <DraggablePlanChoicePill
                      choice={courseSlugs[1]}
                      index={10 * index}
                      studentID={props.studentID}
                      satisfied={satisfied}
                      name={PlanChoiceUtils.buildSimpleName(courseSlugs[1])}
                    />
                  </div>
                );
              }
              return (
                <SatisfiedPlanChoicePill key={index} choice={choice} satisfied={satisfied} />
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
