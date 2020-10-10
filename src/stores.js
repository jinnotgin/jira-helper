import { writable } from 'svelte/store';

export const issues = writable({_sequence: []});
export const sprints = writable({_sequence: []});
export const epics = writable({_sequence: []});
export const dataLastUpdateTime = writable(0);

export const activeSearchTerm = writable("");
export const activeSprintFilter = writable("");
export const activeIssueId = writable(undefined);

export const selectedIssuesIds = writable([]);
export const isMovingIssues = writable(false);

export const ready = writable(false);