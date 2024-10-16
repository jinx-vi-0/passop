chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill") {
    const usernameField = document.querySelector("input[type='email'], input[type='text']");
    const passwordField = document.querySelector("input[type='password']");

    if (usernameField && passwordField) {
      usernameField.value = request.username;
      passwordField.value = request.password;
      sendResponse({ status: "filled" });
    }
  }
});
