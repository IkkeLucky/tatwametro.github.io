import { useState, useEffect, useRef } from 'react';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import { getSunrise } from "sunrise-sunset-js"
import { CountryDropdown } from 'react-country-region-selector';
import _data from "./assets/country-by-geo-coordinates.json";
//import Calendar from './Calendar';

interface Data {
	country: string;
	north: number;
	south: number;
	west: number;
	east: number;
}

const data = _data as Data[];

const states = [
	{
		name: 'Akash',
		background: 'bg-gradient-to-b from-gray-900 via-purple-900 to-violet-800', 
		descriptions: [
			'Principio organico, elemento de destruccion y abolicion',
			'Se deben evitar estos 24 minutos que vibra akash, ocurren grandes decepciones y esperanzas destruidas',
			'Akash obra disolviendo, oponiendose y destruyendo todo l ocorporal. En el duerme el principio de todo ser, el enigma de toda destruccion y creacion',
			'Retorno al estado primitivo, no debemos hacer nada, debemos aislarnos, quedarnos tranquilos en meditacion y pensamiento sobre el principio'
		]
	},
	{
		name: 'Vayu',
		background: 'bg-gradient-to-b from-blue-600 via-blue-400 to-cyan-300',
		descriptions: [
			'Primera manifestacion de la vida, representa el movimiento. Velocidad y movimiento, aire, vientos, navegacion y todo lo que sea avanzar',
			'Ascension a montanas, ejercicio y todo relacionado a moverse debe elegirse en este Tatwa. Todo movimiento que se inicie en este Tatwa ayuda a no cansarse tanto',
			'Aspectos relacionados con facultades intelectuales y espirituales. Mayor proteccion y desarrollo intelectual y mas sentido logico y juicios intuitivos',
			'Vayu generalmente '
	  ]
	},
	{
		name: 'Tejas',
		background: 'bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400',
		descriptions: [
			'Aumento de energias, este es el momento mas activo y mas productivo del dia',
			'Tatwa donde se encuentra la confianza absoluta en uno mismo',
			'Momento donde el exceso de energias puede derivar en momentos agresivos, enojadizos, belicosos, celosos. Tejas es portador de luchas y discusiones',
			'El principio de Tejas es caliente, cuando vibra este tatwas se eleva nuestra temperatura'
	  ]
	},
	{
		name: 'Prithvi',
		background: 'bg-gradient-to-b from-green-800 via-green-600 to-yellow-500', 
		descriptions: [
			'Brightness illuminates everything Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde optio repudiandae',
			'Shadows retreat to the corners',
			'A sense of clarity and vision prevails',
			'The world is awash in radiance'
	  ]
	},
	{
		name: 'Apas',
		background: 'bg-gradient-to-b from-yellow-200 via-yellow-100 to-white', 
		descriptions: [
			'Tatwas donde se puede hacer abortar el mal, correspondiente al agua, donde las peleas no duran mucho tiempo',
			'El tatwa Apas obra concentrando, buen momento de iniciar negocios, depositos de dinero o hacer especulaciones. Tatwa de la riqueza y opulencia',
			'Tatwa del amor sexual y concepcion en el vientre de la madre. Tatwas que influencia al amor',
			'Este momento trae paz, alegria, juego, gozo, baile y placeres de todas las clases'
	  ]
	}
]


function getState(sunriseTime: Date) {
	let state = 0;
	const actualTime = new Date();
	while (sunriseTime <= actualTime) {
		//console.log(sunriseTime)
		state += 1;
		if (state == 6) {
			state = 1;
		}
		sunriseTime.setMinutes(sunriseTime.getMinutes() + 24);
	}
	return state; 
}

/*
devuelve la diferencia en segundos entre la hora de inicio del
estado actual y la hora de inicio del siguiente
*/
function getTime(sunriseTime: Date) {
	const actualTime = new Date();
    while (sunriseTime < actualTime) {
        sunriseTime.setMinutes(sunriseTime.getMinutes() + 24);
    }
    //console.log(sunriseTime);
    const diff = sunriseTime.getTime() - actualTime.getTime();
    return Math.floor(diff / 1000);
}


