declare module 'meteor/meteorhacks:ssr' {
  export const SSR: any;

  export function render(template: any, data: any);

  export function compileTemplate(templateName: any, TemplateContent: any, options?: any);
}
