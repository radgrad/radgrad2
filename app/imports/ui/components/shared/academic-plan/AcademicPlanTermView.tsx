import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
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

const AcademicPlanTermView: React.FC<IAcademicPlanTermViewProps> = ({ title, id, choices, studentID, takenSlugs }) => {
  // console.log('AcademicPlanTermView', props);
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };

  return (
    <Segment style={noPaddingStyle}>
      <Header dividing>{title}</Header>
      <Droppable droppableId={`${id}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getDroppableListStyle(snapshot.isDraggingOver)}
          >
            {_.map(choices, (choice, index) => {
              const satisfied = isPlanChoiceSatisfied(choice, takenSlugs);
              const stripped = PlanChoiceUtils.stripCounter(choice);
              const courseSlugs = complexChoiceToArray(stripped);
              if (courseSlugs.length === 1 && !PlanChoiceUtils.isXXChoice(choice)) {
                return (
                  <DraggablePlanChoicePill
                    key={index}
                    choice={choice}
                    name={PlanChoiceUtils.buildSimpleName(choice)}
                    index={index}
                    studentID={studentID}
                    satisfied={satisfied}
                  />
                );
              }
              if (courseSlugs.length === 2) {
                return (
                  <div key={index}>
                    <DraggablePlanChoicePill choice={courseSlugs[0]} index={10 * index} studentID={studentID} satisfied={satisfied} name={PlanChoiceUtils.buildSimpleName(courseSlugs[0])} />
                    Or
                    <DraggablePlanChoicePill
                      choice={courseSlugs[1]}
                      index={10 * index}
                      studentID={studentID}
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

export default AcademicPlanTermView;
