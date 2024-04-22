chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "apiResponse") {
    const responseElement = document.getElementById("api-response")
    const { rating, feedback, suggestion } = request.data

    const formattedResponse = `
      <div class="response-container">
        <div class="response-item">
          <div class="response-label">Rating:</div>
          <div>${rating}</div>
        </div>
        <div class="response-item">
          <div class="response-label">Feedback:</div>
          <div>${feedback}</div>
        </div>
        <div class="response-item">
          <div class="response-label">Suggestion:</div>
          <div>${suggestion}</div>
        </div>
      </div>
    `

    responseElement.innerHTML = formattedResponse
    responseElement.classList.remove("loading")
  }
})
