import React from 'react';
import { Divider, Grid, Header, Item, List, Segment } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import Markdown from 'react-markdown';
import { AcademicTerms } from '../../../../../../api/academic-term/AcademicTermCollection';
import { RadGradProperties } from '../../../../../../api/radgrad/RadGradProperties';
import { CourseForecastCollection } from '../../../../../../startup/client/collections';
import InterestList from '../../../InterestList';
import { isSingleChoice } from '../../../../../../api/degree-plan/PlanChoiceUtilities';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import { AcademicTerm, Course, DescriptionPair, Review } from '../../../../../../typings/radgrad';
import * as Router from '../../../utilities/router';
import { EXPLORER_TYPE } from '../../../../../layouts/utilities/route-constants';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
// @ts-ignore
import ExplorerReviewWidget from '../ExplorerReviewWidget';
import AddToProfileButton from '../AddToProfileButton';
import { isSame, toUpper } from '../../../utilities/general';
import { courseSlugToName } from '../../../utilities/data-model';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { Courses } from '../../../../../../api/course/CourseCollection';
import { toValueArray, toValueString } from './utilities/description-pair';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import FutureParticipation from '../../FutureParticipation';
import TeaserVideo from '../../../TeaserVideo';
import { Users } from '../../../../../../api/user/UserCollection';
import { ProfileCourses } from '../../../../../../api/user/profile-entries/ProfileCourseCollection';

interface ExplorerCoursesWidgetProps {
  name: string;
  shortName: string;
  descriptionPairs: DescriptionPair[];
  item: Course;
  itemReviews: Review[];
  completed: boolean;
}

