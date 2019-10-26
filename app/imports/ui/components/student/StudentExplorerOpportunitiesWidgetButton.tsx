import * as React from 'react';
import { Button, Menu, Popup } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { IOpportunity, IOpportunityInstanceDefine } from '../../../typings/radgrad'; // eslint-disable-line
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import * as Router from '../shared/RouterHelperFunctions';
import { opportunityTermsNotTaken, unverifiedOpportunityTermNames } from '../shared/data-model-helper-functions';

interface IStudentExplorerOpportunitiesWidgetButtonProps {
  buttonType: 'remove' | 'add';
  opportunity: IOpportunity,
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      course: string;
    }
  };
}

class StudentExplorerOpportunitiesWidgetButton extends React.Component<IStudentExplorerOpportunitiesWidgetButtonProps> {
  constructor(props) {
    super(props);
  }

  private handleAddToPlan = (e: any): void => {
    e.preventDefault();
    const opportunity = this.props.opportunity;
    const term = e.target.text;
    const oppSlug = Slugs.findDoc({ _id: opportunity.slugID });
    const termSplit = term.split(' ');
    const termSlug = `${termSplit[0]}-${termSplit[1]}`;
    const username = Router.getUsername(this.props.match);
    const definitionData: IOpportunityInstanceDefine = {
      academicTerm: termSlug,
      opportunity: oppSlug.name,
      verified: false,
      student: username,
    };
    const collection = OpportunityInstances;
    const collectionName = collection.getCollectionName();
    defineMethod.call({ collectionName, definitionData });
    const interactionData = { username, type: 'addOpportunity', typeData: oppSlug.name };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  }

  private handleRemoveFromPlan = (e: any): void => {
    e.preventDefault();
    const opportunity = this.props.opportunity;
    const term = e.target.text;
    const termSplit = term.split(' ');
    const termSlug = `${termSplit[0]}-${termSplit[1]}`;
    const termID = AcademicTerms.getID(termSlug);
    const oi = OpportunityInstances.find({
      studentID: Router.getUserIdFromRoute(this.props.match),
      opportunityID: opportunity._id,
      termID: termID,
    }).fetch();
    if (oi.length > 1) {
      console.log('Too many opportunity instances found for a single academic term.');
    }
    const collection = OpportunityInstances;
    const collectionName = collection.getCollectionName();
    removeItMethod.call({ collectionName, instance: oi[0]._id });
    const interactionData = {
      username: Router.getUsername(this.props.match), type: 'removeOpportunity',
      typeData: Slugs.getNameFromID(opportunity.slugID),
    };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { buttonType } = this.props;
    const isAddButtonType = buttonType === 'add';
    const isRemoveButtonType = buttonType === 'remove';
    const opportunityTerms = opportunityTermsNotTaken(this.props.opportunity, Router.getUserIdFromRoute(this.props.match));
    const empty = opportunityTerms.length === 0;
    const existingTerms = unverifiedOpportunityTermNames(this.props.opportunity, Router.getUserIdFromRoute(this.props.match));

    // FIXME: Remove from Plan Button doesn't go away if you removed everything
    // FIXME: Only one Popup should be open at a time and they need to close once an item has been picked
    return (
      <React.Fragment>
        {
          isAddButtonType ?
            <Popup
              trigger={
                <Button basic={true} color="green" size="mini" floated="right">ADD TO PLAN</Button>
              }
              position="right center"
              className="transition"
              size="mini"
              on="click"
            >
              <Popup.Content>
                <Menu vertical={true}>
                  {
                    empty ?
                      <Menu.Item as="a">No available future academic terms.</Menu.Item>
                      :
                      <React.Fragment>
                        {
                          opportunityTerms.map((term, index) => (
                            <Menu.Item key={index} as="a" onClick={this.handleAddToPlan}>{term}</Menu.Item>
                          ))
                        }
                      </React.Fragment>
                  }
                </Menu>
              </Popup.Content>
            </Popup>
            :
            <React.Fragment>
              {
                isRemoveButtonType ?
                  <Popup
                    trigger={
                      <Button basic={true} color="green" size="mini" floated="right">REMOVE FROM PLAN</Button>
                    }
                    position="right center"
                    className="transition"
                    on="click"
                  >
                    <Popup.Content>
                      <Menu vertical={true}>
                        {
                          existingTerms.map((term, index) => (
                            <Menu.Item key={index} as="a" onClick={this.handleRemoveFromPlan}>{term}</Menu.Item>
                          ))
                        }
                      </Menu>
                    </Popup.Content>
                  </Popup>
                  : ''
              }
            </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default withRouter(StudentExplorerOpportunitiesWidgetButton);
