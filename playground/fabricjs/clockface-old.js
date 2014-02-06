$(function(){
  var docWidth = 400, //docWidth = $(document).width(),
      docHeight = 400,
      shortest = (docWidth > docHeight) ? docHeight : docWidth,
      radius = shortest - Math.round(shortest * 0.25),
      arcs = [],
      canvas, animate;

  //Set up the canvas
  // $('#c').attr({
  //   'height': docHeight+'px',
  //   'width': docWidth+'px'
  // });

  canvas = new fabric.Canvas('c');
  canvas.setBackgroundColor('#ffffff');

  //Animate clock
  animate = function(showArcs){
    $.each(arcs, function(i, arc){
      arc.animate();
    });
  };


  //Drawing helper methods
  arcCoordinates = function(arcRadius, startAngle, endAngle) {
    var degrees = endAngle - startAngle,
        offset = -90,
        cx = Math.round(docWidth/2),
        cy = Math.round(docHeight/2),
        startX = cx+arcRadius*Math.cos((offset+startAngle)*Math.PI/180),
        startY = cy+arcRadius*Math.sin((offset+startAngle)*Math.PI/180),
        endX = cx+arcRadius*Math.cos((offset+endAngle)*Math.PI/180),
        endY = cy+arcRadius*Math.sin((offset+endAngle)*Math.PI/180),
        arcSVG = [arcRadius, arcRadius, 0, +(degrees > 180), 1, endX-startX, endY-startY].join(' ');

    // return 'M0 0 L'+startX+' '+startY + " a" + arcSVG;
    return 'L'+startX+' '+startY + " a" + arcSVG;
    // return 'M'+Math.round(docWidth/2)+' '+Math.round(docHeight/2)+' M'+startX+' '+startY + " a " + arcSVG;
  };



  //Make new clock arc method
  var Arc = function(i){
    var arcPath = arcCoordinates(200, i * 30, (i + 1) * 30);

    this.arc = new fabric.Path(arcPath, {
      fill: '',
      stroke: 'red',
      opacity: 0.75
    });
    // this.arc.set({left: Math.round(docWidth/2), top: Math.round(docHeight/2)});
    this.arc.set({left: 0, top: 0});

    canvas.add(this.arc);
  };

  Arc.prototype.animate = function() {
    var visible = this.arc.get('opacity');

    if(visible) {
      this.arc.set({opacity: 0});
    }
    else {
      this.arc.set({opacity: 0.75});
    }

    // var go,
    //     boxes = canvas.getObjects(),
    //     total = boxes.length;

    // go = function(){
    //   $.each(boxes, function(i, box){
    //     setTimeout(function(){
    //       //animate
    //       box.animate('angle', '+=180', {
    //         easing: fabric.util.ease.easeInOutExpo,
    //         duration: 2500,
    //         onChange: canvas.renderAll.bind(canvas),
    //         onComplete: function(){
    //           if(i+1 === total) go();
    //         }
    //       });
    //     }, (100 + i*50));
    //   });
    // };

    // go();
  };


  //Generate clock arcs
  for (var i = 0; i < 5; i++) {
    arcs.push(new Arc(i));
  };

  //Animate arcs
  canvas.on('mouse:down', function(options){
    animate();
  });

});