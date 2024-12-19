import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';


const Calendar = () => {
    const [calendarDate, setCalendarDate] = useState(new Date()); // default calendar date
    const [datePicked, setDatePicked] = useState(new Date().toISOString().split("T")[0]);
    const [sunriseTime, setSunriseTime] = useState("")
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const apiUrl = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=${datePicked}`
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
                console.log(calendarDate.toISOString())
            })
        })

    }, [datePicked])


    function changeDate(date:Date) {
        setCalendarDate(date)
        setDatePicked(date.toISOString().split("T")[0])
    }

    return (
        <>
			<DatePicker className='text-black' showIcon selected={calendarDate} onChange={(date: Date | null) => {if (date) changeDate(date)}}></DatePicker>
            <p className='text-black mt-5'><b>Hora de amanecer el {datePicked}:</b> {sunriseTime}</p>
		</>
    )
}

export default Calendar;