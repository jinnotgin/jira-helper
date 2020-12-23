<script>
  import _ from 'lodash';
  import {
    issues,
    activeIssueId,
  } from "./stores.js";
  import { JIRA_BASE_URL } from './config.js';

  $: activeIssue = _.get($issues, `[${$activeIssueId}]`, {});

  $: key = _.get(activeIssue, 'key', false);
  
  $: activeIssueUrl = !!key ? `${JIRA_BASE_URL}browse/${key}` : '';
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
