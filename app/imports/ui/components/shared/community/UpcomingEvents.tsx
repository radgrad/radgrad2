import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Grid } from 'semantic-ui-react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import UpComingEventsCard from './UpComingEventsCard';

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
}
const UpcomingEvents: React.FC<UpcomingEventsProp> = ( upComingEventsList ) => {
  const header = <RadGradHeader title='Upcoming Events' icon='calendar alternate outline' />;
  const eventList = upComingEventsList.upComingEventsList;
  const gridStyle = { overflow: 'auto', height: 350 };
  return (
    <RadGradSegment header={header}>
      <Grid style={gridStyle}>
        {eventList.map((event) => (
          <UpComingEventsCard event={event} />
        ))}
      </Grid>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const opportunities = Opportunities.findNonRetired({});
  const date = new Date();
  const currentDate = moment(date).format('MM/DD/YYYY');
  const threeMonths = moment(currentDate).add(3, 'months');
  const upComingEventsList = [];
  opportunities.forEach((opportunity) => {
    if (opportunity.eventDate1) {
      const temp = moment(opportunity.eventDate1).format('MM/DD/YYYY');
      if (moment(temp).isBetween(currentDate, threeMonths)) {
        upComingEventsList.push({ id: opportunity._id, name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate1).format('MM/DD/YYYY'), label: opportunity.eventDateLabel1, interestIDs: opportunity.interestIDs  });
      }
    }

    if (opportunity.eventDate2 ) {
      const temp = moment(opportunity.eventDate2).format('MM/DD/YYYY');
      if (moment(temp).isBetween(currentDate, threeMonths)) {
        upComingEventsList.push({ id: opportunity._id, name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate2).format('MM/DD/YYYY'), label: opportunity.eventDateLabel2, interestIDs: opportunity.interestIDs });
      }
    }

    if (opportunity.eventDate3) {
      const temp = moment(opportunity.eventDate3).format('MM/DD/YYYY');
      if (moment(temp).isBetween(currentDate, threeMonths)) {
        upComingEventsList.push({ id: opportunity._id,  name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate3).format('MM/DD/YYYY'), label: opportunity.eventDateLabel3, interestIDs: opportunity.interestIDs  });
      }
    }

    if (opportunity.eventDate4) {
      const temp = moment(opportunity.eventDate4).format('MM/DD/YYYY');
      if (moment(temp).isBetween(currentDate, threeMonths)) {
        upComingEventsList.push({ id: opportunity._id,  name: opportunity.name, picture: opportunity.picture, date: moment(opportunity.eventDate4).format('MM/DD/YYYY'), label: opportunity.eventDateLabel4, interestIDs: opportunity.interestIDs  });
      }
    }
  });
  return {
    upComingEventsList,
  };
})(UpcomingEvents);
