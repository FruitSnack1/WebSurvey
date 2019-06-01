console.log(count);
$('.input-img-label').css('box-shadow', '0 0 1rem 0.2rem black');
function addQuestion(){
  count++;
  let i = 0;
  let item = $('.questionInput').children().first();
  while(i < count){
    item.css('display', 'block');
    item = item.next();
    i++;
  }
}
function deleteQuestion(index){
  count--;
  $('#question'+index).css('display','none');
  $('#question'+index).find('input[type=text]').val('');
  $('#question'+index).find('input[type=file]').val('');
  $('#question'+index).find('.img-container').css('background-image', 'url()');
  $('#question'+index).find('.input-img-label').html('Vybrat obrázek');
  let q = $('.questionInput').children().last();
  $('#question'+index).insertAfter(q);
}

function finish(){
  $("input[type=number][name=count]").val(count);
  for (var i = 0; i < count; i++) {
    $('.questionInput').children().eq(i).find('input[type=text]').attr('name','question'+ i);
    $('.questionInput').children().eq(i).find('input[type=file]').attr('name','img'+ i);
  }
  $('form').submit();
}
