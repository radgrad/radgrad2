import React, { useState } from 'react';
import _ from 'lodash';
import { $ } from 'meteor/jquery';
import { Divider, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { AutoForm, SelectField, TextField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { IDesiredDegree, IPlanChoiceDefine } from '../../../typings/radgrad';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { docToShortName } from '../shared/data-model-helper-functions';
import { getDroppableListStyle } from '../shared/StyleFunctions';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import AdvisorAPBPlanChoiceWidget from './AdvisorAPBPlanChoiceWidget';
import DraggableCoursePill from '../shared/DraggableCoursePill';
import { COMBINE_AREA } from './AcademicPlanBuilderUtilities';

interface IAdvisorAcademicPlanBuilderWidgetProps {
  degrees: IDesiredDegree[];
  choices: IPlanChoiceDefine[],
  years: number[];
}

const AdvisorAcademicPlanBuilderWidget = (props: IAdvisorAcademicPlanBuilderWidgetProps) => {
  // console.log('AdvisorAcademicPlanBuilderWidget props=%o', props);
  const quarterSystem: boolean = RadGradProperties.getQuarterSystem();
  const initTerms = quarterSystem ? 20 : 15;
  const [choiceList, setChoiceList] = useState([]);
  const initCoursesPerTerm = [];
  for (let i = 0; i < initTerms; i++) {
    initCoursesPerTerm.push(0);
  }
  const [coursesPerTerm, setCoursesPerTerm] = useState(initCoursesPerTerm);

  /**
   * Returns the index into the coursesPerTerm array for the given termLabel
   * @param {string} termLabel the droppableID of the drop target.
   * @returns {number}
   */
  const parseTermYear = (termLabel: string): number => {
    const index = termLabel.indexOf(' ');
    const yearNum = parseInt(termLabel.substring(index), 10);
    const yearIndex = termLabel.indexOf('Year');
    const term = termLabel.substring(0, yearIndex);
    const numTerms = quarterSystem ? 4 : 3;
    let result = 0;
    switch (term) {
      case AcademicTerms.FALL:
        result = 0;
        break;
      case AcademicTerms.WINTER:
        result = 1;
        break;
      case AcademicTerms.SPRING:
        result = quarterSystem ? 2 : 1;
        break;
      default:
        result = quarterSystem ? 3 : 2;
    }
    return result + numTerms * (yearNum - 1);
  };

  const onDragEnd = (result) => {
    // TODO: Check the droppableId to see what kind of drop this is.
    const termIndex = parseTermYear(result.destination.droppableId);
    let courseListIndex = 0;
    for (let i = 0; i < termIndex; i++) {
      courseListIndex += coursesPerTerm[i];
    }
    courseListIndex += result.destination.index;
    choiceList.splice(courseListIndex, 0, result.draggableId);
    coursesPerTerm[termIndex]++;
    // console.log('new state = %o', { courseList, coursesPerTerm });
    setCoursesPerTerm(coursesPerTerm);
    setChoiceList(choiceList);
    const divs = $('#ApbTrash');
    let element = divs;
    while (element && !element.hasClass('segment')) {
      element = element.parent();
    }
  };

  const degreeNames = _.map(props.degrees, docToShortName);
  const currentYear = AcademicTerms.getCurrentAcademicTermDoc().year;
  const schema = new SimpleSchema({
    degree: { type: String, allowedValues: degreeNames },
    name: String,
    year: { type: SimpleSchema.Integer, allowedValues: props.years, defaultValue: currentYear },
  });
  const planYears = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  const academicYearStyle = {
    padding: '0 0.6rem',
  };
  let courseListStartIndex = 0;
  let coursesPerTermIndex = 0;
  return (
    <Segment padded>
      <Header dividing>ACADEMIC PLAN</Header>
      <AutoForm schema={schema}>
        <Form.Group widths="equal">
          <SelectField name="degree" />
          <TextField name="name" />
          <SelectField name="year" />
        </Form.Group>
      </AutoForm>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid stackable>
          <Grid.Column width={10}>
            Foo
            <Grid widths="equal">
              <Grid.Row columns="5">
                {_.map(planYears, (py, index) => (
                  <Grid.Column key={index} style={academicYearStyle}>
                    <Divider horizontal>{py}</Divider>
                    <Segment>
                      <Header dividing as="h4">{AcademicTerms.FALL}</Header>
                      <Droppable droppableId={`${AcademicTerms.FALL}${py}`}>
                        {(provided, snapshot) => {
                          const courses = choiceList.slice(courseListStartIndex, courseListStartIndex + coursesPerTerm[coursesPerTermIndex]);
                          courseListStartIndex += coursesPerTerm[coursesPerTermIndex++];
                          // console.log(`${AcademicTerms.FALL}${py}`, courses, courseListStartIndex, coursesPerTermIndex);
                          return (
                            <div
                              ref={provided.innerRef}
                              // style={style}
                              style={getDroppableListStyle(snapshot.isDraggingOver)}
                            >
                              {_.map(courses, (choice, idx) => (
                                <DraggableCoursePill
                                  key={choice}
                                  index={idx}
                                  choice={choice}
                                  draggableId={choice}
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
                    {
                      quarterSystem ? (
                        <Segment>
                          <Header dividing as="h4">{AcademicTerms.WINTER}</Header>
                          <Droppable droppableId={`${AcademicTerms.WINTER}${py}`}>
                            {(provided, snapshot) => {
                              const courses = choiceList.slice(courseListStartIndex, courseListStartIndex + coursesPerTerm[coursesPerTermIndex]);
                              courseListStartIndex += coursesPerTerm[coursesPerTermIndex++];
                              // console.log(`${AcademicTerms.WINTER}${py}`, courses, courseListStartIndex, coursesPerTermIndex);
                              return (
                                <div
                                  ref={provided.innerRef}
                                  // style={style}
                                  style={getDroppableListStyle(snapshot.isDraggingOver)}
                                >
                                  {_.map(courses, (choice, idx) => (
                                    <DraggableCoursePill
                                      key={choice}
                                      index={idx}
                                      choice={choice}
                                      draggableId={choice}
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
                        )
                        : ''
                    }
                    <Segment>
                      <Header dividing as="h4">{AcademicTerms.SPRING}</Header>
                      <Droppable droppableId={`${AcademicTerms.SPRING}${py}`}>
                        {(provided, snapshot) => {
                          const courses = choiceList.slice(courseListStartIndex, courseListStartIndex + coursesPerTerm[coursesPerTermIndex]);
                          courseListStartIndex += coursesPerTerm[coursesPerTermIndex++];
                          // console.log(`${AcademicTerms.SPRING}${py}`, courses, courseListStartIndex, coursesPerTermIndex);
                          return (
                            <div
                              ref={provided.innerRef}
                              // style={style}
                              style={getDroppableListStyle(snapshot.isDraggingOver)}
                            >
                              {_.map(courses, (choice, idx) => (
                                <DraggableCoursePill
                                  key={choice}
                                  index={idx}
                                  choice={choice}
                                  draggableId={choice}
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
                    <Segment>
                      <Header dividing as="h4">{AcademicTerms.SUMMER}</Header>
                      <Droppable droppableId={`${AcademicTerms.SUMMER}${py}`}>
                        {(provided, snapshot) => {
                          const courses = choiceList.slice(courseListStartIndex, courseListStartIndex + coursesPerTerm[coursesPerTermIndex]);
                          courseListStartIndex += coursesPerTerm[coursesPerTermIndex++];
                          // console.log(`${AcademicTerms.SUMMER}${py}`, courses, courseListStartIndex, coursesPerTermIndex);
                          return (
                            <div
                              ref={provided.innerRef}
                              // style={style}
                              style={getDroppableListStyle(snapshot.isDraggingOver)}
                            >
                              {_.map(courses, (choice, idx) => (
                                <DraggableCoursePill
                                  key={choice}
                                  index={idx}
                                  choice={choice}
                                  draggableId={choice}
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
                  </Grid.Column>
                ))}
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  Bar
                  <Droppable droppableId={COMBINE_AREA}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        // style={style}
                        style={getDroppableListStyle(snapshot.isDraggingOver)}
                      >
                        <Segment>
                          <Icon name="linkify" size="big" />
                          {provided.placeholder}
                        </Segment>
                      </div>
                    )}
                  </Droppable>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={6}>
            <AdvisorAPBPlanChoiceWidget choices={props.choices} combineChoice="" />
          </Grid.Column>
        </Grid>
      </DragDropContext>
    </Segment>
  );
};

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
