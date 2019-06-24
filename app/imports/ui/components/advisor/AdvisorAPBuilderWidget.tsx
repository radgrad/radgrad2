import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Confirm, Form, Grid, Header, Segment } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import AutoForm from 'uniforms-semantic/AutoForm';
import SelectField from 'uniforms-semantic/SelectField';
import TextField from 'uniforms-semantic/TextField';
import { DragDropContext } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import { IDesiredDegree, IPlanChoiceDefine } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { PlanChoiceCollection, PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { docToShortName } from '../shared/AdminDataModelHelperFunctions';
import AdvisorAPBPlanViewWidget from './AdvisorAPBPlanViewWidget';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';
import AdvisorAPBPlanChoiceWidget from './AdvisorAPBPlanChoiceWidget';
import {
  addChoiceToRaw, removeChoiceFromPlanRaw,
  reorderChoicesInTermRaw,
  updateChoiceCounts,
} from '../../../api/degree-plan/AcademicPlanUtilities';
import {
  compoundCombineChoices,
  isSingleChoice,
  simpleCombineChoices,
  stripCounter,
} from '../../../api/degree-plan/PlanChoiceUtilities';
import {
  CHOICE_AREA,
  COMBINE_AREA, DELETE_AREA,
  getDropDestinationArea, getPlanAreaTermNumber,
  PLAN_AREA,
  stripPrefix,
} from './AcademicPlanBuilderUtilities';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';

interface IAdvisorAPBuilderWidgetProps {
  degrees: IDesiredDegree[];
  choices: IPlanChoiceDefine[],
  years: number[];
}

interface IAdvisorAPBuilderWidgetState {
  choiceList: string[];
  coursesPerTerm: number[];
  combineChoice: string;
  showConfirmAdd: boolean;
  addPlanChoice: string;
  showConfirmDelete: boolean;
  deletePlanChoice: string;
  showConfirmCombine: boolean;
  combineLeftSide: string;
  combineRightSide: string;
}

class AdvisorAPBuilderWidget extends React.Component<IAdvisorAPBuilderWidgetProps, IAdvisorAPBuilderWidgetState> {
  private readonly quarterSystem;

  constructor(props) {
    super(props);
    // console.log('AdvisorAPBuilderWidget %o', props);
    const coursesPerTerm = [];
    this.quarterSystem = RadGradSettings.findOne({}).quarterSystem;
    const numTerms = this.quarterSystem ? 20 : 15;
    for (let i = 0; i < numTerms; i++) {
      coursesPerTerm.push(0);
    }
    this.state = {
      choiceList: [],
      coursesPerTerm,
      combineChoice: '',
      showConfirmAdd: false,
      addPlanChoice: '',
      showConfirmDelete: false,
      deletePlanChoice: '',
      showConfirmCombine: false,
      combineLeftSide: '',
      combineRightSide: '',
    };
  }

  private handleCancelAdd = () => {
    this.setState({ showConfirmAdd: false });
  };

  private handleCancelDelete = () => {
    this.setState({ showConfirmDelete: false });
  };

  private handleSimpleCombine = () => {
    console.log('simple combine', this.state);
    const { combineLeftSide, combineRightSide } = this.state;
    const combineChoice = simpleCombineChoices(combineLeftSide, combineRightSide);
    this.setState({ showConfirmCombine: false, combineChoice });
  };

  private handleCompoundCombine = () => {
    console.log('compound combine', this.state);
    const { combineLeftSide, combineRightSide } = this.state;
    const combineChoice = compoundCombineChoices(combineLeftSide, combineRightSide);
    this.setState({ showConfirmCombine: false, combineChoice });
  };

  private handleConfirmAdd = () => {
    // console.log('handleConfirmAdd %o', this.state);
    const collectionName = PlanChoices.getCollectionName();
    const choice = this.state.combineChoice;
    const definitionData = { choice };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        const combineChoice = '';
        this.setState({ combineChoice });
      }
    });
    const showConfirmAdd = false;
    this.setState({ showConfirmAdd });
  };

  private handleConfirmDelete = () => {
    const collectionName = PlanChoices.getCollectionName();
    const doc = PlanChoices.findDoc({ choice: this.state.deletePlanChoice });
    const instance = doc._id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error deleting CareerGoal. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
    const showConfirmDelete = false;
    this.setState({ showConfirmDelete });
  };
  private handleDropInPlanArea = (dropResult) => {
    const dropTermNum = getPlanAreaTermNumber(dropResult.destination.droppableId);
    const termIndex = dropResult.destination.index;
    const source = dropResult.source.droppableId;
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    // console.log(dropTermNum, termIndex, source, choice);
    const { choiceList, coursesPerTerm } = this.state;
    if (source === CHOICE_AREA) {
      addChoiceToRaw(choice, dropTermNum, choiceList, coursesPerTerm, termIndex);
      updateChoiceCounts(choiceList);
    } else if (source.startsWith(PLAN_AREA)) {
      // changed a choice from in the plan.
      const sourceTerm = source.split('-')[2];
      if (sourceTerm === dropTermNum) {
        // reorder in same term
        reorderChoicesInTermRaw(choice, dropTermNum, termIndex, choiceList, coursesPerTerm);
      } else {
        // moved to new termNumber
        // console.log('moved term sourceTerm %o newTerm %o', sourceTerm, dropTermNum);
        removeChoiceFromPlanRaw(choice, sourceTerm, choiceList, coursesPerTerm);
        addChoiceToRaw(choice, dropTermNum, choiceList, coursesPerTerm, termIndex);
        updateChoiceCounts(choiceList);
      }
    }
    // console.log('plan area new state', { choiceList, coursesPerTerm });
    this.setState({ choiceList, coursesPerTerm });
  };

  private handleDropInChoiceArea(dropResult) {
    console.log(CHOICE_AREA, dropResult);
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    const source = dropResult.source.droppableId;
    console.log(source, choice);
    if (source === COMBINE_AREA) {
      this.setState({ addPlanChoice: choice, showConfirmAdd: true });
    } else if (source.startsWith(PLAN_AREA)) {
      const sourceTerm = source.split('-')[2];
      const { choiceList, coursesPerTerm } = this.state;
      removeChoiceFromPlanRaw(choice, sourceTerm, choiceList, coursesPerTerm);
      this.setState({ choiceList, coursesPerTerm });
    }
  }

  private handleDropInCombineArea(dropResult) {
    console.log(COMBINE_AREA, dropResult);
    const { combineChoice } = this.state;
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    const index = dropResult.destination.index;
    let combineLeftSide = '';
    let combineRightSide = '';
    if (combineChoice) {
      if (index === 0) {
        combineLeftSide = choice;
        combineRightSide = combineChoice;
      } else {
        combineLeftSide = combineChoice;
        combineRightSide = choice;
      }
      if (isSingleChoice(combineLeftSide) && isSingleChoice(combineRightSide)) {
        const newCombineChoice = simpleCombineChoices(combineLeftSide, combineRightSide);
        this.setState({ combineChoice: newCombineChoice });
      } else {
        this.setState({ showConfirmCombine: true, combineLeftSide, combineRightSide });
      }
    } else {
      this.setState({ combineChoice: choice });
    }
  }

  private handleDropInDeleteArea(dropResult) {
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    const source = dropResult.source.droppableId;
    if (source.startsWith(PLAN_AREA)) {
      const sourceTerm = source.split('-')[2];
      const { choiceList, coursesPerTerm } = this.state;
      removeChoiceFromPlanRaw(choice, sourceTerm, choiceList, coursesPerTerm);
      this.setState({ choiceList, coursesPerTerm });
    } else if (source === CHOICE_AREA) {
      if (isSingleChoice(choice)) {
        Swal.fire({
          title: 'Delete failed',
          text: `Cannot delete the single choice ${PlanChoiceCollection.toStringFromSlug(choice)}.`,
          type: 'error',
        });
      } else {
        this.setState({ showConfirmDelete: true, deletePlanChoice: choice });
      }
    }
  }

  private onDragEnd = (result) => {
    console.log('onDragEnd %o', result);
    const dropArea = getDropDestinationArea(result.destination.droppableId);
    switch (dropArea) {
      case PLAN_AREA:
        this.handleDropInPlanArea(result);
        break;
      case CHOICE_AREA:
        this.handleDropInChoiceArea(result);
        break;
      case COMBINE_AREA:
        this.handleDropInCombineArea(result);
        break;
      case DELETE_AREA:
        this.handleDropInDeleteArea(result);
        break;
      default:
      // do nothing?
    }
  };

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const degreeNames = _.map(this.props.degrees, docToShortName);
    const currentYear = AcademicTerms.getCurrentAcademicTermDoc().year;
    const schema = new SimpleSchema({
      degree: { type: String, allowedValues: degreeNames },
      name: String,
      year: { type: SimpleSchema.Integer, allowedValues: this.props.years, defaultValue: currentYear },
    });
    const { choiceList, coursesPerTerm } = this.state;
    // console.log(this.state);
    return (
      <Segment>
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
              <AdvisorAPBPlanViewWidget coursesPerTerm={coursesPerTerm} choiceList={choiceList}/>
            </Grid.Column>
            <Grid.Column width={6}>
              <AdvisorAPBPlanChoiceWidget choices={this.props.choices} combineChoice={this.state.combineChoice}/>
            </Grid.Column>
          </Grid>
        </DragDropContext>
        <Confirm open={this.state.showConfirmAdd} onCancel={this.handleCancelAdd} onConfirm={this.handleConfirmAdd}
                 confirmButton='Add Choice'
                 header="Add Plan Choice?" content={PlanChoiceCollection.toStringFromSlug(this.state.addPlanChoice)}/>
        <Confirm open={this.state.showConfirmDelete} onCancel={this.handleCancelDelete}
                 onConfirm={this.handleConfirmDelete}
                 confirmButton='Delete Choice'
                 header="Delete Plan Choice?"
                 content={PlanChoiceCollection.toStringFromSlug(this.state.deletePlanChoice)}/>
        <Confirm open={this.state.showConfirmCombine} cancelButton='Simple Combine' confirmButton='Compound Combine'
                 header='Simple or Compound Combine?' onCancel={this.handleSimpleCombine}
                 onConfirm={this.handleCompoundCombine}
                 content={`Do a simple combine ${this.state.combineLeftSide},${this.state.combineRightSide} or a compound combine (${this.state.combineLeftSide}),(${this.state.combineRightSide})?`}/>
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
})(AdvisorAPBuilderWidget);
