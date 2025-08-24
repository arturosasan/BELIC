import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

let calendarEl = document.getElementById('calendar');
let calendar = new Calendar(calendarEl, {
  plugins: [ dayGridPlugin, timeGridPlugin, listPlugin ],
  initialView: 'dayGridMonth',
  locale: 'es', // En español
  firstDay: 1, // Empieza en Lunes
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
    const filas = document.querySelectorAll('.fc-daygrid-body tr');
    filas.forEach(fila => {
      // Busca celdas con fondo de evento background
      const tieneEvento = Array.from(fila.querySelectorAll('.fc-daygrid-day'))
        .some(celda => {
          // Busca un div con clase .fc-bg-event dentro de la celda
          return celda.querySelector('.fc-bg-event');
        });
      if (!tieneEvento) {
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
