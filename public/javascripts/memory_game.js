$(document).ready(function(){
  var selectedCard    = [-1, -1];
  var focusedCard     = [0, 0];
  var rowIndex        = 0;
  var columnIndex     = 1;
  var maxColumns      = 4; // 0-4
  var maxRows         = 4; // 0-4
  var cards           = [];
  var totalMoves      = 0;
  var successfulMoves = 0;
  var score           = 0.0;

  var colors = ['colour1','colour1','colour2','colour2','colour3','colour3','colour4','colour4',
           'colour5','colour5','colour6','colour6','colour7','colour7','colour8','colour8'];

  initializeGame();

  function doShuffle(array){
      for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
      return array;
  }
  function initializeGame(){
    var board = $('.board');
    cards = doShuffle(colors);
    console.log(cards)
    board.html('');
    for(var i=0, k=0; i < maxRows; i++){
      var myDiv = $("<div/>");
      for(var j=0; j < maxColumns; j++, k++){
        // if(k == 0 ){
        //   board.append('<div class=row>');
        // }
        myDiv.append('<div data-row= "' + i +'"  data-column = "' + j +'" class="card flipped '  + cards[k] + '">' + '</div>');
        // if(k == 0 ){
        //   board.append('</div');
        // }
      }
      console.log(myDiv);
      // myDiv.addClass('row');
      board.append(myDiv);
    }
    changeView();

  }

  function getJquerySelectorForCard(card){
    return "[data-row=" + "'" + card[rowIndex] + "'" + "][data-column=" + "'" + card[columnIndex] + "'" + "]";
  }

  function changeView(){
    $('.card').removeClass('focused');
    // if(focusedCard != selectedCard){
      $(getJquerySelectorForCard(focusedCard)).addClass('focused');
    // }
    // if(selectedCard[rowIndex] >= 0){
    //   flipCard(selectedCard);
    // }
  }

  function flipCard(card){
    $(getJquerySelectorForCard(card)).toggleClass('flipped');
  }

  function incrementMoves(successful){
    if(successful){
      successfulMoves++;
    }
    totalMoves++;
    score = (successfulMoves / totalMoves) * 100;
  }



  function freezeCard(card){
    $(getJquerySelectorForCard(card)).addClass('frozen');
  }

  function compareCards(previousCard, focusedCard){
    previousCardObject = cards[previousCard[rowIndex], previousCard[columnIndex]];
    focusedCardObject  = cards[focusedCard[rowIndex], focusedCard[columnIndex]];
    console.log(previousCardObject);
    console.log(focusedCardObject);
    if(previousCardObject == focusedCardObject){
      freezeCard(previousCard);
      freezeCard(focusedCard);
      incrementMoves(true);
    }
    else{
      console.log(totalMoves);
      flipCard(previousCard);
      flipCard(focusedCard);
      incrementMoves(false);
    }
    selectedCard = [-1, -1];
  }

  function isFirstCardSelected(){
    return selectedCard[rowIndex] >= 0;
  }

  //keyboard events starts and ends here

  $(document).keydown(function(e) {
    switch(e.which) {
      case 37: // left
        if(focusedCard[columnIndex] - 1 >= 0){
          focusedCard = [focusedCard[rowIndex], focusedCard[columnIndex] - 1];
        }
      break;

      case 38: // up
        if(focusedCard[rowIndex] - 1 >= 0){
          focusedCard = [focusedCard[rowIndex] - 1, focusedCard[columnIndex]];
        }
      break;

      case 39: // right
        if(focusedCard[columnIndex] + 1 < maxColumns){
          focusedCard = [focusedCard[rowIndex], focusedCard[columnIndex] + 1];
        }
      break;

      case 40: // down
        if(focusedCard[rowIndex] + 1 < maxRows){
          focusedCard = [focusedCard[rowIndex] + 1, focusedCard[columnIndex]];   
        }
      break;

      case 13:
        if(isFirstCardSelected()){
          flipCard(focusedCard);
          compareCards(selectedCard, focusedCard);
        }
        else{
          selectedCard = focusedCard;
          flipCard(selectedCard);
        }
      break;
    }
    changeView();
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });


});  

// // on keypress
//   // if key is left arrow key
//   if(focusedCard[columnIndex] - 1 >= 0)
//     focusedCard = [focusedCard[rowIndex], focusedCard[columnIndex] - 1];
//   // if key is right arrow key
//   if(focusedCard[columnIndex] + 1 <= maxColumns)
//     focusedCard = [focusedCard[rowIndex], focusedCard[columnIndex] + 1];
//   // if key is up arrow key
//   if(focusedCard[rowIndex] - 1 >= 0)
//     focusedCard = [focusedCard[rowIndex] - 1, focusedCard[columnIndex]];
//   // if key is down arrow key
//   if(focusedCard[rowIndex] + 1 <= maxRows)
//     focusedCard = [focusedCard[rowIndex] + 1, focusedCard[columnIndex]];
//   // if key is enter and card class is not frozen
//     if(isFirstCardSelected()){
//       compareCards(selectedCard, focusedCard);
//     }
//     else{
//       selectedCard = focusedCard;
//       flipCard(selectedCard);
//     }
//   changeView();


// function changeView(){
//   $('.card').removeClass('focused');
//   $(getJquerySelectorForCard(focusedCard)).addClass('focused');
//   if(rowNumber >= 0){
//     $(getJquerySelectorForCard(selectedCard)).addClass('selected');
//   }
// }

// function getJquerySelectorForCard(card){
//   return ".card[data-row=" + card[rowIndex] + "' data-column='" + card[columnIndex] + "'";
// }

// function incrementMoves(successful){
//   if(successful){
//     successfulMoves++;
//   }
//   totalMoves++;
//   score = (successfulMoves / totalMoves) * 100;
// }



// function freezeCard(card){
//   $(getJquerySelectorForCard(card)).addClass('frozen');
// }

// function compareCards(previousCard, focusedCard){
//   previousCardObject = cards[previousCard[rowIndex], previousCard[columnIndex]];
//   focusedCardObject  = cards[focusedCard[rowIndex], focusedCard[columnIndex]];
//   if(previousCardObject.color == focusedCardObject.color){
//     freezeCard(previousCard);
//     freezeCard(focusedCard);
//     incrementMoves(true);
//   }
//   else{
//     flipCard(previousCard);
//     flipCard(focusedCard);
//     incrementMoves(false);
//   }
//   selectedCard = [-1, -1];
// }

// function isFirstCardSelected(){
//   selectedCard[rowIndex] >= 0;
// }