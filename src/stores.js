import { writable } from 'svelte/store';

export const issues = writable({_sequence: []});
export const sprints = writable({_sequence: []});
export const epics = writable({_sequence: []});

export const activeSearchTerm = writable("");
export const activeSprintFilter = writable("");
export const activeIssueId = writable(undefined);

export const selectedIssuesIds = writable([]);

export const ready = writable(false);