# Github Action | Add Github Comment 

A GitHub action to create or replace a pull request comment.

This action was created as a primitive for "report through comment" flow.
Typical usecase could be to publish a comment with the link to the test coverage report on a pull request. Each new commit in the PR will lead to the previous comment being deleted, and a new one being append below.

## Usage

### Add a comment with inlined body

```yaml
- uses: brightnetwork/add-gh-comment@v0.1
  with:
    id: frontend-coverage
    body: |
      ${{ github.event.pull_request.head.sha }}: test coverage published:

      https://my-site.com/${{ github.event.pull_request.head.sha }}/index.html
```

The `id: frontend-coverage` here ensure the de-duplication. If a comment created by this action with the same id already exist, then it will be deleted. 


### Add a comment with body template

```yaml
- uses: brightnetwork/add-gh-comment@v0.1
  with:
    id: backend-coverage
    template-path: .github/templates/comment.md
    template-var: ${{ step.XX.outputs.2 }}
```

Templating is done with [ejs](https://ejs.co/).
The full github action context is available in the templating context.

```html
<%= context.payload.pull_request.head.sha %> **CI check: comment from template**

Step 2 output: <%= input %>

<details>

<summary>Hello, <%= context.payload.sender.login %>! gh action context:</summary>

        ```json
        <%- JSON.stringify(context, undefined, 2) %>
        ```

</details>
```

### Conditional comment

```yaml
- uses: brightnetwork/add-gh-comment@v0.1
  with:
    id: backend-coverage
    skip-comment: ${{ step.XX.outputs.2 == '' }}
    template-path: .github/templates/comment.md
    template-var: ${{ steps.XX.outputs.2 }}
```

This will skip the comment if the `skip-comment` input is set to a truthy value.
This is different from skipping the action, as the action will still run and delete any previous comment with the same id.

## State of the art comparison

- [Create or Update Comment](https://github.com/marketplace/actions/create-or-update-comment) is similar, but focused on a different flow (ChatOps). This action comes with "battery included" regarding the "report through comment" flow: delete and create by default, templating included.


## Developement

- Architecture is mainly coming from [github typescript action](https://github.com/actions/typescript-action)
- There is no unit tests (for now), but an action is running on each PR that use this repo to comment the PR, and then analyze the results. This provides "end to end" testing.
- `dist` folder needs to be updated on each commit - this can be done by the `npm run package` command.
