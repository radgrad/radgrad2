import moment from 'moment';
import React from 'react';
import {Grid, Header, Icon, Label, Segment, SemanticICONS} from 'semantic-ui-react';
import '../../../../client/style.css';

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

  constructor() {
    this.title[CHECKSTATE.OK] = 'Item is OK';
    this.title[CHECKSTATE.REVIEW] = 'Item should be reviewed';
    this.title[CHECKSTATE.IMPROVE] = 'Item should be improved';
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
    return <Icon name={this.iconName} color="grey" />;
  }

  /**
   * Returns the title of the checklist item.
   * @return {JSX.Element}
   */

  public getTitle(state: CHECKSTATE): JSX.Element {
    return <Header as='h1'>{this.title[state]}</Header>;
  }

  /**
   * Returns the description section of the checklist item.
   * @return {JSX.Element}
   */
  public getDescription(state: CHECKSTATE): JSX.Element {
    return <React.Fragment />;
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
              <Header as='h3' color='grey' attached='top'>
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
