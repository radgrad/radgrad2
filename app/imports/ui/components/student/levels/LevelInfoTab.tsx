import React from 'react';
import { Grid, Header, Image, Tab } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { StudentProfile } from '../../../../typings/radgrad';
import VisibleStudentsAtLevel from './VisibleStudentsAtLevel';

interface LevelInfoTabProps {
  level: number;
  students: StudentProfile[];
}

export const getLevelColor = (level) => {
  switch (level) {
    case 1:
      return 'grey';
    case 2:
      return 'yellow';
    case 3:
      return 'green';
    case 4:
      return 'blue';
    case 5:
      return 'brown';
    case 6:
      return 'black';
    default:
      return 'grey';
  }

};

const getLevelExplanation = (level) => {
  let result = '';
  switch (level) {
    case 6:
      result = `
If you achieve Level 6, you are truly one of the elite RadGrad students, and you will have achieved excellent preparation for entering the workforce, or going on to Graduate School, whichever you prefer. Congratulations!

To achieve Level 6, in addition to fulfilling the myICE requirements, you&apos;ll also need to &quot;pay it forward&quot; to the RadGrad community by completing Reviews of your completed courses and opportunities. One reward is the coveted and rarely seen Ninja-level Black RadGrad sticker.`;
      break;

    case 5:
      result = `
Level 5 students are far along in their degree program, and have made significant progress toward 100 verified points in each of the three myICE categories. 

You will probably be at least a Junior before Level 5 becomes a realistic option for you. 

Many students graduate before reaching Level 5, so try to be one of the few that make it all the way to here!`;
      break;

    case 4:
      result = `
 To achieve Level 4, you will generally have completed three semesters of coursework and you should have worked out your Degree Plan so that you have planned to earn at least 100 Innovation, 100 Competency, and 100 Experience points by the time you graduate.
 
 In addition, you must have completed at least one Opportunity. This involves submitting it for verification.
 
 Once you have completed an Opportunity, and submitted it for verification, you can meet with your advisor and pick up your Level 4 sticker. 
`;
      break;

    case 3:
      result = `
Most students achieve Level 3 after completing two semesters of coursework, as long as the grades are good. 

As always, meet with your Advisor to receive your Level 3 laptop sticker.

The goal of RadGrad is to help you achieve a "well-rounded" degree experience.  This means taking part in courses and opportunities that eventually earn you at least 100 Innovation, 100 Competency, and 100 Experience points. 
`;
      break;

    case 2:
      result = `
To achieve Level Two, you must have finished a single semester of coursework. 

After that, meet with your advisor to update your RadGrad data (if necessary) and then receive your Level 2 laptop sticker.

Now is a good time to start developing your Degree Plan. What extra-curricular activities (Opportunities) look appealing? You should add them to your profile, and then use the Degree Planner page to select a semester in which to take part in them.
`;
      break;

    default:
      result = `
Most students begin their RadGrad experience at Level 1, which is for students who have not yet completed any courses or opportunities. 

You can get a Level 1 laptop sticker from your advisor just for registering with RadGrad. 

Now is a good time to look through RadGrad and learn about Interests and Career Goals. You can select a few that interest you so that RadGrad can recommend related Courses and Opportunities.  
        
*"A journey of a thousand miles begins with a single step" -- Lao Tzu*`;
  }
  return result;
};

const LevelInfoTab: React.FC<LevelInfoTabProps> = ({ level, students }) => {
  const color = getLevelColor(level);
  const levelExplanation = getLevelExplanation(level);
  const imageHolderStyle = { textAlign: 'center' } as React.CSSProperties;
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <div style={imageHolderStyle}>
              <Image centered size="small" src={`/images/level-icons/radgrad-level-${level}-icon.png`} />
              <Header as='h2' color={color}>{color.toUpperCase()}</Header>
            </div>
          </Grid.Column>
          <Grid.Column width={13}>
            <Header as='h2' color='grey'>LEVEL {level}</Header>
            <Markdown source={levelExplanation} />
            <VisibleStudentsAtLevel students={students} level={level} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Tab.Pane>
  );

};


export default LevelInfoTab;
