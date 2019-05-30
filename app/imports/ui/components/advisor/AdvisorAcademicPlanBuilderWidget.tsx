import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Divider, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import AutoForm from 'uniforms-semantic/AutoForm';
import SelectField from 'uniforms-semantic/SelectField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { IDesiredDegree, IPlanChoiceDefine } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { docToShortName } from '../shared/AdminDataModelHelperFunctions';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';
import { getDroppableListStyle } from '../shared/StyleFunctions';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import SatisfiedPlanChoicePill from '../shared/SatisfiedPlanChoicePill';


interface IAdvisorAcademicPlanBuilderWidgetProps {
  degrees: IDesiredDegree[];
  choices: IPlanChoiceDefine[],
  years: number[];
}

class AdvisorAcademicPlanBuilderWidget extends React.Component<IAdvisorAcademicPlanBuilderWidgetProps> {
  constructor(props) {
    super(props);
    console.log('AdvisorAcademicPlanBuilder props=%o', props);
  }

  private onDragEnd = (result) => {
    console.log(result);
  };

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const quarterSystem = RadGradSettings.findOne({}).quarterSystem;
    const degreeNames = _.map(this.props.degrees, docToShortName);
    const currentYear = AcademicTerms.getCurrentAcademicTermDoc().year;
    const schema = new SimpleSchema({
      degree: { type: String, allowedValues: degreeNames },
      name: String,
      year: { type: SimpleSchema.Integer, allowedValues: this.props.years, defaultValue: currentYear },
    });
    const planYears = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    const academicYearStyle = {
      padding: '0 0.6rem',
    };
    return (
      <Segment padded={true}>
        <Header dividing={true}>ACADEMIC PLAN</Header>
        <AutoForm schema={schema}>
          <Form.Group widths="equal">
            <SelectField name="degree"/>
            <TextField name="name"/>
            <SelectField name="year"/>
          </Form.Group>
        </AutoForm>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Grid stackable={true}>
            <Grid.Column width={10}>
              <Grid widths="equal">
                <Grid.Row columns="5">
                  {_.map(planYears, (py, index) => (
                    <Grid.Column key={index} style={academicYearStyle}>
                      <Divider horizontal={true}>{py}</Divider>
                      <Segment>
                        <Header dividing={true} as="h4">{AcademicTerms.FALL}</Header>
                        <Droppable droppableId={`${AcademicTerms.FALL}%{py}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              // style={style}
                              style={getDroppableListStyle(snapshot.isDraggingOver)}
                            >
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </Segment>
                      {
                        quarterSystem ?
                          <Segment>
                            <Header dividing={true} as="h4">{AcademicTerms.WINTER}</Header>
                            <Droppable droppableId={`${AcademicTerms.WINTER}%{py}`}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  // style={style}
                                  style={getDroppableListStyle(snapshot.isDraggingOver)}
                                >
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </Segment>
                          : ''
                      }
                      <Segment>
                        <Header dividing={true} as="h4">{AcademicTerms.SPRING}</Header>
                        <Droppable droppableId={`${AcademicTerms.SPRING}%{py}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              // style={style}
                              style={getDroppableListStyle(snapshot.isDraggingOver)}
                            >
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </Segment>
                      <Segment>
                        <Header dividing={true} as="h4">{AcademicTerms.SUMMER}</Header>
                        <Droppable droppableId={`${AcademicTerms.SUMMER}%{py}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              // style={style}
                              style={getDroppableListStyle(snapshot.isDraggingOver)}
                            >
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </Segment>
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment>
                <Header dividing={true}>Course Choices</Header>
                <Droppable droppableId="AdvisorBuildPlanChoices">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      // style={style}
                      style={getDroppableListStyle(snapshot.isDraggingOver)}
                    >
                      {_.map(this.props.choices, (choice, index) => (
                        <SatisfiedPlanChoicePill key={choice.choice} index={index} choice={choice.choice}
                                                 satisfied={true}/>
                      ))}
                    </div>)}
                </Droppable>
              </Segment>
            </Grid.Column>
          </Grid>
        </DragDropContext>
      </Segment>
    );
  }
}

export default withTracker(() => {
  const degrees = DesiredDegrees.findNonRetired({}, { sort: { name: 1, year: 1 } });
  const terms = AcademicTerms.findNonRetired({}, { sort: { year: 1 } });
  const choices = PlanChoices.findNonRetired({}, { sort: { choice: 1 } });
  const years = _.uniq(_.map(terms, (t) => t.year));
  return {
    degrees,
    years,
    choices,
  };
})(AdvisorAcademicPlanBuilderWidget);
