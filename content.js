chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "apiResponse") {
    // Handle the API response data received from the background script
    console.log("Received API response:", request.data)
    // You can update the DOM or perform any other necessary actions here
  }
})
