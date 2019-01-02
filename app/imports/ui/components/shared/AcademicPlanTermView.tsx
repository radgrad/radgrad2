import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getDroppableListStyle } from './StyleFunctions';
import DraggablePlanChoicePill from './DraggablePlanChoicePill';
import * as PlanChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';
import NamePill from './NamePill';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';

interface IAcademicPlanTermViewProps {
  title: string;
  id: string;
  choices: string[];
  studentID: string;
}

class AcademicPlanTermView extends React.Component<IAcademicPlanTermViewProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactNode {
    const noPaddingStyle = {
      padding: 2,
      margin: 2,
    };
    return (
      <Segment style={noPaddingStyle}>
        <Header dividing={true}>{this.props.title}</Header>
        <Droppable droppableId={`${this.props.id}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              // style={style}
              style={getDroppableListStyle(snapshot.isDraggingOver)}
            >
              {_.map(this.props.choices, (choice, index) => {
                if (PlanChoiceUtils.isSingleChoice(choice) && !PlanChoiceUtils.isXXChoice(choice)) {
                  return (
                    <DraggablePlanChoicePill key={index} choice={choice} index={index}
                                             studentID={this.props.studentID}/>
                  );
                }
                return (<div key={index}><NamePill name={PlanChoiceCollection.toStringFromSlug(choice)}/></div>);
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Segment>
    );
  }
}

export default AcademicPlanTermView;
