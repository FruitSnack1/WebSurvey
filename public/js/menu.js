$(function () {
  const updateVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  updateVH();
  window.onresize = updateVH;
})
function expandTile(tile) {
  let col;
  switch (tile) {
    case 1:
      col = 'rgb(165,212,0)';
      break;
    case 2:
      col = 'rgb(0,191,214)';
      break;
    case 3:
      col = 'rgb(255,184,27)';
      break;
    case 4:
      col = 'rgb(55,55,160)';
      break;
    case 5:
      col = 'rgb(219,0,50)';
      break;
    case 6:
      col = 'rgb(159,161,162)';
      break;
    case 7:
      col = 'rgb(219,19,103)';
      break;
    case 8:
      col = 'rgb(26,27,28)';
      break;
  }
  const el = $('.menu-tile').eq(tile - 1);
  el.addClass('big');
  el.find('span').fadeOut(100);
  el.css('z-index', 1000);
  for (var i = 0; i < $('.menu-tile').length; i++) {
    if (i == tile - 1) continue;
    $('.menu-tile').eq(i).fadeOut(200);
  }
  $('.menu-big-tile').fadeIn(200);
  $('.menu-big-tile p').html($('.menu-tile').eq(tile - 1).find('span').html());
  // $('.menu-big-tile').css('background',col);
  // $('.menu-big-tile').show();
}

$('.menu-big-tile').on('click', (e) => {
  $('.menu-big-tile').fadeOut(200);
});
function selectAnketa(id) {
  window.location.href = `https://${location.host}/playA/hmi/${id}`;
}
