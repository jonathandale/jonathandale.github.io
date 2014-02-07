$(function(){
  var docWidth = $(document).width(),
      docHeight = $(document).height(),
      shortest = (docWidth > docHeight) ? docHeight : docWidth,
      radius = Math.round(shortest - Math.round(shortest * 0.25)),
      arcs = [],
      segments = 12,
      delay = 2,
      totalIterations = 80,
      easing, canvas, animate;

  //Set up the canvas
  $('#clockface').attr({
    'height': docHeight+'px',
    'width': docWidth+'px'
  });

  canvas = new fabric.Canvas('clockface');
  canvas.setBackgroundColor('#ffffff');

  easing = {
    easeInOutExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
      if ((currentIteration /= totalIterations / 2) < 1) {
        return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
      }
      return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
    },
    easeOutExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
      return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
    },
    easeInExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
      return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
    }
  };

  //Make base circle
  // var baseCircle = new fabric.Circle({
  //   left: docWidth/2,
  //   top: docHeight/2,
  //   radius: radius/2,
  //   fill: 'black',
  //   opacity: 0.1,
  //   hasControls: false,
  //   selectable: false,
  //   originX: 'center',
  //   originY: 'center'
  // });

  // canvas.add(baseCircle);

  //Helper methods
  getArcCoordinates = function(arcRadius, startAngle, endAngle) {
    var degrees = endAngle - startAngle,
        offset = -90,
        cx = docWidth/2,
        cy = docHeight/2,
        startX = cx+arcRadius*Math.cos((offset+startAngle)*Math.PI/180),
        startY = cy+arcRadius*Math.sin((offset+startAngle)*Math.PI/180),
        endX = cx+arcRadius*Math.cos((offset+endAngle)*Math.PI/180),
        endY = cy+arcRadius*Math.sin((offset+endAngle)*Math.PI/180),
        arcSVG = [arcRadius, arcRadius, 0, +(degrees > 180), 1, endX-startX, endY-startY].join(' '),
        arcPath;

    // return 'M0 0 L'+startX+' '+startY + " a" + arcSVG;
    // return 'L'+startX+' '+startY + " a" + arcSVG;
    // return 'M'+Math.round(docWidth/2)+' '+Math.round(docHeight/2)+' M'+startX+' '+startY + " a " + arcSVG;

    arcPath = 'M'+cx+' '+cy+' M'+startX+' '+startY+ ' a' + arcSVG + ' z';

    return {
      cx: cx,
      cy: cy,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      arcPath: arcPath
    };
  };

  //Make new clock arc
  var Arc = function(i){
    this.idx = i;
    this.maxRadius = radius/2;
    this.minRadius = 0;
    this.render(this.minRadius);
  };

  Arc.prototype.render = function(arcRadius) {
    var arcCoords = getArcCoordinates(arcRadius, this.idx * (360/segments), (this.idx + 1) * (360/segments));

    if(this.arc) this.arc.remove();

    this.arc = new fabric.Path(arcCoords.arcPath, {
      fill: 'black',
      opacity: 1 - (this.idx * (1/segments)),
      originX: 'center',
      originY: 'center',
      hasControls: false,
      selectable: false
    });

    canvas.add(this.arc);
  };

  Arc.prototype.animate = function(iteration) {
    var arc = this,
        from = this.minRadius,
        to = this.maxRadius,
        idx = this.idx,
        delayedIteration = iteration - (delay * idx),
        newAngle = Math.round(easing.easeOutExpo(delayedIteration > 0 ? delayedIteration : 0, from, to, totalIterations));

      arc.render(newAngle);
  };

  function animate(){
    var enterFrame,
        iteration = 0,
        raf;

    enterFrame = function(){
      //Do anim on each arc
      $.each(arcs, function(i, arc){
        arc.animate(iteration);
      });

      canvas.renderAll();

      if(iteration - (segments*delay) < totalIterations) {
        iteration += 1;
      }
      else {
        cancelAnimationFrame(raf);
        return false;
      }

      raf = requestAnimationFrame(enterFrame);
    };

    enterFrame();
  }

  //Generate clock arcs
  for (var i = 0; i < segments; i++) {
    arcs.push(new Arc(i));
  };

  //Animate arcs
  canvas.on('mouse:down', function(options){
    animate();
  });

});