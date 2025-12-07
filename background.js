chrome.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-mic") {
        try {
            // You can add your Jitsi hosts here
            let tabs = await chrome.tabs.query({
                url: [
                    "https://meet.jit.si/*", 
                    "https://app.element.io/*"
                ]
            });

            if (!tabs.length) {
                console.warn("No active conference tab found.");
                return;
            }

            let tabId = tabs[0].id;

            await chrome.scripting.executeScript({
                target: { 
                    tabId: tabId, 
                    allFrames: true
                },
                func: toggleMicJitsi,
                world: "MAIN"
            });
        } catch (e) {
            console.error("Error executing script:", e);
        }
    }
});

function toggleMicJitsi() {
    try {
        if (window.APP?.conference) {
            let muted = false;
            if (typeof window.APP.conference.isLocalAudioMuted === 'function') {
                muted = window.APP.conference.isLocalAudioMuted();
            } else {
                console.log("isLocalAudioMuted is not a function, trying blind toggle");
            }
            
            window.APP.conference.muteAudio(!muted);
            console.log(`[Extension] Jitsi API found in frame: ${window.location.href}. Toggled to: ${!muted}`);
            return;
        }

        let btn =
            document.querySelector('[aria-label="Toggle mute"]') ||
            document.querySelector('[data-testid="audio-mute"]') ||
            document.querySelector('.audio-preview-microphone') || 
            document.querySelector('[id="mic-enable"]');

        if (btn) {
            btn.click();
            console.log(`[Extension] Button clicked in frame: ${window.location.href}`);
        } 

    } catch (e) {
        console.error("toggleMicJitsi failed inside frame:", e);
    }
}