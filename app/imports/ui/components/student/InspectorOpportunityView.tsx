import * as React from 'react';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { NavLink, withRouter } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import IceHeader from '../shared/IceHeader';
import UserInterestList from '../shared/UserInterestList';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getInspectorViewItemStyle } from './StyleFunctions';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import has = Reflect.has;

interface IInspectorOpportunityViewProps {
  opportunityID: string;
  studentID: string;
  opportunityInstanceID?: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class InspectorOpportunityView extends React.Component<IInspectorOpportunityViewProps> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(event, { value }) {
    event.preventDefault();
    console.log(value);
  }

  public render() {
    const opportunity = Opportunities.findDoc(this.props.opportunityID);
    const opportunitySlug = Slugs.getNameFromID(opportunity.slugID);
    const opportunityName = opportunity.name;
    let opportunityInstance;
    let plannedOpportunity = false;
    let pastOpportunity = false;
    let hasRequest = false;
    let whenSubmitted = '';
    let requestStatus = '';
    let requestHistory = [];
    if (this.props.opportunityInstanceID) {
      opportunityInstance = OpportunityInstances.findDoc(this.props.opportunityInstanceID);
      const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
      const opportunityTerm = AcademicTerms.findDoc(opportunityInstance.termID);
      plannedOpportunity = currentTerm.termNumber <= opportunityTerm.termNumber;
      pastOpportunity = currentTerm.termNumber > opportunityTerm.termNumber;
      const requests = VerificationRequests.find({ opportunityInstanceID: opportunityInstance._id }).fetch();
      hasRequest = requests.length > 0;
      if (hasRequest) {
        const request = requests[0];
        whenSubmitted = moment(request.submittedOn).calendar();
        requestStatus = request.status;
        requestHistory = request.processed;
      }
    }
    const paddingStyle = {
      paddingTop: 15,
      paddingBottom: 15,
    };
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `/#${baseUrl.substring(0, baseIndex)}${username}/explorer/opportunities/${opportunitySlug}`;
    // console.log(opportunity, pastOpportunity, hasRequest);
    return (
      <Container fluid={true} style={paddingStyle}>
        <Header as="h4" dividing={true}>{opportunity.num} {opportunity.name} <IceHeader
          ice={opportunity.ice}/></Header>
        {plannedOpportunity ? <Button floated="right" basic={true} color="green"
                                      size="tiny">remove</Button> : (pastOpportunity ?
          <Button floated="right" basic={true} color="green"
                  size="tiny">taken</Button> : <Droppable droppableId={`inspector-opportunity`}>
            {(provided) => (
              <div
                ref={provided.innerRef}
              >
                <Draggable key={opportunitySlug} draggableId={opportunitySlug} index={0}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      style={getInspectorViewItemStyle(
                        snap.isDragging,
                        prov.draggableProps.style,
                      )}
                    >
                      <b>{opportunityName}</b>
                    </div>
                  )}
                </Draggable>
              </div>)}
          </Droppable>)}

        <b>When: {opportunityInstance ? AcademicTerms.toString(opportunityInstance.termID) : 'N/A'}</b>
        <p><b>Description:</b></p>
        <Markdown escapeHtml={true} source={opportunity.description}/>
        <p/>
        <p><b>Interests:</b></p>
        <UserInterestList userID={this.props.studentID} interestIDs={opportunity.interestIDs}/>
        <p/>
        <a href={baseRoute}>View in Explorer <Icon name="arrow right"/></a>
        <p/>
        {(pastOpportunity) ? (!hasRequest ? (
          <div>
            <Header dividing={true}/>
            <Button basic={true} color="green" size="tiny" onClick={this.handleClick} value={opportunity._id}>Request
              Verification</Button>
          </div>
        ) : (
          <div>
            <Header as="h4" textAlign="center" dividing={true}>REQUEST STATUS</Header>
            <strong>Date Submitted:</strong> {whenSubmitted} <br/>
            <strong>Status: </strong>{requestStatus}
            {_.map(requestHistory, (processed, index) => {
              return (
                  <p key={index}>
                    <span>Processed: {moment(processed.date).calendar()} by {processed.verifier}
                      ({processed.status}) <em>{processed.feedback}</em></span><br/>
                  </p>
              );
            },
            )}
          </div>
        )) : ''
        }
      </Container>
    );
  }
}

export default withRouter(InspectorOpportunityView);
