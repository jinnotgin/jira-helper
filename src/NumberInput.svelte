<script>
	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  const numberClone = (input) => JSON.parse(JSON.stringify(input));

  export let value;

  // track local changes to "value" differently from "prop value"
  const local = {};
  $: local.value = numberClone(value);   

  let disabled = false;
  $: value, disabled = false;   // when prop's value changes, we remove the "disabled"

  const onKeyupHandler = (event) => {
    if (event.code == "Enter") {
      event.preventDefault();

      disabled = true;
      dispatch('valueChanged', {
        value: event.target.value,
      });
    }
  }
</script>

<input
  class="numberInput custom-numberInput"
  type="number"
  step="any"
  {disabled}
  bind:value={local.value}
  on:keyup|preventDefault={onKeyupHandler}
/>

<style>
  input.numberInput {
    width: 5ch;
    margin: 0;
    -moz-appearance: textfield;
  }

  input.numberInput:disabled {
    background: white;
    color: #666;
    cursor: not-allowed;
  }

  input.numberInput::-webkit-outer-spin-button,
  input.numberInput::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>