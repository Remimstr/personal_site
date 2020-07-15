import _ from "lodash";
import all from "../../docs/*.md";

export const projects = _.chain(all)
  .map(transform)
  .value();

function transform({ filename, html, metadata }) {
  const permalink = filename.replace(/\.md$/, '');

  return { filename, html, ...metadata, permalink };
}

export function findProject(permalink) {
  return _.find(projects, { permalink });
}