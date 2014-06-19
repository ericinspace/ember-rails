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
				name: 'Zeke the Plumber'
			},
		];

		var presentations = [
			{ id: 1, title: 'How to eat a pizza: the New York way', speaker_id: 2 }
			{ id: 2, title: 'Tacos: The all-American Food', speaker_id: 1 }
			{ id: 3, title: 'Racism in the post-Shrek generation', speaker_id: 3 }
			{ id: 4, title: 'Self Congratulation and the Giant Peach', speaker_id: 2 }
			{ id: 5, title: 'Tim Berners Lee and the Utopian Vision of a Cat-less Internet', speaker_id: 1 }
			{ id: 6, title: '4Chan: There is no signal, it\'s all Noise', speaker_id: 3 }
			{ id: 7, title: 'Fuck You', speaker_id: 1 }
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

				

				return [200, {"Content-Type": "application/json"}, JSON.stringify({speaker: speaker, presentations: speakerPresentations})];
			});
		});
	},

	teardown: function() {
		Ember.run(App, 'destroy');
		server.shutdown();
	}
});

// declare your tests
test('Should allow navigation to the speakers page from the landing page', function() {
	visit('/').then(function(){
		click('a:contains("Speakers")').then(function() {
			equal(find('h3').text(), 'Speakers');
		});
	});
});

test('Should list all speakers and number of presentations', function() {
	visit('/speakers').then(function() {
		equal(find('a:contains("Bobbum Man (2)")').length, 1);
		equal(find('a:contains("Edward Scissorhands (1)")').length, 1);
		equal(find('a:contains("Zeke the Plumber (3)")').length, 1);
	});
});

test('Should allow navigation to a speaker page', function(){
	visit('/speakers').then(function() {
		click('a:contains("Bobbum Man")').then(function() {
			equal(find('h4').text(), 'Bobbum Man');
		});
	});
});

test('Should allow visiting a speaker page directly', function() {
	visit('/speakers/1').then(function() {
		equal(find('h4').text(), 'Bobbum Man');
	});
});
