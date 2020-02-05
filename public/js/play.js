let result = {
  answers : []
};
let count = 0;

$(function() {
  const updateVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  updateVH();
  window.onresize = updateVH;
})

function start() {
  $('#begin').addClass('hide');
  $('#play').removeClass('hide').addClass('show');
  progress();
}

function select(button) {
  result.answers = [...result.answers, {
    question : $('#question').html(),
    answer : $(button).val()
  }];

  count++;
  progress();

  if(count === anketa.questions.length){
    finish();
    return;
  }
  $('#question').html(anketa.questions[count].question);
}

function finish() {
  $('#play').removeClass('show').addClass('hide');
  $('#finish').removeClass('hide').addClass('show');

  result.anketaId = anketa._id;
  $.ajax({
    method:'POST',
    url: '/results/anketa',
    data: {result:JSON.stringify(result)},
    dataType : 'json'
  })
}

function progress() {
  const width = (count+1)/anketa.questions.length * 100;
  $('#progress-bar').animate({
    width: `${width}%`,
    duration: 400
  });
}
