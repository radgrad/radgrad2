import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { getDroppableListStyle } from '../shared/StyleFunctions';
import { IPlanChoiceDefine } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import DraggableCoursePill from '../shared/DraggableCoursePill';

interface IAdvisorAPBPlanChoiceWidgetProps {
  choices: IPlanChoiceDefine[],
}

const AdvisorAPBPlanChoiceWidget = (props: IAdvisorAPBPlanChoiceWidgetProps) => {
  const column1 = [];
  const column2 = [];
  const column3 = [];
  const column4 = [];
  props.choices.forEach((choice, index) => {
    switch (index % 4) {
      case 0:
        column1.push(choice);
        break;
      case 1:
        column2.push(choice);
        break;
      case 2:
        column3.push(choice);
        break;
      default:
        column4.push(choice);
    }
  });
  const narrowStyle = {
    paddingLeft: 2,
    paddingRight: 2,
  };
  return (
    <Segment>
      <Header dividing={true}>Course Choices</Header>
      <Grid columns="equal">
        <Grid.Column style={narrowStyle}>
          <Droppable droppableId="AdvisorBuildPlanChoices">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                // style={style}
                style={getDroppableListStyle(snapshot.isDraggingOver)}
              >
                {_.map(column1, (choice, index) => (
                  <DraggableCoursePill key={choice.choice} index={index} choice={choice.choice}
                                       satisfied={true} studentID="fakeID"/>
                ))}
              </div>)}
          </Droppable>
        </Grid.Column>
        <Grid.Column style={narrowStyle}>
          <Droppable droppableId="AdvisorBuildPlanChoices">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                // style={style}
                style={getDroppableListStyle(snapshot.isDraggingOver)}
              >
                {_.map(column2, (choice, index) => (
                  <DraggableCoursePill key={choice.choice} index={index} choice={choice.choice}
                                       satisfied={true} studentID="fakeID"/>
                ))}
              </div>)}
          </Droppable>
        </Grid.Column>
        <Grid.Column style={narrowStyle}>
          <Droppable droppableId="AdvisorBuildPlanChoices">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                // style={style}
                style={getDroppableListStyle(snapshot.isDraggingOver)}
              >
                {_.map(column3, (choice, index) => (
                  <DraggableCoursePill key={choice.choice} index={index} choice={choice.choice}
                                       satisfied={true} studentID="fakeID"/>
                ))}
              </div>)}
          </Droppable>
        </Grid.Column>
        <Grid.Column style={narrowStyle}>
          <Droppable droppableId="AdvisorBuildPlanChoices">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                // style={style}
                style={getDroppableListStyle(snapshot.isDraggingOver)}
              >
                {_.map(column4, (choice, index) => (
                  <DraggableCoursePill key={choice.choice} index={index} choice={choice.choice}
                                       satisfied={true} studentID="fakeID"/>
                ))}
              </div>)}
          </Droppable>
        </Grid.Column>
      </Grid>
      <Segment>
        <Icon name="linkify" size="big"/>
        <Droppable droppableId='comboArea'>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              // style={style}
              style={getDroppableListStyle(snapshot.isDraggingOver)}
            >
              {provided.placeholder}
            </div>)}
        </Droppable>
      </Segment>
      <Segment>
        <Icon name="trash alternate outline" size="big"/>
        <Droppable droppableId='trash'>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              // style={style}
              style={getDroppableListStyle(snapshot.isDraggingOver)}
              id="ApbTrash"
            >
              {provided.placeholder}
            </div>)}
        </Droppable>
      </Segment>
    </Segment>
  );
};

export default AdvisorAPBPlanChoiceWidget;
