<script>
  export let type = "default";
  export let id, name, url, urlName, tooltipText, active, selected, onClick;
</script>

<div class="card" class:active class:selected class:addNew={type === "addNew"} on:click={onClick}>
  {#if type === "addNew"}
    <div class="content">
      <span>Add new item...</span>
    </div>
  {:else}
    <div class="header">
      <div class="headerName">
        <a href={url} title={tooltipText} target="_blank">{urlName}</a>
      </div>
      <slot />
    </div>
    <div class="content">
      <span>{name}</span>
    </div>
  {/if}
</div>

<style>
  div.card {
    border: 2px solid #bbb;
    border-radius: 8px;
    padding: 1em 0.5em;
    background: #eee;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }

  div.card.selected {
    background: #dbf6ff;
  }

  div.card.active {
    background: #b6edff;
    border: 2px solid #4dbdff;
  }

  div.header {
    display: flex;
    flex-direction: row;
  }

  div.headerName {
    flex: 1;
  }

  div.card.addNew {
    opacity: 0.8;
    border: none;
  }

  div.card.addNew div.content {
    text-align: center;
  }

</style>