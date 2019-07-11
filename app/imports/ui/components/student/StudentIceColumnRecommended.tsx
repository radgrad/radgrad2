import * as React from 'react';

interface IStudentIceColumnRecommendedProps {
  type: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  projectedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
}

class StudentIceColumnRecommended extends React.Component<IStudentIceColumnRecommendedProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div/>
    );
  }
}

export default StudentIceColumnRecommended;
