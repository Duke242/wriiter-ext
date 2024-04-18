// const supabaseUrl = "YOUR_SUPABASE_URL"
// const supabaseKey = "YOUR_SUPABASE_KEY"
// const supabase = supabase.createClient(supabaseUrl, supabaseKey)

const signInButton = document.getElementById("signInButton")

window.addEventListener("DOMContentLoaded", () => {
  checkAuthState()
})

async function checkAuthState() {
  // const session = supabase.auth.session()
  const session = true
  if (session) {
    // User is signed in, open the dashboard.html
    // chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") })
    renderDashboard()
  } else {
    // User is not signed in, send message to background script to redirect
    signInButton.addEventListener("click", async () => {
      chrome.tabs.create({ url: "http://localhost:3000/" })
      chrome.runtime.sendMessage({ redirect: true })
    })
  }
}

function renderDashboard() {
  // Mock dashboard content for demonstration purposes
  const dashboardContent = document.getElementById("dashboardContent")
  dashboardContent.style.display = "block" // Show the dashboard content
  dashboardContent.innerHTML =
    "<h1>Dashboard Content</h1><p>Welcome to the dashboard!</p>"

  // Hide the sign-in button
  signInButton.style.display = "none"
}
