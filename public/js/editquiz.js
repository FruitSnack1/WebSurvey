function finishEditQ(){
  $('.content-loading').css('display','flex');
  var input = $("<input>")
  .attr("type", "hidden")
  .attr("name", "cluster").val(cluster);
  $('form').append(input);

  $("input[type=number][name=count]").val(countQ);
  imgJson = {};


  for (var i = 0; i < countQ; i++) {
    let originalAttr = $('.questionInput').children().eq(i).find('input[type=text]').attr('name');
    let re = /[0-9]+/;
    let index = re.exec(originalAttr);
    if(editLinkImgsJsonQ[index[0]]){
      imgJson[i] = editLinkImgsJsonQ[index[0]];
    }

    let textInputs = $('.questionInput').children().eq(i).find('input[type=text]');
    let checkboxInputs = $('.questionInput').children().eq(i).find('input[type=checkbox]');
    textInputs.eq(0).attr('name', 'question' + i);
    $('.questionInput').children().eq(i).find('input[type=file]').attr('name', 'img' + i);
    for (var j = 1; j < textInputs.length; j++) {
      textInputs.eq(j).attr('name', 'a' + i+(j-1));
    }
    for (var j = 0; j < checkboxInputs.length; j++) {
      checkboxInputs.eq(j).attr('name', 'ra' + i+j);
    }
  }
  var $hidden = $("<input type='hidden' name='imgJson'/>");
  $hidden.val(JSON.stringify(imgJson));
  $('form').append($hidden);

  $('form').ajaxSubmit(function(){
    getSite('settings');
    $('.content-loading').hide();
  });
}
