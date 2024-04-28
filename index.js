const signInButton = document.getElementById("signInButton")
const dashboardContent = document.getElementById("dashboardContent")
const apiResponseContainer = document.getElementById("apiResponseContainer")
const loadingMessage = document.getElementById("loadingMessage")

window.addEventListener("DOMContentLoaded", () => {
  checkAuthState()
})

async function checkAuthState() {
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
  dashboardContent.innerHTML = `
    <style>
        #dashboard-content {
            font-family: 'Nunito', sans-serif;
        }
        
        #dashboard-content p {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        
        #dashboard-content ol {
            font-size: 16px;
            line-height: 1.5;
        }
        
        #dashboard-content li {
            margin-bottom: 10px;
        }
        
      
    </style>
    
    <div id="dashboard-content">
        <p>Make sure to be signed in and subscribed to wriiter.co</p>
        
        <ol>
            <li>Highlight the text you want to get feedback on</li>
            <li>Right-click on the highlighted text</li>
            <li>Select "Wriiter" from the context menu</li>
            </ol>
    </div>
`
  // Hide the sign-in button
  signInButton.style.display = "none"
}

function renderSignInButton() {
  signInButton.style.display = "block" // Show the sign-in button
  dashboardContent.style.display = "none" // Hide the dashboard content
  loadingMessage.style.display = "none" // Hide the loading message

  signInButton.addEventListener("click", async () => {
    chrome.tabs.create({ url: "http://wriiter.co/" })
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
