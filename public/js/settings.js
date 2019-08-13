let item;
let type;
$('#confirm-delete').css('display','none');

function delete_item(name, typ){
  item = name;
  type = typ;
  $('#confirm-delete h3').html('Opravdu chcete odstranit '+name+' ?');
  $('#confirm-delete').css('display','flex');
}
function decline(){
  $('#confirm-delete').css('display','none');
}
function confirm(){
  // window.location.replace("/delete/"+item);
  $.ajax({
    type:'POST',
    url:'/deleteAnketa',
    data:{
      cluster,
      item
    },
    beforeSend: function(xhr){
      if(localStorage.token)
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
    },
    success:function(){
      getSite('settings');
    }
  });

  // let oReq = new XMLHttpRequest();
  // oReq.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //     getSite('settings');
  //   }
  // };
  // if(type=='anketa')
  //   oReq.open('POST', '/deleteAnketa', true);
  // else
  //   oReq.open('POST', '/deleteQuiz', true);
  // oReq.setRequestHeader("Content-Type", "application/json");
  // oReq.send(JSON.stringify({
  //   cluster,
  //   "pass": pass,
  //   "item": item
  // }));

}
function check(){
  for (var i = 0; i < right_answers.questions.length; i++) {
    for (var j = 0; j < right_answers.questions[i].correct_answers.length; j++) {
      let num = right_answers.questions[i].correct_answers[j];
      $('input[name=ra'+i+num+']').prop('checked', true);
    }
  }
  for(var i = 0; i< right_answers.count;i++){
    $('#answers-count'+i).val(right_answers.questions[i].answers.length);
  }
}
function settingsSwitch(target){
  if(target == 'quiz'){
    $('#switch-quiz').addClass('settings-switch-item-active');
    $('#switch-ankety').removeClass('settings-switch-item-active');
    $('#settings-quiz').css('display','flex');
    $('#settings-anketa').hide();
  }else{
    $('#switch-ankety').addClass('settings-switch-item-active');
    $('#switch-quiz').removeClass('settings-switch-item-active');
    $('#settings-anketa').css('display','flex');
    $('#settings-quiz').hide();
  }
}
