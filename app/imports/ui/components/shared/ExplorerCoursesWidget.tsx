import React from 'react';
import { Divider, Grid, Header, Item, List, Segment } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import Markdown from 'react-markdown';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import InterestList from './InterestList';
import { isSingleChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Reviews } from '../../../api/review/ReviewCollection';
import StudentExplorerReviewWidget from '../student/StudentExplorerReviewWidget';
import { ICourse, IDescriptionPair, IReview } from '../../../typings/radgrad';
import * as Router from './RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import FavoritesButton from './FavoritesButton';
import { isSame, toUpper } from './helper-functions';
import { courseSlugToName } from './data-model-helper-functions';
import { explorerCourseWidget } from './shared-widget-names';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { toValueArray, toValueString } from '../../shared/description-pair-helpers';
import { FAVORITE_TYPE } from '../../../api/favorite/FavoriteTypes';
import FutureParticipation from './FutureParticipation';
import TeaserVideo from './TeaserVideo';

interface IExplorerCoursesWidgetProps {
  name: string;
  shortName: string;
  descriptionPairs: IDescriptionPair[];
  item: ICourse;
  completed: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      course: string;
    }
  };
  reactiveSourceOne: object[];
  reactiveSourceTwo: object[];
}

const getTableTitle = (tableIndex: number, table: object[]): JSX.Element | String => {
  const greyColorStyle = { color: 'grey' };
  switch (tableIndex) {
    case 0:
      if (table.length !== 0) {
        return (
          <h4>
            <i className="green checkmark icon" />
            Completed
          </h4>
        );
      }
      return (
        <h4 style={greyColorStyle}>
          <i className="grey checkmark icon" />
          Completed
        </h4>
      );
    case 1:
      if (table.length !== 0) {
        return (
          <h4>
            <i className="yellow warning sign icon" />
            In Plan (Not Yet Completed)
          </h4>
        );
      }
      return (
        <h4 style={greyColorStyle}>
          <i className="grey warning sign icon" />
          In Plan (Not Yet Completed)
        </h4>
      );
    case 2:
      if (table.length !== 0) {
        return (
          <h4>
            <i className="red warning circle icon" />
            Not in Plan
          </h4>
        );
      }
      return (
        <h4 style={greyColorStyle}>
          <i className="grey warning circle icon" />
          Not in Plan
        </h4>
      );
    default:
      return 'ERROR: More than one table.';
  }
};

const color = (table: object[]): string => {
  if (table.length === 0) {
    return 'whitesmoke';
  }
  return '';
};

const length = (table: object[]): boolean => table.length !== 0;

const choices = (prerequisite: { course: string; status: string }): string[] => prerequisite.course.split(',');

const isFirst = (index: number): boolean => index === 0;

const findReview = (props: IExplorerCoursesWidgetProps): IReview => Reviews.findOne({
  studentID: Router.getUserIdFromRoute(props.match),
  revieweeID: props.item._id,
});

const teaserUrlHelper = (props: IExplorerCoursesWidgetProps): string => {
  const _id = Slugs.getEntityID(props.match.params.course, 'Course');
  const course = Courses.findDoc({ _id });
  const oppTeaser = Teasers.find({ targetSlugID: course.slugID }).fetch();
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};

