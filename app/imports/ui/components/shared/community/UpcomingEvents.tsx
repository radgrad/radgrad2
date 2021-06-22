import React, {useEffect, useState} from 'react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';
import {WHATS_NEW_FIELDS, WhatsNewData} from "../../../../api/whats-new/WhatsNew";
import { getWhatsNew } from "../../../../api/whats-new/WhatsNew.methods";

const UpcomingEvents: React.FC = () => {
  const header = <RadGradHeader title='Upcoming Events' icon='calendar alternate outline' />;
  const [data, setData] = useState<WhatsNewData>({});
  const [fetched, setFetched] = useState(false);
  let info = 'Fetching recent updates';

  useEffect(() => {
    // console.log('check for infinite loop');
    const fetchData = () => {
      getWhatsNew.callPromise({})
      .then(result => setData(result))
      .catch(error => { console.error(error); setData({});});
    };
    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched]);
  console.log(data);
  if (data.newEntities && data.updatedEntities) {
    const newCareerGoals = data.newEntities[WHATS_NEW_FIELDS.CAREER_GOALS].length;
    console.log(newCareerGoals);
  }
  return (
    <RadGradSegment header={header} >
      To be implemented: A list of upcoming opportunities, ordered by event date.
    </RadGradSegment>
  );
};

export default UpcomingEvents;
