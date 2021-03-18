import moment from 'moment';
import React from 'react';
import Markdown from 'react-markdown/with-html';
import {Card, Header, Icon, Label, SemanticICONS} from 'semantic-ui-react';

export const enum CHECKSTATE {
  OK = 'OK',
  REVIEW = 'REVIEW',
  IMPROVE = 'IMPROVE',
}

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
    return <Icon name={this.iconName} color={this.stateColor[this.state]}/>;
  }

  /**
   * Returns the title of the checklist item.
   * @return {JSX.Element}
   */
  public getTitle(): JSX.Element {
    return <Markdown allowDangerousHtml source={`# ${this.title[this.state]}`}/>;
  }

  public getTitle2(): JSX.Element {
    return <Markdown allowDangerousHtml source={`${this.title[this.state]}`}/>;
  }

  /**
   * Returns the description section of the checklist item.
   * @return {JSX.Element}
   */
  public getDescription(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.OK:
        return <Markdown allowDangerousHtml source={this.description[CHECKSTATE.OK]}/>;
      case CHECKSTATE.REVIEW:
        return <Markdown allowDangerousHtml source={this.description[CHECKSTATE.REVIEW]}/>;
      case CHECKSTATE.IMPROVE:
        return <Markdown allowDangerousHtml source={this.description[CHECKSTATE.IMPROVE]}/>;
      default:
        return <React.Fragment/>;
    }
  }

  /**
   * Returns the details section of the checklist item.
   * @return {JSX.Element}
   */
  public getDetails(): JSX.Element {
    return <React.Fragment/>;
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(): JSX.Element {
    return <React.Fragment/>;
  }

  public getChecklistItem(): JSX.Element {
    return (
      <Card style={{minWidth: '425px'}} key={this.name}>
        <Label attached='top' color={this.stateColor[this.state]}>{this.getState()}</Label>
        <Card.Content>
          <Header as='h3' color={this.stateColor[this.state]}>{this.getIcon()}{this.getName()}</Header>
          <Header as='h4'>{this.getTitle2()}</Header>
          {this.getDescription()}
          {this.getDetails()}
          {this.getActions()}
        </Card.Content>
      </Card>
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

