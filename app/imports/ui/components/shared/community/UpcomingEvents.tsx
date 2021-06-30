import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Grid } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router';
import _ from 'lodash';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import UpComingEventsCard from './UpComingEventsCard';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import * as Router from '../utilities/router';
import { Opportunity } from '../../../../typings/radgrad';

interface eventsProp{
  id: string,
  name: string,
  picture: string,
  date: string,
  label: string,
  interestIDs: string[];
}

interface UpcomingEventsProp {
  upComingEventsList: eventsProp[];
  plannerOpportunities: Opportunity[];
  userID: string,
}
const UpcomingEvents: React.FC<UpcomingEventsProp> = ({ upComingEventsList, plannerOpportunities, userID }) => {
  const header = <RadGradHeader title='Upcoming Events' icon='calendar alternate outline' />;
  const gridStyle = { overflow: 'auto', height: 350 };
  const plannerOppIDs = _.map(plannerOpportunities, 'opportunityID');
  return (
    <RadGradSegment header={header}>
      <Grid style={gridStyle} divided='vertically'>
        {upComingEventsList.map((event) => (
          <UpComingEventsCard event={event} plannerOppIDs={plannerOppIDs} userID={userID} />
        ))}
      </Grid>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const opportunities = Opportunities.findNonRetired({});

  const date = new Date();
  const currentDate = moment(date).format('MM/DD/YYYY');

  // Finding yesterday's date and the date three months from now
  const dayBefore = moment(currentDate).subtract(1, 'days').format('MM/DD/YYYY');
  const threeMonths = moment(currentDate).add(3, 'months').format('MM/DD/YYYY');
  const eventList = [];
  // Finding the academic term of yesterday and 3 months from today
  const currentTerm = AcademicTerms.getAcademicTerm(dayBefore);
  const nextTerm = AcademicTerms.getAcademicTerm(threeMonths);
  const currentPlannerOpp = OpportunityInstances.findNonRetired({ studentID: userID, termID: currentTerm });
  let plannerOpportunities = currentPlannerOpp;
  // If the current term is not the same in three months
  if (currentTerm !== nextTerm) {
    const nextPlannerOpp = OpportunityInstances.findNonRetired({ studentID: userID, termID: nextTerm });
    plannerOpportunities = [...currentPlannerOpp, ...nextPlannerOpp];
  }

  // Traversing through each opportunity
  opportunities.forEach((opportunity) => {
    if (opportunity.eventDate1) {
      const temp = moment(opportunity.eventDate1).format('MM/DD/YYYY');

      // If the event date is in between yesterday's date and the date three months from now
      if (moment(temp).isBetween(dayBefore, threeMonths)) {
        eventList.push({ id: opportunity._id, name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate1).format('MM/DD/YYYY'), label: opportunity.eventDateLabel1, interestIDs: opportunity.interestIDs  });
      }
    }

    if (opportunity.eventDate2 ) {
      const temp = moment(opportunity.eventDate2).format('MM/DD/YYYY');
      if (moment(temp).isBetween(dayBefore, threeMonths)) {
        eventList.push({ id: opportunity._id, name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate2).format('MM/DD/YYYY'), label: opportunity.eventDateLabel2, interestIDs: opportunity.interestIDs });
      }
    }

    if (opportunity.eventDate3) {
      const temp = moment(opportunity.eventDate3).format('MM/DD/YYYY');
      if (moment(temp).isBetween(dayBefore, threeMonths)) {
        eventList.push({ id: opportunity._id,  name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate3).format('MM/DD/YYYY'), label: opportunity.eventDateLabel3, interestIDs: opportunity.interestIDs  });
      }
    }

    if (opportunity.eventDate4) {
      const temp = moment(opportunity.eventDate4).format('MM/DD/YYYY');
      if (moment(temp).isBetween(dayBefore, threeMonths)) {
        eventList.push({ id: opportunity._id,  name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate4).format('MM/DD/YYYY'), label: opportunity.eventDateLabel4, interestIDs: opportunity.interestIDs  });
      }
    }
  });
  const upComingEventsList = _.sortBy(eventList, ['date']);
  return {
    upComingEventsList,
    plannerOpportunities,
    userID,
  };
})(UpcomingEvents);
