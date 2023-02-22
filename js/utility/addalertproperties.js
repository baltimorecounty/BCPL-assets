function addPropertyToDiv() {
  const div = document.getElementsByClassName("message-panel");
  const element = document.getElementsByClassName("form-validation-error");

  for (let i = 0; i < div.length; i++) {
    div[i].setAttribute("role", "alert");
  }

  for (let i = 0; i < element.length; i++) {
    div[i].setAttribute("role", "alert");
  }
}

window.addEventListener("load", addPropertyToDiv);
