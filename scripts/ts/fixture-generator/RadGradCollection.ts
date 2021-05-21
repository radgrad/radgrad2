import _ from 'lodash';

interface Doc {
  slug?: string;
  term?: string;
}

class RadGradCollection {
  protected collectionName: string;
  protected contents: Doc[];

  constructor(collectionName: string, contents: Doc[]) {
    this.collectionName = collectionName;
    this.contents = contents;
  }

  public getCollectionName() {
    return this.collectionName;
  }

  public count() {
    return this.contents.length;
  }

  public getContents() {
    return this.contents;
  }

  public getDocBySlug(slug: string) {
    this.contents.find((doc) => doc.slug === slug);
  }

  public getRandomSlugs(num: number) {
    const retVal = [];
    for (let i = 0; i < 2 * num; i++) {
      const doc = this.contents[Math.floor(Math.random() * this.contents.length)];
      retVal.push(doc.slug);
    }
    return _.uniq(retVal).slice(0, num);
  }
}

export default RadGradCollection;
