import * as React from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { ICourse } from '../../../typings/radgrad'; // eslint-disable-line
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface ICoursesCardExplorerProps {
  ready: boolean;
  courses: ICourse[];
  count: number;
  match: object;
  location: object;
  history: object;
}

class LandingCoursesCardExplorer extends React.Component<ICoursesCardExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Loading Courses</Loader>;
  }

  private renderPage() {
    const inlineStyle = {
      maxHeight: 750,
      marginTop: 10,
    };
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true} padded="vertically">
          {/* <Grid.Row> */}
          {/* <HelpPanelWidgetContainer routeProps={this.props.location}/> */}
          {/* </Grid.Row> */}
          <Grid.Row>
            <Grid.Column width="three">
              <LandingExplorerMenuContainer/>
            </Grid.Column>
            <Grid.Column width="thirteen">
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>COURSES</span> ({this.props.count})
                </Header>
                <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
                  {this.props.courses.map((goal) => (
                      <LandingExplorerCardContainer key={goal._id} type="courses" item={goal}/>
                    ))}
                </Card.Group>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const LandingCoursesCardExplorerCon = withRouter(LandingCoursesCardExplorer);

const LandingCoursesCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(Courses.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    courses: Courses.findNonRetired({}, { sort: { shortName: 1 } }),
    count: Courses.countNonRetired(),
  };
})(LandingCoursesCardExplorerCon);

export default LandingCoursesCardExplorerContainer;
