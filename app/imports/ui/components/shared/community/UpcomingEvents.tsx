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

interface UpcomingEventsProp {
  plannerOpportunities: Opportunity[];
  opportunities: Opportunity[];
  userID: string,
  dayBefore: Date,
  threeMonths: Date;
}

const dateFormat = (date) => moment(date).format('MM/DD/YYYY');

const UpcomingEvents: React.FC<UpcomingEventsProp> = ({ opportunities, dayBefore, threeMonths, plannerOpportunities, userID }) => {
  const header = <RadGradHeader title='Upcoming Events' icon='calendar alternate outline' />;
  const gridStyle = { overflow: 'auto', height: 350 };
  const plannerOppIDs = _.map(plannerOpportunities, 'opportunityID');
  const eventList = [];

  // Traversing through each opportunity
  opportunities.forEach((opportunity) => {
    let count = 1;
    while (count < 5) {
      const eventDate = opportunity[`eventDate${count}`];
      const eventLabel = opportunity[`eventDateLabel${count}`];
      if (eventDate) {
        const temp = dateFormat(eventDate);
        if (moment(temp).isBetween(dayBefore, threeMonths)) {
          eventList.push({
            OpportunityID: opportunity._id,
            name: opportunity.name,
            picture: opportunity.picture,
            date: temp,
            label: eventLabel,
            interestIDs: opportunity.interestIDs,
          });
        }
      }
      count++;
    }
  });
  const upComingEventsList = _.sortBy(eventList, ['date']);
  return (
    <RadGradSegment header={header}>
      <Grid style={gridStyle} divided='vertically'>
        {upComingEventsList.map((event) => (
          <UpComingEventsCard key={event.uniqueId} event={event} plannerOppIDs={plannerOppIDs} userID={userID} />
        ))}
      </Grid>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const opportunities = Opportunities.findNonRetired({}).filter(opportunity => opportunity.eventDateLabel1 !== undefined || opportunity.eventDateLabel2 !== undefined || opportunity.eventDateLabel3 !== undefined || opportunity.eventDateLabel4 !== undefined );

  const date = new Date();
  const currentDate = dateFormat(date);

  // Finding yesterday's date and the date three months from now
  const dayBefore = dateFormat(moment(currentDate).subtract(1, 'days'));
  const threeMonths = dateFormat(moment(currentDate).add(3, 'months'));

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
  return {
    opportunities,
    dayBefore,
    threeMonths,
    plannerOpportunities,
    userID,
  };
})(UpcomingEvents);
