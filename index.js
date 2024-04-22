const signInButton = document.getElementById("signInButton")
const dashboardContent = document.getElementById("dashboardContent")
const apiResponseContainer = document.getElementById("apiResponseContainer")
const loadingMessage = document.getElementById("loadingMessage")

window.addEventListener("DOMContentLoaded", () => {
  console.log("dash board content loaded")
  checkAuthState()
})

async function checkAuthState() {
  console.log("Checking auth state...")
  // Retrieve the access token from the website's cookies
  chrome.cookies.get(
    {
      url: "https://www.wriiter.co", // Replace with your website's URL
      name: "sb-osaezyuvvddcvfitbqyo-auth-token", // Replace with the name of the cookie storing the access token
    },
    (cookie) => {
      if (cookie) {
        const accessToken = cookie.value
        console.log({ accessToken })

        if (accessToken) {
          console.log({ accessToken })
          // Access token exists, consider the user as authenticated
          renderDashboard()
        } else {
          console.log("there is no access token")
          // Access token doesn't exist, consider the user as not authenticated
          renderSignInButton()
        }
      } else {
        // Cookie not found, consider the user as not authenticated
        renderSignInButton()
      }
    }
  )
}

function renderDashboard() {
  // Mock dashboard content for demonstration purposes
  dashboardContent.style.display = "block" // Show the dashboard content
  loadingMessage.style.display = "none" // Hide the loading message
  dashboardContent.innerHTML =
    "<h1>Dashboard Content</h1><p>Welcome to the dashboard!</p>"

  // Hide the sign-in button
  signInButton.style.display = "none"
}

function renderSignInButton() {
  signInButton.style.display = "block" // Show the sign-in button
  dashboardContent.style.display = "none" // Hide the dashboard content

  signInButton.addEventListener("click", async () => {
    chrome.tabs.create({ url: "http://localhost:3000/" })
    chrome.runtime.sendMessage({ redirect: true })
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "updatePopupContent") {
    document.body.innerHTML = request.html
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "apiResponse") {
    const apiResponse = request.data
    renderApiResponse(apiResponse)
  }
})

function renderApiResponse(apiResponse) {
  // Clear previous API response
  apiResponseContainer.innerHTML = ""

  // Create elements to display the API response
  const responseTitle = document.createElement("h2")
  responseTitle.textContent = "API Response"
  apiResponseContainer.appendChild(responseTitle)

  const responseText = document.createElement("pre")
  responseText.textContent = JSON.stringify(apiResponse, null, 2)
  apiResponseContainer.appendChild(responseText)

  // Show the API response container
  apiResponseContainer.style.display = "block"
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "apiResponse") {
    const apiResponse = request.data
    renderApiResponse(apiResponse)
  } else if (request.type === "showLoading") {
    showLoading()
  }
})

function showLoading() {
  // Clear previous API response
  apiResponseContainer.innerHTML = ""

  // Show the loading message
  loadingMessage.style.display = "block"
  apiResponseContainer.style.display = "block"
}

function renderApiResponse(apiResponse) {
  // Hide the loading message
  loadingMessage.style.display = "none"
  dashboardContent.style.display = "none"
  // Create elements to display the API response
  const responseTitle = document.createElement("h2")
  responseTitle.textContent = "API Response"
  apiResponseContainer.appendChild(responseTitle)

  const responseText = document.createElement("pre")
  responseText.textContent = JSON.stringify(apiResponse, null, 2)
  apiResponseContainer.appendChild(responseText)

  // Show the API response container
  apiResponseContainer.style.display = "block"
}
