let scripts = {
  'home' : true,
  'createquiz' : true,
  'createanketa' : true
}
let cluster = null;
let pass = null;
let temp_cluster = null;
let temp_pass = null;
let anim = true;
let target = null;
let editAnketaJson;
let editLinkImgsJson = {};
let imgJson = {};
let playSelect;
let playLang = 'cz';
let editData;

$('.active').click(function() {
  if (anim) {
    $('.cluster-list-drop').css('display', 'block');
    anim = !anim;
  } else {
    $('.cluster-list-drop').css('display', 'none');
    anim = !anim;
  }
});
$('.cluster-item').click(function() {
  if (!$(this).hasClass('active')) {
    target = $(this);
    // let active = $('.active').eq(0).children().eq(0).attr('src');
    let change = $(this).children().eq(0).attr('src');
    // $('.active').children().eq(0).attr('src', target);
    // $(this).children().eq(0).attr('src', active);
    let re = new RegExp('(?!^)[a-z]{3,5}');
    let result = change.match(re);
    temp_cluster = result[0];
    $('.password').css('display', 'flex');
    $('.password-input').focus();
  }
  $('.cluster-list-drop').css('display', 'none');
});

$('.cluster-select-shape-out').click(function(){
  // let change = $(this).attr('src');
  // let re = new RegExp('(?!^)[a-z]{3,5}');
  // let result = change.match(re);
  temp_cluster = $(this).attr('data-cluster');
  $('.password').css('display', 'flex');
  $('.password-input').focus();
});

function confirmPassword() {
  temp_pass = $('.password-input').val();
  // getSite('home','', new_pass);
  login(temp_cluster, temp_pass);
}
$(document).on('keypress', function(event){
  if(event.which == 13 && $('.password').is(":visible")){
    confirmPassword();
  }
})

function cancelPassword() {
  $('.password-input').val('');
  $('.password').hide();
}

function successCange() {
  let active = $('.active').eq(0).children().eq(0).attr('src');
  let change = target.children().eq(0).attr('src');
  $('.active').children().eq(0).attr('src', change);
  target.children().eq(0).attr('src', active);
}

// function getSite2(site, params) {
//   if(site=='home'){
//     $('#settings').removeClass('navbar-item-active');
//     $('#home').addClass('navbar-item-active');
//   }
//   if(site=='settings'){
//     $('#home').removeClass('navbar-item-active');
//     $('#settings').addClass('navbar-item-active');
//   }
//   let oReq = new XMLHttpRequest();
//   oReq.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       if (this.responseText == 'Incorrect password') {
//         $('.password').addClass('shake').delay(500).queue(function(){
//           $(this).removeClass('shake');
//           $(this).dequeue();
//         });
//         $('.password-input').focus();
//       } else {
//         changeCluster(cluster);
//         $('.password').hide();
//         $('.password-input').val('');
//         $('.cluster-list').show();
//         $('.content').replaceWith($(this.responseText).find('.content'));
//         if(!scripts[site]){
//           $.getScript('js/'+site+'.js', function(){
//             scripts[site] = true;
//             if(site=='results'){
//               setResultData();``
//             }
//           });
//         }else if(site=='results'){
//           setResultData();
//           // $('.content').replaceWith($(this.responseText).find('.content'));
//         }
//         // $('.container').css('display', 'flex');
//         // successCange();
//       }
//       // document.write(this.responseText);
//     }
//   };
//   // oReq.addEventListener("load", reqListener);
//   oReq.open('POST', '/', true);
//   oReq.setRequestHeader("Content-Type", "application/json");
//   oReq.send(JSON.stringify({
//     cluster,
//     "site": site,
//     "pass": pass,
//     "params": params
//   }));
//
// }

