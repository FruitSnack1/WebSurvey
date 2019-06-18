
$(document).ready(function(){
  $('#myForm').ajaxForm(function() {
    alert("Thank you for your comment!");
  });
});
let count = 1;
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
  $('.content-loading').css('display','flex');
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
  console.log('image uploaded');
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

function sectorCountChange() {
  $('.sector-select').empty();
  for (var i = 1; i <= $('#sector-count-select').val(); i++) {
    $('.sector-select').append($('<option></option>').text(i));
  }
}

function langEnChange() {
  if($('.lang-en-input').is(':visible')){
    $('.lang-en-input').hide();
    $('.lang-cz-input').css('padding-bottom','0');
  }else{
    $('.lang-en-input').fadeIn(300);
    $('.lang-cz-input').css('padding-bottom','.2rem');
  }
}