function App() {
	const [country, setCountry] = useState(String);
	const [currentState, setCurrentState] = useState<number | null>(null);
	const [onError, setOnError] = useState(String);
	const countdownIntervalId = useRef(0);
	const [stateNeedsToChange, setStateNeedsToChange] = useState(Boolean);
	const [countdownTime, setCountdownTime] = useState(Number);
	const [minutesRem, setMinutesRem] = useState(0);
	const [secondsRem, setSecondsRem] = useState(0);

	const [lat, setLat] = useState<number | null>(null);
	const [lon, setLon] = useState<number | null>(null);
	useEffect(() => {
		try {
			if (country.length != 0) {
				const choosedCountry = data.find((element) => element.country == country);
				if (choosedCountry != null) {
					const lat = (choosedCountry.north + choosedCountry.south) / 2
					const lon = (choosedCountry.east + choosedCountry.west) / 2
					const sunriseTime = getSunrise(lat, lon)
					setCurrentState(getState(sunriseTime));
					setCountdownTime(getTime(sunriseTime));
				} else {
					setOnError("No pudimos encontrar información.")
				}
			}
		} catch (error) {
			setOnError("Error")
		}

	}, [country, stateNeedsToChange])

	useEffect(() => {
		return () => {
			doStartCountdown();
		};
	}, []);

	/*
	Si el contador llega a cero cambia el estado (se llama de
	vuelta a la api) y se resetea el contador llamando de vuelta 
	a la funcion getTime()
	*/
	useEffect(() => {
		if (countdownTime < 0) {
			doResetCountdown();
			if (stateNeedsToChange == true) {
				setStateNeedsToChange(false);
			} else {
				setStateNeedsToChange(true);
			}
		}
	}, [countdownTime]);

	const doStartCountdown = () => {
		countdownIntervalId.current = window.setInterval(() => {
			setCountdownTime((pastState) => {
				return pastState -= 1;
			});
		}, 1000);	
	}

	const doStopCountdown = () => {
		window.clearInterval(countdownIntervalId.current);
	};

	const doResetCountdown = () => {
		doStopCountdown();
		setCountdownTime(countdownTime);
		
		doStartCountdown();
	};

	/*
	Transforma los SEGUNDOS en minutos y segundos. Si
	el contador es menor que cero continua renderizando "0:00"
	hasta que el estado cambie. De otra forma, renderiza "-1"
	"-2", etc. Tiene que haber una mejor forma pero no se me
	ocurre todavia.
	*/
	useEffect(() => {
		if (countdownTime > 0) {
			setMinutesRem(Math.floor(countdownTime / 60));
			setSecondsRem(countdownTime % 60);
		} else {
			setMinutesRem(0);
			setSecondsRem(0);
		}

	}, [countdownTime])

	
	function click() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setLat(position.coords.latitude)
				setLon(position.coords.longitude)				
			}, (error) => {
				alert("Debe otorgarnos acceso a su ubicacion. Intente resetear los permisos del navegador");
				console.log(error)
			})
		} else {
			setOnError("Debe otorgarnos acceso a su ubicacion.");
			console.log(onError)
		}
	}

	useEffect(() => {
		if (lat != null && lon != null) {
			const sunriseTime = getSunrise(lat, lon)
			setCurrentState(getState(sunriseTime));
			setCountdownTime(getTime(sunriseTime));
		}
	}, [lat, stateNeedsToChange])

	if(currentState == null) {
		return (
			<div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
				<CountryDropdown value={country} onChange={(val) => setCountry(val)} />
				<button className="btn border-green-500 p-1 mt-10" onClick={click}>Por ubicacion</button>
			</div>
		)
	} else if (onError) {
		return (
			<div>
				<p>Algo salió mal...</p>
				<br />
				<hr />
				<br />
				<p>Detalles: {onError}</p>
			</div>
		)

	} else {
		try {
			const stateToShow = states[currentState - 1]; // Adjusting to 0-based index for our states array
		
			return (
				<div className={`w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-1000 ${stateToShow.background}`}> 		
					{countdownTime < 10 ? <h5 className="text-white">A punto de cambiar de estado...</h5> : ""}
					{secondsRem < 10 ? <h5 className="text-white">Tiempo restante para el siguiente estado: {minutesRem}:0{secondsRem} </h5> : <h5 className="text-white">Tiempo restante para el siguiente estado: {minutesRem}:{secondsRem} </h5>}
					
					<h1 className="text-1xl font-bold mb-6 sm:mb-8 text-white">Estas en: {country}</h1>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-white">{stateToShow.name}</h1>
					<div className="flex flex-col space-y-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
						{stateToShow.descriptions.map((description, index) => (
							<div
								key={index}
								className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-3 sm:p-4 text-sm sm:text-base text-white shadow-lg transition-all duration-500 hover:scale-105">
								{description}
							</div>
						))}
					</div>
					{/* <div className="mt-5">
						<Calendar />
					</div> */}
				</div>
			)
		} catch (error) {
			setOnError((error as Error).message)
		}
		
	}
}

export default App;