const getTableTitle = (tableIndex: number, table: unknown[]): JSX.Element | string => {
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

const color = (table: unknown[]): string => {
  if (table.length === 0) {
    return 'whitesmoke';
  }
  return '';
};

const length = (table: unknown[]): boolean => table.length !== 0;

const choices = (prerequisite: { course: string; status: string }): string[] => prerequisite.course.split(',');

const isFirst = (index: number): boolean => index === 0;

const findReview = (studentID: string, itemReviews: Review[]): Review => {
  const userReviewArr = _.filter(itemReviews, (review) => review.studentID === studentID);
  if (userReviewArr.length > 0) {
    return userReviewArr[0];
  }
  return undefined;
};

const teaserUrlHelper = (courseSlug): string => {
  const _id = Slugs.getEntityID(courseSlug, 'Course');
  const course = Courses.findDoc({ _id });
  const oppTeaser = Teasers.findNonRetired({ targetSlugID: course.slugID });
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};

const ExplorerCourseWidget: React.FC<ExplorerCoursesWidgetProps> = ({ name, shortName, descriptionPairs, item, completed, itemReviews }) => {
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

  const match = useRouteMatch();
  const { course, username } = useParams();

  /* Header Variables */
  const upperShortName = toUpper(shortName);
  const isStudent = Router.isUrlRoleStudent(match);
  const studentID = Router.getUserIdFromRoute(match);
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: item.slugID }).length > 0;

  const quarter = RadGradProperties.getQuarterSystem();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired(
    { termNumber: { $gte: currentTerm.termNumber } },
    {
      sort: { termNumber: 1 },
      limit: numTerms,
    },
  );
  const scores = [];
  _.forEach(academicTerms, (term: AcademicTerm) => {
    const id = `${item._id} ${term._id}`;
    const score = CourseForecastCollection.find({ _id: id }).fetch() as { count: number }[];
    if (score.length > 0) {
      scores.push(score[0].count);
    } else {
      scores.push(0);
    }
  });
  const profile = Users.getProfile(username);
  const added = ProfileCourses.findNonRetired({ studentID: profile.userID, courseID: item._id }).length > 0;
  return (
    <div id="explorerCourseWidget">
      <Segment padded className="container" style={segmentStyle}>
        <Segment clearing basic style={clearingBasicSegmentStyle}>
          <Header as="h4" floated="left">
            <div style={breakWordStyle}>{upperShortName}</div>({name})
          </Header>
          {isStudent ? <AddToProfileButton item={item} studentID={Router.getUserIdFromRoute(match)} type={PROFILE_ENTRY_TYPE.COURSE} added={added} /> : undefined}
        </Segment>

        <Divider style={zeroMarginTopStyle} />
        <div style={fiveMarginTopStyle}>
          <InterestList item={item} size="mini" />
        </div>
        {hasTeaser ? (
          <Grid columns={2}>
            <Grid.Column width={9}>
              {descriptionPairs.map((descriptionPair) => (
                <React.Fragment key={descriptionPair.label}>
                  {isSame(descriptionPair.label, 'Course Number') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? (
                        <React.Fragment>
                          {descriptionPair.value}
                          <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                  {isSame(descriptionPair.label, 'Credit Hours') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? (
                        <React.Fragment>
                          {descriptionPair.value} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                  {isSame(descriptionPair.label, 'Description') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? (
                        <Markdown escapeHtml source={toValueString(descriptionPair)} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                  {isSame(descriptionPair.label, 'Prerequisites') ? (
                    <React.Fragment>
                      {descriptionPair.value ? (
                        <React.Fragment>
                          <Header as="h4" className="horizontal divider">
                            {descriptionPair.label}
                          </Header>
                          {isStudent ? (
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
                                    {length(table) ? (
                                      <React.Fragment>
                                        {table.map((prerequisite) => (
                                          <React.Fragment key={_.uniqueId()}>
                                            {isSingleChoice(prerequisite.course) ? (
                                              <NavLink exact to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prerequisite.course}`)} activeClassName="active item">
                                                {courseSlugToName(prerequisite.course)} <br />
                                              </NavLink>
                                            ) : (
                                              _.map(choices(prerequisite), (choice, choicesIndex) => (
                                                <React.Fragment key={_.uniqueId()}>
                                                  {isFirst(choicesIndex) ? (
                                                    <NavLink exact to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)} activeClassName="active item">
                                                      {courseSlugToName(choice)}
                                                    </NavLink>
                                                  ) : (
                                                    <React.Fragment>
                                                      {/* Not exactly sure where this pops up because even in
                                                                             the original RadGrad I don't see any "or {choice} */}
                                                      or{' '}
                                                      <NavLink exact to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)} activeClassName="active item">
                                                        {courseSlugToName(choice)}
                                                      </NavLink>
                                                    </React.Fragment>
                                                  )}
                                                </React.Fragment>
                                              ))
                                            )}
                                          </React.Fragment>
                                        ))}
                                      </React.Fragment>
                                    ) : (
                                      <Item style={{ color: 'grey' }}>None</Item>
                                    )}
                                  </Grid.Column>
                                ))}
                              </Grid.Row>
                            </Grid>
                          ) : (
                            <List horizontal bulleted>
                              {toValueArray(descriptionPair).map((prereqType) =>
                                prereqType.map((prereq) => (
                                  <List.Item key={prereq.course} as={NavLink} exact to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prereq.course}`)}>
                                    {courseSlugToName(prereq.course)}
                                  </List.Item>
                                )),
                              )}
                            </List>
                          )}
                        </React.Fragment>
                      ) : (
                        ''
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ))}
            </Grid.Column>

            <Grid.Column width={7}>
              {descriptionPairs.map((descriptionPair) => (
                <React.Fragment key={descriptionPair.label}>
                  {isSame(descriptionPair.label, 'Syllabus') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? (
                        <div style={breakWordStyle}>
                          <Markdown source={toValueString(descriptionPair)} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
                          <br />
                        </div>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                  {isSame(descriptionPair.label, 'Teaser') && teaserUrlHelper(course) ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? <TeaserVideo id={teaserUrlHelper(course)} /> : <p> N/A </p>}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ))}
            </Grid.Column>
          </Grid>
        ) : (
          <React.Fragment>
            <Grid stackable columns={2}>
              <Grid.Column width={6}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={descriptionPair.label}>
                    {isSame(descriptionPair.label, 'Course Number') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? (
                          <React.Fragment>
                            {descriptionPair.value}
                            <br />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            N/A <br />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                    {isSame(descriptionPair.label, 'Credit Hours') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? (
                          <React.Fragment>
                            {descriptionPair.value} <br />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            N/A <br />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </Grid.Column>

              <Grid.Column width={10}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={descriptionPair.label}>
                    {isSame(descriptionPair.label, 'Syllabus') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? (
                          <div style={breakWordStyle}>
                            <Markdown source={toValueString(descriptionPair)} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
                            <br />
                          </div>
                        ) : (
                          <React.Fragment>
                            N/A <br />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid>

            <Grid stackable style={zeroMarginTopStyle}>
              <Grid.Column>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={descriptionPair.label}>
                    {isSame(descriptionPair.label, 'Description') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? (
                          <Markdown escapeHtml source={toValueString(descriptionPair)} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
                        ) : (
                          <React.Fragment>
                            N/A <br />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid>
            <Grid stackable style={zeroMarginTopStyle}>
              <Grid.Column>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={descriptionPair.label}>
                    {isSame(descriptionPair.label, 'Prerequisites') ? (
                      <React.Fragment>
                        {descriptionPair.value ? (
                          <React.Fragment>
                            <Header as="h4" className="horizontal divider">
                              {descriptionPair.label}
                            </Header>
                            {isStudent ? (
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
                                      {length(table) ? (
                                        <React.Fragment>
                                          {table.map((prerequisite) => (
                                            <React.Fragment key={_.uniqueId()}>
                                              {isSingleChoice(prerequisite.course) ? (
                                                <NavLink exact to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prerequisite.course}`)} activeClassName="active item">
                                                  {courseSlugToName(prerequisite.course)}
                                                  <br />
                                                </NavLink>
                                              ) : (
                                                _.map(choices(prerequisite), (choice, choicesIndex) => (
                                                  <React.Fragment key={_.uniqueId()}>
                                                    {isFirst(choicesIndex) ? (
                                                      <NavLink exact to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)} activeClassName="active item">
                                                        {courseSlugToName(choice)}
                                                      </NavLink>
                                                    ) : (
                                                      <React.Fragment>
                                                        {/* Not exactly sure where this pops up because even in
                                                                             the original RadGrad I don't see any "or {choice} */}
                                                        or
                                                        <NavLink exact to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)} activeClassName="active item">
                                                          {courseSlugToName(choice)}
                                                        </NavLink>
                                                      </React.Fragment>
                                                    )}
                                                  </React.Fragment>
                                                ))
                                              )}
                                            </React.Fragment>
                                          ))}
                                        </React.Fragment>
                                      ) : (
                                        <Item style={{ color: 'grey' }}>None</Item>
                                      )}
                                    </Grid.Column>
                                  ))}
                                </Grid.Row>
                              </Grid>
                            ) : (
                              <List horizontal bulleted>
                                {toValueArray(descriptionPair).map((prereqType) =>
                                  prereqType.map((prereq) => (
                                    <List.Item key={prereq.course} as={NavLink} exact to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prereq.course}`)}>
                                      {courseSlugToName(prereq.course)}
                                    </List.Item>
                                  )),
                                )}
                              </List>
                            )}
                          </React.Fragment>
                        ) : (
                          ''
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
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
        <FutureParticipation academicTerms={academicTerms} scores={scores} />
      </Segment>

      {isStudent ? (
        <Grid stackable className="column">
          <Grid.Column width={16}>
            <Segment padded>
              <StudentExplorerReviewWidget itemToReview={item} itemReviews={itemReviews} userReview={findReview(studentID, itemReviews)} completed={completed} reviewType="course" />
            </Segment>
          </Grid.Column>
        </Grid>
      ) : (
        <ExplorerReviewWidget itemReviews={itemReviews} reviewType="course" />
      )}
    </div>
  );
};

export default ExplorerCourseWidget;
