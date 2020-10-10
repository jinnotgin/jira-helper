<script>
  export let type = "default";
  export let id, name, url, urlName, tooltipText, active, selected, onClick, draggable;
</script>

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

  div.card.basic {
    opacity: 0.8;
    border: none;
  }

  div.card.basic div.content {
    text-align: center;
  }

  div.content span {
    user-select: text;
    cursor: text;
  }
</style>

<div
  class={`card ${type}`}
  class:active
  class:selected
  draggable={draggable && selected}
  on:click={onClick}>
  {#if type === 'basic'}
    <div class="content">
      <span>{name}</span>
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
