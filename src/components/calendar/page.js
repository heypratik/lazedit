"use client";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
const localizer = momentLocalizer(moment);

const BigCalendar = ({
  events,
  onSelectCalendarEvent,
  viewerDate,
  setViewerDate,
}) => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100vh" }}
        onSelectEvent={onSelectCalendarEvent}
        date={viewerDate}
        onNavigate={(newDate) => {
          setViewerDate(newDate);
        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: "black",
            color: "white",
          },
        })}
      />
    </div>
  );
};

export default BigCalendar;
