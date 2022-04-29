/**
 * Warn about a missing field with id or name when managing fields.
 */
export function warnAboutMissingIdentifier({
  htmlContent,
  documentationPath: documentationAnchorLink,
  handlerName,
}: {
  htmlContent: string;
  documentationPath: string;
  handlerName: string;
}) {
  console.warn(
    `Warning: \`mochi-forms\` called \`${handlerName}\`, but you forgot to pass an \`id\` or \`name\` attribute to your input:
      ${htmlContent}
      \`mochi-forms\` cannot determine which value to update. For more info see https://mochidocs.com/forms/${documentationAnchorLink}
    `
  );
}
