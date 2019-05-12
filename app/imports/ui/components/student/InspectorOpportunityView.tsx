import * as React from 'react';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import IceHeader from '../shared/IceHeader';
import UserInterestList from '../shared/UserInterestList';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { termIDsToString } from '../../../api/academic-term/AcademicTermUtilities';
import { getInspectorDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { selectOpportunity, selectOpportunityInstance } from '../../../redux/actions/actions';
import { IVerificationRequest, IVerificationRequestDefine } from '../../../typings/radgrad';

interface IInspectorOpportunityViewProps {
  opportunityID: string;
  studentID: string;
  opportunityInstanceID?: string;
  verificationRequest?: IVerificationRequest;
  selectOpportunity: (opportunityID: string) => any;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const mapDispatchToProps = (dispatch) => ({
    selectOpportunity: (opportunityID) => dispatch(selectOpportunity(opportunityID)),
    selectOpportunityInstance: (opportunityInstanceID) => dispatch(selectOpportunityInstance(opportunityInstanceID)),
  });

class InspectorOpportunityView extends React.Component<IInspectorOpportunityViewProps> {
  constructor(props) {
    super(props);
    // console.log(props);
  }

  private handleVRClick = (event, { value }) => {
    event.preventDefault();
    // console.log(value);
    const oi = OpportunityInstances.findDoc(value);
    const student = this.props.match.params.username;
    const collectionName = VerificationRequests.getCollectionName();
    const definitionData: IVerificationRequestDefine = {
      student,
      opportunityInstance: oi._id,
    };
    const inst = this; // tslint:disable-line: no-this-assignment
    console.log(inst.props);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Error requesting verification', error);
      }
    });
  }

  private handleRemoveClick = (event, { value }) => {
    event.preventDefault();
    console.log(`Remove OI ${value}`);
    const oi = OpportunityInstances.findDoc(value);
    const collectionName = OpportunityInstances.getCollectionName();
    const instance = value;
    const inst = this; // tslint:disable-line: no-this-assignment
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.error(`Remove opportunityInstance ${instance} failed`, error);
      } else {
        inst.props.selectOpportunity(oi.opportunityID);
      }
    });
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
      hasRequest = !!this.props.verificationRequest;
      if (hasRequest) {
        const request = this.props.verificationRequest;
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
    // console.log('instance %o', opportunityInstance);
    return (
      <Container fluid={true} style={paddingStyle}>
        <Header as="h4" dividing={true}>{opportunity.num} {opportunity.name} <IceHeader
          ice={opportunity.ice}/></Header>
        {plannedOpportunity ? <Button floated="right" basic={true} color="green" onClick={this.handleRemoveClick}
                                      size="tiny" value={opportunityInstance._id}>remove</Button> : (pastOpportunity ?
          <Button floated="right" basic={true} color="green"
                  size="tiny">taken</Button> :
          <Droppable droppableId={'inspecto-opportunity'}>
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
                      style={getInspectorDraggablePillStyle(
                        snap.isDragging,
                        prov.draggableProps.style,
                      )}
                    >
                      <NamePill name={opportunityName}/>
                    </div>
                  )}
                </Draggable>
              </div>)}
          </Droppable>)}

        <b>When: {opportunityInstance ? AcademicTerms.toString(opportunityInstance.termID) : termIDsToString(opportunity.termIDs)}</b>
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
            <Button basic={true} color="green" size="tiny" onClick={this.handleVRClick} value={opportunityInstance._id}>Request
              Verification</Button>
          </div>
        ) : (
          <div>
            <Header as="h4" textAlign="center" dividing={true}>REQUEST STATUS</Header>
            <strong>Date Submitted:</strong> {whenSubmitted} <br/>
            <strong>Status: </strong>{requestStatus}
            {_.map(requestHistory, (processed, index) => (
                <p key={index}>
                <span>Processed: {moment(processed.date).calendar()} by {processed.verifier}
                  ({processed.status}) <em>{processed.feedback}</em></span><br/>
                </p>
              ))}
          </div>
        )) : ''
        }
      </Container>
    );
  }
}

const InspectorOpportunityViewCont = withTracker((props) => {
  // console.log(props);
  if (props.opportunityInstanceID) {
    const verificationRequests = VerificationRequests.find({ opportunityInstanceID: props.opportunityInstanceID }).fetch();
    if (verificationRequests.length > 0) {
      return {
        verificationRequest: verificationRequests[0],
      };
    }
    return {};
  }
  return {};
})(InspectorOpportunityView);
const InspectorOpportunityViewContainer = connect(null, mapDispatchToProps)(InspectorOpportunityViewCont);
export default withRouter(InspectorOpportunityViewContainer);
