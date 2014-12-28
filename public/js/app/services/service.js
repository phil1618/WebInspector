var services = angular.module('mainApp.services', ['ngResource']);

// Define News model, fetched from the server
services.factory('RemotePython', ['$http', 
	function($http){
		var baseUrl = 'http://localhost:8080/pytest';
		
		return {
			getInfo: function(target){
				return $http.post('http://localhost:8080/python/htmlparser', {url : target}).then(function(results){
					return results.data;
				});
			}
		};
	}
]);