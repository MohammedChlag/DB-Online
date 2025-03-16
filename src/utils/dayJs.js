import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import local from 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

//según la resta que va hacer dayJs de la fecha actual con la fecha que este guardada en la base de datos, lanzará alguno de estos mensajes:
dayjs.locale('es', {
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: '1 minuto',
        mm: '%d minutos',
        h: '1 hora',
        hh: '%d horas',
        d: '1 día',
        dd: '%d días',
        M: '1 mes',
        MM: '%d meses',
        y: '1 año',
        yy: '%d años',
    },
});

export const formatDate = (date) => {
    // Se consigue  transformar la fecha guardada en fecha de hora local.
    const localDate = dayjs.utc(date).local();

    // Si la diferencia es menor a 5 minutos, mostrara "hace un momento" para evitar confusiones.
    if (dayjs().diff(localDate, 'minute') < 5) {
        return 'hace un momento';
    }

    return localDate.fromNow(); //Calcular el tiempo correctamente y luego mostrara "hace minutos/hace horas" etc
};
