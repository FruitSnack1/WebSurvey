
$(function() {

  const updateVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  if(!anketa.languages.includes('cz'))
    $('#lang-icon-cz').hide();
  if(!anketa.languages.includes('en'))
    $('#lang-icon-en').hide();
  if(!anketa.languages.includes('de'))
    $('#lang-icon-de').hide();
  updateVH();
  window.onresize = updateVH;

  langSwitch();
  if(local_data[0].languages.length < 2){
    $('.lang-switch-container').hide();
  }else{
    $('#lang-'+lang).addClass('lang-switch-icon-selected');
  }
  if(!anketa.comments){
    $('.note').hide();
    $('.btn-answer').css('height', '13%');
    $('#comment-mobile').hide();
  }
  if(!anketa.user_data){
    $('.user-data-form').css('opacity','0');
    // console.log('hide');
  }
  if(anketa.desc.length == 0){
    $('.desc-popis-title').hide();
  }else{
    $('.desc-popis-title').show();
  }
  if(!anketa.user_data && anketa.desc.length == 0){
    // console.log("hidee");
    $('.desc-data').hide();
  }

  $('.option-dis').attr('selected');
  $('.option-dis').attr('disabled');

});
function isMobile() {
  return !$('.progress-bar-count').is(':visible');
}
let n = -1;
let dropAnim = false;
let anketa = local_data[0];
let result = {};
let colors = ['rgb(116,203,70)', 'rgb(235,216,18)', 'rgb(255,255,255)', 'rgb(255,121,0)', 'rgb(222,29,14)'];
// let date = new Date();
// let time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
let time = Math.floor(Date.now() / 1000)
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
result.timestamp = time;
result.name = anketa.name[0];
result.answers = [];
result.anketaId = anketa._id
if(result.sectors)
result.sector_count = anketa.sector_count;
for (var i = 0; i < anketa.questions.length; i++) {
  let o = {};
  o.question = anketa.questions[i].question[0];
  o.answer = null;
  o.note = null;
  if(result.weights)
    o.weight = anketa.questions[i].weight;
  else
    o.weight = null;
  if(result.sectors)
    o.sector = anketa.questions[i].sector;
  else
    o.sector = null;
  // if(result.weights)
  //   o.weight = anketa.questions[i].weight;
  // if(result.sectors)
  //   o.sector = anketa.questions[i].sector;
  result.answers.push(o);
}
$('.play').css('display', 'none');
$('.progressBar').css('display', 'none');

