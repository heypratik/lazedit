'use client'
import React, { useState } from 'react'
import DatePickerComponent from '@/components/DatePicker'
import { CiCalendar } from 'react-icons/ci';

const DatePickerContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const openDatePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsOpen(false);
  };

  return (
    <div>
      <DatePickerComponent
        onClick={openDatePicker}
        selectedDate={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  )
}

export default DatePickerContainer