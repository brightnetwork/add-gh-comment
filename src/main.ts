import * as core from "@actions/core";
import * as github from "@actions/github";
import type { PullRequestEvent } from "@octokit/webhooks-definitions/schema";
import { addComment, removeComments } from "./comment";
import { render } from "./templating";

async function run(): Promise<void> {
  try {
    let body: string | undefined | null = core.getInput("body");
    const enabled =
      !core.getInput("skip-comment") ||
      core.getInput("skip-comment").toLowerCase() === "false";

    if (!body && enabled) {
      const template: string | undefined = core.getInput("template-path");
      if (!template) {
        throw new Error("Template input is required if body is ");
      }

      const templateVar = core.getInput("template-var");
      body = await render(template, {
        context: github.context,
        input: templateVar,
      });
    }

    let id: string | undefined = core.getInput("id");
    if (!id) {
      id = "default-id";
    }

    if (
      github.context.eventName !== "pull_request" &&
      github.context.eventName !== "pull_request_target"
    ) {
      throw new Error("Action can not be run on a non pull request event");
    }
    const prContext = github.context.payload as unknown as PullRequestEvent;

    const context = {
      repo: prContext.repository.name,
      owner: prContext.repository.owner.login,
      issue_number: prContext.number,
      octokit: github.getOctokit(core.getInput("token", { required: true })),
    };
    await removeComments(id, context);
    if (enabled) {
      await addComment({ id, body }, context);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
      core.error(error.name);
      core.error(error.message);
      core.error(error.stack || "");
    }
  }
}

run();
