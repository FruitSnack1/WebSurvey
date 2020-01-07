let questionsDisplayed = 1

function getSite(siteurl) {
  $.ajax({
    method: 'GET',
    url: siteurl,
    success : data =>{
      replaceContent($(data).find('.main-content').html())
    }
  })
}

function tabActive(tab){
  $('.navbar__list').children().each(function (){
    $(this).removeClass('active');
  });

  $(tab).parent().addClass('active');
}

function replaceContent(content) {
  $('.main-content').html(content);
}

function addQuestion() {
  $(`#question${questionsDisplayed}`).show();
  questionsDisplayed++;
}

function createAnketa() {
  $('form').ajaxSubmit(function(){
    getSite('/ankety/mojeankety');
  });
}

function deleteAnketa(id) {
  $.ajax({
    method: 'DELETE',
    url: `/ankety/delete/${id}`,
    success : data =>{
      replaceContent($(data).find('.main-content').html())
    }
  })
}
