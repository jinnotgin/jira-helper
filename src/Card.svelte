<script>
  export let type = "default";
  export let name = "";
  export let id,
    url,
    urlName,
    tooltipText,
    active,
    selected,
    onClick,
    draggable,
    disabled;
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
    background: #e4f4f9;
  }

  div.card.active {
    background: #b6edff;
    border: 2px solid #4dbdff;
  }

  div.card.disabled {
    opacity: 0.3;
    cursor: not-allowed;
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

  div.card.basic,
  div.card.blank {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div.content span {
    user-select: text;
    cursor: text;
  }

  div.card.blank {
    opacity: 0.8;
    background: transparent;
    border: 2px dotted #aaa;
    height: 50px;
  }
</style>

<div
  class={`card ${type}`}
  class:active
  class:selected
  class:disabled
  draggable={draggable && selected}
  on:click={onClick}>
  {#if type === 'basic' || type === 'blank'}
    <div class="content">
      <span class="name">{name}</span>
    </div>
  {:else}
    <div class="header">
      <div class="headerName">
        <a href={url} class="url" title={tooltipText} target="_blank">
          {urlName}
        </a>
      </div>
      <slot name="top-right" />
    </div>
    <div class="content">
      <span class="name">{name}</span>
    </div>
  {/if}
</div>
