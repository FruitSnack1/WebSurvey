let countQ = 1;
for (var i = 1; i < 20; i++) {
  $('#question' + i).css('display', 'none');
}
for (var i = 0; i < 20; i++) {
  for (var j = 3; j < 5; j++) {
    $('#answers'+i+j).css('display','none');
  }
}
$("input[name=count]").change(function() {
  let val = $("input[type=number][name=count]").val();
  let change = val - count;
  count = val;
  if (change > 0) {
    for (var i = 0; i < change; i++) {
      let step = count - change + i;
      $('#question' + step).css('display', 'block');
    }
  } else {
    for (var i = 0; i < Math.abs(change); i++) {
      let step = count - change - i - 1;
      $('#question' + step).css('display', 'none');
    }
  }
});

function selectChange(select) {
  var id = select.id.replace('answers-count', '');
  for (var i = 0; i < 5; i++) {
      if(i <= select.value-1){
        $('#answers'+id+i).css('display','flex');
      }else{
        $('#answers'+id+i).css('display','none');
      }
  }
}
function addQuestionQ() {
  countQ++;
  for (var i = 0; i < 20; i++) {
    if(i < countQ)
      $('#question' + i).css('display', 'block');
    else
      $('#question' + i).css('display', 'none');
  }
  // let i = 0;
  // let item = $('.questionInput').children().first();
  // while (i < countQ) {
  //   item.show();
  //   item = item.next();
  //   i++;
  // }
}

function deleteQuestionQ(index) {
  countQ--;
  $('#question' + index).hide();
  $('#question' + index).find('input[type=text]').val('');
  $('#question' + index).find('input[type=file]').val('');
  $('#question' + index).find('input[type=checkbox]').prop("checked", false);
  $('#question' + index).find('.img-container').css('background-image', 'url()');
  $('#question' + index).find('select').val('3');
  selectChange($('#question' + index).find('select')[0]);
  $('#question' + index).find('.input-img-label').html('Vybrat obrázek');
  let q = $('.questionInput').children().last();
  $('#question' + index).insertAfter(q);
}

$('.input-img').change(function() {
  let preview = $(this).parent();
  let file = this.files[0];
  let reader = new FileReader();
  let label = $(this).prev();
  reader.addEventListener("load", function() {
    preview.css('background-image', 'url("' + reader.result + '")');
    label.html('Změnit obrázek');
    label.css('box-shadow', '0 0 1rem 0.2rem black');
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
});

function finishQ() {
  $('.content-loading').css('display','flex');
  var input = $("<input>")
                 .attr("type", "hidden")
                 .attr("name", "cluster").val(cluster);
  $('form').append(input);

  $("input[type=number][name=count]").val(countQ);
  for (var i = 0; i < countQ; i++) {
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
  $('form').ajaxSubmit(function(){
    getSite('settings');
    $('.content-loading').hide();
  });
}
