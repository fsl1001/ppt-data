$(function(){
  var mycanvas=document.getElementById("myCanvasTag");
  var mycontext=mycanvas.getContext('2d');
  var width = parseInt($('#myCanvasTag').css('width').replace('px',''));
  var height = parseInt($('#myCanvasTag').css('height').replace('px',''));
  mycanvas.width = width;
  mycanvas.height = height;

  var ball_cnt = 10;
  var ball_maxR =10;
  var ball_minR = 1;
  var ball_maxV = 0.05;
  var ball_minV = 0.02;
  var ball_fill = 'rgba(222,222,222,.4)';
  var ball_stoke = 'rgba(200,200,200,.7)';
  var line_color = 'rgba(222,222,222,.4)';
  var line_width = 0.2;
  
  var balls = [];
  function init(){
    balls=[];
    for(var i=0;i<ball_cnt;i++){
      var ball = {};
      ball.radius = Math.random()*ball_maxR+ball_minR;
      ball.x = Math.random()*width;
      ball.y = Math.random()*height;
      ball.v  = Math.random()*ball_maxV+ball_minV;
      ball.direct={};
      ball.direct.x=Math.random()*(Math.random()>0.5?1:-1);
      ball.direct.y=Math.random()*(Math.random()>0.5?1:-1);
      balls.push(ball);
    }
  }
  function drawball(p){
    for(var i = 0 ;i<balls.length;i++){
      mycontext.beginPath();
      var ball = balls[i];
      mycontext.arc(ball.x, ball.y, ball.radius, 0 , 2 * Math.PI, false);
      mycontext.fillStyle = ball.fillcolor||ball_fill;
      mycontext.fill();
      mycontext.lineWidth = line_width;
      mycontext.strokeStyle = ball_stoke;
      mycontext.stroke();
      if(p && mycontext.isPointInPath(p.x, p.y)){   
        //修改点中区域的颜色   
        mycontext.fillStyle='#F39814'; 
        ball['fillcolor'] =  '#F39814'; 
        mycontext.beginPath();   
        mycontext.arc(ball.x, ball.y, ball.radius, 0 , 2 * Math.PI, false);  
        mycontext.fill();   
        mycontext.lineWidth = line_width;
        mycontext.strokeStyle = ball_stoke;
        mycontext.stroke();
      }
    }
  }
  function drawline(p){
    for(var i = 0 ;i<balls.length;i++){
      for(var j=i;j<balls.length;j++){
        mycontext.beginPath();
        var ball = balls[i];
        mycontext.moveTo(ball.x,ball.y);
        var ball2 = balls[j];
        mycontext.lineTo(ball2.x,ball2.y);
        mycontext.lineWidth = line_width;
        mycontext.strokeStyle = ball_stoke;
        mycontext.stroke();

      }
      
    }
  }
  init();
  function reDraw(p){
    mycontext.save();
    mycontext.setTransform(1,0,0,1,0,0);
    mycontext.clearRect(0,0,width,height);
    drawball(p);
    drawline(p);
    mycontext.restore();
  }
  
  setInterval(function(){
    setBall(30);
    reDraw();
  },30);
  function setBall(interval){
    for(var i = 0 ;i<balls.length;i++){
      var ball = balls[i];
      var sinV = ball.direct.y/Math.sqrt(ball.direct.x*ball.direct.x+ball.direct.y*ball.direct.y);
      var cosV = ball.direct.x/Math.sqrt(ball.direct.x*ball.direct.x+ball.direct.y*ball.direct.y);

      ball.x = ball.x + ball.v*cosV*interval;
      ball.y = ball.y + ball.v*sinV*interval;
      if(ball.x>=width || ball.x<=0){
        ball.direct.x = -ball.direct.x;
      }
      if(ball.y>=height || ball.y<=0){
        ball.direct.y = -ball.direct.y;
      }
      
    }
  }
  //监听事件
  function getEventPosition(ev){   
    var x, y;   
    if (ev.layerX || ev.layerX == 0) {   
      x = ev.layerX;   
      y = ev.layerY;   
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera   
      x = ev.offsetX;   
      y = ev.offsetY;   
    }   
    return {x: x, y: y};   
  }  

  $('#myCanvasTag').click(function(e){
    p = getEventPosition(e);   
    reDraw(p);
  })
  //监听窗口改变
  $(window).resize(function(){
    var newwidth = parseInt($('#myCanvasTag').css('width').replace('px',''));
    var newheight = parseInt($('#myCanvasTag').css('height').replace('px',''));
    width = newwidth;
    height = newheight;
    mycanvas.width = width;
    mycanvas.height = height;
    init();
  })

}) 
   
