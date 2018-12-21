// tslint:disable member-ordering
import * as React from 'react';
import Board from './Board';
import { observe } from './Game';
import BoardSquare from './BoardSquare';

export interface ChessboardTutorialAppState {
  knightPosition: [number, number];
}

/**
 * Unlike the tutorial, export a component so it can be used on the website.
 */
export default class ChessboardTutorialApp extends React.Component<
  {},
  ChessboardTutorialAppState
  > {
  public state: ChessboardTutorialAppState = { knightPosition: [1, 7] };
  private unobserve?: (() => void);

  public componentDidMount() {
    this.unobserve = observe(this.handleChange);
  }
  public componentWillUnmount() {
    if (this.unobserve) {
      this.unobserve();
    }
  }

  public render() {
    console.log('Chessboard.render()');
    const { knightPosition } = this.state;
    return (
      <div
        style={{
          width: 500,
          height: 500,
          border: '1px solid gray',
        }}
      >
        <Board knightPosition={knightPosition} />
        <BoardSquare key={1} x={1} y={1}>foo</BoardSquare>
      </div>
    );
  }

  private handleChange = (knightPosition: [number, number]) => {
    const nextState = { knightPosition };
    if (this.state) {
      this.setState(nextState);
    } else {
      this.state = nextState;
    }
  }
}
