document.getElementById("fetch").addEventListener("click", () => {
  const site = document.getElementById("site").value;
  
  // Fetch credentials from backend (e.g., your API)
  fetch(`https://your-backend-url/api/credentials?site=${site}`)
    .then(response => response.json())
    .then(data => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "autofill",
          username: data.username,
          password: data.password
        });
      });
    });
});