function getSite(site, param) {
  if(site=='home'){
    $('#settings').removeClass('navbar-item-active');
    $('#home').addClass('navbar-item-active');
  }
  if(site=='settings'){
    $('#home').removeClass('navbar-item-active');
    $('#settings').addClass('navbar-item-active');
  }
  $.ajax({
    type:'GET',
    url:`/${site}`,
    data:{
      cluster,
      param
    },
    beforeSend: function(xhr){
      if(localStorage.token)
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
    },
    success:function(data){
      changeCluster(cluster);
      $('.password').hide();
      $('.password-input').val('');
      $('.cluster-list').show();
      $('.content').replaceWith($(data).find('.content'));

      if(!scripts[site]){
        $.getScript('js/'+site+'.js', function(){
          scripts[site] = true;
          if(site=='results')
            setResultData();
          if(site=='editanketa')
            setEditData();
        });
      }else{
        if(site=='results')
          setResultData();
        if(site=='editanketa')
          setEditData();
      }
    }
  });
  // $.get('/'+site, {pass,cluster,param}, (data)=>{
  //     if (data == 'Incorrect password') {
  //       $('.password').addClass('shake').delay(500).queue(function(){
  //         $(this).removeClass('shake');
  //         $(this).dequeue();
  //       });
  //       $('.password-input').focus();
  //     } else {
  //       changeCluster(cluster);
  //       $('.password').hide();
  //       $('.password-input').val('');
  //       $('.cluster-list').show();
  //       $('.content').replaceWith($(data).find('.content'));
  //
  //       if(!scripts[site]){
  //         $.getScript('js/'+site+'.js', function(){
  //           scripts[site] = true;
  //           if(site=='results')
  //             setResultData();
  //           if(site=='editanketa')
  //             setEditData();
  //         });
  //       }else{
  //         if(site=='results')
  //           setResultData();
  //         if(site=='editanketa')
  //           setEditData();
  //       }
  //       // $('.container').css('display', 'flex');
  //       // successCange();
  //     }
  //     // document.write(this.responseText);
  //
  // });
}

function changeCluster(name){
  let active = $('.active').children().eq(0);
  let target = $('img[src="img/'+name+'.png"]');
  target.attr('src',active.attr('src'));
  active.attr('src','img/'+name+'.png')
}

function login(){
  $.post('/login', {"pass":temp_pass,"cluster":temp_cluster}, (data)=>{
    if(data == 'Incorrect password'){
      $('.password').addClass('shake').delay(500).queue(function(){
        $(this).removeClass('shake');
        $(this).dequeue();
      });
      $('.password-input').focus();
    }else{
      // pass = temp_pass;
      cluster = temp_cluster;
      // changeCluster(cluster);
      // $('.password').hide();
      // $('.password-input').val('');
      // $('.cluster-list').show();
      // $('.content-container').replaceWith(data);
      localStorage.token = data;
      $.ajax({
        type:'GET',
        url:'/home',
        data:{
          cluster
        },
        beforeSend: function(xhr){
          if(localStorage.token)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
        },
        success:function(data){
          cluster = temp_cluster;
          changeCluster(cluster);
          $('.password').hide();
          $('.password-input').val('');
          $('.cluster-list').show();
          $('.content-container').replaceWith(data);
        }
      })
    }
  });
}

function editLinkImgs(){
  editLinkImgsJson = {};

  for (var i = 0; i < editAnketaJson.questions.length; i++) {
    if(editAnketaJson.questions[i].img != "data/default.png")
      editLinkImgsJson[i] = editAnketaJson.questions[i].img;
  }
}
function editLinkImgsQ(){
  editLinkImgsJsonQ = {};

  for (var i = 0; i < editQuizJson.questions.length; i++) {
    if(editQuizJson.questions[i].img != "data/default.png")
      editLinkImgsJsonQ[i] = editQuizJson.questions[i].img;
  }
}
function switchCluster(){
  $('.switch-cluster').css('display','flex');
}
function confirmSwitch(){
  location.reload();
}
function declineSwitch(){
  $('.switch-cluster').hide();
}
function playConfirm(id, name, len) {
  if(len == 2)
    $('.confirm-lang-container').show();
  else
    $('.confirm-lang-container').hide();
  $('#playConfirm').show();
  $('#playConfirm').find('h3').html('Chcete spustit '+name+' ?');
  playSelect = id;
}
function confirmPlay() {
  window.location.href = `https://${location.host}/playA/${cluster}/${playSelect}`;
}
function declinePlay() {
  $('#playConfirm').hide();
}
function changeLang(lang) {
  playLang = lang;
  if(lang == 'cz'){
    $('#lang-cz').addClass('confirm-lang-icon-selected');
    $('#lang-en').removeClass('confirm-lang-icon-selected');
  }else{
    $('#lang-en').addClass('confirm-lang-icon-selected');
    $('#lang-cz').removeClass('confirm-lang-icon-selected');
  }
}
