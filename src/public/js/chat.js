const socket = io();
let URLdomain = window.location.host;
let protocol = window.location.protocol;
let Url = protocol + "//" + URLdomain + "/api/messages/";
let confirm = "active";
let user;

const chatBox = document.getElementById("chatBox"),
      btnSend = document.getElementById("btnSend");

const emailLogged = document.querySelector(".nav__container--email-logged");

Swal.fire({
  title: '<b class="chat__login--tittle">Bienvenido al Chat</b>',
  html: '<u class="chat__login--text">Ingresa tu correo</u>',
  input: "email",
  confirmButtonText: '<b class="chat__login--confirm">Confirmar</b>',
  showLoaderOnConfirm: true,
  background:
    '#fff url("https://img.freepik.com/vector-gratis/fondo-degradado-cielo-pastel_23-2148917404.jpg?w=2000")',
  footer: '<a href="">Did you forget your password?</a>',
  inputPlaceholder: "Ingresar aqui...",
  preConfirm: () => {
    confirm = "inactive";
  },
  allowOutsideClick: false,
  backdrop: "rgba(0,0,123,0.4)",
})
  .then((result) => {
    if (result.isDismissed) {
      window.location.reload();
    } else {
      if (result.value) {
        user = result.value;
        emailLogged.innerHTML = `<b>${user}<b>`;
        socket.emit("new-user", { user: user, id: socket.id });
      }
    }
  })
  .catch((error) => {
    Swal.showValidationMessage(`Request failed: ${error}`);
  });

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", {
        user: user,
        message: chatBox.value,
      });
      chatBox.value = "";
    }
  }
});

btnSend.addEventListener("click", () => {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", {
        user: user,
        message: chatBox.value,
      });
      chatBox.value = "";
    }
});

socket.on("messageLogs", (data) => {
  let log = document.querySelector(".chat__container__dinamic");
  let message = "";
  data.forEach((elem) => {
    message += `
      <div class="chat__message">
      <div class="chat__message--bubble">
        <div class="chat__message--sender">${elem.user}</div>
        <p>${elem.message}</p>
        </div>
      </div>
    `;
  });

  log.innerHTML = message;
});

socket.on("new-user-connected", (data) => {
  if (confirm != "active") {
    if (data.id !== socket.id)
      Swal.fire({
        html: `<b class="chat__login--notification">${data.user} se ha conectado al chat<b>`,
        toast: true,
        position: "top-end",
        timer: 2000,
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      });
  }
});

function firstLoad(url) {
  let log = document.querySelector(".chat__container__dinamic");
  fetch(url, {
    method: "GET",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    mode: "cors",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let message = "";
      data.forEach((elem) => {
        message += `
      <div class="chat__message">
        <div class="chat__message--bubble">
          <div class="chat__message--sender">${elem.user}</div>
          <p>${elem.message}</p>
        </div>
      </div>
      `;
      });
      log.innerHTML = message;
      const bubbleMessage = document.querySelectorAll(".chat__message--bubble");
      bubbleMessage[bubbleMessage.length - 1].scrollIntoView();
    });
}

firstLoad(Url);
