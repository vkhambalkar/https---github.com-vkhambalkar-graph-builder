var app = angular.module('app', ['nvd3', 'ui.grid', 'ui.grid.selection', 'ui.bootstrap', 'dialogs.main']);

app.controller('appController', ['$rootScope', '$scope', '$http', 'dialogs', 'APP_CONSTANT','chartTypeFactory', 'AppModelService',
  function($rootScope, $scope, $http, dialogs,APP_CONSTANT, chartTypeFactory,AppModelService){
  console.log('CONTRLLER INITIATED');
  $scope.selectedTemplate = null;
  $scope.showToolbar= false;
  $scope.config = null;
  

  //dialogs.error('Error','An unknown error occurred preventing the completion of the requested action.');

 $scope.openToolbox = function(){
    var dlg = dialogs.create('/templates/config.html','ChartToolBarModalController',{},{key: false,back: 'static'});
        dlg.result.then(function(name){
          $scope.name = name;
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
 }


  

  


  

  $http.get("data/config.json").then(function(response){
    $scope.config = response.data;
    console.log('CONFIG LOADED', $scope.config);
    var components = $scope.config.components;

    _.forEach(components, function(val, key){
      $rootScope.$broadcast(APP_CONSTANT.PANEL.CONFIG_LOADED, val)
    })
  },
  function(error){
    console.log('ERROR', error);
  })

  $scope.chartTypes = [
    {"title":"Line Chart", "type":"lineChart"},
    {"title":"Bar Chart", "type":"barChart"},
    {"title":"Pie Chart", "type":"pieChart"}
  ];

  $scope.chartTypes = chartTypeFactory;

  $scope.templates = [
    {"name":"Grid with 3 Charts", "file":"templates/template1.html"},
    {"name":"Grid with 2 Charts", "file":"templates/template2.html"},
    {"name":"Chart 1", "file":"templates/template3.html"}
  ];

  $scope.loadTemplate = function(template){
    $scope.selectedTemplate = template;
  }

  $scope.getSelectedTemplate = function(){
    console.log('SELECTED TEMPLATE', $scope.selectedTemplate.file);
    return $scope.selectedTemplate.file;
  }

  
  $scope.$on('$includeContentLoaded', function(){

    console.log('TEMPLATE LOADED', arguments);
    
    $scope.showToolbar = true;

    $scope.selectedPanel = {};

    var components = $scope.config.components;

    //console.log('PANEL 1 CONTROLLER');
    //console.log(components);

    //provide the config to new loaded template
    _.forEach(components, function(val, key){
      //console.log('PANEL 1 CONTROLLER');
      console.log(val);
      $rootScope.$broadcast(APP_CONSTANT.PANEL.CONFIG_LOADED, val)
    })

  });

  //will save configuration to localStorage
  $scope.save = function(){

  }
  
  //from template when panel header clicked as scope shared across entire application
  // panel selected,
  //we will display panel information accordigly
  //
  $scope.onPanelSelect = function(val){
    console.log('PANEL SELECTED', val);


    $scope.selectedPanel = val;
    $scope.selectedPanel.chart = {
        "xAxis":{
        "axisLabel":""
      },
        "yAxis":{
        "axisLabel":""
      }
    }

    AppModelService.setPanel ($scope.selectedPanel);

    $scope.openToolbox();
  } 

  $scope.selectedPanel = {
    "title":"Untitled"
  };

  

}])

app.service("AppModelService", function(){
  var selectedPanel
  this.setPanel = function(val){
    selectedPanel = val;
  }
  this.getPanel = function(){
    return selectedPanel;
  }
})

app.controller('ChartToolBarModalController',function($rootScope, $scope,$modalInstance,$http, data, chartTypeFactory, APP_CONSTANT,AppModelService){
  $scope.selectedSource = {"selectedSource":"", "xField":"", "yField":""};
  $scope.api = {};
  $scope.sources = [
    {
      "source":"data1.json", 
      "name" :"Country",
      "cols" :[
        {"name":"countryCode", "type":"string"},
        {"name":"countryName", "type":"string"},
        {"name":"population", "type":"number"}
      ],
      "data":[]
    },
    {
      "source":"data2.json", 
      "name" :"Salary By Designation",
      "cols" :[
        {"name":"designation", "type":"string"},
        {"name":"salary", "type":"string"}
      ],
      "data":[]
    }
  ];

  $scope.onChartSelect = function(val){
    console.log('SELECTED CHART', val);

    var selectedPanel =  AppModelService.getPanel ();

    $scope.options = val.config;
    $scope.data = val.data;

    //val.id = selectedPanel.id;
    //$rootScope.$broadcast(APP_CONSTANT.PANEL.CHART_TYPE_CHANGED, val)

    $scope.api.updateWithOptions($scope.options);
  }


  $scope.user = {name : ''};

  $scope.chartTypes = [
    {"title":"Line Chart", "type":"lineChart"},
    {"title":"Bar Chart", "type":"barChart"},
    {"title":"Pie Chart", "type":"pieChart"}
  ];

  $scope.chartTypes = chartTypeFactory;

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user.name);
  }; // end save
  
  $scope.hitEnter = function(evt){
    if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.name,null) || angular.equals($scope.name,'')))
        $scope.save();
  }; // end hitEnter

  $scope.applyNewDataSource = function(){
    console.log('APPLY DATA CLICKED');

     var selectedPanel =  AppModelService.getPanel ();

     $scope.selectedSource.id = selectedPanel.id;

     $rootScope.$broadcast(APP_CONSTANT.PANEL.APPLY_DATA, $scope.selectedSource)
  };

  //$scope.applyData();

  $scope.onSourceChanged = function(){
    console.log('SOURCE', $scope.selectedSource);

    $http.get("data/"+$scope.selectedSource.source).then(function(response){
      var data = response.data;
      if(data instanceof Array && data.length > 0){
        $scope.selectedSource.data = data;

        console.log('DATA LOADED', $scope.sources);
      }
    },
    function(error){

    });
  }

  $http.get("data/data1.json").then(function(response){
    var data = response.data;
    if(data instanceof Array && data.length > 0){
      $scope.sources[0].data = data;

      console.log('DATA LOADED', $scope.sources);
    }
  },
  function(error){

  });

  $scope.onPanelTitleChange = function(){
    $rootScope.$broadcast(APP_CONSTANT.PANEL.CONFIG_CHANGED, $scope.selectedPanel);
  }

  $scope.applyData = function(){

  }

}) // end whatsYourNameCtrl

