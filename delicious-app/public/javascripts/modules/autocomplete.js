function autocomplete(input, laInput, lngInput) {
	if (!input) return; // skip this fn from running

	console.log('input');

	const dropdown = new google.maps.places.Autocomplete(input);

	dropdown.addListener('place_changed', () => {
		const place = dropdown.getPlace();
		console.log(place);
		latInput.value = place.geometry.location.lat();
		lngInput.value = place.geometry.location.lng();

	});

	// if someone hits enter in the address field, dont submit the form
	input.on('keydown', (e) => {
		if (e.keyCode === 13) e.preventDefault();
	});
}

export default autocomplete;