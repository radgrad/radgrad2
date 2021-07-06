export interface Location {
  city?: string;
  country?: string;
  state?: string;
  zip?: string;
}

export interface InternshipDefine {
  urls: string[];
  position: string;
  description: string;
  lastUploaded?: Date;
  missedUploads?: number;
  interests: string[];
  careerGoals: string[];
  company?: string;
  location?: Location;
  contact?: string;
  posted?: string;
  due?: string;
}
