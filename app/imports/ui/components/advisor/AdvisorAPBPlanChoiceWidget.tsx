import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Header, Segment } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { getDroppableListStyle } from '../shared/StyleFunctions';
import { IPlanChoiceDefine } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import DraggableCoursePill from '../shared/DraggableCoursePill';

interface IAdvisorAPBPlanChoiceWidgetProps {
  choices: IPlanChoiceDefine[],
}

const AdvisorAPBPlanChoiceWidget = (props: IAdvisorAPBPlanChoiceWidgetProps) => (
  <Segment>
    <Header dividing={true}>Course Choices</Header>
    <Droppable droppableId="AdvisorBuildPlanChoices">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          // style={style}
          style={getDroppableListStyle(snapshot.isDraggingOver)}
        >
          {_.map(props.choices, (choice, index) => (
            <DraggableCoursePill key={choice.choice} index={index} choice={choice.choice}
                                     satisfied={true} studentID="fakeID"/>
          ))}
        </div>)}
    </Droppable>
  </Segment>

);

export default AdvisorAPBPlanChoiceWidget;
