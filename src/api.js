// to refactor to use JIRA_BASE_URL from config.js

let MODE = "DEBUG";
if (location.hostname === "jira.sls.ufinity.com") MODE = "PRODUCTION";

export const get_rapidBoard = async () => {
  let FETCH_URL = "";
  switch (MODE) {
    case "DEBUG":
      FETCH_URL = "/fakeData.json?fakeParam=0";
      break;
    default:
      FETCH_URL =
        "https://jira.sls.ufinity.com/rest/greenhopper/1.0/xboard/plan/backlog/data.json?rapidViewId=5&selectedProjectKey=SLS";
  }
  const headers_backup_notNeeded = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-atlassian-greenhopper-gadget": "false",
    "x-ausername": "jin",
    "x-requested-with": "XMLHttpRequest",
  };

  const output = await fetch(`${FETCH_URL}&_=${new Date().getTime()}`, {
    headers: {},
    referrer:
      "https://jira.sls.ufinity.com/secure/RapidBoard.jspa?rapidView=5&projectKey=SLS&view=planning.nodetail",
    referrerPolicy: "no-referrer-when-downgrade",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return {};
    });

  return output;
};

export const set_IssueEstimate = async (issuedId, estimateValue) => {
  let atlassian_token = false;
  try {
    const atlassian_token_dom = document
      .querySelector("iframe.issue-browser")
      .contentDocument.querySelector("#atlassian-token");
    atlassian_token =
      atlassian_token_dom !== null ? atlassian_token_dom.content : false;

    if (!atlassian_token) {
      console.error(error);
      alert(
        "Unable to obtain Atlasssian token. Please ensure you are browsing at least 1 issue."
      );
      return {};
    }
  }
  catch(error) {
    console.error(error);
    alert(
      "Unable to obtain Atlasssian token. Please ensure you are browsing at least 1 issue."
    );
    // return false;
  }

  let FETCH_URL = "";
  switch (MODE) {
    case "DEBUG":
      FETCH_URL = "/";
      break;
    default:
      FETCH_URL =
        "https://jira.sls.ufinity.com/secure/DetailsViewAjaxIssueAction.jspa?decorator=none";
  }

  const backup_headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-ausername": "jin",
    "x-requested-with": "XMLHttpRequest",
    "x-sitemesh-off": "true",
  };

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "x-sitemesh-off": "true",
  };

  const dataPayload = `customfield_10006=${estimateValue}&issueId=${issuedId}&atl_token=${atlassian_token}&singleFieldEdit=true&fieldsToForcePresent=customfield_10006&skipScreenCheck=true&rapidViewId=5`;

  const output = fetch(FETCH_URL, {
    headers,
    referrer: "https://jira.sls.ufinity.com/secure/RapidBoard.jspa",
    referrerPolicy: "no-referrer-when-downgrade",
    body: dataPayload,
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return {};
    });
  return output;
};

export const set_issuesRank = (
  sprintId,
  affectedIssueKeys,
  referenceIssueKey,
  insertAt = "after"
) => {
  let FETCH_URL = "";
  switch (MODE) {
    case "DEBUG":
      FETCH_URL = "/";
      break;
    default:
      FETCH_URL =
        "https://jira.sls.ufinity.com/rest/greenhopper/1.0/sprint/rank";
  }

  const headers = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-ausername": "jin",
    "x-requested-with": "XMLHttpRequest",
  };

  const payload = {
    idOrKeys: affectedIssueKeys,
    customFieldId: 10000,
    sprintId: sprintId,
    addToBacklog: false,
  };
  if (insertAt === "before") payload.idOrKeyBefore = referenceIssueKey;
  else payload.idOrKeyAfter = referenceIssueKey;

  const output = fetch(FETCH_URL, {
    headers,
    referrer: "https://jira.sls.ufinity.com/secure/RapidBoard.jspa?rapidView=5",
    referrerPolicy: "no-referrer-when-downgrade",
    body: JSON.stringify(payload),
    method: "PUT",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return {};
    });
  return output;
};

export const set_newIssue = (sprintId, issueName, issueTypeId = "10001") => {
  let FETCH_URL = "";
  switch (MODE) {
    case "DEBUG":
      FETCH_URL = "/";
      break;
    default:
      FETCH_URL = "https://jira.sls.ufinity.com/rest/inline-create/1.0/issue";
  }

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
  };

  const payload = {
    summary: issueName.trim(),
    contexts: ["project = SLS ORDER BY Rank ASC"],
    issueTypeId,
    overrides: { Sprint: sprintId },
  };

  const output = fetch(FETCH_URL, {
    headers,
    referrer:
      "https://jira.sls.ufinity.com/secure/RapidBoard.jspa?rapidView=5&view=planning.nodetail",
    referrerPolicy: "no-referrer-when-downgrade",
    body: JSON.stringify(payload),
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return {};
    });
  return output;
};
