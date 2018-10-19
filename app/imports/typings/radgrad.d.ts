interface Ice {
  i: number;
  c: number;
  e: number;
}

interface IoiDefine {
  semester: string;
  opportunity: string;
  sponsor: string;
  verified: boolean;
  student: string;
}

interface IoiUpdate {
  semesterID?: string;
  verified?: boolean;
  ice?: Ice;
}
