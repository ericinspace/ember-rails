// import ES6 module that starts our app
import startApp from 'ember-rails/tests/helpers/start-app';

var App, server;

// declare a QUnit test module for the speakers page
module('Integration - Speaker Page', {
	setup: function() {
		App = startApp();
		var speakers = [
			{
				id: 1,
				name: 'Bobbum Man'	
			},
			{
				id: 2,
				name: 'Edward Scissorhands'
			},
			{
				id: 3,
				name: 'Edward Scissorhands'
			},
		];

		server = new Pretender(function() {
			this.get('/api/speakers', function(request) {
				return [200, {"Content-Type": "application/json"}, JSON.stringify({speakers: speakers})];
			});

			this.get('/api/speakers/:id', function(request) {
				var speaker = speakers.find(function(speaker) {
					if (speaker.id === parseInt(request.params.id, 10)) {
						return speaker;
					}
				});

				return [200, {"Content-Type": "application/json"}, JSON.stringify({speaker: speaker})];
			});
		});
	},
	
	teardown: function() {
		Ember.run(App, 'destroy');
		server.shutdown();
	}
});

test('Should allow navigation to the speakers page from the landing page', function() {
	visit('/').then(function(){
		click('a:contains("Speakers")').then(function() {
			equal(find('h3').text(), 'Speakers');
		});
	});
});

test('Should list all speakers', function() {
	visit('/').then(function(){
		click('a:contains("Speakers")').then(function() {
			equal(find('h3').text(), 'Speakers');
		});
	});
});
