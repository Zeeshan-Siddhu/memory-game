(function(){
  var app = angular.module('memory_game', ['ngRoute', 'ngDialog']);

  angular.module('memory_game').directive('controls', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    link:    function postLink(scope, iElement, iAttrs){
      jQuery(document).on('keydown', function(e){
         scope.$apply(scope.keyDown(e));
       });
    }
  };
});


  /*
   * Routing engine for the app.
   * Defines views and their respective controllers based on current url location.
   * All pages and their respective controllers must be defined here and not in views.
  */
  angular.module('memory_game').config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/load_game', {
        templateUrl: '/partials/load_game.html',
        controller: 'GameCtrl'
      })
  }]);


  angular.module('memory_game').config(['ngDialogProvider', function (ngDialogProvider) {
      ngDialogProvider.setDefaults({
          className: 'ngdialog-theme-default',
          showClose: false,
          closeByDocument: false,
          closeByEscape: false
      });
  }]);

  /* 
   * Set Default headers for ajax requests.
   * Angular httpProvider will send all requests using these headers
  */
  angular.module('memory_game').config(["$httpProvider", function(provider){
    provider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    provider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
    provider.defaults.headers.patch["Content-Type"] = "application/x-www-form-urlencoded";
    provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  }]);


  angular.module('memory_game').controller('GameCtrl', function($scope, ngDialog, $http, $route) {

    $scope.highScores      = [];
    $scope.ranking         = 0;
    $scope.userMaxScore    = 0;


    $scope.resetGame = function(){
       window.location.reload();
    }

    $scope.openGetInfoDialog  = function(){
      $(document).off("keydown");
      ngDialog.open({ template: 'get-info.html',
          disableAnimation: true, scope: $scope });
    }

    $scope.showHighScoresAndRanking = function(){
      ngDialog.open({ template: 'show-high-scores.html', showClose: true,
          closeByEscape: true,
          scope: $scope });
    }


    $scope.sendScoreToServer = function(userName, userEmail){
      request = $http({
        url: '/games/add_score_and_get_rankings.json',
        dataType: "json",
        data: "user_name=" + userName + "&email=" + userEmail + "&score=" + $scope.score,
        method: 'POST'
      });

      request.success(function(data){
        $scope.highScores   = data.scores;
        $scope.ranking      = data.ranking;
        $scope.userMaxScore = data.user_max_score;
        ngDialog.closeAll();
        $scope.showHighScoresAndRanking();

      });  
    }

    $scope.doShuffle = function(array){
        for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
        return array;
    }

    //extend array class to add Convert to 2D array 
    Array.prototype.reshape = function() {
      var copy = this.slice(0); // Copy all elements.
      this.length = 0; // Clear out existing array.
      while(copy.length) this.push(copy.splice(0,4));
    };

    $scope.initializeGame = function(e){
      ngDialog.closeAll();
     
      $scope.selectedCard    = [-1, -1];
      $scope.focusedCard     = [0, 0];
      $scope.rowIndex        = 0;
      $scope.columnIndex     = 1;
      $scope.maxColumns      = 4; // 0-4
      $scope.maxRows         = 4; // 0-4
      $scope.totalMoves      = 0;
      $scope.successfulMoves = 0;
      $scope.score           = 0;
      $scope.colors = ['colour1','colour1','colour2','colour2','colour3','colour3','colour4','colour4',
             'colour5','colour5','colour6','colour6','colour7','colour7','colour8','colour8'];
      $('.loading_page').remove();
      var board = $('.board');
      $scope.colors = $scope.doShuffle($scope.colors);
      $scope.colors.reshape();
      board.html('');
      for(var i=0, k=0; i < $scope.maxRows; i++){
        for(var j=0; j < $scope.maxColumns; j++){
          board.append('<div data-row= "' + i +'"  data-column = "' + j +'" class="card flipped '  + $scope.colors[i][j] + '">' + '</div>');
        }
      }
      $scope.changeView();

    }

    $scope.getJquerySelectorForCard = function(card){
      return "[data-row=" + "'" + card[$scope.rowIndex] + "'" + "][data-column=" + "'" + card[$scope.columnIndex] + "'" + "]";
    }

    $scope.changeView = function() {
      $('.card').removeClass('focused');
      $($scope.getJquerySelectorForCard($scope.focusedCard)).addClass('focused');
    }

    $scope.flipCard = function(card){
      $($scope.getJquerySelectorForCard(card)).toggleClass('flipped');
    }

    $scope.incrementMoves = function(successful){
      if(successful){
        $scope.successfulMoves++;
      }
      $scope.totalMoves++;
      $scope.score = ($scope.successfulMoves / $scope.totalMoves) * 100;
    }



    $scope.freezeCard = function(card){
      $($scope.getJquerySelectorForCard(card)).addClass('frozen');
    }

    $scope.compareCards = function(previousCard, focusedCard){
      var previousCardObject = $scope.colors[previousCard[$scope.rowIndex]][previousCard[$scope.columnIndex]];
      var focusedCardObject  = $scope.colors[focusedCard[$scope.rowIndex]][focusedCard[$scope.columnIndex]];

      if(previousCardObject == focusedCardObject){
        $scope.freezeCard(previousCard);
        $scope.freezeCard(focusedCard);
        $scope.incrementMoves(true);
        if($('.frozen').length == 16){
          $scope.openGetInfoDialog();
        }
       
      }
      else{
        setTimeout(function(){
                        $scope.flipCard(previousCard);
                        $scope.flipCard(focusedCard);
                      }, 1000);
        
        
        $scope.incrementMoves(false);
      }
      $scope.selectedCard = [-1, -1];
    }

    $scope.isFirstCardSelected = function(){
      return $scope.selectedCard[$scope.rowIndex] >= 0;
    }

    $scope.keyDown = function(e) {
        switch(e.which) {
          case 37: // left
            if($scope.focusedCard[$scope.columnIndex] - 1 >= 0){
              $scope.focusedCard = [$scope.focusedCard[$scope.rowIndex], $scope.focusedCard[$scope.columnIndex] - 1];
            }
          break;

          case 38: // up
            if($scope.focusedCard[$scope.rowIndex] - 1 >= 0){
              $scope.focusedCard = [$scope.focusedCard[$scope.rowIndex] - 1, $scope.focusedCard[$scope.columnIndex]];
            }
          break;

          case 39: // right
            if($scope.focusedCard[$scope.columnIndex] + 1 < $scope.maxColumns){
              $scope.focusedCard = [$scope.focusedCard[$scope.rowIndex], $scope.focusedCard[$scope.columnIndex] + 1];
            }
          break;

          case 40: // down
            if($scope.focusedCard[$scope.rowIndex] + 1 < $scope.maxRows){
              $scope.focusedCard = [$scope.focusedCard[$scope.rowIndex] + 1, $scope.focusedCard[$scope.columnIndex]];
            }
          break;

          case 13:
            if($($scope.getJquerySelectorForCard($scope.focusedCard)).hasClass('frozen')){
              break;
            }
            if($scope.isFirstCardSelected()){
              $scope.flipCard($scope.focusedCard);
              $scope.compareCards($scope.selectedCard, $scope.focusedCard);
            }
            else{
              $scope.selectedCard = $scope.focusedCard;
              $scope.flipCard($scope.selectedCard);
            }
          break;
        }
        $scope.changeView();
    };

  });


})();