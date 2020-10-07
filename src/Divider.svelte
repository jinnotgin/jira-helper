<script>
  import Hoverable from "./Hoverable.svelte";
  export let disabled = false;
  export let onClick;

  const checkValidClick = (event, active) => {
    if (!disabled && active) onClick(event);
  };
</script>

<style>
  div.container {
    padding: 6px;
  }
  hr.divider {
    margin: 0;
    border: 0;
    height: 2px;
    background: #ff9000;
    opacity: 0;
  }

  div.container.active {
    cursor: pointer;
  }
  div.container.active hr.divider {
    opacity: 1;
  }
</style>

{#if disabled}
  <div class="container">
    <hr class="divider" />
  </div>
{:else}
  <Hoverable requireCtrlKey={true} let:hovering={active}>
    <div
      class="container"
      class:active
      on:click={event => checkValidClick(event, active)}>
      <hr class="divider" />
    </div>
  </Hoverable>
{/if}
