import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

let calendarEl = document.getElementById('calendar');
let calendar = new Calendar(calendarEl, {
  plugins: [ dayGridPlugin, timeGridPlugin, listPlugin ],
  initialView: 'dayGridMonth',
  locale: 'es', // En español, pero sin mayus (¿?)
  firstDay: 1, // Empieza en Lunes
  headerToolbar: {
    start: 'prev',
    center: 'title',
    end: 'next'
    },
    titleFormat:{
      year: 'numeric', 
      month: 'short'
    }
});

// GENERAR EVENTOS AUTOMÁTICOS
function generateEvents(fechaInicio, fechaFin, diasSemana, color) {
  const eventos = [];
  const fecha = new Date(fechaInicio);

  while (fecha <= new Date(fechaFin)) {
    if (diasSemana.includes(fecha.getDay())) {
      eventos.push({
        start: fecha.toISOString().split('T')[0],
        display: 'background',
        backgroundColor: color
      });
    }
    fecha.setDate(fecha.getDate() + 1);
  }

  return eventos;
}

const hoy = new Date();
const fin = new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate());

const weekly = generateEvents(hoy, fin, [1, 2, 3, 4, 5], 'red');
const saturday      = generateEvents(hoy, fin, [6], 'yellow');
const sunday     = generateEvents(hoy, fin, [0], 'blue');

const allEvents = [
  ...weekly,
  ...saturday,
  ...sunday
];

calendar.addEventSource(allEvents);

calendar.render();
