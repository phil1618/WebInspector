var services = angular.module('mainApp.services', ['ngResource']);

// Define News model, fetched from the server
services.factory('RemotePython', ['$http', 
	function($http){
		var baseUrl = 'http://localhost:8080/pytest';
		
		return {
			postTarget: function(target){
				return $http.post(baseUrl, {url : target} ).then(function(results){
					return results.data;
				});
			}
		};
	}
]);