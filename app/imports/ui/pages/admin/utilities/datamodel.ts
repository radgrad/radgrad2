export const makeMarkdownLink = (url: string): string => ((url) ? `[${url}](${url})` : ' ');

export const makeYoutubeLink = (url: string): string => (url ? `https://youtu.be/${url}` : '');
