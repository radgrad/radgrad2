import moment from 'moment';
import React from 'react';
import { Segment, Grid, Label, Header, Icon} from 'semantic-ui-react';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import '../../../../client/style.css';

/**
 * Base class for all checklist items.
 */
export class Checklist {
  private name: string;

  private icon: string;

  protected state: ChecklistState;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Updates the state of this Checklist.
   * @protected
   */
  protected updateState(): void {
    this.state = 'Improve';
  }

  public getState(): ChecklistState {
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
  public getIcon(): string {
    return this.icon;
  }

  /**
   * Returns the title of the checklist item.
   * @return {JSX.Element}
   */

  public getTitle(state: ChecklistState): JSX.Element {
    return <React.Fragment />;
  }

  /**
   * Returns the description section of the checklist item.
   * @return {JSX.Element}
   */
  public getDescription(state: ChecklistState): JSX.Element {
    return <React.Fragment />;
  }

  /**
   * Returns the details section of the checklist item.
   * @return {JSX.Element}
   */
  public getDetails(state: ChecklistState): JSX.Element {
    return <React.Fragment />;
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(state: ChecklistState): JSX.Element {
    return <React.Fragment />;
  }

  public getChecklistItem(): JSX.Element {
    let containerStyle;
    switch (this.getState()) {
      case 'Improve':
        containerStyle = {
          backgroundColor: '#fae9e9',
          width: '100%',
        };
        break;
      case 'Review':
        containerStyle = {
          backgroundColor: '#f9fae9',
          width: '100%',
        };
        break;
      case 'Awesome':
        containerStyle = {
          backgroundColor: '#e2fbdd',
          width: '100%',
        };
    }

    let color;
    switch (this.getState()) {
      case 'Improve':
        color = {
          color: 'red',
        };
        break;
      case 'Review':
        color = {
          color: 'yellow',
        };
        break;
      case 'Awesome':
        color = {
          color: 'green',
        };
    }

    return (
      <div style={containerStyle} >
        <Grid centered>
          <Grid.Column width={10} >
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
