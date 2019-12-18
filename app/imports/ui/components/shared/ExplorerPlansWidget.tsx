import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Divider, Grid } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { IAcademicPlan, IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { Users } from '../../../api/user/UserCollection';
import AcademicPlanStaticViewer from './AcademicPlanStaticViewer';
import * as Router from './RouterHelperFunctions';
import FavoritesButton from './FavoritesButton';
import { toUpper } from './helper-functions';
import { explorerPlanWidget } from './shared-widget-names';

interface IExplorerPlansWidgetProps {
  name: string;
  descriptionPairs: any[];
  item: IAcademicPlan;
  profile: object;
  match: IRadGradMatch;
}

const ExplorerPlansWidget = (props: IExplorerPlansWidgetProps) => {
  const backgroundColorWhiteStyle = { backgroundColor: 'white' };
  const clearingBasicSegmentStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };
  const divierStyle = { marginTop: 0 };

  const { name, descriptionPairs, item, match } = props;
  const upperName = toUpper(name);
  const isStudent = Router.isUrlRoleStudent(props.match);

  return (
    <Segment.Group style={backgroundColorWhiteStyle} id={`${explorerPlanWidget}`}>
      <Segment padded={true} className="container">
        <Segment clearing={true} basic={true} style={clearingBasicSegmentStyle}>
          <Header floated="left">{upperName}</Header>
          {
            isStudent ?
              <FavoritesButton item={item} type='academicPlan'
                               studentID={Router.getUserIdFromRoute(props.match)}/>
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
                                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}/>
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
};

const ExplorerPlansWidgetContainer = withTracker((props) => {
  const profile = Users.getProfile(props.match.params.username);
  return {
    profile,
  };
})(ExplorerPlansWidget);
export default withRouter(ExplorerPlansWidgetContainer);
