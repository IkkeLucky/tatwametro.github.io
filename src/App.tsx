import { useState } from 'react';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import { CountryDropdown } from 'react-country-region-selector';
import Calendar from './components/Calendar';
import Auto from './components/Auto';
import Manual from './components/Manual';

function App() {
	const [country, setCountry] = useState(String);
	const [lat, setLat] = useState<number | null>(null);
	const [lon, setLon] = useState<number | null>(null);
	const [choose, setChoose] = useState("none");
	const [onError, setOnError] = useState(String);

	function click() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setLat(position.coords.latitude);
				setLon(position.coords.longitude);
				setChoose("auto")			
			}, (error) => {
				alert("Debe otorgarnos acceso a su ubicacion. Intente resetear los permisos del navegador");
				console.log(error)
			})
		} else {
			setOnError("Debe otorgarnos acceso a su ubicacion.");
			console.log(onError)
		}
	}

	if (choose == "none") {
		return (
			<div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
				<CountryDropdown value={country} onChange={(val) => {setCountry(val); setChoose("manual")}} />
				<button className="btn border-green-500 p-1 mt-10" onClick={click}>Por ubicacion</button>
				<div className="mt-5">
					<Calendar />
				</div>
			</div>
		)
	} else if (choose == "auto") {
		return (
			<Auto lat={lat} lon={lon}/>
		)
	} else if (choose == "manual") {
		return (
			<Manual country={country} />
		)
	}
}

export default App;