chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "wriiter-extension-context-menu",
    title: "Wriiter",
    contexts: ["page", "selection"],
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "replaceText") {
    const suggestion = request.suggestion
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (suggestion) => {
          const selection = window.getSelection()
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.deleteContents()
            range.insertNode(document.createTextNode(suggestion))
          }
        },
        args: [suggestion],
      })
    })
  }
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "wriiter-extension-context-menu") {
    if (info.selectionText) {
      const selectedText = info.selectionText
      if (selectedText.length <= 2000) {
        sendTextToAPI(selectedText)
        openPopup()
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              alert(
                "Wriiter Extension - Text Limit Exceeded\n\nThe selected text exceeds the maximum length of 2000 characters allowed by Wriiter. Please select a shorter text."
              )
            },
          })
        })
      }
    } else {
      return
    }
  }
})

function sendTextToAPI(text) {
  const apiUrl = "https://wriiter.co/api/ai"
  // const apiUrl = "http://localhost:3000/api/ai"

  // Get the user's access token from the website's cookies
  chrome.cookies.get(
    {
      url: "https://www.wriiter.co", // Replace with your website's URL
      // url: "http://localhost:3000/api/ai",
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
            } else if (response.status === 403) {
              throw new Error("Access Denied")
            } else if (response.status === 429) {
              throw new Error("Query count exceeded")
            } else {
              throw new Error("Error sending text to API")
            }
          })
          .then((data) => {
            showApiResponse(data)
          })
          .catch((error) => {
            console.error("Error:", error)
            if (error.message === "Unauthorized") {
              // Handle unauthorized access, e.g., prompt the user to log in
              showApiResponse({ status: 401 })
            } else if (error.message === "Access Denied") {
              showApiResponse({ status: 403 })
            } else if (error.message === "Query count exceeded") {
              showApiResponse({ status: 429 })
            } else {
              // Handle other errors
              showApiResponse({ status: 500 })
            }
          })
      } else {
        setTimeout(() => {
          showApiResponse({ status: 401 })
        }, 500)
      }
    }
  )
}

// ... (previous code remains the same)

function openPopup() {
  chrome.tabs.query(
    { url: chrome.runtime.getURL("apiResponse.html") },
    (tabs) => {
      if (tabs.length === 0) {
        chrome.windows.create(
          {
            url: chrome.runtime.getURL("apiResponse.html"),
            type: "popup",
            width: 450,
            height: 400,
          },
          (window) => {
            // Wait for the popup window to load before sending messages
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (info.status === "complete" && tabId === window.tabs[0].id) {
                chrome.tabs.onUpdated.removeListener(listener)
                chrome.runtime.sendMessage({ type: "showLoading" })
              }
            })
          }
        )
      } else {
        chrome.windows.update(tabs[0].windowId, { focused: true }, (window) => {
          chrome.runtime.sendMessage({ type: "resetLoading" })
        })
      }
    }
  )
}

// ... (rest of the code remains the same)

function showApiResponse(data) {
  chrome.runtime.sendMessage({ type: "apiResponse", data: data })

  chrome.runtime.sendMessage({ type: "removeLoading" })
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
