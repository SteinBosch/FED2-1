var app = app || {};

(function() {
	app.controller = {
		init: function() {
			console.log('called init');
			app.gps.init();
		}
	}

	app.gps = {
		init: function() {
			console.log("called init gps");
			this.index();
		},
		index: function() {
			console.log("called index gps");	
		}
	}

	app.debug = {

	}

	app.controller.init();

})();