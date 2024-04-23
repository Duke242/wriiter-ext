document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === "apiResponse") {
      const responseElement = document.getElementById("api-response")
      const { status, rating, feedback, suggestion } = request.data

      let responseContent = ""

      if (status === 201) {
        // User is subscribed and API response is successful
        let ratingColor
        if (rating >= 80) {
          ratingColor = "green"
        } else if (rating >= 50) {
          ratingColor = "orange"
        } else {
          ratingColor = "red"
        }

        responseContent = `
          <div class="response-container">
            <div class="response-item">
              <div class="response-label">Grade:</div>
              <div style="color: ${ratingColor}">${rating}</div>
            </div>
            <div class="response-item">
              <div class="response-label">Feedback:</div>
              <div>${feedback}</div>
            </div>
            <div class="response-item">
              <div class="response-label">Rewritten Suggestion:</div>
              <div>"${suggestion}"</div>
            </div>
          </div>
        `
      } else if (status === 401) {
        // User is not authenticated
        responseContent = `
          <div class="response-container">
            <div class="response-item">
              <div class="response-label">Error:</div>
              <div>Unauthorized. Please log in to access the service.</div>
            </div>
          </div>
        `
      } else if (status === 403) {
        // User is not subscribed
        responseContent = `
          <div class="response-container">
            <div class="response-item">
              <div class="response-label">Error:</div>
              <div>Access Denied. Please subscribe to use this feature.</div>
            </div>
          </div>
        `
      } else {
        // Other error occurred
        responseContent = `
          <div class="response-container">
            <div class="response-item">
              <div class="response-label">Error:</div>
              <div>An error occurred. Please try again later.</div>
            </div>
          </div>
        `
      }

      responseElement.innerHTML = responseContent
      responseElement.classList.remove("loading")
    } else if (request.type === "resetLoading") {
      const responseElement = document.getElementById("api-response")
      responseElement.classList.add("loading")
      responseElement.textContent = "Loading..."
    } else if (request.type === "removeLoading") {
      const responseElement = document.getElementById("api-response")
      responseElement.classList.remove("loading")
    } else if (request.type === "showLoading") {
      const responseElement = document.getElementById("api-response")
      responseElement.classList.add("loading")
      responseElement.textContent = "Loading..."
    }
  })
})
