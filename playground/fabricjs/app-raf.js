$(function(){
  var docWidth = $(document).width(),
      docHeight = $(document).height(),
      cols = 1,
      rows = 12,
      padding = Math.round(docHeight * 0.25),
      gutter = 5,
      boxW = Math.round((docWidth - ((padding * 2) + (cols-1) * gutter))/cols),
      boxH = Math.round((docHeight - ((padding * 2) + (rows-1) * gutter))/rows),
      canvas, animate, easing;

  $('#c').attr({
    'height': docHeight+'px',
    'width': docWidth+'px'
  });

  canvas = new fabric.Canvas('c');
  canvas.setBackgroundColor('#ffffff');

  easing = {
    easeInOutExpo: function(t, b, c, d) {
      //currentIteration, startValue, changeInValue, totalIterations;
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      }
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  };

  animate = function(){
    var enterFrame,
        iteration = 0,
        totalIterations = 90,
        delay = 1,
        boxes = canvas.getObjects(),
        raf;

    enterFrame = function(){
      $.each(boxes, function(i, box){
        var newAngle = easing.easeInOutExpo(iteration - (i*delay), 0, 360, totalIterations);
        box.set('angle', newAngle);
      });

      canvas.renderAll();

      if(iteration - (boxes.length*delay) < totalIterations) {
        iteration += .5;
      }
      else {
        iteration = 0;
        // cancelAnimationFrame(raf);
        // return false;
      }

      raf = requestAnimationFrame(enterFrame);
    };

    enterFrame();
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
  // canvas.on('mouse:down', function(options){
    animate();
  // });
});


// Request animation resources

// http://jsfiddle.net/dannygarcia/LqP2R/45/
// https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame
// http://css-tricks.com/using-requestanimationframe/