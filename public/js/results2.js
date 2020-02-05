function setResults(data) {
  console.log(data);
  const labels = data.answers;
  let anketaData = {};
  for (var i = 0; i < data.questions.length; i++) {
    anketaData[data.questions[i].question] = [0,0,0,0,0];
  }
  for (var i = 0; i < data.results.length; i++) {
    for (var j = 0; j < data.results[i].answers.length; j++) {
      const question = data.results[i].answers[j].question;
      const answer = data.results[i].answers[j].answer -1;
      anketaData[question][answer]++;
    }
  }
  console.log(anketaData);
  for (var i = 0; i < data.questions.length; i++) {
    let questionData = anketaData[data.questions[i].question];
    const radarMax = questionData.reduce(function(a, b) {
      return Math.max(a, b);
    })+3;
    var ctx = document.getElementById(`donut-${i}`).getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Votes',
          data: questionData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      }
    });

    var ctx2 = document.getElementById(`rader-${i}`).getContext('2d');
    var myChart2 = new Chart(ctx2, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Počet hodnocení',
          data: questionData,
          backgroundColor: [
            'rgba(75, 168, 46, .3)'
          ],
          borderColor: [
            'rgb(75, 168, 46)'
          ],
          borderWidth: 1
        }]
      },
      options : {
        scale : {
          ticks : {
            stepSize : 1,
            max : radarMax
          }
        }
      }
    });
  }
}
