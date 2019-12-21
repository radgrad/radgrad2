import * as React from 'react';
import { Button, Menu, Popup } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { IOpportunity, IOpportunityInstanceDefine, IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import * as Router from '../shared/RouterHelperFunctions';
import {
  academicTermNameToSlug,
  itemToSlugName,
  opportunityTermsNotTaken,
  unverifiedOpportunityTermNames,
} from '../shared/data-model-helper-functions';

interface IStudentExplorerOpportunitiesWidgetButtonProps {
  buttonType: 'remove' | 'add';
  opportunity: IOpportunity,
  match: IRadGradMatch;
}

const handleAddToPlan = (props: IStudentExplorerOpportunitiesWidgetButtonProps) => (e: any): void => {
  e.preventDefault();
  const opportunity = props.opportunity;
  const term = e.target.text;
  const oppSlug = itemToSlugName(opportunity);
  const termSlug = academicTermNameToSlug(term);
  const username = Router.getUsername(props.match);
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
};

const handleRemoveFromPlan = (props: IStudentExplorerOpportunitiesWidgetButtonProps) => (e: any): void => {
  e.preventDefault();
  const opportunity = props.opportunity;
  const term = e.target.text;
  const termSplit = term.split(' ');
  const termSlug = `${termSplit[0]}-${termSplit[1]}`;
  const termID = AcademicTerms.getID(termSlug);
  const oi = OpportunityInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
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
    username: Router.getUsername(props.match), type: 'removeOpportunity',
    typeData: Slugs.getNameFromID(opportunity.slugID),
  };
  userInteractionDefineMethod.call(interactionData, (err) => {
    if (err) {
      console.log('Error creating UserInteraction', err);
    }
  });
};


const StudentExplorerOpportunitiesWidgetButton = (props: IStudentExplorerOpportunitiesWidgetButtonProps) => {
  const { buttonType } = props;
  const isAddButtonType = buttonType === 'add';
  const isRemoveButtonType = buttonType === 'remove';
  const opportunityTerms = opportunityTermsNotTaken(props.opportunity, Router.getUserIdFromRoute(props.match));
  const empty = opportunityTerms.length === 0;
  const existingTerms = unverifiedOpportunityTermNames(props.opportunity, Router.getUserIdFromRoute(props.match));

  // FIXME: Remove from Plan Button doesn't go away if you removed everything
  // FIXME: Only one Popup should be open at a time and they need to close once an item has been picked
  return (
    <React.Fragment>
      {
        isAddButtonType ? (
          <Popup
            trigger={
              <Button basic color="green" size="mini" floated="right">ADD TO PLAN</Button>
            }
            position="right center"
            className="transition"
            size="mini"
            on="click"
          >
            <Popup.Content>
              <Menu vertical>
                {
                  empty ?
                    <Menu.Item as="a">No available future academic terms.</Menu.Item>
                    : (
                      <React.Fragment>
                        {
                        opportunityTerms.map((term, index) => (
                          <Menu.Item key={index} as="a" onClick={handleAddToPlan(props)}>{term}</Menu.Item>
                        ))
                      }
                      </React.Fragment>
                  )
}
              </Menu>
            </Popup.Content>
          </Popup>
        )
          : (
            <React.Fragment>
              {
              isRemoveButtonType ? (
                <Popup
                  trigger={
                    <Button basic color="green" size="mini" floated="right">REMOVE FROM PLAN</Button>
                  }
                  position="right center"
                  className="transition"
                  on="click"
                >
                  <Popup.Content>
                    <Menu vertical>
                      {
                        existingTerms.map((term, index) => (
                          <Menu.Item key={index} as="a" onClick={handleRemoveFromPlan(props)}>{term}</Menu.Item>
                        ))
                      }
                    </Menu>
                  </Popup.Content>
                </Popup>
              )
                : ''
            }
            </React.Fragment>
        )
}
    </React.Fragment>
  );
};

export default withRouter(StudentExplorerOpportunitiesWidgetButton);
