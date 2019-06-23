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
import { combineChoices, stripCounter } from '../../../api/degree-plan/PlanChoiceUtilities';
import {
  CHOICE_AREA,
  COMBINE_AREA, DELETE_AREA,
  getDropDestinationArea, getPlanAreaTermNumber,
  PLAN_AREA,
  stripPrefix,
} from './AcademicPlanBuilderUtilities';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

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
    };
  }

  private handleCancelAdd = () => {
    this.setState({ showConfirmAdd: false });
  };

  private handleConfirmAdd = () => {
    console.log('handleConfirmAdd %o', this.state);
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

  private handleDropInPlanArea = (dropResult) => {
    const dropTermNum = getPlanAreaTermNumber(dropResult.destination.droppableId);
    const termIndex = dropResult.destination.index;
    const source = dropResult.source.droppableId;
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    console.log(dropTermNum, termIndex, source, choice);
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
        console.log('moved term sourceTerm %o newTerm %o', sourceTerm, dropTermNum);
        removeChoiceFromPlanRaw(choice, sourceTerm, choiceList, coursesPerTerm);
        addChoiceToRaw(choice, dropTermNum, choiceList, coursesPerTerm, termIndex);
        updateChoiceCounts(choiceList);
      }
    }
    console.log('plan area new state', { choiceList, coursesPerTerm });
    this.setState({ choiceList, coursesPerTerm });
  };

  private handleDropInChoiceArea(dropResult) {
    console.log(CHOICE_AREA, dropResult);
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    this.setState({ addPlanChoice: choice, showConfirmAdd: true });
  }

  private handleDropInCombineArea(dropResult) {
    console.log(COMBINE_AREA, dropResult);
    const { combineChoice } = this.state;
    const choice = stripCounter(stripPrefix(dropResult.draggableId));
    if (combineChoice) {
      const newCombineChoice = combineChoices(this.state.combineChoice, choice);
      console.log(COMBINE_AREA, { newCombineChoice });
      this.setState({ combineChoice: newCombineChoice });
    } else {
      this.setState({ combineChoice: choice });
    }
  }

  private handleDropInDeleteArea(dropResult) {
    console.log(DELETE_AREA, dropResult);
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
    console.log(this.state);
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
                 header="Add Plan Choice?" content={PlanChoiceCollection.toStringFromSlug(this.state.addPlanChoice)}/>
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
