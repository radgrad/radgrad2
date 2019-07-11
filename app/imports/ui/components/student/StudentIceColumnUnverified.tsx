import * as React from 'react';

interface IStudentIceColumnUnverifiedProps {
  type: 'Innovation' | 'Competency' | 'Experience';
  projectedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
}

class StudentIceColumnUnverified extends React.Component<IStudentIceColumnUnverifiedProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div/>
    );
  }
}

export default StudentIceColumnUnverified;
