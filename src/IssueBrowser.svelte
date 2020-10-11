<script>
  import _ from 'lodash';
  import {
    issues,
    activeIssueId,
  } from "./stores.js";

  $: activeIssue = _.get($issues, `[${$activeIssueId}]`, {});

  $: key = _.get(activeIssue, 'key', false);
  $: statusUrl = _.get(activeIssue, 'statusUrl', false);
  
  $: activeIssueUrl = !!key ? `${statusUrl}browse/${key}` : '';
</script>

<style>
  iframe {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>

<iframe class="issue-browser" name="issue-browser" src={activeIssueUrl} title="Issue Browser" />