app.factory('ConfigService', [function(){
  var configVal = {};
  setConfig = function(){
    configVal = val;
  };

  getConfig = function(){
    return configVal;
  }

  getConfigById = function(id){
    var components = val.components;

    var comp = _.find(components, {"id":id});

    return comp;
  }

  return {
    setConfig:setConfig,
    getConfig:getConfig
  };
}])

app.factory('api',['$http', '$q', function($http,$q) {
  var api = {};

  api.getData = function(){
    defer = $q.defer();

    $http({
      method: 'GET',
      url: '/data/static.json'
        }).then(function(response) {
        
        defer.resolve(response.data)
      }, function (error) {
        
        defer.reject(error)
      });

    return defer.promise;
  }
  // factory function body that constructs shinyNewServiceInstance
  return api;
}]);
app.constant('APP_CONSTANT', {
 "SUMMARY" : {
    "ROW_SELECTION" : "SUMMARY:ROW_SELECTION"
 },
 "LOGIN":{
    "SUCCESS":"LOGIN:SUCCESS",
    "FAILED":"LOGIN:FAILED"
 },
 "CHART_TYPE":{
    "CHART_TYPE_CHANGED":"CHART_TYPE:CHART_CHANGED"
 },
 "PANEL":{
    "TITLE_CHANGED" :"PANEL:TITLE_CHANGED",
    "CONFIG_LOADED" :"PANEL:CONFIG_LOADED",
    "CHART_TYPE_CHANGED":"PANEL:CHART_TYPE_CHANGED",
    "CONFIG_CHANGED":"PANEL:CONFIG_CHANGED",
    "APPLY_DATA":"PANEL:APPLY_DATA"
 },
 "PANEL1":{
    "TITLE_CHANGED" :"PANEL1:TITLE_CHANGED",
    "CONFIG_LOADED" :"PANEL1:CONFIG_LOADED"
 },
 "PANEL2":{
    "TITLE_CHANGED" :"PANEL2:TITLE_CHANGED",
    "CONFIG_LOADED" :"PANEL2:CONFIG_LOADED"
 },
 "PANEL3":{
    "TITLE_CHANGED" :"PANEL3:TITLE_CHANGED",
    "CONFIG_LOADED" :"PANEL3:CONFIG_LOADED"
 }
})
app.controller('MainCtrl', ['$rootScope','$scope','api', '$log','APP_CONSTANT', function ($rootScope, $scope,api,$log, APP_CONSTANT) {
    $scope.showSummaryGrid = false;

    $rootScope.$on(APP_CONSTANT.LOGIN.SUCCESS,  function(event, data){
        $scope.showSummaryGrid = true;
    })
    $scope.gridOptions1 = {
         showFooter: true,
        enableSorting: true,
        multiSelect: false,
        enableFiltering: true,     
        enableRowSelection: true, 
        enableSelectAll: false,
        enableRowHeaderSelection: false,
        selectionRowHeaderWidth: 35,  
        noUnselect: true,
        enableGridMenu: true,
        
        data:[],
        columnDefs: [
          { field: 'engineName' },
          { field: 'lastRun' },
          { field: 'users' },
          { field: 'connections'}
        ],
        onRegisterApi: function( gridApi ) {
          $scope.grid1Api = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
            var msg = 'row selected ' + row.isSelected;
            $log.log(row);

            $rootScope.$broadcast(APP_CONSTANT.SUMMARY.ROW_SELECTION, row.entity.engines)
          });
        }
      };

    api.getData().then(function(response){
        console.log('RESPONSE', response);
        $scope.gridOptions1.data = response;
    });


  
  
  
  
}]);

