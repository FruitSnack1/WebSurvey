function setResultData() {
  $('.data-name').html(name);
  if (local_data.length > 0) {
    let score = [0, 0, 0, 0, 0];
    let total = local_data.length * local_data[0].answers.length;
    for (var i = 0; i < local_data.length; i++) {
      for (var j = 0; j < local_data[i].answers.length; j++) {
        if (local_data[i].answers[j].answer) {
          switch (local_data[i].answers[j].answer) {
            case 'Ano':
              score[0]++;
              break;
            case 'Spíš ano':
              score[1]++;
              break;
            case 'Neutral':
              score[2]++;
              break;
            case 'Spíš ne':
              score[3]++;
              break;
            case 'Ne':
              score[4]++;
              break;
            default:

          }
        }
      }
    }
    let avg = (score[0] + score[1] + score[2] + score[3] + score[4]) / 5;
    let max = 0;
    for (var i = 0; i < score.length; i++) {
      if (score[i] > max)
        max = score[i];
    }
    // max = total;
    $('#bar1').css('height', score[0] / max * 90 + '%');
    $('#bar2').css('height', score[1] / max * 90 + '%');
    $('#bar3').css('height', score[2] / max * 90 + '%');
    $('#bar4').css('height', score[3] / max * 90 + '%');
    $('#bar5').css('height', score[4] / max * 90 + '%');
    // console.log(score);
  }
  let male_count = 0,
    female_count = 0,
    time = 0;
  for (var i = 0; i < local_data.length; i++) {
    if (local_data[i].sex === 'Muž') {
      male_count++;
    } else {
      female_count++;
    }
    if (local_data[i].totalTime != null) {
      time += local_data[i].totalTime;
    }
  }
  time = time / local_data.length;
  time = Math.floor(time);
  let od_male = new Odometer({
    el: $('#male_count')[0],
    value: 0
  });
  od_male.update(male_count);
  let od_female = new Odometer({
    el: $('#female_count')[0],
    value: 0
  });
  od_female.update(female_count);
  let od_time = new Odometer({
    el: $('#time')[0],
    value: 0
  });
  od_time.update(time);
  let od_count = new Odometer({
    el: $('#quiz_count')[0],
    value: 0
  });
  od_count.update(local_data.length);
  let od_questions = new Odometer({
    el: $('#questions_count')[0],
    value: 0
  });
  od_questions.update(local_data[0].answers.length);
}
function download(){
  window.location.replace('http://localhost:8080/excel/'+cluster+'_vysledky.xlsx');
}
