import * as React from 'react';
import { Ice } from '../../../typings/radgrad';

interface IMenuIceCircleProps {
  earned: number;
  planned: number;
  type: string;
}

export default class MenuIceCircle extends React.Component<IMenuIceCircleProps, {}> {
  public render() {
    const p = (this.props.planned < 100) ? this.props.planned : 100;
    const e = (this.props.earned < 100) ? this.props.earned : 100;
    const classNamesPlanned = `radgrad-ice-circle p${p} radgrad-proj-${this.props.type}`;
    const classNamesEarned = `radgrad-ice-circle p${e} radgrad-earn-${this.props.type}`;
    return (
      <div className="radgrad-ice menu">
        <a className={classNamesPlanned} href="{{pathFor iceRouteName username=routeUserName}}">
          <div className="radgrad-ice-stat">
            <span>{e}</span>
          </div>
          <div className="slice">
            <div className="bar"/>
            <div className="fill"/>
          </div>
        </a>
        <a className={classNamesEarned}>
          <span/>
          <div className="slice">
            <div className="bar"/>
            <div className="fill"/>
          </div>
        </a>
      </div>
    );
  }
}
