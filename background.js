console.log("Background service worker started");

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        if (tab && tab.url) {
            sendUrl(tab.url);
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active && tab.url) {
        sendUrl(tab.url);
    }
});

function sendUrl(url) {
    fetch('http://127.0.0.1:5000/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })
    .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            console.log("URL sent successfully:", data);
        } else {
            console.warn("Received non-JSON response");
            const text = await res.text();
            console.log(text);
        }
    })
    .catch(err => console.error("Error sending to backend:", err));
}
