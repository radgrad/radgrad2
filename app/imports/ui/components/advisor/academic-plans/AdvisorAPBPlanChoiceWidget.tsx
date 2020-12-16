import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import SimpleSchema from 'simpl-schema';
import { AutoForm, BoolField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { getDroppableListStyle } from '../../shared/academic-plan/utilities/styles';
import { PlanChoiceDefine } from '../../../../typings/radgrad';
import DraggableCoursePill from '../../shared/academic-plan/DraggableCoursePill';
import { buildCombineAreaDraggableId, CHOICE_AREA, COMBINE_AREA, DELETE_AREA } from './utilities/academic-plan-builder';
import { PlanChoices } from '../../../../api/degree-plan/PlanChoiceCollection';
import { academicPlanActions } from '../../../../redux/advisor/academic-plan';
import { RootState } from '../../../../redux/types';

interface AdvisorAPBPlanChoiceWidgetProps {
  dispatch: (any) => void;
  showOnlyUnderGraduateChoices: boolean;
  choices: PlanChoiceDefine[];
  combineChoice: string;
}

const mapStateToProps = (state: RootState) => ({
  showOnlyUnderGraduateChoices: state.advisor.academicPlan.showOnlyUnderGraduateChoices,
});

const handleFilterChange = (dispatch) => ((model) => {
  // console.log(model);
  dispatch(academicPlanActions.setShowOnlyUnderGraduateChoices(model.showOnlyUnderGraduateChoices));
});

const AdvisorAPBPlanChoiceWidget: React.FC<AdvisorAPBPlanChoiceWidgetProps> = ({ dispatch, showOnlyUnderGraduateChoices, choices, combineChoice }) => {
  const column1 = [];
  const column2 = [];
  const column3 = [];
  const column4 = [];
  const choicesToShow = _.filter(choices, (choice) => {
    if (showOnlyUnderGraduateChoices) {
      return !PlanChoices.isGraduateChoice(choice.choice);
    }
    return true;
  });
  choicesToShow.forEach((choice, index) => {
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
  const schema = new SimpleSchema({
    showOnlyUnderGraduateChoices: Boolean,
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const filter = {
    showOnlyUnderGraduateChoices: showOnlyUnderGraduateChoices,
  };
  return (
    <Segment>
      <Header dividing>
        Course Choices
        <AutoForm schema={formSchema} model={filter} onChangeModel={handleFilterChange(dispatch)}>
          <BoolField name="showOnlyUnderGraduateChoices" />
        </AutoForm>
      </Header>
      <Droppable droppableId={CHOICE_AREA}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            // style={style}
            style={getDroppableListStyle(snapshot.isDraggingOver)}
          >
            <Grid columns="equal">
              <Grid.Column style={narrowStyle}>
                {_.map(column1, (choice, index) => (
                  <DraggableCoursePill
                    key={choice.choice}
                    index={index}
                    choice={choice.choice}
                    draggableId={`courseChoices-${choice.choice}`}
                    satisfied
                    studentID="fakeID"
                  />
                ))}
                {provided.placeholder}
              </Grid.Column>
              <Grid.Column style={narrowStyle}>
                {_.map(column2, (choice, index) => (
                  <DraggableCoursePill
                    key={choice.choice}
                    index={index}
                    choice={choice.choice}
                    draggableId={`courseChoices-${choice.choice}`}
                    satisfied
                    studentID="fakeID"
                  />
                ))}
                {provided.placeholder}
              </Grid.Column>
              <Grid.Column style={narrowStyle}>
                {_.map(column3, (choice, index) => (
                  <DraggableCoursePill
                    key={choice.choice}
                    index={index}
                    choice={choice.choice}
                    draggableId={`courseChoices-${choice.choice}`}
                    satisfied
                    studentID="fakeID"
                  />
                ))}
                {provided.placeholder}
              </Grid.Column>
              <Grid.Column style={narrowStyle}>
                {_.map(column4, (choice, index) => (
                  <DraggableCoursePill
                    key={choice.choice}
                    index={index}
                    choice={choice.choice}
                    draggableId={`courseChoices-${choice.choice}`}
                    satisfied
                    studentID="fakeID"
                  />
                ))}
                {provided.placeholder}
              </Grid.Column>
            </Grid>
          </div>
        )}
      </Droppable>
      <Droppable droppableId={COMBINE_AREA}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            // style={style}
            style={getDroppableListStyle(snapshot.isDraggingOver)}
          >
            <Segment>
              <Icon name="linkify" size="big" />
              {combineChoice ? (
                <DraggableCoursePill
                  key={combineChoice}
                  index={0}
                  choice={combineChoice}
                  draggableId={buildCombineAreaDraggableId(combineChoice)}
                  satisfied
                  studentID="fakeID"
                />
              ) : ''}
              {provided.placeholder}
            </Segment>
          </div>
        )}
      </Droppable>
      <Droppable droppableId={DELETE_AREA}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            // style={style}
            style={getDroppableListStyle(snapshot.isDraggingOver)}
            id="ApbTrash"
          >
            <Segment>
              <Icon name="trash alternate outline" size="big" />
              {provided.placeholder}
            </Segment>
          </div>
        )}
      </Droppable>
    </Segment>
  );
};

export default connect(mapStateToProps)(AdvisorAPBPlanChoiceWidget);
