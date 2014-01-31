$(function(){

  var canvas = new fabric.Canvas('c'),
      cols = 4,
      yOffset = 100,
      animateObject;

  animateObject = function(obj){
    obj.animate('angle', '+=360', {
      onChange: canvas.renderAll.bind(canvas),
      duration: 2000,
      easing: fabric.util.ease.easeInOutCirc
    });
  };

  //fabric test
  for (var i = 1; i <= 1; i++) {
    var circle = new fabric.Rect({
      left: ((i-1)%cols === 0) ? 101 : (i-((Math.floor((i-1)/cols)))*cols) * 101,
      top: yOffset + (Math.floor((i-1)/cols) * 101),
      width: 100,
      height: 100,
      // radius: 20,
      fill: 'black',
      opacity: 0.75,
      hasControls: false,
      selectable: false,
      originX: 'center',
      originY: 'center'
    });

    canvas.add(circle);

    animateObject(circle);
  };

  setInterval(function(){
    $.each(canvas.getObjects(), function(i, obj){
      animateObject(obj);
    });
  }, 2200);
});