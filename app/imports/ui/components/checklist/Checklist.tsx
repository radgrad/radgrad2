import moment from 'moment';
import React from 'react';
import Markdown from 'react-markdown/with-html';
import {Grid, Header, Icon, Label, Segment, SemanticICONS} from 'semantic-ui-react';
import '../../../../client/style.css';


export const enum CHECKSTATE {
  OK = 'OK',
  REVIEW = 'REVIEW',
  IMPROVE = 'IMPROVE',
}

/**
 * Checklist TODOS
 *   * Public Stats should provide a method returning a date object for lastUpdated interests and career goals, with suitable default.
 *   * Pass Public Stats into constructor to encapsulate all state.
 *   * Student Profile should also provide that kind of method.
 *   * getDescription could compute a markdown string and return it as <Markdown>.
 *   * getDetails will probably just return JSX for now.
 *   * Maybe split getActions into getActionsText and getActionsButtons. The latter is an array of Buttons.
 *   * Maybe paint the icon and name in the state color?
 *   * Change "Go to" to an icon?
 *   * Set entire state on updateState in instance variables?
 *   * Style.css should be local
 */

/**
 * Base class for all checklist items.
 */
export class Checklist {
  protected name = 'Checklist Name';
  protected iconName: SemanticICONS = 'question';
  protected state: CHECKSTATE = CHECKSTATE.OK;
  protected title = {};
  protected description = {};
  protected stateColor = {};

  constructor() {
    this.stateColor[CHECKSTATE.OK] = 'green';
    this.stateColor[CHECKSTATE.REVIEW] = 'yellow';
    this.stateColor[CHECKSTATE.IMPROVE] = 'red';
    this.title[CHECKSTATE.OK] = 'Item is OK';
    this.title[CHECKSTATE.REVIEW] = 'Item should be reviewed';
    this.title[CHECKSTATE.IMPROVE] = 'Item should be improved';
    this.description[CHECKSTATE.OK] = 'Item is OK';
    this.description[CHECKSTATE.REVIEW] = 'Item should be reviewed';
    this.description[CHECKSTATE.IMPROVE] = 'Item should be improved';
  }

  /**
   * Updates the state of this Checklist.
   * @protected
   */
  protected updateState(): void {
    this.state = CHECKSTATE.IMPROVE;
  }

  public getState(): CHECKSTATE {
    return this.state;
  }

  /**
   * Returns the name of the checklist.
   * @return {string}
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Returns the icon of the checklist.
   * @return {}
   */
  public getIcon(): JSX.Element {
    return <Icon name={this.iconName} color={this.stateColor[this.state]} />;
  }

  /**
   * Returns the title of the checklist item.
   * @return {JSX.Element}
   */

  public getTitle(state: CHECKSTATE): JSX.Element {
    return <Markdown allowDangerousHtml source={`# ${this.title[state]}`}/>;
  }

  /**
   * Returns the description section of the checklist item.
   * @return {JSX.Element}
   */
  public getDescription(state: CHECKSTATE): JSX.Element {
    switch (state) {
      case CHECKSTATE.OK:
        return <Markdown allowDangerousHtml source={this.description[CHECKSTATE.OK]}/>;
      case CHECKSTATE.REVIEW:
        return <Markdown allowDangerousHtml source={this.description[CHECKSTATE.REVIEW]}/>;
      case CHECKSTATE.IMPROVE:
        return <Markdown allowDangerousHtml source={this.description[CHECKSTATE.IMPROVE]}/>;
      default:
        return <React.Fragment />;
    }
  }

  /**
   * Returns the details section of the checklist item.
   * @return {JSX.Element}
   */
  public getDetails(state: CHECKSTATE): JSX.Element {
    return <React.Fragment />;
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(state: CHECKSTATE): JSX.Element {
    return <React.Fragment />;
  }

  public getChecklistItem(): JSX.Element {
    let containerStyle;
    let color;
    switch (this.getState()) {
      case CHECKSTATE.IMPROVE:
        containerStyle = { backgroundColor: '#fae9e9', width: '100%'};
        color = 'red';
        break;
      case CHECKSTATE.REVIEW:
        containerStyle = { backgroundColor: '#f9fae9', width: '100%'};
        color = 'yellow';
        break;
      case CHECKSTATE.OK:
        containerStyle = {backgroundColor: '#e2fbdd', width: '100%'};
        color = 'green';
    }

    return (
      <div style={containerStyle} key={this.name}>
        <Grid centered>
          <Grid.Column width={10}>
            <div className="checklist">
              <Header as='h3' color={this.stateColor[this.state]} attached='top'>
                {this.getIcon()}{this.getName()}
              </Header>
              <Segment attached raised placeholder id={`checklist-${this.name}`} key={`checklist-${this.name}`} padded='very'>
                <div className="labelStatus">
                  <Label as='a' size='large' ribbon='right' color={color}>{this.getState()}</Label>
                </div>
                {this.getTitle(this.getState())}
                {this.getDescription(this.getState())}
                {this.getDetails(this.getState())}
                {this.getActions(this.getState())}
              </Segment>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  protected isSixMonthsOld(dateString?: string): boolean {
    if (dateString) {
      const lastVisit = moment(dateString, 'YYYY-MM-DD');
      return lastVisit.isBefore(moment().subtract(6, 'months'));
    }
    return true;
  }
}

