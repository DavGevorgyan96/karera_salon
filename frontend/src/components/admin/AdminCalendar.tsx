"use client";
import { Calendar, momentLocalizer, Views, Navigate } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-overrides.css'; // We will create this or just rely on inline styles/tailwind

moment.locale('ru');
const localizer = momentLocalizer(moment);

interface AdminCalendarProps {
  appointments: any[];
  blockedTimes: any[];
  onSelectSlot: (slotInfo: any) => void;
  onSelectEvent: (event: any) => void;
}

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate(Navigate.PREVIOUS);
  };

  const goToNext = () => {
    toolbar.onNavigate(Navigate.NEXT);
  };

  const goToCurrent = () => {
    toolbar.onNavigate(Navigate.TODAY);
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span className="text-xl font-bold text-gray-800 capitalize">
        {date.format('MMMM YYYY')}
      </span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-2">
      <div className="flex items-center gap-2">
        <button onClick={goToBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>
        <button onClick={goToCurrent} className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Сегодня
        </button>
        <button onClick={goToNext} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </button>
      </div>
      
      <div>
        {label()}
      </div>

      <div className="flex bg-gray-100 p-1 rounded-lg">
        {[
            { id: 'month', label: 'Месяц' },
            { id: 'week', label: 'Неделя' },
            { id: 'day', label: 'День' },
            { id: 'agenda', label: 'Список' }
        ].map(view => (
            <button
                key={view.id}
                onClick={() => toolbar.onView(view.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    toolbar.view === view.id 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                {view.label}
            </button>
        ))}
      </div>
    </div>
  );
};

const CustomEvent = ({ event }: any) => {
    return (
        <div className="h-full w-full flex flex-col px-1 py-0.5 text-xs overflow-hidden">
            <div className="font-bold truncate">{event.title}</div>
            {event.resource?.clientPhone && (
                <div className="opacity-90 truncate text-[10px]">{event.resource.clientPhone}</div>
            )}
             {event.type === 'APPOINTMENT' && event.resource?.timeFrom && (
                <div className="opacity-90 truncate text-[10px]">
                    {new Date(event.resource.timeFrom).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            )}
        </div>
    )
}

export default function AdminCalendar({ appointments, blockedTimes, onSelectSlot, onSelectEvent }: AdminCalendarProps) {
  const events = [
    ...appointments.map(app => {
        // Construct start/end dates. 
        // app.date is YYYY-MM-DD or ISO. app.timeFrom is ISO (1970-01-01THH:mm:ss).
        const dateStr = app.date.toString().split('T')[0];
        const timeFromStr = app.timeFrom.toString().split('T')[1] || app.timeFrom;
        const timeToStr = app.timeTo.toString().split('T')[1] || app.timeTo;
        
        return {
            id: app.id,
            title: `${app.clientName} (${app.service?.name || 'Услуга'})`,
            start: new Date(`${dateStr}T${timeFromStr}`),
            end: new Date(`${dateStr}T${timeToStr}`),
            type: 'APPOINTMENT',
            status: app.status,
            resource: app
        };
    }),
    ...blockedTimes.map(block => {
        const dateStr = block.date.toString().split('T')[0];
        let start, end, allDay = false;

        if (!block.timeFrom) {
            start = new Date(dateStr);
            end = new Date(dateStr);
            allDay = true;
        } else {
            const timeFromStr = block.timeFrom.toString().split('T')[1] || block.timeFrom;
            const timeToStr = block.timeTo.toString().split('T')[1] || block.timeTo;
            start = new Date(`${dateStr}T${timeFromStr}`);
            end = new Date(`${dateStr}T${timeToStr}`);
        }

        return {
            id: block.id,
            title: block.reason || 'Недоступно',
            start,
            end,
            type: 'BLOCKED',
            allDay,
            resource: block
        };
    })
  ];

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3b82f6';
    let borderLeft = '4px solid #2563eb';
    
    if (event.type === 'BLOCKED') {
      backgroundColor = '#fee2e2'; // Red-100
      borderLeft = '4px solid #ef4444'; // Red-500
      return {
        style: {
            backgroundColor,
            borderLeft,
            color: '#991b1b', // Red-800
            borderRadius: '4px',
            border: 'none',
            display: 'block'
        }
      };
    } else if (event.status === 'CONFIRMED') {
      backgroundColor = '#d1fae5'; // Green-100
      borderLeft = '4px solid #10b981'; // Green-500
      return {
        style: {
            backgroundColor,
            borderLeft,
            color: '#065f46', // Green-800
            borderRadius: '4px',
            border: 'none',
            display: 'block'
        }
      };
    } else if (event.status === 'NEW') {
      backgroundColor = '#dbeafe'; // Blue-100
      borderLeft = '4px solid #3b82f6'; // Blue-500
      return {
        style: {
            backgroundColor,
            borderLeft,
            color: '#1e40af', // Blue-800
            borderRadius: '4px',
            border: 'none',
            display: 'block'
        }
      };
    } else {
      backgroundColor = '#f3f4f6'; // Gray-100
      borderLeft = '4px solid #6b7280'; // Gray-500
      return {
        style: {
            backgroundColor,
            borderLeft,
            color: '#374151', // Gray-700
            borderRadius: '4px',
            border: 'none',
            display: 'block'
        }
      };
    }
  };

  const slotPropGetter = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date < now) {
      return {
        style: {
          backgroundColor: '#f9fafb', // Very light gray
          backgroundImage: 'repeating-linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6), repeating-linear-gradient(45deg, #f3f4f6 25%, #f9fafb 25%, #f9fafb 75%, #f3f4f6 75%, #f3f4f6)',
          backgroundPosition: '0 0, 10px 10px',
          backgroundSize: '20px 20px',
          cursor: 'not-allowed',
          opacity: 0.7
        }
      };
    }
    return {};
  };

  const dayPropGetter = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date < now) {
        return {
            style: {
                backgroundColor: '#f9fafb',
                color: '#9ca3af',
                cursor: 'not-allowed'
            }
        };
    }
    return {};
  };

  return (
    <div className="h-[700px] bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', fontFamily: 'inherit' }}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        selectable
        components={{
            toolbar: CustomToolbar,
            event: CustomEvent
        }}
        eventPropGetter={eventStyleGetter}
        slotPropGetter={slotPropGetter}
        dayPropGetter={dayPropGetter}
        messages={{
          next: "Вперед",
          previous: "Назад",
          today: "Сегодня",
          month: "Месяц",
          week: "Неделя",
          day: "День",
          agenda: "Список",
          date: "Дата",
          time: "Время",
          event: "Событие",
          noEventsInRange: "Нет событий в этом диапазоне"
        }}
      />
    </div>
  );
}
