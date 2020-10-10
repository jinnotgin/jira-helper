<script>
  import _ from "lodash";
  import {
    issues,
	sprints,
	overallIssuesSequence,
    activeSearchTerm,
    activeSprintFilter,
    activeIssueId,
    selectedIssuesIds,
    isMovingIssues
  } from "./stores.js";

  import DragDropAware from "./DragDropAware.svelte";
  import SprintList from "./SprintList.svelte";
  import Card from "./Card.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { set_IssueEstimate, set_newIssue, set_issuesRank } from "./api.js";

  const onItemClick = (event, itemId) => {
    console.log(event);
    activeIssueId.set(itemId);

    if (event.ctrlKey || event.metaKey) {
      selectedIssuesIds.update(arr => [...arr, itemId]);
    } else {
      selectedIssuesIds.set([itemId]);
    }
  };

  const onNumberSubmit = async (itemId, estimateValue) => {
    console.log({ itemId, estimateValue });
    const result = await set_IssueEstimate(itemId, estimateValue);
    console.log(result);
  };

  const onCreateNewIssue = async event => {
    console.log(event);
    const { sprintId, title, insertAt } = event.detail;

    console.log({ sprintId, title });
    const result = await set_newIssue(sprintId, title);
    const newIssueKey = _.get(result, "issue.issueKey", false);

    if (!!newIssueKey && insertAt === "start") {
      const { issuesIds = [] } = $sprints[sprintId];
      if (issuesIds.length === 0) return false;

      const firstIssueKey = $issues[issuesIds[0]].key;
      const reorder_result = await set_issuesRank(
        sprintId,
        [newIssueKey],
        firstIssueKey,
        "before"
      );
      console.log(reorder_result);
    }

    // apparently Jira needs a bit of time before their API shows the new data. let's wait for 0.5 second.
    setTimeout(() => dispatch("refreshDataSource", {}), 250);
  };

  const onMouseReleased = event => {
    const { elementWhenMouseIsReleased } = event.detail;

    if (
      elementWhenMouseIsReleased !== null &&
      elementWhenMouseIsReleased.closest("div.divider") !== null
    ) {
      // hack, but we are simulating a mouse click on the divider
      // this is becasue the older implementation uses a mouse click to trigger a move.
      // TODO: clean this up in future.
      elementWhenMouseIsReleased.click();
      console.log("Triggering mouse click on", { elementWhenMouseIsReleased });
    }
  };

  const onMoveIssues = async event => {
    const { sprintId, moveMode, referenceIssueId } = event.detail;
    console.log({ sprintId, moveMode, referenceIssueId });

    const sequenced_selectIssueIds = [...$selectedIssuesIds].sort((a, b) => {
      return $overallIssuesSequence.indexOf(a) - $overallIssuesSequence.indexOf(b);
	});
	console.log({sequenced_selectIssueIds})

    isMovingIssues.set(true);
    const reorder_result = await set_issuesRank(
      sprintId,
      sequenced_selectIssueIds,
      referenceIssueId,
      moveMode
    );
    console.log(reorder_result);

    // apparently Jira needs a bit of time before their API shows the new data. let's wait for 0.5 second.
    setTimeout(() => dispatch("refreshDataSource", {}), 250);
  };

  $: _$issues = $issues;
  $: sprintIssues = $sprints._sequence
    .filter(sprintId => {
      const hasSprintFilter = $activeSprintFilter !== "";

      return (
        !hasSprintFilter ||
        (hasSprintFilter && sprintId === $activeSprintFilter)
      );
    })
    .map(sprintId => {
      const sprintData = $sprints[sprintId];
      const { issuesIds } = sprintData;

      const issues = issuesIds.map(issueId => {
        const issue = _$issues[issueId];
        const { summary, statusUrl, key } = issue;
        const estimate = _.get(
          issue,
          "estimateStatistic.statFieldValue.text",
          ""
        );

        const searchString = `${key} ${summary} ${estimate}`
          .toLocaleLowerCase()
          .trim();
        const _hidden =
          $activeSearchTerm === ""
            ? false
            : !searchString.includes($activeSearchTerm);

        let _name = summary;
        // if (estimate !== "") _name += ` [${estimate}]`;

        return {
          ...issue,
          _name,
          _prefix: key,
          _url: `${statusUrl}browse/${key}`,
          _tooltip: `${key}: ${summary}`,
          _hidden,
          _active: $activeIssueId === issueId,
          _selected: $selectedIssuesIds.includes(issueId),
          _numberValue: estimate
        };
      });

      return { ...sprintData, issues };
    });
</script>

<!-- <DragDropAware let:isDragging on:mouseReleased={onMouseReleased}> -->
<div>
  <!-- <div slot="content"> -->
  {#each sprintIssues as sprint, i (sprint.id)}
    <SprintList
      sprintId={sprint.id}
      header={sprint.name}
      items={sprint.issues}
      {onItemClick}
      {onNumberSubmit}
      on:createNewIssue={onCreateNewIssue}
      on:moveIssues={onMoveIssues}
      isSearching={$activeSearchTerm !== ''}
      userCanToggleVisibility={$activeSearchTerm === '' && $activeSprintFilter === ''} />
    <!-- {isDragging} /> -->
  {/each}
</div>
<!-- <div slot="shadow">
    <Card type="blank" name={`${$selectedIssuesIds.length} items selected`} />
  </div> -->
<!-- </DragDropAware> -->