function changeQuestion(dir) {
  if (n + dir == anketa.count ) {
    if(anketa.user_data){
      result.first_name = $('input[name=jmeno]').val();
      result.oddeleni = $('select[name=oddeleni]').val();
      result.age = $('select[name=age]').val();
      result.sex = $('select[name=sex]').val();
      result.language = lang;
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
    setTimeout(function () {
      window.location.href = `https://${location.host}`;
    }, 3000);
  } else if (n + dir == -1) {
    n--;
    $('.desc').show();
    $('.play').css('display', 'none');
    $('.progressBar').css('display', 'none');
  } else {
    if (dir == -1 || n ==-1 || result.answers[n].answer) {
      n += dir;
      if(anketa.questions[n].open){
        $('.play-buttons-container').hide();
        $('#q-sub').hide();
        $('.open-question').show();
        $('#open').val(result.answers[n].answer);
      }else{
        $('.play-buttons-container').show();
        $('.open-question').hide();
        $('#q-sub').show();
        $('#right').css('opacity','.5');
      }
      progress(dir);
      if(lang == 'cz')
        $('#q').html(anketa.questions[n].question[0]);
      else if(lang == 'en')
        $('#q').html(anketa.questions[n].question[1]);
      else if(lang == 'de')
          $('#q').html(anketa.questions[n].question[2]);
      if(anketa.questions[n].img != 'data/default.png'){
        $('.play-img').show();
        $('#questionImg').attr('src', '../../../' + anketa.questions[n].img);
        if(isMobile())
        $('.play-img').hide();
          // $('.play-buttons-container').css('height','80%');
      }else{
        $('.play-img').hide();
        // if(isMobile())
          // $('.play-buttons-container').css('height','80%');
      }
      $('#note').val(result.answers[n].note);
      for (var i = 0; i < 5; i++) {
        $('#answer' + (i + 1)).css('display', 'block');
        $('#answer' + (i + 1)).css('opacity', '1');
        $('#answer' + (i + 1)).css('color', 'white');
        $('#answer' + (i + 1)).css('border', 'none');
      }

      if (result.answers[n].answer) {
        $('#right').css('opacity','1')
        for (var i = 1; i <= 5; i++) {
          if (i != result.answers[n].answer) {
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
      $('.btn-answer').css('border','none');
      $('.btn-answer').css('border', 'rgb(177,31,31) .1rem solid');
      $('.btn-answer').animate({
        opacity: 1
      }, 0, ()=>{
        $('.btn-answer').css('border','none');
      })
    }
  }
}

function start() {
  // document.body.requestFullscreen();
  $('.desc').css('display', 'none');
  $('.play').css('display', 'flex');
  $('.progressBar').css('display', 'block');
  changeQuestion(1);
}

function select(button) {
  $('#right').css('opacity','1');
  result.answers[n].answer = button;
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


function noteChanged() {
  result.answers[n].note = $('#note').val();
}

function progress(dir) {
  $('.progress-bar-count').html(n+1+'/'+anketa.count);
  let p = ((n+1)/(anketa.count))*100;
  if($(window).width() > 480){
    if(p == 100){
      $('.progressBar-foreground').css('border-radius', '2rem');
    }else{
      $('.progressBar-foreground').css('border-radius', '2rem 0 0 2rem');
    }
  }
  $('.progressBar-foreground').animate({
    width:p+'%'
  }, 200);
}

// if (!('webkitSpeechRecognition' in window)) {
//   alert('use chrome please!');
// } else {
//   var recognition = new webkitSpeechRecognition();
//   recognition.continuous = false;
//   recognition.interimResults = true;
//
//   function record() {
//     $('.note-button').css('color', 'red');
//     recognition.lang = 'cs-CZ';
//     recognition.start();
//   }
//
//   recognition.onresult = function(event) {
//     let text = '';
//     for (var i = event.resultIndex; i < event.results.length; ++i) {
//       text += event.results[i][0].transcript;
//       text = text.charAt(0).toUpperCase() + text.slice(1);
//       // console.log(text);
//       $('#note').val(text);
//     }
//   };
//
//   recognition.onend = function() {
//     $('.note-button').css('color', 'gray');
//     result.answers[n].note = $('#note').val();
//   }
// }

function reset() {
  n = -1;
  result = {};
  // date = new Date();
  // time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
  time = Math.floor(Date.now() / 1000)
  console.log("time is", time);
  questionTime = [];
  for (var i = 0; i < anketa.questions.length; i++) {
    questionTime[i] = 0;
  }
  timer = setInterval(function() {
    if (n > -1)
    questionTime[n]++;
  }, 1000);
  result.timestamp = time;
  result.name = anketa.name[0];
  result.answers = [];
  result.anketaId = anketa._id
  for (var i = 0; i < anketa.questions.length; i++) {
    let o = {};
    o.question = anketa.questions[i].question[0];
    o.answer = null;
    o.note = null;
    result.answers.push(o);
  }
  $('.desc').show();
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

function langSwitch() {
  // if(lang == 'cz'){
  //   $('.desc-btn').html('Začít');
  //   $('#answer1').html('Určitě Ano');
  //   $('#answer2').html('Spíše ano');
  //   $('#answer3').html('Nemohu rozhodnout');
  //   $('#answer4').html('Spíše ne');
  //   $('#answer5').html('Určitě ne');
  //   $('.end-text').html('Děkujeme za spolupráci');
  //   $('.end-btn-span').html('Spustit znovu');
  //   $('#note').attr('placeholder','Komentář ...');
  //   $('.user-data-form').find('label').eq(0).html("Jméno :");
  //   $('.user-data-form').find('label').eq(1).html("Příjmení :");
  //   $('.user-data-form').find('label').eq(2).html("Věk :");
  //   $('.user-data-form').find('label').eq(3).html("Pohlaví :");
  //   $('.desc-select').find('option').eq(0).html('Muž');
  //   $('.desc-select').find('option').eq(1).html('Žena');
  //   if(n != -1)
  //   $('#q').html(anketa.questions[n].question[0]);
  // }else if(lang == 'en'){
  //   $('.desc-btn').html('Begin');
  //   $('#answer1').html('Definitely yes');
  //   $('#answer2').html('Rather yes');
  //   $('#answer3').html("Can't decide");
  //   $('#answer4').html('Rather no');
  //   $('#answer5').html('Definitely no');
  //   $('.end-text').html('Thank you for your cooperation');
  //   $('.end-btn-span').html('Start again');
  //   $('#note').attr('placeholder','Comment ...');
  //   $('.user-data-form').find('label').eq(0).html("First name :");
  //   $('.user-data-form').find('label').eq(1).html("Last name :");
  //   $('.user-data-form').find('label').eq(2).html("Age :");
  //   $('.user-data-form').find('label').eq(3).html("Sex :");
  //   $('.desc-select').find('option').eq(0).html('Man');
  //   $('.desc-select').find('option').eq(1).html('Woman');
  //   if(n !=-1)
  //   $('#q').html(anketa.questions[n].question[1]);
  // }else{
  //   $('#q').html(anketa.questions[n].question[2]);
  // }
  let x;
  switch (lang) {
    case 'cz':
      x = 0
      break;
    case 'en':
      x = 1;
      break;
    case 'de':
      x = 2;
      break;
  }
  $('.desc-title').html(anketa.name[x]);
  $('.desc-btn').html(langTexts['desc-btn'][x]);
  // $('#answer1').html(langTexts['answer1'][x]);
  // $('#answer2').html(langTexts['answer2'][x]);
  // $('#answer3').html(langTexts['answer3'][x]);
  // $('#answer4').html(langTexts['answer4'][x]);
  // $('#answer5').html(langTexts['answer5'][x]);
  $('.end-text').html(langTexts['end-text'][x]);
  $('.end-btn-span').html(langTexts['end-btn'][x]);
  $('#note').attr('placeholder',langTexts['note'][x]);
  $('.user-data-form').find('label').eq(0).html(langTexts['user-data-form1'][x]);
  // $('.user-data-form').find('label').eq(1).html(langTexts['user-data-form2'][x]);
  $('.user-data-form').find('label').eq(2).html(langTexts['user-data-form3'][x]);
  $('.user-data-form').find('label').eq(3).html(langTexts['user-data-form4'][x]);
  // $('.desc-select').find('option').eq(0).html(langTexts['desc-select1'][x]);
  // $('.desc-select').find('option').eq(1).html(langTexts['desc-select2'][x]);
  if(n != -1)
  $('#q').html(anketa.questions[n].question[x]);
}
const langTexts = {
  'desc-btn': ['Začít','Begin','Start'],
  // 'answer1':['Určitě ano','Definitely yes','Entschieden Ja'],
  // 'answer2':['Spíše ano','Rather yes','Eher Ja'],
  // 'answer3':['Nemohu rozhodnout',"Can't decide",'Neutrale Haltung'],
  // 'answer4':['Spíše ne','Rather no','Eher Nein'],
  // 'answer5':['Určitě ne','Definitely no','Entschieden Nein'],
  'end-text':['Děkujeme za spolupráci','Thank you for your cooperation','Entschieden Nein'],
  'end-btn':['Spustit znovu','Start again','Start nochmal'],
  'note':['Komentář ...','Comment ...','Kommentar'],
  'user-data-form1':['Jméno','First name :','Name'],
  // 'user-data-form2':['Příjmení','Last name :','Nachname'],
  'user-data-form3':['Věk','Age :','Alter'],
  'user-data-form4':['Pohlaví','Sex :','Geschlecht'],
  // 'desc-select1':['Muž','Man','Mann'],
  // 'desc-select2':['Žena','Woman','Frau']
}
function switchLang(l) {
  if(l == lang)
    return;
  lang = l;
  langSwitch();
  if(lang == 'cz'){
    $('#lang-cz').addClass('lang-switch-icon-selected');
    $('#lang-en').removeClass('lang-switch-icon-selected');
  }else{
    $('#lang-en').addClass('lang-switch-icon-selected');
    $('#lang-cz').removeClass('lang-switch-icon-selected');
  }
}
function toggleMobileComment() {
  if(!$('.comment-mobile-background').is(':visible')){
    $('.play-container-main').css('filter','blur(4px)');
    $('.question').css('filter','blur(4px)');
    $('#comment-mobile').css('filter','blur(4px)');
    $('.comment-mobile-background').css('display','flex');
  }else{
    $('.play-container-main').css('filter','blur(0px)');
    $('.question').css('filter','blur(0px)');
    $('#comment-mobile').css('filter','blur(0px)');
    $('.comment-mobile-background').hide();
  }
}
function toggleMobileLang() {
  if(!$('.lang-mobile-background').is(':visible')){
    $('.main-container').css('filter','blur(4px)');
    $('.lang-mobile-background').slideDown(200);
    $('.lang-mobile-background').css('display','flex');
  }else{
    $('.main-container').css('filter','blur(0px)');
    $('.lang-mobile-background').hide();
  }
}
function openQuestion() {
  result.answers[n].answer = $('#open').val();
  $('#right').css('opacity',1);
  console.log(result.answers[n].answer);
}
