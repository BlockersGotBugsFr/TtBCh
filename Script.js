(() => {
    // Initialize settings
    let useArialFont = GM_getValue('useArialFont', false);
    let highlightInterval;
 
    // Add minimal styles
    GM_addStyle(`
        .blooket-highlight-status {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: Nunito,sans-serif;
            font-size: 12px;
            z-index: 9999;
        }
    `);
 
    // Create status indicator
    function createStatusIndicator() {
        const status = document.createElement('div');
        status.className = 'blooket-highlight-status';
        status.textContent = `Highlight Mode: ${useArialFont ? 'Italic' : 'Normal'}`;
        document.body.appendChild(status);
        return status;
    }
 
    function updateHighlights() {
        try {
            const { stateNode: { state, props } } = Object.values((function react(r = document.querySelector("body>div")) {
                return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div"))
            })())[1].children[0]._owner;
 
            [...document.querySelectorAll(`[class*="answerContainer"]`)].forEach((answer, i) => {
                const isCorrect = (state.question || props.client.question).correctAnswers.includes((state.question || props.client.question).answers[i]);
 
                // Reset styles first
 
                if (useArialFont) {
                    // Font style mode
                    if (isCorrect) {
                        answer.style.fontFamily = "Arial, sans-serif";
                        answer.style.fontStyle = "italic";
                    }
                } else {
                    // Color highlight mode
                answer.style.backgroundColor = '';
                answer.style.fontFamily = '';
                answer.style.fontWeight = '';
                answer.style.fontStyle = '';
 
                    if (isCorrect) {
                        answer.style.backgroundColor = "rgb(0, 207, 119)";
                    } else {
                        answer.style.backgroundColor = "rgb(189, 15, 38)";
                    }
                }
            });
        } catch (e) {
            // Silently handle errors that occur when game elements aren't available
        }
    }
 
    function startHighlighting() {
        if (highlightInterval) clearInterval(highlightInterval);
        highlightInterval = setInterval(updateHighlights, 500);
    }
 
    // Initialize
    const statusIndicator = createStatusIndicator();
    startHighlighting();
 
    // Register simple toggle command
    GM_registerMenuCommand(`Toggle Highlight Mode`, () => {
        useArialFont = !useArialFont;
        GM_setValue('useArialFont', useArialFont);
        statusIndicator.textContent = `Highlight Mode: ${useArialFont ? 'Italic' : 'Normal'}`;
        updateHighlights();
    });
})();
