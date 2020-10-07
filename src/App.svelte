<script>
  import _ from "lodash";

  import {
    issues,
    sprints,
    epics,
    activeSearchTerm,
    activeSprintFilter,
    activeIssueId,
    ready
  } from "./stores.js";

  import IssuesList from "./IssuesList.svelte";
  import Search from "./Search.svelte";
  import IssueBrowser from "./IssueBrowser.svelte";
  export let name;

  import { get_rapidBoard } from "./api.js";

  const _refreshDataSource = () => {
    get_rapidBoard().then(data => {
      //   console.log(data);

      const keyedArray = arrayItem =>
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

      const process = keyName => {
        const array = _.get(data, keyName, []);
        return keyedArray(array);
      };

      const issuesData = process("issues");

      issues.set(issuesData);
      sprints.set(process("sprints"));
      epics.set(process("epicData.epics"));

      ready.set(true);
      console.log("Refreshing data source...");
      console.log({ $issues, $sprints, $epics });
    });
  };
  let timeout_refreshDataSource;
  const refreshDataSource = () => {
	  clearTimeout(timeout_refreshDataSource);
	  _refreshDataSource();
	  timeout_refreshDataSource = setTimeout(refreshDataSource, 60 * 1000);
  }
  refreshDataSource();

  $: orderedSprints = $sprints._sequence
    .filter(id => $sprints[id].issuesIds.length > 0)
    .map(id => $sprints[id]);
</script>

<style>
  main {
    padding: 0.5em;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 1em - 60px);
  }

  section.toolbar {
    display: flex;
  }

  section.content {
    display: flex;
    height: 100%;
  }

  .issuesList {
    flex: 1;
    overflow: scroll;
    margin-right: 0.5em;
  }
  .issueBrowser {
    flex: 3;
    margin-left: 0.5em;
  }

  .search {
    flex: 1;
    margin-right: 8px;
  }
  .sprintSelect {
    flex-basis: 300px;
  }
  .sprintSelect select {
    width: 100%;
  }
</style>

<main>
  <section class="toolbar">
    <section class="search">
      <Search />
    </section>
    <section class="sprintSelect">
      <select bind:value={$activeSprintFilter}>
        <option value="" selected>All</option>
        {#each orderedSprints as sprint (sprint.id)}
          <option value={sprint.id}>{sprint.name}</option>
        {/each}
      </select>
    </section>

  </section>

  <section class="content">

    {#if $ready}
      <section class="issuesList">
        <IssuesList on:refreshDataSource={refreshDataSource} />

      </section>
      <section class="issueBrowser">
        <IssueBrowser />
      </section>
    {:else}
      <span>Loading...</span>
    {/if}

  </section>
</main>
