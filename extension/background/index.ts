// Background script for TabZen Chrome extension

console.log('TabZen background script loaded')

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('TabZen extension installed')
})

// Listen for tab creation
chrome.tabs.onCreated.addListener((tab) => {
  console.log('Tab created:', tab.url)
})

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.url)
  }
})

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Tab removed:', tabId)
})

// Export to avoid TypeScript isolation error
export {}