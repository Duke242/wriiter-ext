// const supabaseUrl = "YOUR_SUPABASE_URL"
// const supabaseKey = "YOUR_SUPABASE_KEY"
// const supabase = supabase.createClient(supabaseUrl, supabaseKey)

window.addEventListener("DOMContentLoaded", () => {
  checkAuthState()
})

async function checkAuthState() {
  // const session = supabase.auth.session()

  if (!session) {
    // User is not signed in, redirect to popup.html
    window.location.href = chrome.runtime.getURL("popup.html")
  }
}
