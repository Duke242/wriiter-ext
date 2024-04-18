chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "apiResponse") {
    const responseElement = document.getElementById("api-response")
    responseElement.textContent = JSON.stringify(request.data, null, 2)
    responseElement.classList.remove("loading")
  }
})
