import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { getSunrise } from "sunrise-sunset-js"

function getState(sunriseTime: Date, timePicked: Date) {
	let state = 0;
	while (sunriseTime <= timePicked) {
		//console.log(sunriseTime)
		state += 1;
		if (state == 6) {
			state = 1;
		}
		sunriseTime.setMinutes(sunriseTime.getMinutes() + 24);
	}
	return state; 
}

const Calendar = () => {
    const [calendarDate, setCalendarDate] = useState(new Date()); // default calendar date
    const [datePicked, setDatePicked] = useState(new Date());
    const [state, setState] = useState<number | null>(null);
    

    function changeDate(date:Date) {
        setCalendarDate(date)
        setDatePicked(date);
        navigator.geolocation.getCurrentPosition(position => {
            const sunriseTime = getSunrise(position.coords.latitude, position.coords.longitude, datePicked)
            setState(getState(sunriseTime, datePicked));
        })

    }

    return (
        <>
			<DatePicker showTimeSelect showIcon selected={calendarDate} onChange={(date: Date | null) => {if (date) changeDate(date)}}></DatePicker>
            <p className='mt-5'><b>{calendarDate.toISOString()}</b></p>
            <p><b>Estado a las: </b>{state}</p>
		</>
    )
}

export default Calendar;