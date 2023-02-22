function addPropertyToDiv() {
  const div = document.getElementsByClassName("message-panel");

  for (let i = 0; i < div.length; i++) {
    div[i].setAttribute("role", "alert");
  }
}

window.addEventListener("load", addPropertyToDiv);
