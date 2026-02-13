// GoNow — Background Service Worker

function getLinks() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ links: {} }, (data) => resolve(data.links));
  });
}

// Show suggestions as user types in omnibox
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const links = await getLinks();
  const input = text.trim();
  const suggestions = [];

  for (const [keyword, urlTemplate] of Object.entries(links)) {
    if (keyword.toLowerCase().startsWith(input.toLowerCase())) {
      suggestions.push({
        content: keyword,
        description: `${keyword}  →  ${urlTemplate}`,
      });
    }
  }

  suggest(suggestions);
});

// Navigate when user selects a suggestion or presses Enter
chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  const links = await getLinks();
  const input = text.trim();

  // Split keyword from placeholder value at first '?'
  const qIndex = input.indexOf("?");
  let keyword, value;
  if (qIndex !== -1) {
    keyword = input.substring(0, qIndex);
    value = input.substring(qIndex + 1);
  } else {
    keyword = input;
    value = "";
  }

  const urlTemplate = links[keyword];
  if (!urlTemplate) {
    const searchDisposition = disposition === "currentTab" ? "CURRENT_TAB"
      : disposition === "newForegroundTab" ? "NEW_TAB" : "NEW_TAB";
    chrome.search.query({ text: input, disposition: searchDisposition });
    return;
  }

  let url;
  if (urlTemplate.includes("{}")) {
    if (value) {
      url = urlTemplate.replace("{}", encodeURIComponent(value));
    } else {
      url = urlTemplate.replace("{}", "");
    }
  } else {
    url = urlTemplate;
  }

  switch (disposition) {
    case "currentTab":
      chrome.tabs.update({ url });
      break;
    case "newForegroundTab":
      chrome.tabs.create({ url });
      break;
    case "newBackgroundTab":
      chrome.tabs.create({ url, active: false });
      break;
  }
});
