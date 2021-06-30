import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import { WHATS_NEW_FIELDS, WhatsNewData } from '../../../../api/whats-new/WhatsNew';
import { getWhatsNew } from '../../../../api/whats-new/WhatsNew.methods';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

const CommunityActivity: React.FC = () => {
  const header = <RadGradHeader title="What's New?" icon='calendar alternate outline' />;
  const [data, setData] = useState<WhatsNewData>({});
  const [fetched, setFetched] = useState(false);
  const gridStyle = { height: 350, paddingTop: 10 };
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

  if (data.newEntities && data.updatedEntities) {
    const newInterests = data.newEntities[WHATS_NEW_FIELDS.INTERESTS].length;
    const newCourses = data.newEntities[WHATS_NEW_FIELDS.COURSES].length;
    const newCareerGoals = data.newEntities[WHATS_NEW_FIELDS.CAREER_GOALS].length;
    const newOpportunities = data.newEntities[WHATS_NEW_FIELDS.OPPORTUNITIES].length;
    const newStudents = data.newEntities[WHATS_NEW_FIELDS.STUDENTS].length;
    const newFaculty = data.newEntities[WHATS_NEW_FIELDS.FACULTY].length;
    const newAdvisors = data.newEntities[WHATS_NEW_FIELDS.ADVISORS].length;

    const updatedInterests = data.updatedEntities[WHATS_NEW_FIELDS.INTERESTS].length;
    const updatedCourses = data.updatedEntities[WHATS_NEW_FIELDS.COURSES].length;
    const updatedCareerGoals = data.updatedEntities[WHATS_NEW_FIELDS.CAREER_GOALS].length;
    const updatedOpportunities = data.updatedEntities[WHATS_NEW_FIELDS.OPPORTUNITIES].length;

    info = `
    
In the past week, ${data.logins} users have accessed RadGrad, and ${data.levelUps} of those have leveled up. 

New additions include ${newInterests} interests, ${newCareerGoals} career goals, ${newCourses} courses, and ${newOpportunities} opportunities. 

Also, ${newStudents} students, ${newFaculty} faculty, and ${newAdvisors} advisors have joined the system.

There have been updates to ${updatedInterests} interests, ${updatedCareerGoals} career goals, ${updatedCourses} courses, and ${updatedOpportunities} opportunities. 

This information was last updated ${moment(data.lastUpdate).fromNow()}.
    `;
  }
  return (
    <RadGradSegment header={header}>
      <Grid style={gridStyle}>
        <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={info}/>
      </Grid>
    </RadGradSegment>
  );
};

export default CommunityActivity;
