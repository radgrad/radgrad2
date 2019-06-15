import * as React from 'react';
import { Button, Menu, Popup } from 'semantic-ui-react';
import * as _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { IOpportunity, IOpportunityInstanceDefine } from '../../../typings/radgrad'; // eslint-disable-line
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

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

  private getUsername = () => this.props.match.params.username;

  private getUserIdFromRoute = (): string => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private opportunityTerms = (): string[] => {
    const opp = this.props.opportunity;
    const terms = opp.termIDs;
    const takenTerms = [];
    const termNames = [];
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const opportunity = this.props.opportunity;
    const oi = OpportunityInstances.find({
      studentID: this.getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.forEach(oi, (o) => {
      takenTerms.push(o.termID);
    });
    _.forEach(terms, (term) => {
      if (AcademicTerms.findDoc(term).termNumber >= currentTerm.termNumber) {
        if (!_.includes(takenTerms, term)) {
          termNames.push(AcademicTerms.toString(term));
        }
      }
    });
    return termNames.slice(0, 8);
  }

  private existingTerms = (): string[] => {
    const terms = [];
    const opportunity = this.props.opportunity;
    const oi = OpportunityInstances.find({
      studentID: this.getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.forEach(oi, (o) => {
      if (!o.verified) {
        terms.push(AcademicTerms.toString(o.termID, false));
      }
    });
    return terms;
  }

  private handleAddToPlan = (e: any): void => {
    e.preventDefault();
    const opportunity = this.props.opportunity;
    const term = e.target.text;
    const oppSlug = Slugs.findDoc({ _id: opportunity.slugID });
    const termSplit = term.split(' ');
    const termSlug = `${termSplit[0]}-${termSplit[1]}`;
    const username = this.getUsername();
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
      studentID: this.getUserIdFromRoute(),
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
      username: this.getUsername(), type: 'removeOpportunity',
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
    const opportunityTerms = this.opportunityTerms();
    const empty = opportunityTerms.length === 0;
    const existingTerms = this.existingTerms();

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
