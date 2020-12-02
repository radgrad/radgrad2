import _ from 'lodash';
import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { Segment, Header, Divider, Grid } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { CourseInstances } from '../../../../../../api/course/CourseInstanceCollection';
import { passedCourse } from '../../../../../../api/degree-plan/AcademicPlanUtilities';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { Users } from '../../../../../../api/user/UserCollection';
import { IAcademicPlan } from '../../../../../../typings/radgrad';
import AcademicPlanStaticViewer from '../../AcademicPlanStaticViewer';
import * as Router from '../../../utilities/router';
import FavoritesButton from '../FavoritesButton';
import { toUpper } from '../../../utilities/general';
import { explorerPlanWidget } from '../../../shared-widget-names';
import { toId } from '../course/utilities/description-pair';
import { FAVORITE_TYPE } from '../../../../../../api/favorite/FavoriteTypes';
import { FavoriteAcademicPlans } from '../../../../../../api/favorite/FavoriteAcademicPlanCollection';

interface IExplorerPlansWidgetProps {
  name: string;
  descriptionPairs: any[];
  item: IAcademicPlan;
}

const ExplorerPlanWidget: React.FC<IExplorerPlansWidgetProps> = (props: IExplorerPlansWidgetProps) => {
  const backgroundColorWhiteStyle = { backgroundColor: 'white' };
  const clearingBasicSegmentStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };
  const divierStyle = { marginTop: 0 };

  const { name, descriptionPairs, item } = props;
  console.log(props);
  const match = useRouteMatch();
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const added = FavoriteAcademicPlans.findNonRetired({ studentID: profile.userID, academicPlanID: item._id }).length > 0;
  const upperName = toUpper(name);
  const isStudent = Router.isUrlRoleStudent(match);
  let takenSlugs = [];
  if (isStudent) {
    const courseInstances = CourseInstances.findNonRetired({ studentID: profile.userID });
    const passedCourseInstances = _.filter(courseInstances, (ci) => passedCourse(ci));
    takenSlugs = _.map(passedCourseInstances, (ci) => {
      const doc = CourseInstances.getCourseDoc(ci._id);
      return Slugs.getNameFromID(doc.slugID);
    });
  }
  return (
    <Segment.Group style={backgroundColorWhiteStyle} id={`${explorerPlanWidget}`}>
      <Segment padded className="container">
        <Segment clearing basic style={clearingBasicSegmentStyle}>
          <Header floated="left">{upperName}</Header>
          {
            isStudent ? (
              <FavoritesButton
                item={item}
                type={FAVORITE_TYPE.ACADEMICPLAN}
                studentID={Router.getUserIdFromRoute(match)}
                added={added}
              />
            )
              : ''
          }
        </Segment>

        <Divider style={divierStyle} />

        <Grid stackable>
          <Grid.Column>
            {
              descriptionPairs.map((descriptionPair) => (
                <React.Fragment key={toId(descriptionPair)}>
                  <b>
                    {descriptionPair.label}
                    :
                  </b>
                  {
                    descriptionPair.value ? (
                      <Markdown
                        escapeHtml
                        source={descriptionPair.value}
                        renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                      />
                    )
                      : (
                        <React.Fragment>
                          N/A
                          <br />
                        </React.Fragment>
                      )
                  }
                </React.Fragment>
              ))
            }
          </Grid.Column>
        </Grid>
      </Segment>

      <Segment>
        <AcademicPlanStaticViewer plan={item} takenSlugs={takenSlugs} />
      </Segment>
    </Segment.Group>
  );
};

export default ExplorerPlanWidget;
