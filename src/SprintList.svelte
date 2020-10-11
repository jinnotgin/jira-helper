<script>
  import { getContext } from 'svelte';
  import {
    isSearching,
    isMovingIssues,
    dataLastUpdateTime,
    selectedIssuesIds
  } from "./stores.js";
  import Card from "./Card.svelte";
  import NumberInput from "./NumberInput.svelte";
  import Divider from "./Divider.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { slide, fade } from "svelte/transition";
  import { flip } from "svelte/animate";

  export let sprintId,
    header,
    items,
    onItemClick,
    onNumberSubmit,
    userCanToggleVisibility;
  let userToggleVisible = false;

  const onToggleClick = () => {
    if (userCanToggleVisibility) {
      userToggleVisible = !userToggleVisible;
    }
  };

  const handleKeyup = event => {
    if (event.code == "Enter") {
      event.preventDefault();

      const itemId = event.target.dataset.itemid;
      const value = event.target.value;
      console.log({ itemId, value });

      onNumberSubmit(itemId, value);
    }
  };

  const addItem = (insertAt = "end") => {
    const title = window.prompt("Title of issue:", "");
    if (title === null) return false;
    dispatch("createNewIssue", {
      sprintId,
      title,
      insertAt
    });
  };

  const triggerMoveIssues = (moveMode, referenceIssueId) => {
    dispatch("moveIssues", {
      sprintId,
      moveMode,
      referenceIssueId
    });
  };
</script>

<style>
  div.container {
    text-align: left;
    padding: 0.25em;
    margin: 0 auto;
  }

  .header {
    display: flex;
    cursor: pointer;

    margin: 0 0 0.75em 0;
  }
  .header .toggle {
    margin-right: 8px;
    user-select: none;
    height: 1.3em;
    transition: all 0.2s ease-out;
    transform: rotate(-90deg);
  }
  .header .toggle.expanded {
    transform: rotate(0deg);
  }
  h2 {
    margin: 0;
    padding: 0;
    font-size: 2em;
    font-weight: 200;
    user-select: none;
  }

  ol {
    list-style: none;
    padding: 0;
  }

  ol li {
    margin: 0;
  }

  ol li::before {
    display: inline-block;
    margin-right: 0.2rem;
  }

  :global(.custom-numberInput) {
    margin-top: -0.5em !important;
  }
</style>

{#if items.length > 0}
  <div class="container">
    <div class="header" on:click={onToggleClick}>
      {#if userCanToggleVisibility}
        <h2 class="toggle" class:expanded={userToggleVisible} in:fade>▼</h2>
      {/if}
      <h2>{header}</h2>
    </div>
    {#if (userCanToggleVisibility && userToggleVisible) || !userCanToggleVisibility}
      <ol>
        {#if items.length > 0 && !$isSearching}
          <li>
            <Card
              type="basic"
              name="Add new item..."
              onClick={() => addItem('start')} />
          </li>

          <Divider
            onClick={() => triggerMoveIssues('before', items[0].id)}
            dropTarget={true}>
            <div slot="dragging" let:dropped>
              <Card type="blank" name={dropped ? `Moving ${$selectedIssuesIds.length} items...` : ""} />
            </div>
          </Divider>
        {/if}
        {#each items as item (item.id)}
            <li animate:flip="{{duration: 200}}"> 
              <Card 
                id={item.id}
                name={item._name}
                url={item._url}
                urlName={item._prefix}
                tooltipText={item._tooltip}
                active={item._active}
                selected={item._selected}
                onClick={event => !$isMovingIssues && onItemClick(event, item.id)}
                draggable={!$isMovingIssues}
                disabled={$isMovingIssues && $selectedIssuesIds.includes(item.id)}>
                <NumberInput
                  value={item._numberValue}
                  on:valueChanged={e => {
                    onNumberSubmit(item.id, e.detail.value);
                  }} />
              </Card>
                {#key $dataLastUpdateTime}
              <Divider
                onClick={() => triggerMoveIssues('after', item.id)}
                dropTarget={true}
                disabled={$isSearching}>
                <div slot="dragging" let:dropped>
                  <Card type="blank" name={dropped ? `Moving ${$selectedIssuesIds.length} items...` : ""} />
                </div>
              </Divider>
                {/key}
            </li>
        {/each}
        {#if !$isSearching}
          <li>
            <Card type="basic" name="Add new item..." onClick={addItem} />
          </li>
        {/if}
      </ol>
    {/if}
  </div>
{/if}
