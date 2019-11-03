import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Button, Divider, Grid } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line
import { Users } from '../../../api/user/UserCollection';
import AcademicPlanStaticViewer from './AcademicPlanStaticViewer';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import * as Router from './RouterHelperFunctions';
import { toUpper } from './helper-functions';

interface IExplorerPlansWidgetProps {
  name: string;
  descriptionPairs: any[];
  item: IAcademicPlan;
  profile: object;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
}

class ExplorerPlansWidget extends React.Component<IExplorerPlansWidgetProps> {
  constructor(props) {
    super(props);
  }

  private getUsername = (): string => Router.getUsername(this.props.match);

  private isRoleStudent = (): boolean => Router.isUrlRoleStudent(this.props.match);

  private userStatus = (plan: IAcademicPlan): boolean => {
    const profile = Users.getProfile(this.getUsername());
    return profile.academicPlanID !== plan._id;
  }

  private handleAddPlan = (e: any): void => {
    e.preventDefault();
    const profile = Users.getProfile(this.getUsername());
    const updateData: { [key: string]: any } = {};
    const collectionName = StudentProfiles.getCollectionName();
    updateData.id = profile._id;
    updateData.academicPlan = this.props.item._id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log(`Error updating ${this.getUsername()}'s academic plan ${JSON.stringify(error)}`);
      }
    });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const backgroundColorWhiteStyle = { backgroundColor: 'white' };
    const clearingBasicSegmentStyle = {
      margin: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    };
    const divierStyle = { marginTop: 0 };

    const { name, descriptionPairs, item, match } = this.props;
    const upperName = toUpper(name);
    const isStudent = this.isRoleStudent();
    const userStatus = this.userStatus(item);

    return (
      <Segment.Group style={backgroundColorWhiteStyle}>
        <Segment padded={true} className="container">
          <Segment clearing={true} basic={true} style={clearingBasicSegmentStyle}>
            <Header floated="left">{upperName}</Header>
            {
              isStudent ?
                <React.Fragment>
                  {
                    userStatus ?
                      <Button basic={true} color="green" size="mini" floated="right" onClick={this.handleAddPlan}>
                        SET AS ACADEMIC PLAN
                      </Button>
                      : ''
                  }
                </React.Fragment>
                : ''
            }
          </Segment>

          <Divider style={divierStyle}/>

          <Grid stackable={true}>
            <Grid.Column>
              {
                descriptionPairs.map((descriptionPair, index) => (
                  <React.Fragment key={index}>
                    <b>{descriptionPair.label}:</b>
                    {
                      descriptionPair.value ?
                        <Markdown escapeHtml={true} source={descriptionPair.value}
                                  renderers={{ link: (props) => Router.renderLink(props, match) }}/>
                        :
                        <React.Fragment> N/A <br/></React.Fragment>
                    }
                  </React.Fragment>
                ))
              }
            </Grid.Column>
          </Grid>
        </Segment>

        <Segment>
          <AcademicPlanStaticViewer plan={item}/>
        </Segment>
      </Segment.Group>
    );
  }
}

const ExplorerPlansWidgetContainer = withTracker((props) => {
  const profile = Users.getProfile(props.match.params.username);
  return {
    profile,
  };
})(ExplorerPlansWidget);
export default withRouter(ExplorerPlansWidgetContainer);
