// Content script for TabZen Chrome extension

console.log('TabZen content script loaded on:', window.location.href)

// Listen for messages from background or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message)
  
  // Echo back for testing
  sendResponse({ status: 'received', message })
})

// Export to avoid TypeScript isolation error
export {}