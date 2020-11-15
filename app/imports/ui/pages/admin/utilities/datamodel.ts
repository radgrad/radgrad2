export function makeMarkdownLink(url: string): string {
  return (url) ? `[${url}](${url})` : ' ';
}

export const makeYoutubeLink = (url: string): string => (url ? `https://youtu.be/${url}` : '');
