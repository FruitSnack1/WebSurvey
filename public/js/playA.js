let dropAnim = false;
let anketa = local_data[0];
let n = -1;
let result = {};
let colors = ['rgb(116,203,70)', 'rgb(235,216,18)', 'rgb(255,255,255)', 'rgb(255,121,0)', 'rgb(222,29,14)'];
let date = new Date();
let time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
let questionTime = [];
if(anketa.random_order)
  shuffle(anketa.questions);
for (var i = 0; i < anketa.questions.length; i++) {
  questionTime[i] = 0;
}
let timer = setInterval(function() {
  if (n > -1)
    questionTime[n]++;
}, 1000);
result.date = time;
result.name = anketa.name;
result.answers = [];
result.random_order = anketa.random_order;
result.weights = anketa.weights;
result.sectors = anketa.sectors;
if(result.sectors)
  result.sector_count = anketa.sector_count;
for (var i = 0; i < anketa.questions.length; i++) {
  let o = {};
  o.question = anketa.questions[i].q;
  o.answer = null;
  o.note = null;
  if(result.weights)
    o.weight = anketa.questions[i].weight;
  if(result.sectors)
    o.sector = anketa.questions[i].sector;
  result.answers.push(o);
}
$('.play').css('display', 'none');
$('.progressBar').css('display', 'none');
if(!anketa.comments){
  $('.note').hide();
  $('.btn-answer').css('height', '13%');
}
if(!anketa.user_data){
  $('.user-data-form').css('opacity','0');
}
if(anketa.desc.length == 0){
  $('.desc-popis-title').hide();
}
if(!anketa.user_data && anketa.desc.length == 0){
  $('.desc-data').hide();
}
function changeQuestion(dir) {
  if (n + dir == anketa.count) {
    if(anketa.user_data){
      result.first_name = $('input[name=jmeno]').val();
      result.last_name = $('input[name=prijmeni]').val();
      result.age = $('input[name=age]').val();
      result.sex = $('select[name=sex]').val();
    }
    result.totalTime = 0;
    for (var i = 0; i < anketa.questions.length; i++) {
      result.answers[i].time = questionTime[i];
      result.totalTime += questionTime[i];
    }
    let json = {
      'result' : result,
      'cluster' : cluster
    }
    let oReq = new XMLHttpRequest();
    oReq.open('POST', '/anketa_result', true);
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(JSON.stringify(json));
    // $('body').html(JSON.stringify(result));
    $('.play').css('display', 'none');
    $('.progressBar').css('display', 'none');
    $('.end').css('display', 'flex');
  } else if (n + dir == -1) {
    n--;
    $('.desc').css('display', 'block');
    $('.play').css('display', 'none');
    $('.progressBar').css('display', 'none');
  } else {
    if (dir == -1 || n ==-1 || result.answers[n].answer) {
      $('#right').css('opacity','.5');
      n += dir;
      progress(dir);
      $('#q').html(anketa.questions[n].q);
      if(anketa.questions[n].img != 'data/default.png'){
        $('.play-img').show();
        $('#questionImg').attr('src', '../../' + anketa.questions[n].img);
      }else{
        $('.play-img').hide();
      }
      $('#note').val('');
      for (var i = 0; i < 5; i++) {
        $('#answer' + (i + 1)).css('display', 'block');
        $('#answer' + (i + 1)).css('opacity', '1');
        $('#answer' + (i + 1)).css('color', 'white');
        $('#answer' + (i + 1)).css('border', 'none');
      }

      if (result.answers[n].answer) {
        for (var i = 1; i <= 5; i++) {
          if ($('#answer' + i).html() != result.answers[n].answer) {
            $('#answer' + i).css('opacity', '0.5');
            $('#answer' + i).css('color', 'white');
            $('#answer' + i).css('border','none')
          } else {
            $('#answer' + i).css('opacity', '1');
            // $('#answer' + i).css('color', colors[i - 1]);
            $('#answer' + i).css('border','solid .07rem #4BA82E');
          }
        }
      }

      if (result.answers[n].note) {
        $('#note').val(result.answers[n].note);
      }
    }else{
      $('.btn-answer').css('border', 'rgb(147, 51, 51) .07rem solid');
      $('.btn-answer').animate({
        opacity: .8
      }, 300)
      .animate({
        opacity: 1
      },300, ()=>{
        $('.btn-answer').css('border','none');
      });
    }
  }
}

function start() {
  $('.desc').css('display', 'none');
  $('.play').css('display', 'flex');
  $('.progressBar').css('display', 'block');
  changeQuestion(1);
}

function select(button) {
  $('#right').css('opacity','1');
  result.answers[n].answer = $('#answer' + button).html();
  for (var i = 1; i <= 5; i++) {
    if (i != button) {
      $('#answer' + i).css('opacity', '0.5');
      $('#answer' + i).css('color', 'white');
      $('#answer' + i).css('border','none');
    } else {
      $('#answer' + i).css('opacity', '1');
      // $('#answer' + i).css('color', colors[button - 1]);
      $('#answer' + i).css('border' ,'solid .07rem #4BA82E');
    }
  }
}

$('#note').change(function() {
  result.answers[n].note = $('#note').val();
});

function progress(dir) {
  $('.progress-bar-count').html(n+1+'/'+anketa.count);
  let p = ((n+1)/(anketa.count))*100;
  if(p == 100){
    $('.progressBar-foreground').css('border-radius', '2rem');
  }else{
    $('.progressBar-foreground').css('border-radius', '2rem 0 0 2rem');
  }
  // let start = (n - dir) / (anketa.count - 1);
  // let end = n / (anketa.count - 1);
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
  // $('.progressBar-foreground').css('width', p+'%');
  $('.progressBar-foreground').animate({
    width:p+'%'
  }, 200);
}

if (!('webkitSpeechRecognition' in window)) {
  alert('use chrome please!');
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  function record() {
    $('.note-button').css('color', 'red');
    recognition.lang = 'cs-CZ';
    recognition.start();
  }

  recognition.onresult = function(event) {
    let text = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      text += event.results[i][0].transcript;
      text = text.charAt(0).toUpperCase() + text.slice(1);
      // console.log(text);
      $('#note').val(text);
    }
  };

  recognition.onend = function() {
    $('.note-button').css('color', 'gray');
    result.answers[n].note = $('#note').val();
  }
}

function reset() {
  n = -1;
  result = {};
  date = new Date();
  time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
  questionTime = [];
  for (var i = 0; i < anketa.questions.length; i++) {
    questionTime[i] = 0;
  }
  timer = setInterval(function() {
    if (n > -1)
      questionTime[n]++;
  }, 1000);
  result.date = time;
  result.name = anketa.name;
  result.answers = [];
  for (var i = 0; i < anketa.questions.length; i++) {
    let o = {};
    o.question = anketa.questions[i].q;
    o.answer = null;
    o.note = null;
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
