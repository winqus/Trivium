// https://opentdb.com/api.php?amount=10&type=multiple

var triviaObject = {};

function ClearCards() {
    $("#allCards").empty();
}

function AddCard(id) {
    $("#allCards").append (`
        <li onclick="LoadQuestion(${id});" class="list-group-item d-flex gap-3 align-items-center listCard">
        <div class="profileCircle rounded-circle flex-shrink-0">${id+1}</div>
        <div class="d-flex w-100"><h4>Question ${id+1}</h2></div>
        </li>
    `);
}

function SetTitle(bubbleText, titleText) {
    let newTitle = `<div class="profileCircle rounded-circle flex-shrink-0">${bubbleText}</div>
    <div class="d-flex w-100"><h2>${titleText}</h2></div>`;
    $('#titleDiv').empty().append(newTitle);
}

function SetInqueryMessage(newQuery) {
    $("#inqueryPlaceHolder").empty().append(newQuery);

}

function Shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function LoadQuestion(id) {
    SetTitle(`${id+1}`, `Question ${id+1}`);
    let trivia = triviaObject.results[id];
    let answerButtons = [];
    answerButtons.push(`<a href="#" class="m-2 btn btn-secondary">${trivia.correct_answer}</a>`);
    trivia.incorrect_answers.forEach(incorrectAnswer => {
        answerButtons.push(`<a href="#" class="m-2 btn btn-secondary">${incorrectAnswer}</a>`);
    });
    let shuffledButtons = Shuffle(answerButtons);
    buttonsHtml = ``;
    shuffledButtons.forEach(btn => {
        buttonsHtml += btn;
    });
    SetInqueryMessage(`
        <div class="card-body">
        <h5 class="card-title">Here's a question ${id+1} from category ${trivia.category}</h5>
        <p class="card-text">${trivia.question}</p>
        ${buttonsHtml}
        </div>
    `);
}

function GetTrivia() {
    $.ajax({
        url: "https://opentdb.com/api.php?amount=10&type=multiple", 
        success: function(result) {
            triviaObject = result;
      }}).done(() => {
        let len = triviaObject.results.length;
        for(let i = 0; i < len; i++) {
            AddCard(i);
        }
      }

      );

    
}

$(document).ready( () => {
    ClearCards();
    SetTitle("", "It's Trivia Time!");
    SetInqueryMessage(`<div class="card-body">
    <h5 class="card-title">Welcome to random Trivia!</h5>
    <p class="card-text">You'll be provided with several questions to answer. Try to get as many correct as possible!</p>
    <a href="#" class="btn btn-primary">Start!</a>
    </div>`);
    GetTrivia();

    
});