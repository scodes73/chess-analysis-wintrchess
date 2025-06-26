(async () => {
    const pgnResult = await chrome.runtime.sendMessage({ type: "getPgnResult" });
    if (!pgnResult.isWhite) {
        (await waitForElm('[data-tooltip-id="options-toolbar-flip"]'))?.click();
    }

    const textarea = await waitForElm('textarea', {
        setValue: true,
        value: pgnResult.pgn
    });

    const analyseButton = await waitForElm((document) => {
        return Array.from(document.querySelectorAll('button'))
            .find(btn => btn.textContent.trim() === 'Analyse');
    });
    analyseButton.click();
})();
