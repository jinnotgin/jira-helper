import _ from "lodash";
import { writable, derived } from "svelte/store";

const keyedArray = (arrayItem) =>
  arrayItem.reduce(
    (accumulator, currentValue) => {
      const { id } = currentValue;
      const keyValue = {};
      keyValue[id] = currentValue;

      const { _sequence } = accumulator;
      _sequence.push(id);

      return { ...accumulator, ...keyValue, _sequence };
    },
    { _sequence: [] }
  );

export const jiraData = writable({});
export const issues = derived(jiraData, ($jiraData) =>
  keyedArray(_.get($jiraData, "issues", []))
);
export const sprints = derived(jiraData, ($jiraData) =>
  keyedArray(_.get($jiraData, "sprints", []))
);
export const epics = derived(jiraData, ($jiraData) =>
  keyedArray(_.get($jiraData, "epicData.epics", []))
);
export const overallIssuesSequence = derived(sprints, ($sprints) =>
  $sprints._sequence.reduce((acc, sprintId) => {
    return [...acc, ...$sprints[sprintId].issuesIds];
  }, [])
);
export const dataLastUpdateTime = derived(jiraData, (_) =>
  new Date().getTime()
);

export const activeSearchTerm = writable("");
export const activeSprintFilter = writable("");
export const activeIssueId = writable(undefined);

export const selectedIssuesIds = writable([]);
export const isMovingIssues = writable(false);

export const ready = writable(false);
