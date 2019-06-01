let dropAnim = false;
let quiz = local_data[0];
let n = -1;
let result= {};
let date = new Date();
let time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
let questionTime = [];
shuffle(quiz.questions);
for (var i = 0; i < quiz.questions.length; i++) {
  questionTime[i] = 0;
}
let timer = setInterval(function() {
  if (n > -1)
    questionTime[n]++;
}, 1000);
result.date = time;
result.name = quiz.name;
result.answers = [];
for (var i = 0; i < quiz.questions.length; i++) {
  let o = {};
  o.question = quiz.questions[i].question;
  o.answer = null;
  o.correct = false;
  result.answers.push(o);
}
$('.play').css('display','none');
$('.progressBar').css('display','none');

function nextQuestion() {
  if (n + 1 == quiz.count) {
    result.first_name = $('input[name=jmeno]').val();
    result.last_name = $('input[name=prijmeni]').val();
    result.age = $('input[name=age]').val();
    result.sex = $('select[name=sex]').val();
    result.totalTime = 0;
    for (var i = 0; i < quiz.questions.length; i++) {
      result.answers[i].time = questionTime[i];
      result.totalTime += questionTime[i];
    }
    let json = {
      'result' : result,
      'cluster' : cluster
    }
    let oReq = new XMLHttpRequest();
    oReq.open('POST', '/quiz_result', true);
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(JSON.stringify(json));
    $('.play').css('display', 'none');
    $('.progressBar').css('display', 'none');
    $('.end').css('display', 'flex');
  } else {
    n++;
    progress(1);
    $('#q').html(quiz.questions[n].question);
    $('#questionImg').attr('src','../../'+quiz.questions[n].img);
    for (var i = 0; i < 5; i++) {
      $('#answer'+(i+1)).css('display', 'block');
      $('#answer'+(i+1)).css('opacity', '1');
      $('#answer'+(i+1)).css('color', 'white');
      if(i <quiz.questions[n].answers.length){
        $('#answer'+(i+1)).html(quiz.questions[n].answers[i]);
      }else{
        $('#answer'+(i+1)).css('display', 'none');
      }
    }
    if(result.answers[n].answer){
      for (var i = 1; i <= 5; i++) {
        if($('#answer'+i).html() != result.answers[n].answer){
          $('#answer'+i).css('opacity', '0.5');
          $('#answer'+i).css('color', 'white');
        }else{
          $('#answer'+i).css('opacity', '1');
          $('#answer'+i).css('color', 'rgb(116,203,70)');
        }
      }
    }
  }
}
function prvQuestion() {
  if (n == 0) {
    n--;
    $('.desc').css('display', 'block');
    $('.play').css('display', 'none');
    $('.progressBar').css('display', 'none');
  } else {
    n--;
    progress(-1);
    $('#q').html(quiz.questions[n].question);
    $('#questionImg').attr('src','../../'+quiz.questions[n].img);
    for (var i = 0; i < 5; i++) {
      $('#answer'+(i+1)).css('display', 'block');
      $('#answer'+(i+1)).css('opacity', '1');
      $('#answer'+(i+1)).css('color', 'white');
      if(quiz.questions[n].answers.length > i){
        $('#answer'+(i+1)).html(quiz.questions[n].answers[i]);
      }else{
        $('#answer'+(i+1)).css('display', 'none');
      }
    }
    if(result.answers[n].answer){
      for (var i = 1; i <= 5; i++) {
        if($('#answer'+i).html() != result.answers[n].answer){
          $('#answer'+i).css('opacity', '0.5');
          $('#answer'+i).css('color', 'white');
        }else{
          $('#answer'+i).css('opacity', '1');
          $('#answer'+i).css('color', 'rgb(116,203,70)');
        }
      }
    }
  }
}

function start(){
  $('.desc').css('display', 'none');
  $('.play').css('display', 'block');
  $('.progressBar').css('display', 'block');
  nextQuestion();
}
function select(button){
  result.answers[n].answer = $('#answer'+button).html();
  if(quiz.questions[n].correct_answers.includes(String(button-1))){
    result.answers[n].correct = true;
  }
  for (var i = 1; i <= 5; i++) {
    if(i != button){
      $('#answer'+i).css('opacity', '0.5');
      $('#answer'+i).css('color', 'white');
    }else{
      $('#answer'+i).css('opacity', '1');
      $('#answer'+i).css('color', 'rgb(116,203,70)');
    }
  }
}

// function progress(){
//   let prog = (n+1)/quiz.count;
//   $('.bar').css('width',prog*100+'%');
// }

function progress(dir) {
  // $('.progress-bar-count').html(n+1+'/'+quiz.count);
  // let start = (n - dir) / (quiz.count - 1);
  // let end = n / (quiz.count - 1);
  //
  // if (start >= 0) {
  //   if (start < end) {
  //     var id = setInterval(frame, 10);
  //
  //     function frame() {
  //       if (start >= end) {
  //         clearInterval(id);
  //       } else {
  //         start += 0.01;
  //         $('.progress-car').css('margin-left', start * 88.5 + '%');
  //       }
  //     }
  //   } else {
  //     var id = setInterval(frame, 10);
  //
  //     function frame() {
  //       if (start <= end) {
  //         clearInterval(id);
  //       } else {
  //         start -= 0.01;
  //         $('.progress-car').css('margin-left', start * 89.5 + '%');
  //       }
  //     }
  //   }
  // }
  $('.progress-bar-count').html(n+1+'/'+quiz.count);
  let p = ((n+1)/(quiz.count))*100;
  if(p == 100){
    $('.progressBar-foreground').css('border-radius', '2rem');
  }else{
    $('.progressBar-foreground').css('border-radius', '2rem 0 0 2rem');
  }

  $('.progressBar-foreground').animate({
    width:p+'%'
  }, 200);
}

function reset(){
  n = -1;
  result = {};
  date = new Date();
  time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
  questionTime = [];
  for (var i = 0; i < quiz.questions.length; i++) {
    questionTime[i] = 0;
  }
  timer = setInterval(function() {
    if (n > -1)
      questionTime[n]++;
  }, 1000);
  result.date = time;
  result.name = quiz.name;
  result.answers = [];
  for (var i = 0; i < quiz.questions.length; i++) {
    let o = {};
    o.question = quiz.questions[i].q;
    o.answer = null;
    result.answers.push(o);
  }
  $('.desc').css('display', 'block');
  $('.play').css('display', 'none');
  $('.progressBar').css('display', 'none');
  $('.end').css('display', 'none');
  $('.progress-car').css('margin-left', 0);

  $('input[name=jmeno]').val('');
  $('input[name=prijmeni]').val('');
  $('input[name=age]').val('');
  $('select[name=sex]').prop('selectedIndex', 0);
}
function dropDown(){
  if(!dropAnim){
    $('.statusBar-dropdown').animate({
      height:'300%'
    }, 500);
    $('.statusBar-button').fadeIn(500);
  }else{
    $('.statusBar-dropdown').animate({
      height:'100%'
    }, 500);
    $('.statusBar-button').fadeOut(500);
  }
  dropAnim = !dropAnim;
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
