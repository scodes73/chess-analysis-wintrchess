chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getPgnResult") sendResponse(pgnResult);
    if (message.type === "log") console.log(message.content);
});

const rule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: ".chess.com", schemes: ["https"] }
        })
    ],
    actions: [new chrome.declarativeContent.ShowAction()]
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([rule]);
    });
});

let pgnResult = null;

chrome.action.onClicked.addListener(async (tab) => {
    pgnResult = null;

    // Extract PGN from current chess.com tab
    [{ result: pgnResult }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/common.js", "scripts/getPgn.js"]
    });

    // Open Wintrchess tab next to current
    wintrchessTab = await chrome.tabs.create({
        url: "https://wintrchess.com/analysis",
        index: tab.index + 1
    });

    chrome.tabs.onUpdated.addListener(wintrchessImport);
});

async function wintrchessImport(id, changeInfo) {
    if (changeInfo.status !== "complete") return;

    chrome.tabs.onUpdated.removeListener(wintrchessImport);

    await chrome.scripting.executeScript({
        target: { tabId: id },
        files: ["scripts/common.js", "scripts/fillPgn.js"]
    });
}
