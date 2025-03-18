---
Name: Typescript Programming Notes
Snippet: Notes
Platform: N/a
tags:
  - coding
  - scripting
  - Resources
---
Extensions:
- DotEnv
- ESLint
- Pretty Typescript (More readable error output)

I don't need a lot of extensions to code.

------

To initialize ESLint in VS Codium:

```bash
npm init @eslint/config
```

------

Return the explicit type of the return variable. So for example:

```typescript
async function GetFile(): Promise<string> {

    const answer = await rl.question('File to download? ');

    return answer;

}
```

Which defines the return type as `Promise<string>` which is basically just returning string type, but since this is an async function, we need to use `Promise<type>` keyword.

If nothing is returned, still return `void` or for async `Promise<void>`.

------

When declaring variables, use `let` or `const` if the variable's value is never going to change.

------

For async do:

```typescript
(async() => {
	...
    await main(dbx).catch(console.error);
})();
```

I have no idea what this does exactly, but it is supposed to prevent some sort of weird runtime timeout.