import * as core from "@actions/core";
import * as github from "@actions/github";
import type { PullRequestEvent } from "@octokit/webhooks-definitions/schema";
import { addComment, removeComments } from "./comment";
import { render } from "./templating";

async function run(): Promise<void> {
  try {
    let body: string | undefined = core.getInput("body");
    core.debug(`body is ${body}`);
    if (!body) {
      const template: string | undefined = core.getInput("template");
      core.debug(`template is ${template}`);
      if (!template) {
        throw new Error("Template input is required if body is ");
      }
      body = await render(template, { context: github.context });
      core.debug(`body is ${body} (from template)`);
    }

    let id: string | undefined = core.getInput("id");
    if (!id) {
      id = "default-id";
      core.debug(`id is ${id}`);
    }

    if (github.context.eventName !== "pull_request") {
      throw new Error("Action can not be run on a non pull request event");
    }
    const prContext = github.context as unknown as PullRequestEvent;

    const context = {
      repo: prContext.repository.name,
      owner: prContext.repository.owner.login,
      issue_number: prContext.number,
      octokit: github.getOctokit(core.getInput("token", { required: true })),
    };
    await removeComments(id, context);
    await addComment({ id, body }, context);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
