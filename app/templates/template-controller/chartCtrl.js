//console.log('FROM CHART CONTROLLER', app);
app.controller('summaryCtrl', ['$scope', function($scope){
	
}]);

app.controller('panel1Ctrl', ['$scope', 'ConfigService', 'APP_CONSTANT', function($scope,ConfigService, APP_CONSTANT){

	console.log('PANEL 1 CONTROLLER');
  
  $scope.panelTitle ="Untitled";
  $scope.panelId = "panel1";
  $scope.panelData = null;




  $scope.$on(APP_CONSTANT.PANEL.CONFIG_LOADED, function(event, panelData){
  	console.log('DATA_LOADED', panelData);
  	if($scope.panelId !== panelData.id) return;

  	$scope.id =panelData.id;
  	$scope.panelData = panelData;
  })

  $scope.$on(APP_CONSTANT.PANEL.CHART_TYPE_CHANGED, function(event, selectedChart){
  	if($scope.panelId !== selectedChart.id) return;

  	console.log('PANEL 1 CHANGE CHART');

  	$scope.options = selectedChart.config;
  	$scope.data = selectedChart.data;

  })

  $scope.$on(APP_CONSTANT.PANEL.CONFIG_CHANGED, function(event, panelData){
  	if($scope.panelId !== panelData.id) return;
  	$scope.panelTitle = panelData.title;
  	console.log('PANEL DATA', panelData);
  	$scope.options.chart.xAxis.axisLabel = panelData.chart.xAxis.axisLabel;
  	$scope.options.chart.yAxis.axisLabel = panelData.chart.yAxis.axisLabel;

	//$scope.api.refresh();
  })

  //$scope.run = true;

  $scope.$on(APP_CONSTANT.PANEL.APPLY_DATA, function(event, val){
    if($scope.panelId !== val.id) return;

    console.log('DATA RECEIVED', val);
    var xField = val.xField.name;
    var yField = val.yField.name;

    $scope.options.chart.x = function(d){
      console.log('X Label', xField, " : ", yField, " : ",  d);
      return d[xField];
    }

    $scope.options.chart.y = function(d){
      return d[yField];
    }


    $scope.api.updateWithOptions($scope.options);
    $scope.api.updateWithData([{values:val.data, "key":xField}]);

    //$scope.data = [{values:val.data}];

    
    
    
  })

}]);

app.controller('panel2Ctrl', ['$scope', 'ConfigService', 'APP_CONSTANT', function($scope,ConfigService, APP_CONSTANT){

	console.log('PANEL 2 CONTROLLER');
  
  $scope.panelTitle ="Untitled";
  $scope.panelId = "panel2";
  $scope.panelData = null;

  $scope.$on(APP_CONSTANT.PANEL.CONFIG_LOADED, function(event, panelData){
  	console.log('DATA_LOADED', panelData);
  	if($scope.panelId !== panelData.id) return;

  	$scope.id =panelData.id;
  	$scope.panelData = panelData;
  })

  $scope.$on(APP_CONSTANT.PANEL.CHART_TYPE_CHANGED, function(event, selectedChart){
  	if($scope.panelId !== selectedChart.id) return;

  	console.log('PANEL 2 CHANGE CHART');
  	$scope.options = selectedChart.config;
  	$scope.data = selectedChart.data;

  })

  $scope.$on(APP_CONSTANT.PANEL.TITLE_CHANGED, function(event, panelData){
  	if($scope.panelId !== panelData.id) return;
  	$scope.panelTitle = panelData.title;
  })

  $scope.$on(APP_CONSTANT.PANEL.APPLY_DATA, function(event, val){
    if($scope.panelId !== val.id) return;

    console.log('DATA RECEIVED', val);
    var xField = val.xField.name;
    var yField = val.yField.name;

    $scope.options.chart.x = function(d){
      console.log('X Label', xField, " : ", yField, " : ",  d);
      return d[xField];
    }

    $scope.options.chart.y = function(d){
      return d[yField];
    }


    $scope.api.updateWithOptions($scope.options);
    $scope.api.updateWithData([{values:val.data, "key":xField}]);

    //$scope.data = [{values:val.data}];

    
    
    
  })

}]);

app.controller('panel3Ctrl', ['$scope', 'ConfigService', 'APP_CONSTANT', function($scope,ConfigService, APP_CONSTANT){

	console.log('PANEL 3 CONTROLLER');
  
  $scope.panelTitle ="Untitled";
  $scope.panelId = "panel3";
  $scope.panelData = null;

  $scope.$on(APP_CONSTANT.PANEL.CONFIG_LOADED, function(event, panelData){
  	console.log('DATA_LOADED', panelData);
  	if($scope.panelId !== panelData.id) return;

  	$scope.id =panelData.id;
  	$scope.panelData = panelData;
  })

  $scope.$on(APP_CONSTANT.PANEL.CHART_TYPE_CHANGED, function(event, selectedChart){
  	if($scope.panelId !== selectedChart.id) return;

  	console.log('PANEL 3 CHANGE CHART');
  	$scope.options = selectedChart.config;
  	$scope.data = selectedChart.data;

  })

  $scope.$on(APP_CONSTANT.PANEL.TITLE_CHANGED, function(event, panelData){
  	if($scope.panelId !== panelData.id) return;
	$scope.panelTitle = panelData.title;
  })

  $scope.$on(APP_CONSTANT.PANEL.APPLY_DATA, function(event, val){
    if($scope.panelId !== val.id) return;

    console.log('DATA RECEIVED', val);
    var xField = val.xField.name;
    var yField = val.yField.name;

    $scope.options.chart.x = function(d){
      console.log('X Label', xField, " : ", yField, " : ",  d);
      return d[xField];
    }

    $scope.options.chart.y = function(d){
      return d[yField];
    }


    $scope.api.updateWithOptions($scope.options);
    $scope.api.updateWithData([{values:val.data, "key":xField}]);

    //$scope.data = [{values:val.data}];

    
    
    
  })

}]);