<script>
  let hovering;
  export let requireCtrlKey = false;

  function enter(event) {
    if (requireCtrlKey) {
      if (event.ctrlKey || event.metaKey) {
        hovering = true;
      }
    } else {
      hovering = true;
    }
  }

  function leave(event) {
    hovering = false;
  }
</script>

<div on:mouseenter={enter} on:mouseleave={leave}>
  <slot {hovering} />
</div>
