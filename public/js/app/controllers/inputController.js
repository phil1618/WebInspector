app.controller('inputController', ['$rootScope', '$scope','$log','RemotePython',
	function($rootScope ,$scope, $log, RemotePython){
		// Set up visibility
		$scope.showAllLinks = false;

		var target = $scope.urlTarget;
		$scope.submitUrl = function(target){
			$log.log('Submit button hit with url : ' + target);
			var search = RemotePython.postTarget(target).then(function(results){
				$log.log(results);
				if (results.length != 0){
					$log.log(results.length);
					$scope.AllLinks = results;
					$log.log($scope.AllLinks);
					$scope.showAllLinks = true;
				}
			});
			
		}
	}
]);