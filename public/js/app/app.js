var app = angular.module('mainApp', ['ngRoute', 'ngSanitize', 'mainApp.services']);

// ROUTER IMPLEMENTATION
app.
config(['$routeProvider', function($routeProvider){
	$routeProvider.
	// Basic routes
		when('/', { 
			templateUrl: 'js/templates/index.html',
			controller: 'inputController'
		});
}]);