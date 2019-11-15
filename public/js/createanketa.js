
$(document).ready(function(){
  $('#myForm').ajaxForm(function() {
    alert("Thank you for your comment!");
  });

});

let count = 3;
for (var i = 1; i < 20; i++) {
  $('#question' + i).css('display', 'none');
}
$("input[name=count]").change(function() {
  let val = $("input[type=number][name=count]").val();
  for (var i = 0; i < 20; i++) {
    if (i < val)
      $('#question' + i).css('display', 'block');
    else
      $('#question' + i).css('display', 'none');
  }
});

function addQuestion() {
  count++;
  // for (var i = 0; i < 20; i++) {
  //   if(i < count)
  //     $('#question' + i).css('display', 'block');
  //   else
  //     $('#question' + i).css('display', 'none');
  // }
  let i = 0;
  let item = $('.questionInput').children().first();
  while (i < count) {
    item.css('display', 'block');
    item = item.next();
    i++;
  }
}

function deleteQuestion(index) {
  count--;
  $('#question' + index).css('display', 'none');
  $('#question' + index).find('input[type=text]').val('');
  $('#question' + index).find('input[type=file]').val('');
  $('#question' + index).find('.img-container').css('background-image', 'url()');
  $('#question' + index).find('.input-img-label').html('Vybrat obrázek');
  let q = $('.questionInput').children().last();
  $('#question' + index).insertAfter(q);
}


function finish() {
  $('.main-container').css('filter','blur(.2rem)');
  $('.content-loading').show();
  var input = $("<input>")
                 .attr("type", "hidden")
                 .attr("name", "cluster").val(cluster);
  $('form').append(input);

  $("input[type=number][name=count]").val(count);
  for (var i = 0; i < count; i++) {
    $('.questionInput').children().eq(i).find('input[type=text]').attr('name', 'question' + i);
    $('.questionInput').children().eq(i).find('input[type=file]').attr('name', 'img' + i);
  }
  $('form').ajaxSubmit(function(){
    getSite('settings');
    $('.content-loading').hide();
    $('.main-container').css('filter','none');
  });
}

// $('.input-img').change(function() {
//   var file = this.files[0].name;
//   $(this).prev().eq(0).html(file);
// });

// $('.input-img').on('change', function() {
//   console.log('image uploaded');
//   let preview = $(this).parent();
//   let file = this.files[0];
//   let reader = new FileReader();
//   let label = $(this).prev();
//   reader.addEventListener("load", function() {
//     preview.css('background-image', 'url("' + reader.result + '")');
//     label.html('Změnit obrázek');
//     label.css('box-shadow', '0 0 1rem 0.2rem black');
//   }, false);
//
//   if (file) {
//     reader.readAsDataURL(file);
//   }
// });

function imgChange(element){
  let preview = $(element).parent();
  let file = element.files[0];
  let reader = new FileReader();
  let label = $(element).prev();
  reader.addEventListener("load", function() {
    preview.css('background-image', 'url("' + reader.result + '")');
    label.html('Změnit obrázek');
    label.css('box-shadow', '0 0 1rem 0.2rem black');
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function showAdvancedSettings(){
  if($('.advanced-settings').is(':visible')){
    $('.advanced-settings').hide();
    $('#advanced-settings-icon').removeClass('fa-chevron-up');
    $('#advanced-settings-icon').addClass('fa-chevron-down');
  }else{
    $('.advanced-settings').fadeIn(500);
    $('#advanced-settings-icon').removeClass('fa-chevron-down');
    $('#advanced-settings-icon').addClass('fa-chevron-up');
  }
}


function sectorChange() {
  if($('#sector-count').is(':visible')){
    $('#sector-count').hide();
    $('.sector-container').hide();
  }else{
    $('#sector-count').fadeIn(500);
    $('.sector-container').show();
  }
}

function weightChange() {
  if($('#weights').is(':checked')){
    $('.weight-container').show();
  }else{
    $('.weight-container').hide();
  }
}

function sectorCountChange(count) {
  $('.sector-select').empty();
  for (var i = 1; i <= count; i++) {
    $('.sector-select').append($('<option></option>').text(i));
  }
}

function langEnChange() {
  if($('.lang-en-input').is(':visible')){
    $('.lang-en-input').hide();
    // $('.lang-cz-input').css('padding-bottom','0');
  }else{
    $('.lang-en-input').fadeIn(300);
    // $('.lang-cz-input').css('padding-bottom','.2rem');
  }
}

function langDeChange() {
  if($('.lang-de-input').is(':visible')){
    $('.lang-de-input').hide();
    // $('.lang-cz-input').css('padding-bottom','0');
  }else{
    $('.lang-de-input').fadeIn(300);
    // $('.lang-cz-input').css('padding-bottom','.2rem');
  }
}

function addMpsQuestion() {

}

function loadFromCsv(){
  let file = $('#csv-input')[0].files[0];
  console.log(file);
  let r = new FileReader();
  r.onload = function(e) {
    var contents = e.target.result;
    console.log(contents);
    let list = contents.split('\n');
    let list2 = [];
    for (var i = 0; i < list.length; i++) {
      list2.push(list[i].split('\t'));
    }
    console.log(list2);
    if(list2[1].length > 2){
      langEnChange();
      $('#lang_en').prop('checked',true);
    }
    if(list2[1].length > 3){
      langDeChange();
      $('#lang_de').prop('checked',true);
    }
    for (var i = 0; i < $('input[name="name"]').length; i++) {
      $('input[name="name"]').eq(i).val(list2[1][i+1]);
    }
    for (var i = 0; i < list2.length-3; i++) {
      console.log(i);
      if(i != 0)
        addQuestion();
      for (var j = 0; j < list2[1].length-1; j++) {
        $(`input[name="question${i}"]`).eq(j).val(list2[i+2][j+1]);
      }
    }
 }
  r.readAsText(file);
  console.log(r.result);
}
