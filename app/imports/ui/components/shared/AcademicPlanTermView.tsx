import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
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
  groups: any;
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
  console.log('AcademicPlanTermView', props);
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
              const satisfied = isPlanChoiceSatisfied(choice, props.takenSlugs, props.groups);
              const stripped = PlanChoiceUtils.stripCounter(choice);
              const courseSlugs = props.groups[stripped].courseSlugs;
              if (courseSlugs.length === 1 && !PlanChoiceUtils.isXXChoice(choice)) {
                return (
                  <DraggablePlanChoicePill
                    key={index}
                    choice={choice}
                    name={PlanChoiceUtils.buildSimpleName(choice)}
                    groups={props.groups}
                    index={index}
                    studentID={props.studentID}
                    satisfied={satisfied}
                  />
                );
              }
              if (courseSlugs.length === 2) {
                return (
                  <div key={index}>
                    <DraggablePlanChoicePill choice={courseSlugs[0]} groups={props.groups} index={10 * index} studentID={props.studentID} satisfied={satisfied} name={PlanChoiceUtils.buildSimpleName(courseSlugs[0])} />
                    Or
                    <DraggablePlanChoicePill
                      choice={courseSlugs[1]}
                      groups={props.groups}
                      index={10 * index}
                      studentID={props.studentID}
                      satisfied={satisfied}
                      name={PlanChoiceUtils.buildSimpleName(courseSlugs[1])}
                    />
                  </div>
                );
              }
              return (
                <SatisfiedPlanChoicePill key={index} choice={choice} groups={props.groups} satisfied={satisfied} />
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
