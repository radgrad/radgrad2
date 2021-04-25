import React, { useEffect, useState } from 'react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import { WHATS_NEW_FIELDS, WhatsNewData } from '../../../../api/whats-new/WhatsNew';
import { getWhatsNew } from '../../../../api/whats-new/WhatsNew.methods';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

const CommunityActivity: React.FC = () => {
  const header = <RadGradHeader title="What's New?" icon='calendar alternate outline' />;
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
In the past week, new additions include ${newInterests} interests, ${newCareerGoals} career goals, ${newCourses} courses, and ${newOpportunities} opportunities. 

Also, ${newStudents} students, ${newFaculty} faculty, and ${newAdvisors} advisors have joined the system.

Finally, there have been updates to ${updatedInterests} interests, ${updatedCareerGoals} career goals, ${updatedCourses} courses, and ${updatedOpportunities} opportunities. 
    `;
  }
  return (
    <RadGradSegment header={header}>
      <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={info}/>
    </RadGradSegment>
  );
};

export default CommunityActivity;
