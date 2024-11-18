'use client'

import { useState, useEffect } from 'react'

const states = [
  {
    name: 'Akash1',
    background: 'bg-gradient-to-b from-gray-900 via-purple-900 to-violet-800', 
    descriptions: [
      'Principio organico, elemento de destruccion y abolicion',
      'Se deben evitar estos 24 minutos que vibra akash, ocurren grandes decepciones y esperanzas destruidas',
      'Akash obra disolviendo, oponiendose y destruyendo todo l ocorporal. En el duerme el principio de todo ser, el enigma de toda destruccion y creacion',
      'Retorno al estado primitivo, no debemos hacer nada, debemos aislarnos, quedarnos tranquilos en meditacion y pensamiento sobre el principio'
    ]
  },
  {
    name: 'Vayu2',
    background: 'bg-gradient-to-b from-blue-600 via-blue-400 to-cyan-300',
    descriptions: [
      'Primera manifestacion de la vida, representa el movimiento. Velocidad y movimiento, aire, vientos, navegacion y todo lo que sea avanzar',
      'Ascension a montanas, ejercicio y todo relacionado a moverse debe elegirse en este Tatwa. Todo movimiento que se inicie en este Tatwa ayuda a no cansarse tanto',
      'Aspectos relacionados con facultades intelectuales y espirituales. Mayor proteccion y desarrollo intelectual y mas sentido logico y juicios intuitivos',
      'Vayu generalmente '
    ]
  },
  {
    name: 'Tejas3',
    background: 'bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400',
    descriptions: [
      'Aumento de energias, este es el momento mas activo y mas productivo del dia',
      'Tatwa donde se encuentra la confianza absoluta en uno mismo',
      'Momento donde el exceso de energias puede derivar en momentos agresivos, enojadizos, belicosos, celosos. Tejas es portador de luchas y discusiones',
      'El principio de Tejas es caliente, cuando vibra este tatwas se eleva nuestra temperatura'
    ]
  },
  {
    name: 'Prithvi4',
    background: 'bg-gradient-to-b from-green-800 via-green-600 to-yellow-500', 
    descriptions: [
      'Brightness illuminates everything',
      'Shadows retreat to the corners',
      'A sense of clarity and vision prevails',
      'The world is awash in radiance'
    ]
  },
  {
    name: 'Apas5',
    background: 'bg-gradient-to-b from-yellow-200 via-yellow-100 to-white', 
    descriptions: [
      'Tatwas donde se puede hacer abortar el mal, correspondiente al agua, donde las peleas no duran mucho tiempo',
      'El tatwa Apas obra concentrando, buen momento de iniciar negocios, depositos de dinero o hacer especulaciones. Tatwa de la riqueza y opulencia',
      'Tatwa del amor sexual y concepcion en el vientre de la madre. Tatwas que influencia al amor',
      'Este momento trae paz, alegria, juego, gozo, baile y placeres de todas las clases'
    ]
  }
]

function getState(sunriseTime: Date, actualTime: Date) {
	let state = 0
	while (sunriseTime < actualTime) {
		state += 1
		if (state == 6) {
		state = 1
		}
		sunriseTime.setMinutes(sunriseTime.getMinutes() + 24)
	}
	return state - 1 // Adjusting to 0-based index for our states array
}

export default function ElementStateVisualizer() {
  	const [currentState, setCurrentState] = useState(0);
	const [currentCountry, setCurrentCountry] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		const updateState = () => {
			navigator.geolocation.getCurrentPosition((position) => {
				let lat = position.coords.latitude;
				let lon = position.coords.longitude;

				const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0e1414393ec8b28124eff5028e775326&units=metric`
			
				fetch(apiUrl)
					.then(response => {
						if (response.ok) {
							return response.json();
						} else {
							return Promise.reject(response);
						}
					})
					.then(data => {
						const sunriseUnixTime = data.sys.sunrise;
						const sunriseTime = new Date(sunriseUnixTime * 1000);
						const actualTime = new Date();

						const newState = getState(sunriseTime, actualTime);
						setCurrentState(newState);
						setCurrentCountry(data.sys.country);
					})
					.catch(error => {
						setError(error.message);
					})
			});
		}

	// updateState() // Initial update
    // const timer = setInterval(updateState, 60000) // Update every minute

    // return () => clearInterval(timer)


    return () => updateState()
  }, [])

  	const state = states[currentState]

  	// si algo sale mal al llamar a la api
  	if (error) {
		return (
			<div className={`w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-1000 ${state.background}`}>
				<p className="text-3xl sm:text-4xl mb-6 sm:mb-8 text-white">Something went wrong. Try refreshing the page.</p>
				Details: {error}
			</div>
		)
	} else {
		return (
			<div className={`w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-1000 ${state.background}`}>
				<h5 className="text-3xl sm:text-4xl mb-6 sm:mb-8 text-white">You are in: {currentCountry}</h5>
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-white">{state.name}</h1>
				<div className="flex flex-col space-y-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
					{state.descriptions.map((description, index) => (
						<div
							key={index}
							className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-3 sm:p-4 text-sm sm:text-base text-white shadow-lg transition-all duration-500 hover:scale-105">
							{description}
						</div>
					))}
				</div>
			</div>
		)
	}
}