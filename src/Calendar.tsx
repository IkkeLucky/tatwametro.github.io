import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { getSunrise } from "sunrise-sunset-js"

function getState(sunriseTime: Date, timePicked: Date) {
	let state = 0;
    console.log(sunriseTime)
    console.log(timePicked)
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
    const [sunriseTime, setSunriseTime] = useState("")
    const [state, setState] = useState<number | null>(null);
    const [hourPicked, setHourPicked] = useState<string | null>(null);
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const sunriseTime = getSunrise(position.coords.latitude, position.coords.longitude)

            const apiUrl = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=${datePicked.toISOString().split("T")[0]}`
			fetch(apiUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            })
            .then(data => {
                setSunriseTime(data.results.sunrise)
                const str_sunrise = data.results.sunrise.split(" ")[0];
                const str_sunriseDay = datePicked.toISOString().split("T")[0];
                const newDate = new Date(str_sunriseDay + "T0" + str_sunrise);
                setState(getState(newDate, datePicked));
                //console.log(new Date.parse(datePicked.toISOString().split("T")[0] + " " + str_sunrise.split(" ")[0]))
            })
        })

    }, [datePicked])


    function changeDate(date:Date) {
        setCalendarDate(date)
        setDatePicked(date);
        setHourPicked(date.toISOString().split("T")[0])
    }

    return (
        <>
			<DatePicker showTimeSelect showIcon selected={calendarDate} onChange={(date: Date | null) => {if (date) changeDate(date)}}></DatePicker>
            <p className='mt-5'><b>Hora de amanecer el {datePicked.toISOString().split("T")[0]}:</b> {sunriseTime}</p>
            <p><b>Estado a las {hourPicked}: </b>{state}</p>
		</>
    )
}

export default Calendar;