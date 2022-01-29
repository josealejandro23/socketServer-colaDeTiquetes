const path = require('path');
const fs = require('fs')

class Ticket {
   constructor ( numero, escritorio) {
      this.numero = numero,
      this.escritorio = escritorio
   }
}

class TicketControl {
   constructor( ) {
      this.ultimo = 0;
      this.fechaHoy = new Date().getDate();
      this.tickets = [];
      this.ultimosCuatro = [];

      this.init();
   }

   get toJSON() {
      return {
         ultimo : this.ultimo,
         fechaHoy : this.fechaHoy,
         tickets : this.tickets,
         ultimosCuatro : this.ultimosCuatro
      }
   }

   init() {
      const {fechaHoy, ultimo, tickets, ultimosCuatro} = require('../db/data.json');
      //si la fecha de registro del objeto json es igual a la de hoy se mantiene la info ahí almacenada
      if(fechaHoy === this.fechaHoy){
         this.tickets = tickets,
         this.ultimo = ultimo,
         this.ultimosCuatro = ultimosCuatro
      }else{
         //un día diferente
         this.guardarDB()
      }
   }

   guardarDB(){
      const dbPath = path.join(__dirname,'../db/data.json');
      fs.writeFileSync(dbPath, JSON.stringify(this.toJSON));
   }

   siguienteTk(){
      this.ultimo +=1;
      const ticket = new Ticket(this.ultimo, null);
      this.tickets.push(ticket);

      this.guardarDB();
      return 'Ticket ' + ticket.numero;
   }

   atenderTk ( escritorio ){
      //si no hay tickets
      if( this.tickets.length === 0)
         return null;

         //se extrae el tk en la posición 0 y se elimina del listado
      const ticket = this.tickets.shift();  //this.ticket[0]
      //se le asigna un escritorio al tk
      ticket.escritorio = escritorio;
      //se agrega el tk al inicio del arreglo de tks
      this.ultimosCuatro.unshift( ticket );
      //se corta el arreglo para evitar que sea mayor a cuatro que es el número de escritorios
      if(this.ultimosCuatro.length > 4){
         this.ultimosCuatro.splice(-1,1);
      }
      //se guarda en db
      this.guardarDB();

      return ticket;
   }
}

module.exports = TicketControl;