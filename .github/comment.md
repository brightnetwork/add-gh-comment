{{ context.payload.pull_request.head.sha }} **CI check: comment from template**

<details>

<summary>Hello, {{ context.payload.sender.login }}! gh action context:</summary>

```json
{{ JSON.stringify(context, undefined, 2) }}
```

</details>

