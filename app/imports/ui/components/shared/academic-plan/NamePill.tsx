import React from 'react';

interface INamePillProps {
  name: string;
}

const NamePill = (props: INamePillProps) => (<b>{props.name}</b>);

export default NamePill;
