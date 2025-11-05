# linear-cli

This is a very bare-bones script to create an entire backlog from a json file. Feel free to have grok estimate your project, raw-dog it from the comfort of your editor, or compose it however you see fit.
To use it:

- create a linear API key and set it in `.env`. Keep in mind you can limit it's access to a single team!
- install dependencies `npm install`
- list the teams the api key has access to: `node index.js list-teams`
- list the projects the api key has access to: `node index.js list-projects`
- create the task file according to the example below:
- run the main task of the script `node index.js create-tasks --file ./tasks.js`
- see all your tasks show up in real time!

Example taskfile:

```js
// tasks.js
export default {
  project: "<project-id>",
  team: "<team-id>",
  state: "<state-id>",
  tasks: [
    { title: "set team, state and project id in taskfile" },
    { title: "add support for estimations" },
    { title: "add -q flag that only lists ids, one per line" },
    { title: "command to create a single task, for greater composability" },
    {
      title: "support updates",
      children: [
        { title: "print taskfile including ids to stdout when creating tasks" },
        { title: "add -i file to replace the taskfile in-place" },
        {
          title:
            "check if a task with the given id is already created, and only update it in that case",
        },
      ],
    },
    {
      title: "validate taskfile schema",
      description:
        "research a runtime json validation schema or typescript tools I imagine probably exist",
    },
    {
      title: "add alternate schema for a string to be an entire task",
      description: `
instead of needing to write {title: "set team, state and project id in taskfile"}, allow for a bare string to be interpreted as a task with only a title, : "set team, state and project id in taskfile"`,
    },
    {
      title: "configure ci",
      children: [{ title: "static analysis" }, { title: "add one smoke test" }],
    },
  ],
};
```
