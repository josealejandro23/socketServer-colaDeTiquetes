const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    //eventos cuando un cliente se conecte
   socket.emit("ultimo-tk", "Ticket " + ticketControl.ultimo);
   socket.emit("estado-actual", ticketControl.ultimosCuatro);
   socket.emit("tickets-pendientes", ticketControl.tickets.length);

    socket.on("siguiente-tk", (payload, callback) => {
        const siguiente = ticketControl.siguienteTk();
        callback(siguiente);

        //TODO notificar que hay un nuevo tk
        //se lanza el evento para todos
        socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);
    });

    socket.on("atender-tk", ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
            ok: false,
            msg: "El escritorio es obligatorio",
            });
        }

        const ticket = ticketControl.atenderTk(escritorio);
        //si se atiende un tk se reenvía la lista de los últimos tks
        socket.broadcast.emit("estado-actual", ticketControl.ultimosCuatro);
        //se lanza el evento para el socket que hizo el llamado
        socket.emit("tickets-pendientes", ticketControl.tickets.length);
        //se lanza el evento para todos
        socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);
        if (!ticket) {
            callback({
            ok: false,
            msg: "No hay tks pendientes",
            });
        } else {
            callback({
            ok: true,
            ticket,
            });
        }
    });
}

module.exports = {
    socketController
}