app.controller('DrilldownCtrl', ['$rootScope','$scope', 'APP_CONSTANT', function ($rootScope, $scope,APP_CONSTANT) {
    $scope.displayDrilldownGrid = false;
    $scope.drillDownGridOptions = {
        showFooter: true,
        enableSorting: true,
        multiSelect: false,
        enableFiltering: true,     
        enableRowSelection: true, 
        enableSelectAll: false,
        enableRowHeaderSelection: false,
        selectionRowHeaderWidth: 35,  
        noUnselect: true,
        enableGridMenu: true,
        
        data:[],
        columnDefs: [
          { field: 'id', displayName:'ID' },
          { field: 'engineName', displayName:"Engine Name" },
          { field: 'exchange',displayName:"Exchange"},
          { field: 'ip', displayName:"IP" },
          { field: 'port',displayName:"Port"}
        ]
      };
    $rootScope.$on(APP_CONSTANT.SUMMARY.ROW_SELECTION, function(event, data){
        console.log('ROW CLICKED', data);
        if($scope.displayDrilldownGrid == false){
            $scope.displayDrilldownGrid = true;
        }
        $scope.drillDownGridOptions.data = data;
    })
    

}]);

app.controller('loginController', ['$rootScope','$scope', 'APP_CONSTANT', function ($rootScope, $scope,APP_CONSTANT) {
    $scope.user = {"userName":"", "password":""}
    $scope.showLogin = true;
    $scope.login = function(){
        console.log('LOGIN',$scope.user);
        if($scope.user.userName =="vijay" && $scope.user.password == "vijay"){
            $rootScope.$broadcast(APP_CONSTANT.LOGIN.SUCCESS, "success");
            $scope.showLogin = false;
        }
        
    }

}]);
