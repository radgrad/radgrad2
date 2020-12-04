import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid, Container, Card, Image } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import HelpPanelWidget, { IHelpPanelWidgetProps } from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentLevelsWidget from '../../components/student/levels/StudentLevelsWidget';
import StudentLevelsOthersWidget from '../../components/student/levels/StudentLevelsOthersWidget';

const StudentHomeLevelsPage: React.FC<IHelpPanelWidgetProps> = ({ helpMessages }) => (
  <div id="student-levels-page">
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Card.Group itemsPerRow={3}>
              <Card>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="/images/level-icons/radgrad-level-1-icon.png"
                  />
                  <Card.Header>LEVEL 1</Card.Header>
                  <Card.Meta>GRAY</Card.Meta>
                  <Card.Description>
                    You begin your RadGrad experience at Level 1, and you will receive this laptop sticker when you
                    first sign up for RadGrad with your advisor. <em>&quot;A journey of a thousand miles begins with a
                      single step&quot; -- Lao Tzu</em>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="/images/level-icons/radgrad-level-2-icon.png"
                  />
                  <Card.Header>LEVEL 2</Card.Header>
                  <Card.Meta>YELLOW</Card.Meta>
                  <Card.Description>
                    Successfully finish your first academic term of ICS coursework. Then meet with your advisor and ask
                    him/her to update RadGrad with your current STAR data. That should bring you to Level 2, and earn
                    you the Level 2 laptop sticker.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="/images/level-icons/radgrad-level-3-icon.png"
                  />
                  <Card.Header>LEVEL 3</Card.Header>
                  <Card.Meta>GREEN</Card.Meta>
                  <Card.Description>
                    With any luck, you&apos;ll achieve Level 3 after you complete your second academic term of ICS
                    coursework, as long as your grades are good. As before, meet with your Advisor to update RadGrad
                    with your current STAR data, and if the system shows you&apos;ve gotten to Level 3, you&apos;ll get
                    your Green laptop sticker.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="/images/level-icons/radgrad-level-4-icon.png"
                  />
                  <Card.Header>LEVEL 4</Card.Header>
                  <Card.Meta>BLUE</Card.Meta>
                  <Card.Description>
                    ICS has a &quot;core curriculum&quot;, and Level 4 students have not only finished it, but they have
                    also thought beyond mere competency. Once your current STAR data is in RadGrad, and you&apos;ve
                    achieved some verified opportunities, you might just find yourself at Level 4! Meet with your
                    advisor to pick up your sticker, and bask in the glory it will bring to you!
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="/images/level-icons/radgrad-level-5-icon.png"
                  />
                  <Card.Header>LEVEL 5</Card.Header>
                  <Card.Meta>BROWN</Card.Meta>
                  <Card.Description>
                    Level 5 students are far along in their degree program, and they&apos;ve made significant progress
                    toward 100 verified points in each of the three ICE categories. You will probably be at least a
                    Junior before Level 5 becomes a realistic option for you. Keep your STAR data current in RadGrad,
                    make sure your opportunities are verified, and good luck! Some students might graduate before
                    reaching Level 5, so try to be one of the few that make it all the way to here!
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="/images/level-icons/radgrad-level-6-icon.png"
                  />
                  <Card.Header>LEVEL 6</Card.Header>
                  <Card.Meta>BLACK</Card.Meta>
                  <Card.Description>
                    If you achieve Level 6, you are truly one of the elite ICS students, and you will have demonstrated
                    excellent preparation for entering the workforce, or going on to Graduate School, whichever you
                    prefer. Congratulations! Note that in addition to fulfilling the ICE requirements, you&apos;ll also need
                    to &quot;pay it forward&quot; to the RadGrad community in order to obtain your Black RadGrad laptop
                    sticker.
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Grid container stackable columns="equal">
              <Grid.Column stretched>
                <StudentLevelsWidget />
              </Grid.Column>
              <Grid.Column stretched>
                <StudentLevelsOthersWidget />
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid.Row>

      </Grid>

      <BackToTopButton />
    </Container>
  </div>
);

const StudentHomeLevelsPageContainer = withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    helpMessages,
  };
})(StudentHomeLevelsPage);

export default StudentHomeLevelsPageContainer;
