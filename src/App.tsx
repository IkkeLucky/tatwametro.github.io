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

	function getPosition() {
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
			<>
				<header>
				<h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Tatwámetro</h1>
				</header>
			
				<main>
					<div className="w-full min-h-screen flex flex-col items-center justify-center">
						<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccione un país</label>
						<CountryDropdown className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={country} onChange={(val) => {setCountry(val); setChoose("manual")}} />
						<hr />
						<button className="mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={getPosition}>Ubicación precisa</button>
						<hr />
						<div className="mt-10">
							<Calendar />
						</div>
					</div>
				</main>
			</>
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