let charts = [];
function setResultData() {
  $('.data-name').html(name);
  if (local_data.length > 0) {
    let score = [0, 0, 0, 0, 0];
    let total = local_data.length * local_data[0].answers.length;
    for (var i = 0; i < local_data.length; i++) {
      for (var j = 0; j < local_data[i].answers.length; j++) {
        if (local_data[i].answers[j].answer) {
          switch (local_data[i].answers[j].answer) {
            case 'Určitě Ano':
              score[0]++;
              break;
            case 'Spíše ano':
              score[1]++;
              break;
            case 'Nemohu rozhodnout':
              score[2]++;
              break;
            case 'Spíše ne':
              score[3]++;
              break;
            case 'Určitě ne':
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
    $('#bar1').css('height', score[0] / max * 100 + '%');
    $('#bar2').css('height', score[1] / max * 100 + '%');
    $('#bar3').css('height', score[2] / max * 100 + '%');
    $('#bar4').css('height', score[3] / max * 100 + '%');
    $('#bar5').css('height', score[4] / max * 100 + '%');
    // console.log(score);
    $('#bar1-value').html(score[0]);
    $('#bar2-value').html(score[1]);
    $('#bar3-value').html(score[2]);
    $('#bar4-value').html(score[3]);
    $('#bar5-value').html(score[4]);
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
  let time_min = Math.floor(time/60);
  let time_el = time_min + ':' + (time - (time_min*60));
  $('#male_count').html(male_count);
  $('#female_count').html(female_count);
  $('#time').html(time_el);
  $('#quiz_count').html(local_data.length);
  $('#questions_count').html(local_data[0].answers.length);


}
function download(){
  window.location.replace('http://localhost:8080/excel/'+cluster+'_vysledky.xlsx');
}
function showCharts() {
  $('.results-chart-container').fadeIn(300);
  $('.graph-container').hide();
  $('.data-container').hide();
  displayCharts();
  // for (var i = 0; i < charts.length; i++) {
  //   charts[i].render();
  //   charts[i].update();
  // }
}

function displayCharts() {

  for (var i = 0; i < local_data[0].answers.length; i++) {
    let el = $('<div class="chart"></div>');
    el.append($('<span class="chart-span">'+ local_data[0].answers[i].question+'</span>'))
    el.append($('<canvas id="chart'+ i +'"></canvas>'));
    $('.results-chart-container').append(el);

    let answers =[0,0,0,0,0];
    for (var j = 0; j < local_data.length; j++) {
      switch (local_data[j].answers[i].answer) {
        case 'Určitě Ano':
          answers[0]++;
          break;
        case 'Spíše ano':
          answers[1]++;
          break;
        case 'Nemohu rozhodnout':
          answers[2]++;
          break;
        case 'Spíše ne':
          answers[3]++;
          break;
        case 'Určitě ne':
          answers[4]++;
          break;
        default:

      }
    }

    data = {

      labels: ['Určitě ano', 'Spíše ano', 'Nemohu rozhodnout', 'Spíše ne','Určitě ne'],
      datasets:[{
        data: [answers[0], answers[1], answers[2], answers[3], answers[4]],
        backgroundColor: [
          'rgb(96,146,80)',
          'rgb(114,172,96)',
          'rgb(255,210,0)',
          'rgb(247,211,213)',
          'rgb(239,166,170)'
        ],
        borderWidth: 0
      }]
    }

    charts[i] = new Chart($('#chart'+i), {
        type: 'pie',
        data: data,
        options: {
          legend: {
            position: 'right'
          },
          animateScale : true,
          animation:{
            duration: 1000
          }
        }
    });
  }
}
