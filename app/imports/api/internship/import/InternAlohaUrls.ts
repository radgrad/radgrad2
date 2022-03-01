export enum InternAlohaUrlsEnum {
  'manual' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/manual-entry.json',
  'apple' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/apple.json',
  'chegg' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/chegg.json',
  'cisco' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/cisco.json',
  'glassdoor' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/glassdoor.json',
  'idealist' = 'https://raw.githubusercontent.com/internaloha/internaloha/master/scraper/data/canonical/idealist.canonical.data.json',
  'indeed' = 'https://raw.githubusercontent.com/internaloha/internaloha/master/scraper/data/canonical/indeed.canonical.data.json',
  'linkedin' = 'https://raw.githubusercontent.com/internaloha/internaloha/master/scraper/data/canonical/linkedin.canonical.data.json',
  'monster' = 'https://raw.githubusercontent.com/internaloha/internaloha/master/scraper/data/canonical/monster.canonical.data.json',
  'nsf-reu' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/nsf.json',
  'simplyhired' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/simplyHired.json',
  'soc' = 'https://raw.githubusercontent.com/internaloha/internaloha/master/scraper/data/canonical/soc.canonical.data.json',
  'stackoverflow' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/stackoverflow.json',
  'ziprecruiter' = 'https://raw.githubusercontent.com/internaloha/scrapers/main/listings/compsci/ziprecruiter.json',
}

export const internAlohaUrls = Object.values(InternAlohaUrlsEnum);
