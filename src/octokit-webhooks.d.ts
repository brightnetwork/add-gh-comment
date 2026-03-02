// Bridge for @octokit/webhooks-definitions/schema which lacks ESM exports
declare module "@octokit/webhooks-definitions/schema" {
  export interface PullRequestEvent {
    action: string;
    number: number;
    pull_request: {
      number: number;
      head: { sha: string };
      [key: string]: unknown;
    };
    repository: {
      name: string;
      owner: { login: string };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }
}
