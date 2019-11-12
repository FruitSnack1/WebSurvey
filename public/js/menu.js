$(()=>{
  const updateVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  updateVH();
  window.onresize = updateVH;
})

function expandTile(tile) {
  $('.select-main-container').hide();
  $('.select-sub-container').hide();
  $(`#sub-${tile}`).show();
}

// $('.menu-big-tile').on('click', (e) =>{
//   $('.menu-big-tile').fadeOut(200);
// });

function selectAnketa(id) {
  window.location.href = `${location.protocol}//${location.host}/play/${id}`;
}
function menuHome(){
  $('.select-container').show();
  $('.info-container').hide();
  $('.map-container').hide();
  $('.select-sub-container').hide();
  $('.select-main-container').show();
}
function menuInfo() {
  $('.select-container').hide();
  $('.info-container').show();
  $('.map-container').hide();
}
function menuMap() {
  $('.select-container').hide();
  $('.info-container').hide();
  $('.map-container').show();
}
function displaySection(section) {
  $('.menu-section-container').hide();
  $('.menu-flex-item').show();
}
