const socket = io();
let chatBox = document.getElementById("chatBox");
let URLdomain = window.location.host;
let protocol = window.location.protocol;
let Url = protocol + "//" + URLdomain + "/api/messages/";
let confirm='active';
let user;
const titi= document.querySelector('.email-logged');

Swal.fire({
  title: '<b class="chat-login-tittle">Bienvenido al Chat</b>',
  html: '<u class="chat-login-text">Ingresa tu correo</u>',
  input: "text",
  confirmButtonText: '<b class="chat-login-confirm">Confirmar</b>',
  showLoaderOnConfirm: true,
  background:
    '#fff url("https://img.freepik.com/vector-gratis/fondo-degradado-cielo-pastel_23-2148917404.jpg?w=2000")',
  footer: '<a href="">Did you forget your password?</a>',
  inputPlaceholder: 'Ingresar aqui...',
  preConfirm: () => {confirm='inactive'},
  allowOutsideClick: false,
  backdrop:'rgba(0,0,123,0.4)',
})
  .then((result) => {
    if (result.isDismissed) {
      window.location.reload();
    } else {
      if (result.value) {
        user = result.value;
        titi.innerHTML=`<b>${user}<b>`;
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

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let message = "";
  data.forEach((elem) => {
    message += `
      <div class="chat-message">
      <div class="message-bubble">
        <div class="message-sender">${elem.user}</div>
        <p>${elem.message}</p>
        </div>
      </div>
    `;
  });

  log.innerHTML = message;
});

socket.on("new-user-connected", (data) => {
  if (confirm!='active') {
  if (data.id !== socket.id)
    Swal.fire({
      html: `<b class="chat-login-notification">${data.user} se ha conectado al chat<b>`,
      toast: true,
      position: "top-end",
      timer:2000,
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    });
  }
});

function firstLoad(url) {
  let log = document.getElementById("messageLogs");
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
      <div class="chat-message">
        <div class="message-bubble">
          <div class="message-sender">${elem.user}</div>
          <p>${elem.message}</p>
        </div>
      </div>
      `;
      });
      log.innerHTML = message;
    });
}

firstLoad(Url);
