import type * as github from "@actions/github";

type Octokit = ReturnType<typeof github.getOctokit>;

type Context = {
  repo: string;
  owner: string;
  issue_number: number;
  octokit: Octokit;
};

const UNIQUE_ID = "1c3c3b02-bb4e-46f1-a516-90d8ab4261b6";

const getSignature = (id: string): string => `<!-- ${UNIQUE_ID}:${id} -->`;

const signComment = (id: string, body: string): string =>
  body.concat("\n").concat(getSignature(id));

const isCommentSigned =
  (id: string) =>
  (comment: { body?: string }): boolean =>
    !!comment.body?.includes(getSignature(id));

export const removeComments = (id: string, context: Context) =>
  context.octokit.rest.issues
    .listComments({
      issue_number: context.issue_number,
      repo: context.repo,
      owner: context.owner,
    })
    .then(comments =>
      Promise.all(
        comments.data
          .filter(isCommentSigned(id))
          .map(comment => ({
            repo: context.repo,
            owner: context.owner,
            comment_id: comment.id,
          }))
          .map(context.octokit.rest.issues.deleteComment),
      ),
    );

export const addComment = (
  comment: { id: string; body: string },
  context: Context,
) =>
  context.octokit.rest.issues.createComment({
    body: signComment(comment.id, comment.body),
    issue_number: context.issue_number,
    repo: context.repo,
    owner: context.owner,
  });
