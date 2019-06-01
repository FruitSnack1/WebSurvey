let json;
let questions = [];
let n = -1;
let score = 0;
$.getJSON("../data/quiz1.json", function(json) {
  //console.log(json);
  questions = json.questions;
  //console.log(questions);
  nextQuestion();
});

function nextQuestion() {
  n++;
  $("button.answer1").html(questions[n]["a1"]);
  $("button.answer2").html(questions[n]["a2"]);
  $("button.answer3").html(questions[n]["a3"]);
  $("div.question").html('<h1 class="text-white">' + questions[n]["q"] + '</h1>');
}

$("button.answer").click(function(button) {
  let a = questions[n]["ra"];
  for (var i = 1; i <= 3; i++) {
    if (a == i) {

      $("button.answer" + i).css("background-color", "green");
    } else {
      $("button.answer" + i).css("background-color", "red");
    }
  }
  setTimeout(function() {
    for (var i = 1; i <= 3; i++) {
      $("button.answer" + i).css("background-color", "#5a6268");
    }
    nextQuestion()
  }, 3000);
});
