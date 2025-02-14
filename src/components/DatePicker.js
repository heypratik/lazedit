import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CiCalendar } from 'react-icons/ci';

const DatePickerComponent = ({ selectedDate, onChange }) => {
  return (
    <div className="date-picker-container">
      <CiCalendar size={25} className="calendar-icon" />
      <DatePicker
        selected={selectedDate}
        placeholderText="Time Period"
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        className="date-picker-input"
      />
    </div>
  )
}

export default DatePickerComponent