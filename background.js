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
  // onClicked: () => alert("Context menu item"),
}

chrome.contextMenus.create(contextMenuItem, () => {
  console.log("Context menu item created")
})

function handleContextMenuClick(info, tab) {
  console.log("querying context menu")
  if (info.selectionText) {
    // User has selected some text
    const selectedText = info.selectionText
    console.log("Selected text:", selectedText)
    // Perform your desired action with the selected text
  } else {
    // No text selected
    console.log("No text selected")
  }
}

chrome.contextMenus.onClicked.addListener(handleContextMenuClick)
