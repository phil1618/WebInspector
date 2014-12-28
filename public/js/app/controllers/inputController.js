app.controller('inputController', ['$rootScope', '$scope','$log','RemotePython',
	function($rootScope ,$scope, $log, RemotePython){

		//---------------------------------------------------------------------
		//	jQuery and display methods
		//---------------------------------------------------------------------
		var panelId = ['href', 'script', 'meta'];

		setPanelClick = function(str){ 
			$('#' + str + '_panel_header').click(function(){
				if($('#' + str + '_panel_content').is(":visible")){
					$('#' + str + '_panel_content').fadeOut('slow');
				} else {
					$('#' + str + '_panel_content').fadeIn('slow');
				}
			});
		}

		initContentClick = function(){
			for(i = 0; i < panelId.length; i++){
				setPanelClick(panelId[i]);
			}
		}

		initContentVisibility = function(){
			for(i = 0; i < panelId.length; i++){
				$('#' + panelId[i] + '_panel').hide();
				$('#' + panelId[i] + '_panel_content').hide();
			}
		}

		resetContent = function(){
			initContentVisibility();
			if($scope.AllLinks != null) $scope.AllLinks = [];
			if($scope.AllScripts != null) $scope.AllScripts = [];
			if($scope.AllMetas != null) $scope.AllMetas = [];
			if($scope.linkNumber != null) $scope.linkNumber = null;
			if($scope.scriptNumber != null) $scope.scriptNumber = null;
			if($scope.metaNumber != null) $scope.metaNumber = null;
		}

		initContentVisibility();
		initContentClick();

		//---------------------------------------------------------------------
		//	Core methods
		//---------------------------------------------------------------------
		var target = $scope.urlTarget;

		$scope.submitUrl = function(target){
			$log.log('Submit button hit with url : ' + target);

			resetContent();

			RemotePython.getInfo(target).then(function(results){
				$log.log(results);
				if (results.message == 'OK'){
					// Links
					if(results.links.length != 0){
						$scope.AllLinks = results.links;
						$scope.linkNumber = results.links.length;
						$('#href_panel').hide().fadeIn('slow');
					}
					
					// Scripts
					if(results.scripts.length != 0){
						$scope.AllScripts = results.scripts;
						$scope.scriptNumber = results.scripts.length;
						$('#script_panel').hide().fadeIn('slow');
					}
					// Metadata
					var metaObj = $.parseJSON(results.meta);
					var keys = Object.getOwnPropertyNames(metaObj);
					var metaData = [];
					if (keys.length != 0){
						for(idx = 0; idx < keys.length; idx++){
							metaData[idx] = {
								name: formatMetaName(keys[idx]),
								content: (metaObj[keys[idx]] != '') ? metaObj[keys[idx]] : 'None'
							}
						}
						$('#meta_panel').hide().fadeIn('slow');
					}
					$scope.AllMetas = metaData;
					$scope.metaNumber = keys.length;
				}
			});
		}
		
		//---------------------------------------------------------------------
		//	Various formating methods
		//---------------------------------------------------------------------
		formatMetaName = function(str){
			if(str && str != ''){
				return str.charAt(0).toUpperCase() + str.toLowerCase().substr(1, str.length);
			}
			return '';
		}
	}
]);