const ExplorerCoursesWidget = (props: IExplorerCoursesWidgetProps) => {
  const segmentStyle = { backgroundColor: 'white' };
  const zeroMarginTopStyle = { marginTop: 0 };
  const fiveMarginTopStyle = { marginTop: '5px' };
  const clearingBasicSegmentStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    wordWrap: 'break-word',
  };
  const breakWordStyle: React.CSSProperties = { wordWrap: 'break-word' };

  const { name, shortName, descriptionPairs, item, completed, match } = props;
  /* Header Variables */
  const upperShortName = toUpper(shortName);
  const isStudent = Router.isUrlRoleStudent(props.match);
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: item.slugID }).length > 0;
  return (
    <div id={explorerCourseWidget}>
      <Segment padded className="container" style={segmentStyle}>
        <Segment clearing basic style={clearingBasicSegmentStyle}>
          <Header as="h4" floated="left">
            <div style={breakWordStyle}>{upperShortName}</div>
            ({name})</Header>
          {isStudent ?
            (
              <FavoritesButton
                item={props.item}
                studentID={Router.getUserIdFromRoute(props.match)}
                type={FAVORITE_TYPE.COURSE}
              />
            )
            : undefined}
        </Segment>

        <Divider style={zeroMarginTopStyle} />
        <div style={fiveMarginTopStyle}><InterestList item={item} size="mini" /></div>
        {hasTeaser ?
          (
            <Grid columns={2}>
              <Grid.Column width={9}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={descriptionPair.label}>
                    {isSame(descriptionPair.label, 'Course Number') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (
                              <React.Fragment>
                                {descriptionPair.value}
                                <br />
                              </React.Fragment>
                            )
                            : (<React.Fragment>N/A <br /></React.Fragment>)}
                        </React.Fragment>
                      )
                      : ''}
                    {isSame(descriptionPair.label, 'Credit Hours') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (<React.Fragment>{descriptionPair.value} <br /></React.Fragment>)
                            : (<React.Fragment>N/A <br /></React.Fragment>)}
                        </React.Fragment>
                      )
                      : ''}
                    {isSame(descriptionPair.label, 'Description') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (
                              <Markdown
                                escapeHtml
                                source={toValueString(descriptionPair)}
                                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                              />
                            )
                            : (<React.Fragment>N/A <br /></React.Fragment>)}
                        </React.Fragment>
                      )
                      : ''}
                    {isSame(descriptionPair.label, 'Prerequisites') ?
                      (
                        <React.Fragment>
                          {descriptionPair.value ?
                            (
                              <React.Fragment>
                                <Header as="h4" className="horizontal divider">{descriptionPair.label}</Header>
                                {isStudent ?
                                  (
                                    <Grid columns={3} stackable padded celled>
                                      <Grid.Row>
                                        {toValueArray(descriptionPair).map((table, tableIndex) => (
                                          <Grid.Column
                                            key={_.uniqueId()}
                                            style={{
                                              textAlign: 'center',
                                              backgroundColor: color(table),
                                            }}
                                          >
                                            {getTableTitle(tableIndex, table)}
                                            {length(table) ?
                                              (
                                                <React.Fragment>
                                                  {table.map((prerequisite) => (
                                                    <React.Fragment key={_.uniqueId()}>
                                                      {isSingleChoice(prerequisite.course) ?
                                                        (
                                                          <NavLink
                                                            exact
                                                            to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prerequisite.course}`)}
                                                            activeClassName="active item"
                                                          >
                                                            {courseSlugToName(prerequisite.course)} <br />
                                                          </NavLink>
                                                        )
                                                        :
                                                        _.map(choices(prerequisite), (choice, choicesIndex) => (
                                                          <React.Fragment key={_.uniqueId()}>
                                                            {isFirst(choicesIndex) ?
                                                              (
                                                                <NavLink
                                                                  exact
                                                                  to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)}
                                                                  activeClassName="active item"
                                                                >
                                                                  {courseSlugToName(choice)}
                                                                </NavLink>
                                                              )
                                                              :
                                                              (
                                                                <React.Fragment>
                                                                  {/* Not exactly sure where this pops up because even in
                                                                             the original RadGrad I don't see any "or {choice} */}
                                                                  or
                                                                  {' '}
                                                                  <NavLink
                                                                    exact
                                                                    to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)}
                                                                    activeClassName="active item"
                                                                  >
                                                                    {courseSlugToName(choice)}
                                                                  </NavLink>
                                                                </React.Fragment>
                                                              )}
                                                          </React.Fragment>
                                                        ))}
                                                    </React.Fragment>
                                                  ))}
                                                </React.Fragment>
                                              )
                                              : (<Item style={{ color: 'grey' }}>None</Item>)}
                                          </Grid.Column>
                                        ))}
                                      </Grid.Row>
                                    </Grid>
                                  )
                                  :
                                  (
                                    <List horizontal bulleted>
                                      {toValueArray(descriptionPair).map((prereqType) => (
                                        prereqType.map((prereq) => (
                                          <List.Item
                                            key={prereq.course}
                                            as={NavLink}
                                            exact
                                            to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prereq.course}`)}
                                          >
                                            {courseSlugToName(prereq.course)}
                                          </List.Item>
                                        ))
                                      ))}
                                    </List>
                                  )}
                              </React.Fragment>
                            )
                            : ''}
                        </React.Fragment>
                      )
                      : ''}
                  </React.Fragment>
                ))}
              </Grid.Column>

              <Grid.Column width={7}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={descriptionPair.label}>
                    {isSame(descriptionPair.label, 'Syllabus') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (
                              <div style={breakWordStyle}>
                                <Markdown
                                  source={toValueString(descriptionPair)}
                                  renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                                />
                                <br />
                              </div>
                            )
                            : (<React.Fragment>N/A <br /></React.Fragment>)}
                        </React.Fragment>
                      )
                      : ''}
                    {isSame(descriptionPair.label, 'Teaser') && teaserUrlHelper(props) ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (<TeaserVideo id={teaserUrlHelper(props)} />)
                            : (<p> N/A </p>)}
                        </React.Fragment>
                      )
                      : ''}
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid>
          )
          :
          (
            <React.Fragment>
              <Grid stackable columns={2}>
                <Grid.Column width={6}>
                  {descriptionPairs.map((descriptionPair) => (
                    <React.Fragment key={descriptionPair.label}>
                      {isSame(descriptionPair.label, 'Course Number') ?
                        (
                          <React.Fragment>
                            <b>{descriptionPair.label}: </b>
                            {descriptionPair.value ?
                              (
                                <React.Fragment>
                                  {descriptionPair.value}
                                  <br />
                                </React.Fragment>
                              )
                              : (<React.Fragment>N/A <br /></React.Fragment>)}
                          </React.Fragment>
                        )
                        : ''}
                      {isSame(descriptionPair.label, 'Credit Hours') ?
                        (
                          <React.Fragment>
                            <b>{descriptionPair.label}: </b>
                            {descriptionPair.value ?
                              (<React.Fragment>{descriptionPair.value} <br /></React.Fragment>)
                              : (<React.Fragment>N/A <br /></React.Fragment>)}
                          </React.Fragment>
                        )
                        : ''}
                    </React.Fragment>
                  ))}
                </Grid.Column>

                <Grid.Column width={10}>
                  {
                    descriptionPairs.map((descriptionPair) => (
                      <React.Fragment key={descriptionPair.label}>
                        {isSame(descriptionPair.label, 'Syllabus') ?
                          (
                            <React.Fragment>
                              <b>{descriptionPair.label}: </b>
                              {descriptionPair.value ?
                                (
                                  <div style={breakWordStyle}>
                                    <Markdown
                                      source={toValueString(descriptionPair)}
                                      renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                                    />
                                    <br />
                                  </div>
                                )
                                : (<React.Fragment>N/A <br /></React.Fragment>)}
                            </React.Fragment>
                          ) : ''}
                      </React.Fragment>
                    ))
                  }
                </Grid.Column>
              </Grid>

              <Grid stackable style={zeroMarginTopStyle}>
                <Grid.Column>
                  {
                    descriptionPairs.map((descriptionPair) => (
                      <React.Fragment key={descriptionPair.label}>
                        {isSame(descriptionPair.label, 'Description') ?
                          (
                            <React.Fragment>
                              <b>{descriptionPair.label}: </b>
                              {descriptionPair.value ?
                                (
                                  <Markdown
                                    escapeHtml
                                    source={toValueString(descriptionPair)}
                                    renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                                  />
                                )
                                : (<React.Fragment>N/A <br /></React.Fragment>)}
                            </React.Fragment>
                          )
                          : ''}
                      </React.Fragment>
                    ))
                  }
                </Grid.Column>
              </Grid>
              <Grid stackable style={zeroMarginTopStyle}>
                <Grid.Column>
                  {descriptionPairs.map((descriptionPair) => (
                    <React.Fragment key={descriptionPair.label}>
                      {isSame(descriptionPair.label, 'Prerequisites') ?
                        (
                          <React.Fragment>
                            {descriptionPair.value ?
                              (
                                <React.Fragment>
                                  <Header as="h4" className="horizontal divider">{descriptionPair.label}</Header>
                                  {isStudent ?
                                    (
                                      <Grid columns={3} stackable padded celled>
                                        <Grid.Row>
                                          {toValueArray(descriptionPair).map((table, tableIndex) => (
                                            <Grid.Column
                                              key={_.uniqueId()}
                                              style={{
                                                textAlign: 'center',
                                                backgroundColor: color(table),
                                              }}
                                            >
                                              {getTableTitle(tableIndex, table)}
                                              {length(table) ?
                                                (
                                                  <React.Fragment>
                                                    {table.map((prerequisite) => (
                                                      <React.Fragment key={_.uniqueId()}>
                                                        {isSingleChoice(prerequisite.course) ?
                                                          (
                                                            <NavLink
                                                              exact
                                                              to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prerequisite.course}`)}
                                                              activeClassName="active item"
                                                            >
                                                              {courseSlugToName(prerequisite.course)}
                                                              <br />
                                                            </NavLink>
                                                          )
                                                          :
                                                          _.map(choices(prerequisite), (choice, choicesIndex) => (
                                                            <React.Fragment key={_.uniqueId()}>
                                                              {isFirst(choicesIndex) ?
                                                                (
                                                                  <NavLink
                                                                    exact
                                                                    to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)}
                                                                    activeClassName="active item"
                                                                  >
                                                                    {courseSlugToName(choice)}
                                                                  </NavLink>
                                                                )
                                                                : (
                                                                  <React.Fragment>
                                                                    {/* Not exactly sure where this pops up because even in
                                                                             the original RadGrad I don't see any "or {choice} */}
                                                                    or
                                                                    <NavLink
                                                                      exact
                                                                      to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)}
                                                                      activeClassName="active item"
                                                                    >
                                                                      {courseSlugToName(choice)}
                                                                    </NavLink>
                                                                  </React.Fragment>
                                                                )}
                                                            </React.Fragment>
                                                          ))}
                                                      </React.Fragment>
                                                    ))}
                                                  </React.Fragment>
                                                )
                                                : (<Item style={{ color: 'grey' }}>None</Item>)}
                                            </Grid.Column>
                                          ))}
                                        </Grid.Row>
                                      </Grid>
                                    )
                                    :
                                    (
                                      <List horizontal bulleted>
                                        {toValueArray(descriptionPair).map((prereqType) => (
                                          prereqType.map((prereq) => (
                                            <List.Item
                                              key={prereq.course}
                                              as={NavLink}
                                              exact
                                              to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prereq.course}`)}
                                            >
                                              {courseSlugToName(prereq.course)}
                                            </List.Item>
                                          ))
                                        ))}
                                      </List>
                                    )}
                                </React.Fragment>
                              )
                              : ''}
                          </React.Fragment>
                        )
                        : ''}
                    </React.Fragment>
                  ))}
                </Grid.Column>
              </Grid>
            </React.Fragment>
          )}
      </Segment>

      <Segment textAlign="center">
        <Header>STUDENTS PARTICIPATING BY SEMESTER</Header>
        <Divider />
        <FutureParticipation item={props.item} type="courses" />
      </Segment>

      {isStudent ?
        (
          <Grid stackable className="column">
            <Grid.Column width={16}>
              <Segment padded>
                <StudentExplorerReviewWidget
                  event={item}
                  userReview={findReview(props)}
                  completed={completed}
                  reviewType="course"
                />
              </Segment>
            </Grid.Column>
          </Grid>
        )
        : ''}
    </div>
  );
};

const ExplorerCoursesWidgetContainer = withTracker(() => {
  /* Reactive Sources to make StudentExplorerCoursesWidgetButton reactive */
  const reactiveSourceOne = CourseInstances.findNonRetired({});

  /* Reactive Source to make StudentExplorerEditReviewForm reactive */
  const reactiveSourceTwo = Reviews.find({}).fetch();

  return {
    reactiveSourceOne,
    reactiveSourceTwo,
  };
})(ExplorerCoursesWidget);
export default withRouter(ExplorerCoursesWidgetContainer);
