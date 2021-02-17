import React from 'react';
import { Segment } from 'semantic-ui-react';
import { ChecklistState } from '../../../api/checklist/ChecklistState';

/**
 * Base class for all checklist items.
 */
export class Checklist {
  private name: string;

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
    let segmentStyle;
    switch (this.getState()) {
      case 'Improve':
        segmentStyle = {
          backgroundColor: '#C94963',
        };
        break;
      case 'Review':
        segmentStyle = {
          backgroundColor: '#CEB23F',
        };
        break;
      case 'OK':
        segmentStyle = {
          backgroundColor: '#6FBE44',
        };
    }
    return (
      <Segment id={`checklist-${this.name}`} key={`checklist-${this.name}`} style={segmentStyle}>
        {this.getTitle(this.getState())}
        {this.getDescription(this.getState())}
        {this.getDetails(this.getState())}
        {this.getActions(this.getState())}
      </Segment>
    );
  }

}
