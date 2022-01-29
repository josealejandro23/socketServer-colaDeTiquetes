const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCrear = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
   // console.log('Conectado');
   btnCrear.disabled = false;
});

socket.on("disconnect", () => {
   btnCrear.disabled = true;
});

socket.on("ultimo-tk",(ultimo) => {
   lblNuevoTicket.innerText = ultimo;
});

btnCrear.addEventListener("click", () => {
   socket.emit("siguiente-tk", null, (ticket) => {
      lblNuevoTicket.innerText = ticket;
   });
});
