import React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Divider, Grid } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { IAcademicPlan } from '../../../../../../typings/radgrad';
import AcademicPlanStaticViewer from '../../AcademicPlanStaticViewer';
import * as Router from '../../../router-helper-functions';
import FavoritesButton from '../FavoritesButton';
import { toUpper } from '../../../helper-functions';
import { explorerPlanWidget } from '../../../shared-widget-names';
import { toId } from '../../../../../shared/description-pair-helpers';
import { FAVORITE_TYPE } from '../../../../../../api/favorite/FavoriteTypes';

interface IExplorerPlansWidgetProps {
  name: string;
  descriptionPairs: any[];
  item: IAcademicPlan;
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

const ExplorerPlanWidget = (props: IExplorerPlansWidgetProps) => {
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
      <Segment padded className="container">
        <Segment clearing basic style={clearingBasicSegmentStyle}>
          <Header floated="left">{upperName}</Header>
          {
            isStudent ? (
              <FavoritesButton
                item={item}
                type={FAVORITE_TYPE.ACADEMICPLAN}
                studentID={Router.getUserIdFromRoute(props.match)}
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
        <AcademicPlanStaticViewer plan={item} />
      </Segment>
    </Segment.Group>
  );
};

export default withRouter(ExplorerPlanWidget);
