const contextMenuItem = {
  id: "my-context-menu",
  title: "Wriiter",
  contexts: ["page", "selection"],
}

chrome.contextMenus.create(contextMenuItem, () => {})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "my-context-menu") {
    if (info.selectionText) {
      const selectedText = info.selectionText

      sendTextToAPI(selectedText)

      openPopup()
    } else {
      console.log("No text selected")
    }
  }
})

function sendTextToAPI(text) {
  const apiUrl = "http://localhost:3000/api/openai"

  // Get the user's access token from the website's cookies
  chrome.cookies.get(
    {
      url: "https://www.wriiter.co", // Replace with your website's URL
      name: "sb-osaezyuvvddcvfitbqyo-auth-token", // Replace with the name of the cookie storing the access token
    },
    (cookie) => {
      if (cookie) {
        const accessToken = cookie.value

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
          body: JSON.stringify({ text }),
        }

        fetch(apiUrl, requestOptions)
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else if (response.status === 401) {
              throw new Error("Unauthorized")
            } else {
              throw new Error("Error sending text to API")
            }
          })
          .then((data) => {
            console.log("API response:", data)
            showApiResponse(data)
          })
          .catch((error) => {
            console.error("Error:", error)
            if (error.message === "Unauthorized") {
              // Handle unauthorized access, e.g., prompt the user to log in
              console.log("User is not authenticated")
            }
          })
      } else {
        // Cookie not found, consider the user as not authenticated
        console.log("Access token cookie not found")
        // Handle the case where the user is not authenticated
      }
    }
  )
}

function openPopup() {
  // Check if the popup is already open
  chrome.tabs.query(
    { url: chrome.runtime.getURL("apiResponse.html") },
    (tabs) => {
      if (tabs.length === 0) {
        // Popup is not open, create it
        chrome.windows.create(
          {
            url: chrome.runtime.getURL("apiResponse.html"),
            type: "popup",
            width: 500,
            height: 400,
          },
          (window) => {
            // Popup window created
            // Send the "showLoading" message to display the loading message
            chrome.runtime.sendMessage({ type: "showLoading" })
          }
        )
      }
    }
  )
}

function showApiResponse(data) {
  // Send the API response to the popup
  chrome.runtime.sendMessage({ type: "apiResponse", data: data })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getApiResponse") {
    // Retrieve the API response data from the background script
    sendResponse({ data: request.data })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "setPopupHtml") {
    // Set the popup's HTML content
    document.documentElement.innerHTML = request.html
  }
})
