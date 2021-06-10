import SimpleSchema from 'simpl-schema';

class InternshipCollection {
  constructor() {
    let defineSchema = new SimpleSchema({
      urls: String[],
      position: String,
      description: String,
      lastUploaded: { type: Date, optional: true },
      missedUploads: Date,
      interests: String[],
      careerGoals: String[],
      company: { type: String, optional: true },
      location: { type: Object, optional: true },
      contact: String,
      posted: String,
      due: String,
      guid: String,
    });
  }
}

export const Internships = new InternshipCollection();