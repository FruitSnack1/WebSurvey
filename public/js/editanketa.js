function finishEditA(){
  $('.content-loading').css('display','flex');
  var input = $("<input>")
                 .attr("type", "hidden")
                 .attr("name", "cluster").val(cluster);
  $('form').append(input);

  $("input[type=number][name=count]").val(count);
  imgJson = {};
  
  for (var i = 0; i < count; i++) {
    let originalAttr = $('.questionInput').children().eq(i).find('input[type=text]').attr('name');
    let re = /[0-9]+/;
    let index = re.exec(originalAttr);
    if(editLinkImgsJson[index[0]]){
      imgJson[i] = editLinkImgsJson[index[0]];
    }
    $('.questionInput').children().eq(i).find('input[type=text]').attr('name', 'question' + i);
    $('.questionInput').children().eq(i).find('input[type=file]').attr('name', 'img' + i);
  }
  var $hidden = $("<input type='hidden' name='imgJson'/>");
  $hidden.val(JSON.stringify(imgJson));
  $('form').append($hidden);

  $('form').ajaxSubmit(function(){
    getSite('settings');
    $('.content-loading').hide();
  });
}

// function test() {
//   imgJson = {};
//   for (var i = 0; i < count; i++) {
//     console.log($('.questionInput').children().eq(i).find('input[type=text]').attr('name'));
//     let originalAttr = $('.questionInput').children().eq(i).find('input[type=text]').attr('name');
//     let re = /[0-9]+/;
//     let index = re.exec(originalAttr);
//     console.log(index[0]);
//     if(editLinkImgsJson[index[0]]){
//       imgJson[i] = editLinkImgsJson[index[0]];
//     }
//     $('.questionInput').children().eq(i).find('input[type=text]').attr('name', 'question' + i);
//     $('.questionInput').children().eq(i).find('input[type=file]').attr('name', 'img' + i);
//   }
// }
