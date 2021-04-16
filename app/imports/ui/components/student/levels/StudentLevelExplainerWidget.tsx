import React from 'react';
import { Card, Grid, Header, Icon, Image } from 'semantic-ui-react';
import _ from 'lodash';
import Markdown from 'react-markdown';
import { StudentProfile } from '../../../../typings/radgrad';


interface StudentLevelExplainerWidgetProps {
  level;
  students: StudentProfile[];
}
const getLevelColor = (level) => {
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
const getStudentsAtLevel = (profiles, level) => {
  const students = [];
  _.forEach(profiles, (profile) => {
    if (profile.level === level) {
      students.push(profile);
    }
  });
  return students.length;
};


const getLevelExplanation = (level) => {
  let result = '';
  switch (level) {
    case 6:
      // eslint-disable-next-line max-len
      result = 'If you achieve Level 6, you are truly one of the elite ICS students, and you will have demonstrated excellent preparation for entering the workforce, or going on to Graduate School, whichever you prefer. Congratulations!\n' +
          '                                            Note that in addition to fulfilling the ICE requirements, you&apos;ll also need to &quot;pay it forward&quot; to the RadGrad community in order to obtain your Black RadGrad laptop sticker.';
      break;
    case 5:
      // eslint-disable-next-line max-len
      result = ' Level 5 students are far along in their degree program, and they&apos;ve made significant progress toward 100 verified points in each of the three ICE categories. You will probably be at least a Junior before Level 5\n' +
          '                                            becomes a realistic option for you. Keep your STAR data current in RadGrad, make sure your opportunities are verified, and good luck! Some students might graduate before reaching Level 5, so try to be one of the few that\n' +
          '                                            make it all the way to here!';
      break;
    case 4:
      // eslint-disable-next-line max-len
      result = ' ICS has a &quot;core curriculum&quot;, and Level 4 students have not only finished it, but they have also thought beyond mere competency. Once your current STAR data is in RadGrad, and you&apos;ve achieved some verified\n' +
          '                                            opportunities, you might just find yourself at Level 4! Meet with your advisor to pick up your sticker, and bask in the glory it will bring to you!';
      break;
    case 3:
      // eslint-disable-next-line max-len
      result = 'With any luck, you&apos;ll achieve Level 3 after you complete your second academic term of ICS coursework, as long as your grades are good. As before, meet with your Advisor to update RadGrad with your current STAR data,\n' +
          '                                            and if the system shows you&apos;ve gotten to Level 3, you&apos;ll get your Green laptop sticker.';
      break;
    case 2:
      // eslint-disable-next-line max-len
      result = 'Successfully finish your first academic term of ICS coursework. Then meet with your advisor and ask him/her to update RadGrad with your current STAR data. That should bring you to Level 2, and earn you the Level 2 laptop\n' +
          '                                            sticker.';
      break;
    default:
      // eslint-disable-next-line max-len
      result = 'You begin your RadGrad experience at Level 1, and you will receive this laptop sticker when you first sign up for RadGrad with your advisor. *"A journey of a thousand miles begins with a single step" -- Lao Tzu*';
  }
  return result;
};

const StudentLevelExplainerWidget: React.FC<StudentLevelExplainerWidgetProps> = ({ level, students }) => {
  const color = getLevelColor(level);
  const levelExplanation = getLevelExplanation(level);
  return (
        <div>
            <Grid >
                <Grid.Row>
                    <Grid.Column width={2}>
                        <div style={{ textAlign:'center' }}>
                            <Image floated="left" size="small" src={`/images/level-icons/radgrad-level-${level}-icon.png`} />
                            <Header as='h2' color={color}>{color.toUpperCase()}</Header>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Header as='h2' color='grey'>LEVEL {level}</Header>
                        <Card.Description>
                            <Markdown source={levelExplanation}/>
                            <Header as='h3' color='grey' style={{ paddingTop: '9%' }}><Icon name='user circle'/> {getStudentsAtLevel(students, level)} Students at Level {level}</Header>
                        </Card.Description>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
  );

};


export default StudentLevelExplainerWidget;
