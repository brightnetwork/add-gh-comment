import type { PullRequestEvent } from "@octokit/webhooks-definitions/schema";
import { Octokit, UNIQUE_ID } from "./comment";

const numberOfCommentsMatching = (
  github: Octokit,
  context: PullRequestEvent,
  regexp: RegExp,
): Promise<number> =>
  github.rest.issues
    .listComments({
      issue_number: context.pull_request.number,
      repo: context.repository.name,
      owner: context.repository.owner.login,
    })
    .then(result => result.data)
    .then(comments => comments.filter(c => c.body?.includes(UNIQUE_ID)))
    .then(comments => comments.filter(c => c.body?.match(regexp)))
    .then(comments => comments.length);

export const assertOneComment = async (
  github: Octokit,
  context: PullRequestEvent,
  regexp: RegExp,
): Promise<void> => {
  const count = await numberOfCommentsMatching(github, context, regexp);
  if (count !== 1) {
    throw new Error(
      `Invalid number of comment found for regexp ${regexp}: ${count}`,
    );
  }
};
