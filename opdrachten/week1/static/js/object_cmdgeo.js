var Maps = function() {
	this.SANDBOX = "SANDBOX";
	this.LINEAIR = "LINEAIR";
	this.GPS_AVAILABLE = 'GPS_AVAILABLE';
	this.GPS_UNAVAILABLE = 'GPS_UNAVAILABLE';
	this.POSITION_UPDATED = 'POSITION_UPDATED';
	this.REFRESH_RATE = 1000;
	this.currentPosition = this.currentPositionMarker = this.customDebugging = this.debugId = this.map = this.interval = this.intervalCounter = this.updateMap = false;
	this.locatieRij = this.markerRij = [];
	this.init();
}

// Maps.prototype.EventTarget = function() {

// }

Maps.prototype.init = function() {
	self = this;
	debug_message("Controleer of GPS beschikbaar is...");

    ET.addListener(GPS_AVAILABLE, start_interval);
    ET.addListener(GPS_UNAVAILABLE, function(){debug_message('GPS is niet beschikbaar.')});

    (geo_position_js.init())?ET.fire(GPS_AVAILABLE):ET.fire(GPS_UNAVAILABLE);
}

Maps.prototype.start_interval = function(event) {
	intervalCounter++;
    geo_position_js.getCurrentPosition(_set_position, _geo_error_handler, {enableHighAccuracy:true});
}

Maps.prototype.set_position = function(position) {
	currentPosition = position;
    ET.fire("POSITION_UPDATED");
    debug_message(intervalCounter+" positie lat:"+position.coords.latitude+" long:"+position.coords.longitude);
}

Maps.prototype.check_locations = function(event) {
	// Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
    for (var i = 0; i < locaties.length; i++) {
        var locatie = {coords:{latitude: locaties[i][3],longitude: locaties[i][4]}};

        if(_calculate_distance(locatie, currentPosition)<locaties[i][2]){

            // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
            if(window.location!=locaties[i][1] && localStorage[locaties[i][0]]=="false"){
                // Probeer local storage, als die bestaat incrementeer de locatie
                try {
                    (localStorage[locaties[i][0]]=="false")?localStorage[locaties[i][0]]=1:localStorage[locaties[i][0]]++;
                } catch(error) {
                    debug_message("Localstorage kan niet aangesproken worden: "+error);
                }

// TODO: Animeer de betreffende marker

                window.location = locaties[i][1];
                debug_message("Speler is binnen een straal van "+ locaties[i][2] +" meter van "+locaties[i][0]);
            }
        }
    }
}

Maps.prototype.calculate_distance = function(p1,p2) {
	var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
    var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
}

Maps.prototype.generate_map = function(myOptions, canvasId) {
// TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
    debug_message("Genereer een Google Maps kaart en toon deze in #"+canvasId)
    map = new google.maps.Map(document.getElementById(canvasId), myOptions);

    var routeList = [];
    // Voeg de markers toe aan de map afhankelijk van het tourtype
    debug_message("Locaties intekenen, tourtype is: "+tourType);
    for (var i = 0; i < locaties.length; i++) {

        // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
        try {
            (localStorage.visited==undefined||isNumber(localStorage.visited))?localStorage[locaties[i][0]]=false:null;
        } catch (error) {
            debug_message("Localstorage kan niet aangesproken worden: "+error);
        }

        var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
        routeList.push(markerLatLng);

        markerRij[i] = {};
        for (var attr in locatieMarker) {
            markerRij[i][attr] = locatieMarker[attr];
        }
        markerRij[i].scale = locaties[i][2]/3;

        var marker = new google.maps.Marker({
            position: markerLatLng,
            map: map,
            icon: markerRij[i],
            title: locaties[i][0]
        });
    }
// TODO: Kleur aanpassen op het huidige punt van de tour
    if(tourType == LINEAIR){
        // Trek lijnen tussen de punten
        debug_message("Route intekenen");
        var route = new google.maps.Polyline({
            clickable: false,
            map: map,
            path: routeList,
            strokeColor: 'Black',
            strokeOpacity: .6,
            strokeWeight: 3
        });

    }

    // Voeg de locatie van de persoon door
    currentPositionMarker = new google.maps.Marker({
        position: kaartOpties.center,
        map: map,
        icon: positieMarker,
        title: 'U bevindt zich hier'
    });

    // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
    ET.addListener(POSITION_UPDATED, update_positie);
}

Maps.prototype.isNumber = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

Maps.prototype.update_positie = function(event) {
	// use currentPosition to center the map
    var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
    map.setCenter(newPos);
    currentPositionMarker.setPosition(newPos);
}

Maps.prototype.geo_error_handler = function(code, message {
	debug_message('geo.js error '+code+': '+message);
}

Maps.prototype.debug_message = function(message) {
	(customDebugging && debugId)?document.getElementById(debugId).innerHTML:console.log(message);
}

Maps.prototype.set_custom_debugging = function(debugId) {
	debugId = this.debugId;
    customDebugging = true;
}