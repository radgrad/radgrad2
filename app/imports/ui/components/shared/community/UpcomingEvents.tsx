import React from 'react';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Grid } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import UpComingEventsList from './UpComingEventsList';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import * as Router from '../utilities/router';
import { Opportunity, OpportunityInstance } from '../../../../typings/radgrad';

interface UpcomingEventsProp {
  plannerOpportunities: OpportunityInstance[];
  opportunities: Opportunity[];
  userID: string,
  dayBefore: Date,
  threeMonths: Date;
}

const dateFormat = 'MM/DD/YYYY';

const UpcomingEvents: React.FC<UpcomingEventsProp> = ({ opportunities, dayBefore, threeMonths, plannerOpportunities, userID }) => {
  const gridStyle = { overflow: 'auto', height: 350 };
  const header = <RadGradHeader title='Upcoming Events' icon='calendar alternate outline' />;
  const plannerOppIDs = plannerOpportunities.map(opportunity => opportunity.opportunityID);
  const eventList = [];

  // Traverse through each opportunity w/ events
  opportunities.forEach((opportunity) => {
    let count = 1;
    while (count < 5) {
      const eventDate = opportunity[`eventDate${count}`];
      const eventLabel = opportunity[`eventDateLabel${count}`];
      if (eventDate) {
        const temp = moment(eventDate);
        if (moment(temp).isBetween(dayBefore, threeMonths)) {
          eventList.push({
            id: opportunity._id + temp,
            OpportunityID: opportunity._id,
            name: opportunity.name,
            picture: opportunity.picture,
            date: moment.utc(temp).format(dateFormat),
            label: eventLabel,
            interestIDs: opportunity.interestIDs,
          });
        }
      }
      count++;
    }
  });
  const upComingEvents = _.sortBy(eventList, (event) => event.date);
  return (
    <RadGradSegment header={header}>
      <Grid style={gridStyle} divided='vertically'>
        {upComingEvents.map((event) => (
          <UpComingEventsList key={event.id} event={event} plannerOppIDs={plannerOppIDs} userID={userID} />
        ))}
      </Grid>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const opportunities = Opportunities.findNonRetired({}).filter(opportunity => opportunity.eventDateLabel1 !== undefined || opportunity.eventDateLabel2 !== undefined || opportunity.eventDateLabel3 !== undefined || opportunity.eventDateLabel4 !== undefined );

  // Find yesterday's date and the date three months from now
  const dayBefore = moment(new Date()).subtract(1, 'days').format();
  const threeMonths = moment(new Date()).add(3, 'months').format();

  // Find the academic term of yesterday and 3 months from today
  const currentTerm = AcademicTerms.getAcademicTerm(dayBefore);
  const nextTerm = AcademicTerms.getAcademicTerm(threeMonths);
  const currentPlannerOpp = OpportunityInstances.findNonRetired({ studentID: userID, termID: currentTerm });
  let plannerOpportunities = currentPlannerOpp;

  // If the current term is not the same in three months, include opportunity instances of next term
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
