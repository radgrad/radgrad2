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

// Determines the role based on the URL route. This is for styling ChoicePills. If they are not student, don't render them
// with a special style.
const getRole = (props: IAcademicPlanTermViewProps): string => {
  const url = props.match.url;
  const username = props.match.params.username;
  const indexUsername = url.indexOf(username);
  return url.substring(1, indexUsername - 1);
};

const AcademicPlanTermView = (props: IAcademicPlanTermViewProps) => {
  const isStatic = props.match.path.includes('/explorer/plans');
  const role = getRole(props);
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };

  return (
    <Segment style={noPaddingStyle}>
      <Header dividing={true}>{props.title}</Header>
      <Droppable droppableId={`${props.id}`} isDropDisabled={!!isStatic}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getDroppableListStyle(snapshot.isDraggingOver)}
          >
            {_.map(props.choices, (choice, index) => {
              const satisfied = isPlanChoiceSatisfied(choice, props.takenSlugs);
              if (PlanChoiceUtils.isSingleChoice(choice) && !PlanChoiceUtils.isXXChoice(choice)) {
                return (
                  <DraggablePlanChoicePill key={index} choice={choice} index={index} role={role} isStatic={isStatic}
                                           studentID={props.studentID} satisfied={satisfied}/>
                );
              }
              return (
                <SatisfiedPlanChoicePill key={index} choice={choice} index={index} satisfied={satisfied} role={role}/>
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
