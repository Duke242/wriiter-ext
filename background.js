// chrome.cookies.get(
//   { url: "https://your-website.com", name: "session_cookie" },
//   function (cookie) {
//     if (cookie) {
//       // Cookie found, you can access cookie.value to get the session information
//       const sessionInfo = cookie.value
//       // Use the session information to authenticate the user within your extension
//     } else {
//       // Cookie not found, handle the case where the user is not authenticated
//     }
//   }
// )

const contextMenuItem = {
  id: "my-context-menu",
  title: "My Context Menu Item",
  contexts: ["page", "selection"],
  // onClicked: handleContextMenuClick, // Call the handleContextMenuClick function
}

chrome.contextMenus.create(contextMenuItem, () => {})

function handleContextMenuClick(info) {
  if (info.selectionText) {
    console.log("Context")
    const selectedText = info.selectionText
    console.log("Selected text:", selectedText)
    sendTextToAPI(selectedText)
  } else {
    console.log("No text selected")
  }
}

function sendTextToAPI(text) {
  console.log("send text")
  const apiUrl = "http://localhost:3000/api/openai"
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  }

  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("Error sending text to API")
      }
    })
    .then((data) => {
      console.log("API response:", data)
      displayApiResponse(data)
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

function displayApiResponse(data) {
  const popupWidth = 500
  const popupHeight = 400

  // Get the current window's dimensions
  chrome.windows.getCurrent((currentWindow) => {
    const screenWidth = currentWindow.width
    const screenHeight = currentWindow.height

    // Calculate the position of the popup window to center it on the screen
    const left = Math.floor((screenWidth - popupWidth) / 2)
    const top = Math.floor((screenHeight - popupHeight) / 2)

    chrome.windows.create(
      {
        url: "apiResponse.html",
        type: "popup",
        width: popupWidth,
        height: popupHeight,
        left: left,
        top: top,
      },
      (window) => {
        // Send the API response to the popup window after a short delay
        setTimeout(() => {
          chrome.runtime.sendMessage({ type: "apiResponse", data })
        }, 100)
      }
    )
  })
}

chrome.contextMenus.onClicked.addListener(handleContextMenuClick)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getApiResponse") {
    // Retrieve the API response data from the background script
    sendResponse({ data: request.data })
  }
})
