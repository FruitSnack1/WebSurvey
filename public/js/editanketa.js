// function finishEditA(){
//   $('.content-loading').css('display','flex');
//   var input = $("<input>")
//                  .attr("type", "hidden")
//                  .attr("name", "cluster").val(cluster);
//   $('form').append(input);
//
//   $("input[type=number][name=count]").val(count);
//   imgJson = {};
//
//   for (var i = 0; i < count; i++) {
//     let originalAttr = $('.questionInput').children().eq(i).find('input[type=text]').attr('name');
//     let re = /[0-9]+/;
//     let index = re.exec(originalAttr);
//     if(editLinkImgsJson[index[0]]){
//       imgJson[i] = editLinkImgsJson[index[0]];
//     }
//     $('.questionInput').children().eq(i).find('input[type=text]').attr('name', 'question' + i);
//     $('.questionInput').children().eq(i).find('input[type=file]').attr('name', 'img' + i);
//   }
//   var $hidden = $("<input type='hidden' name='imgJson'/>");
//   $hidden.val(JSON.stringify(imgJson));
//   $('form').append($hidden);
//
//   $('form').ajaxSubmit(function(){
//     getSite('settings');
//     $('.content-loading').hide();
//   });
// }
//
// // function test() {
// //   imgJson = {};
// //   for (var i = 0; i < count; i++) {
// //     console.log($('.questionInput').children().eq(i).find('input[type=text]').attr('name'));
// //     let originalAttr = $('.questionInput').children().eq(i).find('input[type=text]').attr('name');
// //     let re = /[0-9]+/;
// //     let index = re.exec(originalAttr);
// //     console.log(index[0]);
// //     if(editLinkImgsJson[index[0]]){
// //       imgJson[i] = editLinkImgsJson[index[0]];
// //     }
// //     $('.questionInput').children().eq(i).find('input[type=text]').attr('name', 'question' + i);
// //     $('.questionInput').children().eq(i).find('input[type=file]').attr('name', 'img' + i);
// //   }
// // }
function setEditData() {
  console.log(editData);
  showAdvancedSettings();
  if(editData.random_order)
    $('input[name="random_order"]').prop( "checked", true );
  if(editData.comments)
    $('input[name="note"]').prop( "checked", true );
  if(editData.user_data)
    $('input[name="user_data"]').prop( "checked", true );
  if(editData.sectors){
    $('input[name="sectors"]').prop( "checked", true );
    sectorChange();
    $('select[name="sector_count"]').val(editData.sector_count);
    sectorCountChange(editData.sector_count);
    for (var i = 0; i < editData.questions.length; i++) {
      $('select[name="sector'+i+'"]').val(editData.questions[i].sector);
    }
  }
  if(editData.weights){
    $('input[name="weights"]').prop( "checked", true );
    weightChange();
    for (var i = 0; i < editData.questions.length; i++) {
      $('input[name="weight'+i+'"]').val(editData.questions[i].weight);
    }
  }
  if(editData.languages.length > 1){
    $('input[name="lang_en"]').prop( "checked", true );
    $('.lang-en-input').show();
    for (var i = 0; i < editData.questions.length; i++) {
      $('input[name="question'+i+'"]').eq(1).val(editData.questions[i].question[1]);
    }
  }
  for (var i = 0; i < editData.questions.length; i++) {
    $('#question'+i).show();
    $('input[name="question'+i+'"]').eq(0).val(editData.questions[i].question[0]);
    if(editData.questions[i].img != 'data/default.png'){
      $('input[name="img'+i+'"]').parent().css('background-image','url('+editData.questions[i].img+')');
      $('input[name="img'+i+'"]').prev().html('Změnit obrázek');
    }
  }
  $('input[name="name"]').val(editData.name);
  $('textarea[name="desc"]').val(editData.desc);
  if(editData.img != 'data/default.png'){
    $('input[name="img"]').parent().css('background-image','url('+editData.img+')');
    $('input[name="img"]').prev().html('Změnit obrázek');
  }
}
