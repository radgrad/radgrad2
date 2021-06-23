import React from 'react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';
import {withTracker} from "meteor/react-meteor-data";
import {Opportunities} from "../../../../api/opportunity/OpportunityCollection";
import {Opportunity} from "../../../../typings/radgrad";
import moment from "moment";

interface UpcomingEventsProp {
  opportunities: Opportunity[];
}
const UpcomingEvents: React.FC<UpcomingEventsProp> = ( opportunities ) => {
  const header = <RadGradHeader title='Upcoming Events' icon='calendar alternate outline' />;
  return (
    <RadGradSegment header={header} >
      To be implemented: A list of upcoming opportunities, ordered by event date.
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const opportunities = Opportunities.findNonRetired({});
  const date = new Date();
  const currentDate = moment(date).format('MM/DD/YYYY');
  const threeMonths = moment(currentDate).add(3, 'months');
  const upComingEvents = [];
  opportunities.forEach((opportunity) => {
    if (opportunity.eventDate1) {
      const temp = moment(opportunity.eventDate1).format('MM/DD/YYYY');
      if (moment(temp).isBetween(currentDate, threeMonths)) {
        upComingEvents.push({ name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate1).format('MM/DD/YYYY'), label: opportunity.eventDateLabel1});
      }
    }

    if (opportunity.eventDate2 ) {
      const temp = moment(opportunity.eventDate2).format('MM/DD/YYYY');
      if (moment(temp).isBetween(currentDate, threeMonths)) {
        upComingEvents.push({ name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate1).format('MM/DD/YYYY'), label: opportunity.eventDateLabel2});
      }
    }

    if (opportunity.eventDate3) {
      const temp = moment(opportunity.eventDate3).format('MM/DD/YYYY');
      if (moment(temp).isBetween(currentDate, threeMonths)) {
        upComingEvents.push({ name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate1).format('MM/DD/YYYY'), label: opportunity.eventDateLabel3});
      }
    }

    if (opportunity.eventDate4) {
      const temp = moment(opportunity.eventDate4).format('MM/DD/YYYY');
      if (moment(temp).isBetween(currentDate, threeMonths)) {
        upComingEvents.push({ name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate1).format('MM/DD/YYYY'), label: opportunity.eventDateLabel4});
      }
    }
  })
  console.log(upComingEvents);
  return {
    opportunities,
  };
})(UpcomingEvents);
