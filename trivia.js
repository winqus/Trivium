// https://opentdb.com/api.php?amount=10&type=multiple

var triviaObject = {};
var userAnswers = {};

function ClearCards() {
    $("#allCards").empty();
}

function AddCard(id) {
    $("#allCards").append (`
        <li onclick="LoadQuestion(${id});" id="q${id}" class="list-group-item d-flex gap-3 align-items-center listCard">
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

function GetAnswerCount () {
    var answeredCount = 0;
    for(let i = 0; i < triviaObject.results.length; i++) {
        if(userAnswers[i].answered)
        {
            answeredCount++;
        }
    }
    return answeredCount;
}

function GetCorrectAnswerCount () {
    var answeredCount = 0;
    for(let i = 0; i < triviaObject.results.length; i++) {
        if(userAnswers[i].answered && userAnswers[i].correct)
        {
            answeredCount++;
        }
    }
    return answeredCount;
}

function CheckGameEnd() {
    if(GetAnswerCount() >= 10) {
        SetInqueryMessage(`    
        <div class="card-body">
        <h5 class="card-title">You correctly answered:</h5>
        <h3 class="card-title">${GetCorrectAnswerCount()}/${triviaObject.results.length}</h3>
        <a href="" class="btn btn-primary">Try again?</a>
        </div>
    `);
    }
}

function CheckSelectedAnswer(thisObj, id, answer) {
    if(userAnswers[id].answered)
        return;
    userAnswers[id].answered = true;

    correctAnswer = triviaObject.results[id].correct_answer.replaceAll(' ', '_');

    $(thisObj).removeClass("btn-secondary");
    
    if($(thisObj).text().replaceAll(' ', '_') == correctAnswer) {
        userAnswers[id].correct = true;
        $(thisObj).addClass("btn-success");
        $(`#q${id}`).addClass("goodAnswerQ");

        CheckGameEnd();
        return;
    }
    userAnswers[id].correct = false;
    $(thisObj).addClass("btn-danger");
    $(`#q${id}`).addClass("badAnswerQ");
    $(`#${id}_${correctAnswer}`).removeClass("btn-secondary");
    $(`#${id}_${correctAnswer}`).addClass("btn-success");

    CheckGameEnd();
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
    if(userAnswers[id].answered)
        answerButtons.push(`<a href="#" onclick="CheckSelectedAnswer(\$(this), ${id}, '${trivia.correct_answer.replaceAll(' ', '_')}');" id="${id}_${trivia.correct_answer.replaceAll(' ', '_')}" class="m-2 btn btn-success">${trivia.correct_answer}</a>`);
    else  answerButtons.push(`<a href="#" onclick="CheckSelectedAnswer(\$(this), ${id}, '${trivia.correct_answer.replaceAll(' ', '_')}');" id="${id}_${trivia.correct_answer.replaceAll(' ', '_')}" class="m-2 btn btn-secondary">${trivia.correct_answer}</a>`);
    //else answerButtons.push(`<a href="#" onclick="CheckSelectedAnswer(\$(this), ${id}, '${trivia.correct_answer.replaceAll(' ', '_')}');" id="${id}_${trivia.correct_answer.replaceAll(' ', '_')}" class="m-2 btn btn-secondary">${trivia.correct_answer}</a>`);
    trivia.incorrect_answers.forEach(incorrectAnswer => {
        if(userAnswers[id].answered)
            answerButtons.push(`<a href="#" onclick="CheckSelectedAnswer(\$(this), ${id}, '${incorrectAnswer.replaceAll(' ', '_')}');" id="${id}_${incorrectAnswer.replaceAll(' ', '_')}" class="m-2 btn btn-danger">${incorrectAnswer}</a>`);
        else answerButtons.push(`<a href="#" onclick="CheckSelectedAnswer(\$(this), ${id}, '${incorrectAnswer.replaceAll(' ', '_')}');" id="${id}_${incorrectAnswer.replaceAll(' ', '_')}" class="m-2 btn btn-secondary">${incorrectAnswer}</a>`);
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
            userAnswers[i] = {
                "answered" : false,
                "correct" : false
            };
        }
      }
    );
}

$(document).ready( () => {
    ClearCards();
    SetTitle("", "It's Trivia Time!");
    GetTrivia();
    SetInqueryMessage(`<div class="card-body">
    <h5 class="card-title">Welcome to random Trivia!</h5>
    <p class="card-text">You'll be provided with several questions to answer. Try to get as many correct as possible!</p>
    <a href="#" onclick="LoadQuestion(0);" class="btn btn-primary">Start!</a>
    </div>`);

    
});