import React, { useState } from 'react';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Confirm, Form, Grid, Header, Segment } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SelectField, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { DragDropContext } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { IAcademicPlanDefine, IAcademicTerm, IPlanChoiceDefine } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { PlanChoices } from '../../../../api/degree-plan/PlanChoiceCollection';
import {
  academicTermNameToDoc,
  academicTermToName,
} from '../../shared/data-model-helper-functions';
import AdvisorAPBPlanViewWidget from './AdvisorAPBPlanViewWidget';
import AdvisorAPBPlanChoiceWidget from './AdvisorAPBPlanChoiceWidget';
import {
  addChoiceToRaw, removeChoiceFromPlanRaw, removeEmptyYearsRaw,
  reorderChoicesInTermRaw,
  updateChoiceCounts,
} from '../../../../api/degree-plan/AcademicPlanUtilities';
import {
  compoundCombineChoices,
  isSingleChoice,
  simpleCombineChoices,
  stripCounter,
} from '../../../../api/degree-plan/PlanChoiceUtilities';
import {
  CHOICE_AREA,
  COMBINE_AREA, DELETE_AREA,
  getDropDestinationArea, getPlanAreaTermNumber,
  PLAN_AREA,
  stripPrefix,
} from './AcademicPlanBuilderUtilities';
import { defineMethod, removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { AcademicPlans } from '../../../../api/degree-plan/AcademicPlanCollection';
import slugify, { Slugs } from '../../../../api/slug/SlugCollection';

interface IAdvisorAPBuilderWidgetProps {
  choices: IPlanChoiceDefine[],
  terms: IAcademicTerm[];
}

const AdvisorAPBuilderWidget = (props: IAdvisorAPBuilderWidgetProps) => {
  // console.log('AdvisorAPBuilderWidget %o', props);
  const quarterSystem = RadGradProperties.getQuarterSystem();
  const coursesPerTerm = [];
  const numTerms = quarterSystem ? 20 : 15;
  for (let i = 0; i < numTerms; i++) {
    coursesPerTerm.push(0);
  }
  const [choiceListState, setChoiceList] = useState([]);
  const [coursesPerTermState, setCoursesPerTerm] = useState(coursesPerTerm);
  const [combineChoiceState, setCombineChoice] = useState('');
  const [showConfirmAddState, setShowConfirmAdd] = useState(false);
  const [addPlanChoiceState, setAddPlanChoice] = useState('');
  const [showConfirmDeleteState, setShowConfirmDelete] = useState(false);
  const [deletePlanChoiceState, setDeletePlanChoice] = useState('');
  const [showConfirmCombineState, setShowConfirmCombine] = useState(false);
  const [combineLeftSideState, setCombineLeftSide] = useState('');
  const [combineRightSideState, setCombineRightSide] = useState('');

  const handleCancelAdd = () => {
    setShowConfirmAdd(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleSimpleCombine = () => {
    // console.log('simple combine', combineLeftSideState, combineRightSideState);
    const combineChoice = simpleCombineChoices(combineLeftSideState, combineRightSideState);
    setShowConfirmCombine(false);
    setCombineChoice(combineChoice);
  };

  const handleCompoundCombine = () => {
    // console.log('simple combine', combineLeftSideState, combineRightSideState);
    const combineChoice = compoundCombineChoices(combineLeftSideState, combineRightSideState);
    setShowConfirmCombine(false);
    setCombineChoice(combineChoice);
  };

  const handleConfirmAdd = () => {
    // console.log('handleConfirmAdd');
    const collectionName = PlanChoices.getCollectionName();
    const choice = combineChoiceState;
    const definitionData = { choice };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        setCombineChoice('');
      }
    });
    setShowConfirmAdd(false);
  };

  const handleConfirmDelete = () => {
    const collectionName = PlanChoices.getCollectionName();
    const doc = PlanChoices.findDoc({ choice: deletePlanChoiceState });
    const instance = doc._id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting CareerGoal. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
    setShowConfirmDelete(false);
  };

  const handleDropInPlanArea = (dropResult) => {
    const dropTermNum = getPlanAreaTermNumber(dropResult.destination.droppableId);
    const termIndex = dropResult.destination.index;
    const source = dropResult.source.droppableId;
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    // console.log(dropTermNum, termIndex, source, choice);
    if (source === CHOICE_AREA) {
      addChoiceToRaw(choice, dropTermNum, choiceListState, coursesPerTermState, termIndex);
      updateChoiceCounts(choiceListState);
    } else if (source.startsWith(PLAN_AREA)) {
      // changed a choice from in the plan.
      const sourceTerm = source.split('-')[2];
      if (sourceTerm === dropTermNum) {
        // reorder in same term
        reorderChoicesInTermRaw(choice, dropTermNum, termIndex, choiceListState, coursesPerTermState);
      } else {
        // moved to new termNumber
        // console.log('moved term sourceTerm %o newTerm %o', sourceTerm, dropTermNum);
        removeChoiceFromPlanRaw(choice, sourceTerm, choiceListState, coursesPerTermState);
        addChoiceToRaw(choice, dropTermNum, choiceListState, coursesPerTermState, termIndex);
        updateChoiceCounts(choiceListState);
      }
    }
    // console.log('plan area new state', { choiceListState, coursesPerTermState });
    setChoiceList(choiceListState);
    setCoursesPerTerm(coursesPerTermState);
  };

  const handleDropInChoiceArea = (dropResult) => {
    // console.log(CHOICE_AREA, dropResult);
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    const source = dropResult.source.droppableId;
    // console.log(source, choice);
    if (source === COMBINE_AREA) {
      setAddPlanChoice(choice);
      setShowConfirmAdd(true);
    } else if (source.startsWith(PLAN_AREA)) {
      const sourceTerm = source.split('-')[2];
      removeChoiceFromPlanRaw(choice, sourceTerm, choiceListState, coursesPerTermState);
      setChoiceList(choiceListState);
      setCoursesPerTerm(coursesPerTermState);
    }
  };

  const handleDropInCombineArea = (dropResult) => {
    // console.log(COMBINE_AREA, dropResult, combineChoiceState);
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    const index = dropResult.destination.index;
    let combineLeftSide = '';
    let combineRightSide = '';
    if (combineChoiceState) {
      if (index === 0) {
        combineLeftSide = choice;
        combineRightSide = combineChoiceState;
      } else {
        combineLeftSide = combineChoiceState;
        combineRightSide = choice;
      }
      // console.log(combineLeftSide, combineRightSide);
      if (isSingleChoice(combineLeftSide) && isSingleChoice(combineRightSide)) {
        const newCombineChoice = simpleCombineChoices(combineLeftSide, combineRightSide);
        setCombineChoice(newCombineChoice);
      } else {
        setCombineLeftSide(combineLeftSide);
        setCombineRightSide(combineRightSide);
        setShowConfirmCombine(true);
      }
    } else {
      setCombineChoice(choice);
    }
  };

  const handleDropInDeleteArea = (dropResult) => {
    // console.log(DELETE_AREA, dropResult);
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    const source = dropResult.source.droppableId;
    if (source.startsWith(PLAN_AREA)) {
      const sourceTerm = source.split('-')[2];
      removeChoiceFromPlanRaw(choice, sourceTerm, choiceListState, coursesPerTermState);
      setChoiceList(choiceListState);
      setCoursesPerTerm(coursesPerTermState);
    } else if (source === CHOICE_AREA) {
      if (isSingleChoice(choice)) {
        Swal.fire({
          title: 'Delete failed',
          text: `Cannot delete the single choice ${PlanChoices.toString(choice)}.`,
          icon: 'error',
        });
      } else {
        setShowConfirmDelete(true);
        setDeletePlanChoice(choice);
      }
    } else if (source === COMBINE_AREA) {
      setCombineChoice('');
    }
  };

  const handleSavePlan = (doc) => {
    // console.log('handleSavePlan', doc);
    const truncatedCoursesPerTerm = removeEmptyYearsRaw(coursesPerTermState);
    // console.log(truncatedCoursesPerTerm);
    const collectionName = AcademicPlans.getCollectionName();
    const name = doc.name;
    const description = doc.description;
    const term = academicTermNameToDoc(doc.term);
    const academicTerm = Slugs.getNameFromID(term.slugID);
    const slug = `${slugify(name)}-${academicTerm}`;
    const definitionData: IAcademicPlanDefine = {
      name,
      description,
      academicTerm,
      choiceList: choiceListState,
      coursesPerAcademicTerm: truncatedCoursesPerTerm,
      slug,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add academic plan failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error adding academic plan. %o', error);
      } else {
        Swal.fire({
          title: 'Add academic plan succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const onDragEnd = (result) => {
    // console.log('onDragEnd %o', result);
    const dropArea = getDropDestinationArea(result.destination.droppableId);
    switch (dropArea) {
      case PLAN_AREA:
        handleDropInPlanArea(result);
        break;
      case CHOICE_AREA:
        handleDropInChoiceArea(result);
        break;
      case COMBINE_AREA:
        handleDropInCombineArea(result);
        break;
      case DELETE_AREA:
        handleDropInDeleteArea(result);
        break;
      default:
      // do nothing?
    }
  };

  const termNames = _.map(props.terms, academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const schema = new SimpleSchema({
    name: String,
    description: String,
    term: {
      type: String,
      allowedValues: termNames,
      defaultValue: currentTermName,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const paddingTopStyle = {
    marginTop: 10,
  };
  return (
    <Segment>
      <Header dividing>ACADEMIC PLAN</Header>
      <AutoForm schema={formSchema} onSubmit={handleSavePlan}>
        <Form.Group widths="equal">
          <TextField name="name" />
          <SelectField name="term" />
        </Form.Group>
        <LongTextField name="description" />
        <SubmitField className="basic green" value="Save Academic Plan" disabled={false} inputRef={undefined} />
      </AutoForm>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid stackable style={paddingTopStyle}>
          <Grid.Column width={10}>
            <AdvisorAPBPlanViewWidget coursesPerTerm={coursesPerTermState} choiceList={choiceListState} />
          </Grid.Column>
          <Grid.Column width={6}>
            <AdvisorAPBPlanChoiceWidget choices={props.choices} combineChoice={combineChoiceState} />
          </Grid.Column>
        </Grid>
      </DragDropContext>
      <Confirm
        open={showConfirmAddState}
        onCancel={handleCancelAdd}
        onConfirm={handleConfirmAdd}
        confirmButton="Add Choice"
        header="Add Plan Choice?"
        content={PlanChoices.toString(addPlanChoiceState)}
      />
      <Confirm
        open={showConfirmDeleteState}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmButton="Delete Choice"
        header="Delete Plan Choice?"
        content={PlanChoices.toString(deletePlanChoiceState)}
      />
      <Confirm
        open={showConfirmCombineState}
        cancelButton="Simple Combine"
        confirmButton="Compound Combine"
        header="Simple or Compound Combine?"
        onCancel={handleSimpleCombine}
        onConfirm={handleCompoundCombine}
        content={`Do a simple combine ${combineLeftSideState},${combineRightSideState} or a compound combine (${combineLeftSideState}),(${combineRightSideState})?`}
      />
    </Segment>
  );
};

export default withTracker(() => {
  const terms = AcademicTerms.findNonRetired({}, { sort: { year: 1 } });
  const choices = PlanChoices.findNonRetired({}, { sort: { choice: 1 } });
  return {
    terms,
    choices,
  };
})(AdvisorAPBuilderWidget);
