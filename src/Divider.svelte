<script>
  import Hoverable from "./Hoverable.svelte";
  export let disabled = false;
  export let onClick, dropTarget;

  const checkValidClick = (event, active) => {
    if (!disabled && active) onClick(event);
  };

  let dragCounter = 0;
  let dragEntered = false;
  const handleDragEnter = () => {
    dragCounter++;
    dragEntered = true;
  };
  const handleDragLeave = () => {
    dragCounter--;
    if (dragCounter === 0) dragEntered = false;
  };

  let dropped = false;
  const handleDragDrop = event => {
    event.preventDefault();
    console.log(event);
    dropped = true;
    console.log("item was dropped");
    onClick(event);
  };
</script>

<style>
  div.divider {
    padding: 6px;
  }
  div.divider hr {
    margin: 0;
    border: 0;
    height: 2px;
    background: #ff9000;
    opacity: 0;
  }

  div.divider.active {
    cursor: pointer;
  }
  div.divider.active hr {
    opacity: 1;
  }
</style>

{#if disabled}
  <div class="divider" class:disabled>
    <hr />
  </div>
{:else if dropTarget}
  <div
    class="divider"
    class:dragEntered
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:drop={handleDragDrop}
    ondragover="return false">
    <hr />
    {#if dragEntered || dropped}
      <div class="dragEntered-slot">
        <slot name="dragging" {dropped} />
      </div>
    {/if}
  </div>
{:else}
  <Hoverable let:hovering={active}>
    <div
      class="divider"
      class:active
      on:click={event => checkValidClick(event, active)}>
      <hr />
    </div>
  </Hoverable>
{/if}
