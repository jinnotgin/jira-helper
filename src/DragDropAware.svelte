<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const shadowOffset = 16;
  let elementWhenMouseIsReleased = null;

  let isMouseDown = false;
  let timeout_longTermMouseDown;
  const longTermMouseDown_delay = 100;
  function _handleMousedown(event) {
    isMouseDown = true;
    elementWhenMouseIsReleased = null;
  }
  function handleMousedown(event) {
	  timeout_longTermMouseDown = setTimeout(_handleMousedown, longTermMouseDown_delay)
  }

  let hasMouseMoved = false;
  let m = { x: 0, y: 0 };
  function handleMousemove(event) {
	if (isMouseDown) {
		const {clientX, clientY} = event;
		if (clientX !== m.x && clientY !== m.y) {
			hasMouseMoved = true;
		}
		m.x = event.clientX;
		m.y = event.clientY;
	}
  }

  function handleMouseup(event) {
	clearTimeout(timeout_longTermMouseDown);
	isMouseDown = false;
	hasMouseMoved = false;

	elementWhenMouseIsReleased = document.elementFromPoint(m.x, m.y);
	
    dispatch("mouseReleased", {
      elementWhenMouseIsReleased
    });
    // console.log(elementWhenMouseIsReleased);
  }

  $: isDragging = isMouseDown && hasMouseMoved;
</script>

<style>
  div.dragDropAware {
    width: 100%;
	height: 100%;
	user-select: none;
  }

  div.shadow {
    position: absolute;
    display: none;
    user-select: none;
  }

  div.dragDropAware.active div.shadow {
    display: unset;
  }
</style>

<div
  class="dragDropAware"
  class:active={isDragging}
  on:mousemove={handleMousemove}
  on:mousedown={handleMousedown}
  on:mouseup={handleMouseup}>

  <slot name="content" {isDragging} {elementWhenMouseIsReleased} />

  <div class="shadow" style="left: {m.x + shadowOffset}px; top: {m.y + shadowOffset}px">
    <slot name="shadow" />
  </div>
</div>
