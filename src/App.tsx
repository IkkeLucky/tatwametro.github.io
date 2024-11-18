'use client'

import { useState, useEffect } from 'react'

const states = [
	{
		name: 'Akash1',
		background: 'bg-gradient-to-b from-gray-900 via-purple-900 to-violet-800', 
		descriptions: [
		'Flames dance and flicker Flames dance and flicker Flames dance and flicker Flames dance and flicker Flames dance and flicker Flames dance and flicker Flames dance and flicker',
		'Heat radiates intensely Flames dance and flicker Flames dance and flicker vFlames dance and flicker Flames dance and flicker',
		'Sparks fly through the air Flames dance and flickerFlames dance and flickerFlames dance and flicker',
		'The world is bathed in a warm glow Flames dance and flickerFlames dance and flickerFlames dance and flicker'
		]
	},
	{
		name: 'Vayu2',
		background: 'bg-gradient-to-b from-blue-600 via-blue-400 to-cyan-300',
		descriptions: [
			'Waves crash and recede',
			'A cool mist fills the air',
			'Ripples spread across still surfaces',
			'The sound of flowing water echoes'
		]
	},
	{
		name: 'Tejas3',
		background: 'bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400',
		descriptions: [
			'The ground feels solid and stable',
			'Plants and trees sway gently',
			'Rich soil nurtures life',
			'Mountains stand tall and immovable'
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
			'Shadows deepen and spread',
			'The world is shrouded in mystery',
			'Stars twinkle in the vast expanse',
			'A calm silence envelops everything'
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