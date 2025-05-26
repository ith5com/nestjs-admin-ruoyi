export const uniqueSlash = (path: string) =>
  path.replace(/(https?:\/)|(\/)+/g, '$1$2');
