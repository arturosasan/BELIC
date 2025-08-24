import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

let calendarEl = document.getElementById('calendar');
let calendar = new Calendar(calendarEl, {
  plugins: [ dayGridPlugin, timeGridPlugin, listPlugin ],
  initialView: 'dayGridMonth',
  initialDate: '2025-09-01',
  locale: 'es', // En español
  firstDay: 1, // Empieza en Lunes
  fixedWeekCount : false,
  showNonCurrentDates : true, // Mostrar los días que no pertenecen al mes actual
  headerToolbar: {
    start: 'prev', // IZQ
    center: 'title', // CENTRO
    end: 'next', // DER
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

//const hoy = new Date();
const hoy = new Date(2025, 8, 2); // EMPIEZA EL 1 DE SEPTIEMBRE DEL 2025
const fin = new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate()); // FIN DEL PERIODO (EN ESTE CASO 1 DE SEPTIEMBRE DEL 2026) (CONST = HOY)

const weekly = generateEvents(hoy, fin, [2, 3, 4, 5, 6], 'red'); // Días de semana
const saturday      = generateEvents(hoy, fin, [0], 'yellow'); // Sábados
const sunday     = generateEvents(hoy, fin, [1], 'blue'); // Domingos

const allEvents = [
  ...weekly,
  ...saturday,
  ...sunday
];

calendar.addEventSource(allEvents);

calendar.render();

// OCULTAR FILAS SIN EVENTOS EN LA VISTA MENSUAL
function ocultarFilasSinEventos() {
  setTimeout(() => {
    const filas = Array.from(document.querySelectorAll('.fc-daygrid-body tr'));
    // Identificar filas con eventos
    const filasConEvento = filas.map(fila => {
      return Array.from(fila.querySelectorAll('.fc-daygrid-day'))
        .some(celda => celda.querySelector('.fc-bg-event'));
    });
    // Mantener visibles todas las filas hasta la última que tenga evento
    let ultimaConEvento = -1;
    for (let i = 0; i < filasConEvento.length; i++) {
      if (filasConEvento[i]) ultimaConEvento = i;
    }
    filas.forEach((fila, idx) => {
      if (idx > ultimaConEvento) {
        fila.style.display = 'none';
      } else {
        fila.style.display = '';
      }
    });
  }, 10);
}

// Llama a la función después de cada renderizado
calendar.on('datesSet', ocultarFilasSinEventos);
calendar.on('eventAdd', ocultarFilasSinEventos);
calendar.on('eventRemove', ocultarFilasSinEventos);
// Llamada inicial
ocultarFilasSinEventos();
