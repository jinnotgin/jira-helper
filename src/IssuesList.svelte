<script>
  import _ from "lodash";
  import {
    issues,
    sprints,
    overallIssuesSequence,
    isSearching,
    searchMatches,
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
    const { target } = event;
    console.log({ event, target });

    const isHyperlink =
      target.nodeName === "A" && target.classList.contains("url");
    const isNumberInput =
      target.nodeName === "INPUT" && target.classList.contains("numberInput");
    if (isHyperlink) event.preventDefault();

    if (!isNumberInput) {
      activeIssueId.set(itemId);

      // the following selection logic is not exactly the same as "file manager" UX
      // to be accurate, you should track the "last focused item" seperately from "selectedItems"
      if (event.ctrlKey || event.metaKey) {
        selectedIssuesIds.update(arr => [...arr, itemId]);
      } else if (event.shiftKey) {
        // remove any selected ranges
        let selection = window.getSelection();
        selection.removeAllRanges();

        // determine with "visual ordering" to use
        const visualSequence = $isSearching
          ? $searchMatches
          : $overallIssuesSequence;

        // proceed with selection logic
        const lastClickedItemId = $selectedIssuesIds.slice(-1)[0];

        let new_selectedIssuesIds = [];

        if (lastClickedItemId) {
          // if user is searching, and the last clicked item is not in view
          if ($isSearching && !visualSequence.includes(lastClickedItemId)) {
            new_selectedIssuesIds = [...$selectedIssuesIds, itemId];
          } else {
            const lastClickedItemId_index = visualSequence.indexOf(
              lastClickedItemId
            );
            const currentClickItemId_index = visualSequence.indexOf(itemId);

            // the following logic is to ensure "lastClickedItem" remains the "lastClickedItem", since "shift-click" does not count as a selection click (ctrl-click)
            if (currentClickItemId_index < lastClickedItemId_index) {
              new_selectedIssuesIds = visualSequence.slice(
                currentClickItemId_index,
                lastClickedItemId_index
              );
            } else {
              new_selectedIssuesIds = visualSequence.slice(
                lastClickedItemId_index + 1,
                currentClickItemId_index + 1
              );
            }
            new_selectedIssuesIds.push(lastClickedItemId);
          }
        } else {
          // in case no items was selected previously, even with shift engaged
          new_selectedIssuesIds.push(itemId);
        }

        selectedIssuesIds.set(new_selectedIssuesIds);
      } else {
        selectedIssuesIds.set([itemId]);
      }
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
      return (
        $overallIssuesSequence.indexOf(a) - $overallIssuesSequence.indexOf(b)
      );
    });
    console.log({ sequenced_selectIssueIds });

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

      const issues = issuesIds
        .filter(issueId => {
          return (
            ($isSearching && $searchMatches.includes(issueId)) || !$isSearching
          );
        })
        .map(issueId => {
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

          let _name = summary;
          // if (estimate !== "") _name += ` [${estimate}]`;

          return {
            ...issue,
            _name,
            _prefix: key,
            _url: `${statusUrl}browse/${key}`,
            _tooltip: `${key}: ${summary}`,
            // _hidden,
            _active: $activeIssueId === issueId,
            _selected: $selectedIssuesIds.includes(issueId),
            _numberValue: estimate
          };
        });

      return { ...sprintData, issues };
    });
</script>

<!-- <DragDropAware let:isDragging on:mouseReleased={onMouseReleased}> -->
<!--
<DragDropAware let:isDragging>
  <div slot="content">
  -->
<div>
  {#each sprintIssues as sprint, i (sprint.id)}
    <SprintList
      sprintId={sprint.id}
      header={sprint.name}
      items={sprint.issues}
      {onItemClick}
      {onNumberSubmit}
      on:createNewIssue={onCreateNewIssue}
      on:moveIssues={onMoveIssues}
      userCanToggleVisibility={!$isSearching && $activeSprintFilter === ''} />
    <!-- {isDragging} /> -->
  {/each}
</div>
<!--
<div slot="shadow">
    <Card type="basic" name={`${$selectedIssuesIds.length} items selected`} />
  </div>
</DragDropAware>
-->
