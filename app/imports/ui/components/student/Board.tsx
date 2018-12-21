import * as React from 'react';
import styled from 'styled-components';
import BoardSquare from './BoardSquare';
import Knight from './Knight';

export interface BoardProps {
  knightPosition: [number, number];
}

export default class Board extends React.Component<BoardProps> {
  public render() {
    console.log('Board.render()');
    const squares = [];
    for (let i = 0; i < 64; i += 1) {
      squares.push(this.renderSquare(i));
    }
    // console.log(squares);
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
      }}>{squares}</div>
    );
  }

  private renderSquare(i: number) {
    const x = i % 8;
    const y = Math.floor(i / 8);
    // console.log(`renderSquare ${x}, ${y}`);
    return (
        <BoardSquare key={i} x={x} y={y}>
          {this.renderPiece(x, y)}
        </BoardSquare>
    );
  }

  private renderPiece(x: number, y: number) {
    const [knightX, knightY] = this.props.knightPosition;
    const isKnightHere = x === knightX && y === knightY;
    // console.log(`Board.knightIstHere = ${isKnightHere} ${x}, ${y}`);
    return isKnightHere ? <Knight/> : null;
  }
}
