$(function(){
  var docWidth = $(document).width(),
      docHeight = $(document).height(),
      cols = 1,
      rows = 12,
      padding = Math.round(docHeight * 0.25),
      gutter = 5,
      boxW = Math.round((docWidth - ((padding * 2) + (cols-1) * gutter))/cols),
      boxH = Math.round((docHeight - ((padding * 2) + (rows-1) * gutter))/rows),
      canvas, animate;

  $('#c').attr({
    'height': docHeight+'px',
    'width': docWidth+'px'
  });

  canvas = new fabric.Canvas('c');
  canvas.setBackgroundColor('#ffffff');


  animate = function(){
    var go,
        boxes = canvas.getObjects(),
        total = boxes.length;

    go = function(){
      $.each(boxes, function(i, box){
        setTimeout(function(){
          //animate
          box.animate('angle', '+=180', {
            easing: fabric.util.ease.easeInOutExpo,
            duration: 2500,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function(){
              if(i+1 === total) go();
            }
          });
        }, (100 + i*50));
      });
    };

    go();
  };

  //Make some boxes
  for (var i = 1; i <= (cols*rows); i++) {
    var box = new fabric.Rect({
      left: ((i-1)%cols === 0) ? padding + (boxW/2) : padding + (boxW/2) + ((i-1) - (Math.floor((i-1)/cols) * cols)) * (boxW + gutter),
      top: padding + (boxH/2) + Math.floor((i-1)/cols) * (boxH+gutter),
      width: boxW,
      height: boxH,
      fill: 'black',
      opacity: 0.75,
      hasControls: false,
      selectable: false,
      originX: 'center',
      originY: 'center',
      angle: 0
    });

    canvas.add(box);
  };

  //Animate boxes
  animate();
});