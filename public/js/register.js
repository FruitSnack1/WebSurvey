let userAge = null;

function setUserAge(age, button) {
  userAge = age;
  let parent = $(button).parent().find('button');
  for (var i = 0; i < parent.length; i++) {
    if(parent[i] != button)
      parent.eq(i).css('opacity','.5');
    else
      parent.eq(i).css('opacity','1');
  }
}
function register() {
  if(!($('input[name="pin"]').val().length && userAge)){
    if(!$('input[name="pin"]').val().length)
      $('#required-pin').show();
    else
      $('#required-pin').hide();
    if(!userAge)
      $('#required-age').show();
    else
      $('#required-age').hide();
    return
  }
  $('#required-pin').hide();
  $('#required-age').hide();
  $.ajax({
    type : 'POST',
    url : '/register',
    data : {
      'pin' : $('input[name="pin"]').val(),
      'age' : userAge
    },
    success : (res)=>{
      switch (res) {
        case '1':
          location.reload();
          break;
        case '2':
          $('#error-desc').html('Osobní číslo neexistuje');
          $('.error').slideDown(300).delay(3000).fadeOut(500);
          break;
        case '3':
          $('#error-desc').html('Osobní číslo registrováné');
          $('.error').slideDown(300).delay(3000).fadeOut(500);
          break;
        default:

      }
    }
  });
}
