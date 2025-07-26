import React from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateSelector = ({ selectedDate, onDateChange }) => {
  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => onDateChange(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a date"
        maxDate={new Date()} // optional: disallow future dates
        showPopperArrow={false}
      />
    </div>
  )
}

export default DateSelector
