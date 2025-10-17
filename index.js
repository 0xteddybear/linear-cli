import { LinearClient } from "@linear/sdk";

const client = new LinearClient({
  apiKey: "",
});

//0xbow
const teamId = "8158aa06-4b50-4dd9-ad34-4d9afeecc36a";
const projectId = "6d2830df-8516-4235-8fee-4d1c765de76f";

const tasks = [
  {
    title: "unit tests: Keystore",
    children: [
      { title: "registerSpendingKeys" },
      { title: "rotateRevocableKey" },
      { title: "registerViewingKey" },
      { title: "isKnownRoot" }
    ],
  },
  {
    title: "Integration tests",
    children: [
      {
        title: "Alice (msg.sender) makes a deposit for Bob, and Bob withdraws it publicly",
        children: [
          { title: "Bob already has registered their keys" },
          { title: "Bob registers their keys after the fact" }
        ]
      },
      { title: "Alice consolidates two notes to make a public payment of an amount greater than any of the notes'" }
    ],
  },
];

async function listProjects() {
  const projects = await client.projects();

  console.log("Available projects:\n");
  projects.nodes.forEach((p) => {
    console.log(`Name: ${p.name}`);
    console.log(`ID: ${p.id}`);
    console.log(`State: ${p.state}`);
    console.log("---");
  });
}
async function listStates(teamId) {
  const team = await client.team(teamId);
  const states = await team.states();

  console.log("Available workflow states:\n");
  states.nodes.forEach((s) => {
    console.log(`${s.name}: ${s.id}`);
    console.log(`  Type: ${s.type}`);
    console.log(`  Color: ${s.color}`);
    console.log("---");
  });
}

async function listTeams() {
  const teams = await client.teams();
  teams.nodes.forEach((team) => {
    console.log(`${team.name}: ${team.id}`);
  });
}

async function createChild(parentId, issue) {
  const res = await client.createIssue({
    teamId,
    parentId,
    stateId: "ff3ea940-841b-4f53-bc9f-031ba274f717", // TODO
    projectId,
    description: issue.description,
    title: issue.title,
  });
  const id = res._issue.id;
  console.log("created issue: (", issue.title, ") id: (", id, ")");

  if (issue.children) {
    for (const child of issue.children) {
      await createChild(id, child);
    }
  }
}

async function createTasks() {
  for (const task of tasks) {
    await createChild(undefined, task);
  }
}
createTasks();
// async function createIssues() {
//   for (const task of tasks) {
//     const parent = await client.createIssue({
//       teamId,
//       stateId: "ff3ea940-841b-4f53-bc9f-031ba274f717", // TODO
//       projectId,
//       description: task.description,
//       title: task.title,
//     });
//
//     for (const child of task.children) {
//       await client.createIssue({
//         teamId,
//         projectId,
//         title: child.title,
//         description: child.description,
//         parentId: parent.issue.id,
//       });
//     }
//   }
// }
