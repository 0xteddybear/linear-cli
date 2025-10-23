import { LinearClient } from "@linear/sdk";
import { Command } from "commander";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config({ silent: true });

if (!process.env.LINEAR_API_KEY) {
  console.error("Error: LINEAR_API_KEY not found in .env file");
  process.exit(1);
}

const client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

const program = new Command();

program
  .name("linear-cli")
  .description("CLI tool for managing Linear tasks")
  .version("0.0.0");

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

async function createChild(teamId, projectId, stateId, parentId, issue) {
  const res = await client.createIssue({
    teamId,
    parentId,
    stateId,
    projectId,
    description: issue.description,
    title: issue.title,
  });
  const id = res._issue.id;
  console.log("created issue: (", issue.title, ") id: (", id, ")");

  if (issue.children) {
    for (const child of issue.children) {
      await createChild(teamId, projectId, stateId, id, child);
    }
  }
}

async function createTasks(tasksArray, teamId, projectId, stateId) {
  for (const task of tasksArray) {
    await createChild(teamId, projectId, stateId, undefined, task);
  }
}

program
  .command("list-projects")
  .description("List all available projects")
  .action(async () => {
    try {
      await listProjects();
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  });

program
  .command("list-teams")
  .description("List all available teams")
  .action(async () => {
    try {
      await listTeams();
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  });

program
  .command("list-states")
  .description("List all workflow states for a team")
  .requiredOption("--team-id <teamId>", "Team ID")
  .action(async (options) => {
    try {
      await listStates(options.teamId);
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  });

program
  .command("create-tasks")
  .description("Create tasks from a JSON file")
  .requiredOption("--file <path>", "Path to JSON file containing tasks")
  .requiredOption("--team-id <teamId>", "Team ID")
  .requiredOption("--project-id <projectId>", "Project ID")
  .requiredOption("--state-id <stateId>", "State ID")
  .action(async (options) => {
    try {
      const { default: tasksData } = await import(options.file);
      await createTasks(
        tasksData,
        options.teamId,
        options.projectId,
        options.stateId,
      );
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  });

program.parse();
