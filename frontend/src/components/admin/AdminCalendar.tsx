"use client";
import { useState, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-overrides.css';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Scissors,
  MoreHorizontal
} from 'lucide-react';

moment.locale('ru');
const localizer = momentLocalizer(moment);

interface AdminCalendarProps {
  appointments: any[];
  blockedTimes: any[];
  onSelectSlot: (slotInfo: any) => void;
  onSelectEvent: (event: any) => void;
  view?: any;
  onView?: (view: any) => void;
  date?: Date;
  onNavigate?: (date: Date) => void;
}

const CustomToolbar = ({ onNavigate, onView, date, view }: any) => {
  const goToBack = () => onNavigate('PREV');
  const goToNext = () => onNavigate('NEXT');
  const goToCurrent = () => onNavigate('TODAY');
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
        onNavigate('DATE', new Date(e.target.value));
    }
  };

  const label = () => {
    const dateObj = moment(date);
    return (
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 capitalize leading-none">
          {dateObj.format('MMMM')}
        </span>
        <span className="text-sm text-gray-500 font-medium">
          {dateObj.format('YYYY')}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button 
            type="button" 
            onClick={goToBack} 
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
          >
              <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            type="button" 
            onClick={goToCurrent} 
            className="px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
              Сегодня
          </button>
          <button 
            type="button" 
            onClick={goToNext} 
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
          >
              <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
            <input
                type="date"
                onChange={handleDateChange}
                value={moment(date).format('YYYY-MM-DD')}
                className="pl-10 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm cursor-pointer"
            />
            <CalendarIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        
        <div className="hidden md:block">
          {label()}
        </div>
      </div>

      <div className="md:hidden">
        {label()}
      </div>

      <div className="flex bg-gray-100/80 p-1 rounded-xl">
        {[
            { id: 'month', label: 'Месяц' },
            { id: 'week', label: 'Неделя' },
            { id: 'day', label: 'День' },
            { id: 'agenda', label: 'Список' }
        ].map(viewItem => (
            <button
                key={viewItem.id}
                type="button"
                onClick={() => onView(viewItem.id)}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    view === viewItem.id 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
            >
                {viewItem.label}
            </button>
        ))}
      </div>
    </div>
  );
};

const CustomEvent = ({ event }: any) => {
    const isBlocked = event.type === 'BLOCKED';
    
    if (isBlocked) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-red-50 border-l-4 border-red-400 rounded-r-md p-1">
                <span className="text-xs font-medium text-red-800 truncate">
                    {event.title}
                </span>
            </div>
        );
    }

    const statusColors = {
        NEW: 'bg-blue-50 border-blue-500 text-blue-700',
        CONFIRMED: 'bg-emerald-50 border-emerald-500 text-emerald-700',
        DONE: 'bg-gray-50 border-gray-500 text-gray-700',
        CANCELED: 'bg-red-50 border-red-500 text-red-700'
    };

    const colorClass = statusColors[event.status as keyof typeof statusColors] || statusColors.NEW;

    return (
        <div className={`h-full w-full flex flex-col p-1.5 text-xs overflow-hidden rounded-md border-l-4 transition-all hover:brightness-95 shadow-sm ${colorClass}`}>
            <div className="font-bold truncate flex items-center gap-1.5 mb-0.5">
                <User className="w-3 h-3 opacity-70" />
                {event.title.split('(')[0]}
            </div>
            <div className="flex flex-col gap-0.5 opacity-90">
                <div className="flex items-center gap-1.5 truncate">
                    <Scissors className="w-3 h-3 opacity-70" />
                    <span className="truncate font-medium">{event.resource?.service?.name}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate text-[10px]">
                    <Clock className="w-3 h-3 opacity-70" />
                    <span>
                        {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default function AdminCalendar({ 
  appointments, 
  blockedTimes, 
  onSelectSlot, 
  onSelectEvent,
  view: controlledView,
  onView: controlledOnView,
  date: controlledDate,
  onNavigate: controlledOnNavigate
}: AdminCalendarProps) {
  const [localView, setLocalView] = useState(Views.MONTH);
  const [localDate, setLocalDate] = useState(new Date());

  const view = controlledView !== undefined ? controlledView : localView;
  const date = controlledDate !== undefined ? controlledDate : localDate;

  const handleView = (newView: any) => {
    if (controlledOnView) controlledOnView(newView);
    else setLocalView(newView);
  };

  const handleNavigate = (newDate: Date) => {
    if (controlledOnNavigate) controlledOnNavigate(newDate);
    else setLocalDate(newDate);
  };

  const events = [
    ...appointments.map(app => {
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
    return {
        style: {
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            boxShadow: 'none',
            color: 'inherit'
        }
    };
  };

  const slotPropGetter = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date < now) {
      return {
        className: 'bg-gray-50/50 cursor-not-allowed'
      };
    }
    return {};
  };

  return (
    <div className="h-[850px] bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', fontFamily: 'inherit' }}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        selectable
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={handleView}
        components={{
            toolbar: CustomToolbar,
            event: CustomEvent
        }}
        eventPropGetter={eventStyleGetter}
        slotPropGetter={slotPropGetter}
        popup={true} // Show popup when too many events in month view
        min={new Date(0, 0, 0, 8, 0, 0)} // Start at 8:00 AM
        max={new Date(0, 0, 0, 22, 0, 0)} // End at 10:00 PM
        step={30} // 30 minute slots
        timeslots={2} // 2 slots per step (so 1 hour is 2 steps) -> wait, step is slot duration. timeslots is number of slots per "major" time.
        // Actually standard is step=30, timeslots=2 means 1 hour lines.
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
          noEventsInRange: "Нет событий",
          showMore: (total) => `+ еще ${total}`
        }}
      />
    </div>
  );
}
