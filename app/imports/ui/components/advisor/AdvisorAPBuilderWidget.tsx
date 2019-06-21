import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Form, Grid, Header, Segment } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import AutoForm from 'uniforms-semantic/AutoForm';
import SelectField from 'uniforms-semantic/SelectField';
import TextField from 'uniforms-semantic/TextField';
import { DragDropContext } from 'react-beautiful-dnd';
import { IDesiredDegree, IPlanChoiceDefine } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { docToShortName } from '../shared/AdminDataModelHelperFunctions';
import AdvisorAPBPlanViewWidget from './AdvisorAPBPlanViewWidget';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';
import AdvisorAPBPlanChoiceWidget from './AdvisorAPBPlanChoiceWidget';
import { addChoiceToRaw, updateChoiceCounts } from '../../../api/degree-plan/AcademicPlanUtilities';

interface IAdvisorAPBuilderWidgetProps {
  degrees: IDesiredDegree[];
  choices: IPlanChoiceDefine[],
  years: number[];
}

interface IAdvisorAPBuilderWidgetState {
  choiceList: string[];
  coursesPerTerm: number[];
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
    this.state = { choiceList: [], coursesPerTerm };
  }

  private onDragEnd = (result) => {
    // console.log('onDragEnd %o', result);
    const dropTermNum = result.destination.droppableId.split('-')[2];
    const choice = result.draggableId;
    // console.log(dropTermNum, choice);
    const { choiceList, coursesPerTerm } = this.state;
    addChoiceToRaw(choice, dropTermNum, choiceList, coursesPerTerm);
    updateChoiceCounts(choiceList);
    console.log('new state %o', { choiceList, coursesPerTerm });
    this.setState({ choiceList, coursesPerTerm });
  }

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
              <AdvisorAPBPlanChoiceWidget choices={this.props.choices}/>
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
})(AdvisorAPBuilderWidget);
