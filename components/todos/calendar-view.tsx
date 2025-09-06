"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMemo, useEffect } from "react";
import { Todo } from "@/types/todo";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CATEGORY_DOT_COLORS, PRIORITY_DOT_COLORS } from "@/lib/constants";
import { CalendarSkeleton } from "./todo-list-skeleton";

interface CalendarViewProps {
  todos: Todo[];
  onEditClick: (todo: Todo) => void;
  onAddTask: () => void;
  onAddTaskForDate: (date: Date) => void;
  isLoading?: boolean;
}

export default function CalendarView({
  todos,
  onEditClick,
  onAddTaskForDate,
  isLoading = false,
}: CalendarViewProps) {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .fc .fc-toolbar {
        margin-bottom: 1rem;
        padding: 0 0.5rem;
        gap: 0.75rem;
        flex-wrap: wrap;
        align-items: center;
        display: flex;
      }
      
      .fc .fc-toolbar-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: hsl(var(--foreground));
        margin: 0;
        order: 1;
        flex: 1;
        min-width: 200px;
        text-align: center;
      }

      .fc .fc-toolbar-chunk {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .fc .fc-toolbar-chunk:first-child {
        order: 0;
        flex: 1;
        justify-content: flex-start;
      }

      .fc .fc-toolbar-chunk:last-child {
        order: 2;
        flex: 1;
        justify-content: flex-end;
      }

      .fc .fc-button {
        background: hsl(var(--background));
        border: 1px solid hsl(var(--border));
        color: hsl(var(--foreground));
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.375rem;
        transition: all 0.2s;
        height: 2.25rem;
        font-family: inherit;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        min-width: auto;
      }

      .fc .fc-button:hover {
        background: hsl(var(--muted));
        border-color: hsl(var(--border));
        color: hsl(var(--foreground));
      }

      .fc .fc-button:focus {
        box-shadow: 0 0 0 2px hsl(var(--ring));
        outline: none;
      }

      .fc .fc-button-active,
      .fc .fc-button-active:hover {
        background: hsl(var(--primary));
        border-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
      }

      .fc .fc-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .fc .fc-button-group {
        display: flex;
        border-radius: 0.375rem;
        overflow: hidden;
        border: 1px solid hsl(var(--border));
      }

      .fc .fc-button-group > .fc-button {
        border-radius: 0;
        margin-left: -1px;
        border-left: none;
      }

      .fc .fc-button-group > .fc-button:first-child {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
        margin-left: 0;
        border-left: 1px solid hsl(var(--border));
      }

      .fc .fc-button-group > .fc-button:last-child {
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }

      .fc .fc-today-button {
        margin-right: 0.5rem;
      }

      @media (max-width: 768px) {
        .fc .fc-toolbar {
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .fc .fc-toolbar-title {
          font-size: 1.125rem;
          order: -1;
          text-align: center;
        }

        .fc .fc-toolbar-chunk:first-child,
        .fc .fc-toolbar-chunk:last-child {
          flex: none;
          justify-content: center;
        }

        .fc .fc-button {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          height: 2rem;
        }
      }

      @media (max-width: 640px) {
        .fc .fc-toolbar-chunk {
          display: flex;
          justify-content: center;
        }

        .fc .fc-button-group {
          flex-wrap: wrap;
          gap: 0.25rem;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const events = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos
      .filter((todo) => {
        const todoEndDate = new Date(todo.endDate);
        todoEndDate.setHours(0, 0, 0, 0);
        return todoEndDate >= today;
      })
      .map((t) => {
        const startDate = t.startDate.split("T")[0];
        const endDate = t.endDate.split("T")[0];
        const categoryColor =
          CATEGORY_DOT_COLORS[t.category as keyof typeof CATEGORY_DOT_COLORS] ||
          "bg-gray-500";

        const colorMap: Record<string, string> = {
          "bg-blue-500": "hsl(214, 95%, 50%)",
          "bg-green-500": "hsl(142, 76%, 36%)",
          "bg-yellow-500": "hsl(45, 93%, 47%)",
          "bg-purple-500": "hsl(262, 83%, 58%)",
          "bg-pink-500": "hsl(330, 81%, 60%)",
          "bg-indigo-500": "hsl(238, 100%, 67%)",
          "bg-orange-500": "hsl(25, 95%, 53%)",
          "bg-cyan-500": "hsl(199, 89%, 48%)",
          "bg-gray-500": "hsl(215, 20%, 65%)",
          "bg-red-500": "hsl(0, 84%, 60%)",
        };

        return {
          id: t._id,
          title: t.title,
          start: startDate,
          end: endDate,
          allDay: true,
          backgroundColor: colorMap[categoryColor] || "hsl(214, 95%, 50%)",
          borderColor: colorMap[categoryColor] || "hsl(214, 95%, 50%)",
          textColor: "white",
          classNames: [
            `category-${t.category.toLowerCase()}`,
            `priority-${t.priority}`,
            "todo-event",
          ],
          extendedProps: {
            category: t.category,
            priority: t.priority,
            status: t.status,
            description: t.description,
            categoryColor,
            priorityColor:
              PRIORITY_DOT_COLORS[
                t.priority as keyof typeof PRIORITY_DOT_COLORS
              ] || "bg-gray-500",
          },
        };
      });
  }, [todos]);

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            expandRows
            stickyHeaderDates
            firstDay={1}
            events={events}
            headerToolbar={{
              left: "prev,today,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{ today: "Today" }}
            dayHeaderFormat={{ weekday: "short" }}
            moreLinkClick="popover"
            dayMaxEvents={true}
            eventDisplay="block"
            dateClick={(info) => onAddTaskForDate(info.date)}
            eventClick={(info) => {
              const todo = todos.find((t) => t._id === info.event.id);
              if (todo) onEditClick(todo);
            }}
            eventContent={(eventInfo) => {
              const { category, priority, status } =
                eventInfo.event.extendedProps;
              const categoryColor =
                CATEGORY_DOT_COLORS[
                  category as keyof typeof CATEGORY_DOT_COLORS
                ] || "bg-gray-500";
              const priorityColor =
                PRIORITY_DOT_COLORS[
                  priority as keyof typeof PRIORITY_DOT_COLORS
                ] || "bg-gray-500";

              return (
                <div className="flex items-center gap-1 w-full">
                  <div
                    className={`w-2 h-2 rounded-full ${categoryColor} flex-shrink-0`}
                  />
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${priorityColor} flex-shrink-0`}
                  />
                  <span className="truncate text-xs font-medium flex-1 text-white">
                    {eventInfo.event.title}
                  </span>
                  {status === "completed" && (
                    <span className="text-xs text-white">✓</span>
                  )}
                </div>
              );
            }}
            contentHeight="auto"
            aspectRatio={1.2}
          />
        </div>
      </div>
    </div>
  );
}
