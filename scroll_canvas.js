var canvas = document.querySelector("canvas");

var graphics = canvas.getContext("2d");
    
var requestAnimFrame = (function(){
        // return must be on the same line at the data
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(f){
        setTimeout(f, 1000/60);
    };
})();

fitToContainer(canvas);

var mouse = {x:0, y:0};
var onCanvas  = false;
var bounds = canvas.getBoundingClientRect();
var slideImages = [];


var temp;
var slideNum = 0;
var slideNumMax = 0;

// need to change this to be more dynamic
for(var i = 0; i <= 2; i++)
{
    
    temp = new Sprite("imgs/slides/"+i+".png");
    temp.x += canvas.width * i * 2;
    slideImages.push(temp);
    slideNumMax = slideImages.length - 1;
}



var hor = 60;

var btn1 = new button(0, 0, 0, hor, canvas.height, -1, -canvas.width/2 + 30, "imgs/arrow2.png");
var btn2 = new button(1, canvas.width - hor, 0, hor, canvas.height, 1, canvas.width/2 - 30, "imgs/arrow.png");

function fitToContainer(canvas){
            
    canvas.style.width="100%";
    canvas.style.height="400px";
            
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
}

function Sprite(url){
		this.image = new Image();
		this.x = 0;
		this.y = 0;
        this.anchorx = 0;
        this.anchory = 0;
        this.angle = 0;
		this.scale = 1;
		this.hasLoaded = false;
		
		var me = this;
		
		this.image.onload = function(){
			me.anchorx = this.width/2 - canvas.width/2;
			me.anchory = this.height/2 - canvas.height/2;
			me.hasLoaded = true;
		}
		this.image.src = url;
		
		this.draw = function(g){
			if(!this.hasLoaded) return;
			
			g.save();
			
			g.translate(this.x, this.y);
            g.rotate(this.angle);
			g.scale(this.scale, this.scale);
			g.drawImage(this.image, -this.anchorx, - this.anchory);
            
			g.restore();
		};
	}


   function button(id, x, y, w, h, scale, x2, url){
        var obj = new Sprite(url);
        this.id = id;
		obj.x = x2;
		obj.y = 0;
        obj.h = h;
        obj.w = w;
        obj.scale = 1;
        obj.angle = 0;
        this.over = false;
        obj.dead = false;
        this.alpha = .05;
       
		
        // the update logic for this object
        // dt: the delta time of this frame
        // retun: null
		this.draw = function(g){
			g.save();
            
            if(this.over === false && this.alpha > .05){
                
                this.alpha -= .05;
            }
            else if(this.over === true && this.alpha < 1){
                this.alpha += .05;
            }
            
            g.globalAlpha = this.alpha;
			g.fillStyle = "#CCC";
            g.fillRect(x, y, w, h);
            
            obj.draw(g);
            
			g.restore();

		};
        
        this.update = function(dt){
			
            if(onCanvas === true){
                if(this.id === 0 && mouse.x > 0 && mouse.x < 60){
                    this.over = true;
                }
                else if(this.id === 1 && mouse.x > canvas.width - 60 && mouse.x < canvas.width){
                    this.over = true;
                }
                else{
                    this.over = false;
                }
            }
            else{
                this.over = false;
            }
		};
       
        this.clicked = function(){
            
            if(this.id == 0){
                console.log("left");
                slideImages[slideNum].x += canvas.width*4;
                
                if(slideNum > 0)
                {
                    slideNum--;
                    slideImages[slideNum].x = 0;
                }
                else
                {
                    slideNum = slideNumMax;
                    slideImages[slideNum].x = 0;
                }

            }
            else if(this.id == 1){
                console.log("right");
                slideImages[slideNum].x += canvas.width * 2;
                if(slideNum < slideNumMax)
                {
                    slideNum++;
                    slideImages[slideNum].x = 0;
                }
                else
                {
                    slideNum = 0;
                    slideImages[slideNum].x = 0;
                }
                
            }
            
        }
		
	}



/* -------------------General Functions------------------------*/
	
	// Track the mouse cursor
	canvas.addEventListener("mousemove", function(e){ 
        bounds = canvas.getBoundingClientRect();
        mouse.x = e.clientX - bounds.left;
        mouse.y = e.clientY - bounds.top;

    });
    canvas.addEventListener("mouseenter", function(e){ 
        onCanvas = true;

    });
    canvas.addEventListener("mouseleave", function(e){ 
        onCanvas = false;

    });
	canvas.addEventListener("mousedown", function(e){
		
		isMouseDown = true;
	});
	canvas.addEventListener("mouseup", function(e){
		
		isMouseDown = false;
	});
	canvas.addEventListener("click", function(e){
        console.log(btn1.over);
        if(btn1.over === true)
        {
            btn1.clicked();
        }
        
        if(btn2.over === true)
        {
            btn2.clicked();
        }
	});
	
	/* -------------------Game Loop ----------------------*/



var ptime = 0;
	function gameloop(time){ 
        if(isNaN(time)) time = 0;
        
        var dt = (time - ptime) / 1000;
        ptime = time;
        
        update(dt);
        draw();
        requestAnimFrame(gameloop);
    }
	function update(dt){
		
        btn1.update(dt);
        btn2.update(dt);
		/*
        delayUntilNextAsteroid -= dt;
        
        if(delayUntilNextAsteroid <= 0){
            asteroids.push(new Asteroid());
            delayUntilNextAsteroid = .5;
        }
        
        for(var i = asteroids.length - 1; i >= 0; i--){
            asteroids[i].update();
            if(asteroids[i].dead === true){
                asteroids.splice(i, 1);
            }
        }
		*/
		
		
        //console.clear();
        //console.log(asteroids.length);
		//console.log("X: " + mouse.x + " :: Y: " + mouse.y);
    }
    function draw(){
        graphics.clearRect(0,0, canvas.width, canvas.height);
        
        for(var i = 0; i <= slideNumMax; i++)
        {
		  slideImages[i].draw(graphics);
        }
        btn1.draw(graphics);
        btn2.draw(graphics);
    }
    gameloop();