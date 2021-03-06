
var app = angular.module("CubeSatApp", []);
var url = "zacube.php";

app.controller("CubeSatCtrl", function($scope, $http, $timeout) {


  // Function to get the data
  $scope.getData = function(){

    if($scope.zacube && $scope.zacube.loadingData===true)
      return;

    $scope.zacube = {};
    $scope.zacube.loadingData = true;

    $http.get(url).
      success(function(data, status, headers, config) {
        $scope.zacube = data;
        $scope.zacube.loadingData = false;
      }).
      error(function(data, status, headers, config) {
      });;
  };

  $scope.updateApp = function(){
  
    //test if data exists
    
    if (typeof($scope.zacube)==="undefined" ||
        typeof($scope.zacube.current_time)==="undefined")
    {
      $scope.getData();
      return;
    }

    if (typeof($scope._current_time)!=="object"){
      $scope._current_time = moment($scope.zacube.current_time);
      $scope._endofpass = moment($scope.zacube.pass_ends);
      $scope._startofpass = moment($scope.zacube.next_pass);
      $scope._nextpassstarts = moment($scope.zacube.upcoming_start);
    }
    
    $scope._current_time.add(1, 's')
    $scope.zacube.current_time_nice = $scope._current_time.format('YYYY-MM-DD HH:mm:ss');
    
    $scope.zacube.endofpass_nice = moment.preciseDiff($scope._endofpass, $scope.zacube._current_time);
    $scope.zacube.startofpass_nice = moment.preciseDiff($scope._startofpass, $scope.zacube._current_time); // Need to check if -ive and ad the word "ago" to the output
    $scope.zacube.nextpassstarts_nice = moment.preciseDiff($scope._nextpassstarts, $scope.zacube._current_time);

    if(!moment($scope._current_time).isBefore($scope._nextpassstarts))
      $scope.getData();

  };

  // Function to replicate setInterval using $timeout service.
  $scope.intervalFunction = function(){
    $timeout(function() {
      $scope.updateApp();
      $scope.intervalFunction();
    }, 1000)
  };

  // Kick off the interval
  $scope.intervalFunction();

});