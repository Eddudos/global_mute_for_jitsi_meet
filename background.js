chrome.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-mic") {
        try {
            // You can add hosts here:
            let tabs = await chrome.tabs.query({ url: ["https://meet.jit.si/*"]});
            if (!tabs.length) {
                console.warn("No active Jitsi tab found.");
                return;
            }

            let tabId = tabs[0].id;

            await chrome.scripting.executeScript({
                target: { tabId },
                func: toggleMicJitsi
            });
        } catch (e) {
            console.error("Error:", e);
        }
    }
});

function toggleMicJitsi() {
    try {
        if (window.APP?.conference?.isLocalAudioMuted) {
            const muted = window.APP.conference.isLocalAudioMuted();
            window.APP.conference.muteAudio(!muted);
            console.log("Jitsi mic toggled:", !muted);
            return;
        }

        let btn =
            document.querySelector('[aria-label*="microphone"]') ||
            document.querySelector('[data-testid="toggle-audio"]') ||
            document.querySelector('button[aria-label*="Mute"]') ||
            document.querySelector('button[aria-label*="Unmute"]');

        if (btn) {
            btn.click();
        } else {
            console.warn("Jitsi mic button not found.");
        }
    } catch (e) {
        console.error("toggleMicJitsi failed:", e);
    }
}
