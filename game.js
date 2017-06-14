//http://www.w3school.com.cn/tiy/t.asp?f=jseg_timing1
var canvas, ctx, info;
var bg, button, X;
var hammer, hamX, hamY;
var manState, manFrmLen = 10, manPress = false;
var sprites = [], holes = [], Hearts = [];
var score = 0;

var time = 0;
var Downtime = 0;

var DrawDialog = true;
var DialogPage = 'Begin';	//Begin, Fail, Success

/* Object*/
function Button(x, y, w, h, state, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = state;       // begin, pressed, end
    this.imageShift = 0;
    this.image = image;
}
var Sprite = function(w, h, x, y, state, image, check){
	var self = this;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.image = image;
	this.state = state;
	this.check = check;
	
	this.draw = function(){
		if(this.state == 'show'){
			ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
			setTimeout(function(){
				self.state = 'hide';
			},1100);
		}
	}
}
var Love = function(w, h, x, y, state, image){
	var self = this;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.image = image;
	this.state = state;
	
	this.draw = function(){
		if(this.state == 'show'){
			ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
		}
	}
}
var HoleSprite = function(w, h, x, y, state, image){
	var self = this;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.image = image;
	this.state = state;
	
	this.draw = function(){
		if(this.state == 'show'){
			ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
		}
	}
}
function HammerSprite(w, h, x, y, image){
	HammerSprite.prototype.w = w;
	HammerSprite.prototype.h = h;
	HammerSprite.prototype.x = x;
	HammerSprite.prototype.y = y;
	
	HammerSprite.prototype.draw = function(isPress){
		if(isPress){
			ctx.save();
			
			ctx.translate(this.x-10, this.y+34);
			ctx.rotate(Math.PI/180*330);
			ctx.drawImage(image, 0, 0, w, h);
			
			ctx.restore();
		}else{
			ctx.drawImage(image, this.x, this.y, w, h);
		}
		
	}
}


/* Secense*/

function drawDialog() { // draw dialog function
    if (DrawDialog == true) {
        var bg_gradient = ctx.createLinearGradient(0, 200, 0, 400);
        bg_gradient.addColorStop(0.0, 'rgba(160, 160, 160, 0.8)');
        bg_gradient.addColorStop(1.0, 'rgba(250, 250, 250, 0.8)');

        ctx.beginPath(); // custom shape begin
        ctx.fillStyle = bg_gradient;
        ctx.moveTo(100, 100);
        ctx.lineTo(700, 100);//右上
        ctx.lineTo(700, 500);//右下
        ctx.lineTo(100, 500);//左下
        ctx.lineTo(100, 100);//左上
        ctx.closePath(); // custom shape end
        ctx.fill(); // fill custom shape

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
        ctx.stroke(); // draw border

        // draw the title text
        ctx.font = '42px DS-Digital';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.shadowColor = '#000';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 2;
        ctx.fillStyle = '#fff';
        if(DialogPage == 'Begin') {
            ctx.fillText('開始', ctx.canvas.width/2, 150);
            ctx.font = '24px ';
            ctx.fillText('', ctx.canvas.width/2, 250);
            ctx.fillText(' ', ctx.canvas.width/2, 280);
        }
		if (DialogPage == 'Fail') {
            ctx.fillText('逃脫失敗', ctx.canvas.width/2, 150);
            ctx.font = '24px DS-Digital';
            ctx.fillText('', ctx.canvas.width/2, 250);
        }
		if (DialogPage == '逃脫成功') {
            ctx.fillText('second', ctx.canvas.width/2, 150);
            ctx.font = '24px DS-Digital';
            ctx.fillText('', ctx.canvas.width/2, 250);
        }
    }
}

function clearScreen(){
	//ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.drawImage(bg, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScreen(){
	clearScreen();
	
	if(DrawDialog == true){
		drawDialog();
		ctx.drawImage(button.image, 0, button.imageShift, button.w, button.h, button.x, button.y, button.w, button.h);
        ctx.font = '22px DS-Digital';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('start', 400, 485);
		if(hammer){
			hammer.draw(manPress);
		}
	}
	else{
	    time = new Date().getTime() - Downtime;
		if(time <30000){
			//setTimeout("document.getElementById('txt').value='2 秒'",60s000);
			//绘制得分
			/*ctx.font = "40px serif"
			ctx.fillStyle = "#ff0000";
			ctx.fillText(time,450,50);*/
	
			for(i=0;i<3;i++){
				if(Hearts[i].state =='show'){
				Hearts[i].draw();
				}
			}
	
			for(i=0;i<3;i++){
				for(j=0; j<3; j++){
					holes[i][j].draw();
				}
			}
	
			for(i=0;i<3;i++){
				for(j=0; j<3; j++){
					sprites[i][j].draw();
				}	
			}
	
			if(hammer){
				hammer.draw(manPress);
			}
		}
		else{
			button.state = 'Unpressed';
            DrawDialog = true;
			DialogPage = 'Success';
            button.imageShift = 0;
			score = 0;
			time = 0;
			
		}
	}
	
	
	
}

function updateLogic(){
	if(DrawDialog == false){
		for(i=0;i<3;i++){
			for(j=0; j<3; j++){
				if(sprites[i][j].state=='show' && sprites[i][j].check =='false'){
					score++;
					switch(score) {
						case 1:
							Hearts[2].state = 'hide';
						break;
						case 2:
							Hearts[1].state = 'hide';
						break;
						case 3:
							Hearts[0].state = 'hide';
							DrawDialog = true;
							DialogPage = 'Fail';
							button.imageShift = 0;
							button.state = 'Unpressed';
							time = 0;
							score = 0;
						break;
						default:
					}
				}
				sprites[i][j].state=='hide'
			}
		}
	
		var a = Math.round(Math.random()*100)%3;
		var b = Math.round(Math.random()*100)%3;
		if(sprites[a][b].state !='show')
		{
			sprites[a][b].state='show';
			sprites[a][b].check = 'false';
		}
		
	}else{
		
	}
}


function hammerMove(e){
	if(hammer){
		hammer.x = event.x-40;
		hammer.y = event.y-40;
	}
}

function hit(x, y){
 	
	for(i=0;i<3;i++){
		for(j=0;j<3;j++){
			var s = sprites[i][j];
			if(s.state=='show'){
				if(x>s.x+30 && y>s.y && x<(s.x+s.w+30) && y<(s.y+s.h)){
					//score++;
					s.state = 'hide';
					s.check = 'true';		//hit
					ctx.drawImage(X, s.x, s.y,s.w, s.h);
				}
			}
		}
	}
}

function init(){
	info = document.getElementById('info');
	canvas = document.getElementById('screen');
	ctx = canvas.getContext('2d');
	
	bg = new Image();
	bg.src = 'img/sky.png';
	bg.onload = function(){};
	
	X = new Image();
	X.src = 'img/X.png';
	X.onload = function(){};
	
 // load the button sprite image
    var buttonImage = new Image();
    buttonImage.src = 'img/btn.png';
    buttonImage.onload = function() {
    }
    button = new Button(310, 450, 180, 120, 'Unpressed', buttonImage);
	
	
	
	var hamImg = new Image();
	hamImg.src = 'img/hammer.png';
	hamImg.onload = function(){
		hammer = new HammerSprite(48, 48, 100, 100, hamImg);
	}
	
	var msImg = new Image();
	msImg.src = 'img/man.png';
	
	msImg.onload = function(){
		for(i=0;i<3;i++){
			var arr = [];
			for(j=0; j<3; j++){
				var s = new Sprite(90, 100, 70+250*i, 95+150*j, 'hide', msImg, 'false'); 
				arr[j] = s;
			}
			sprites[i] = arr;
		}		
	}
	
	var holeImg = new Image();
	holeImg.src = 'img/hole.png';
	holeImg.onload = function(){
		for(i=0;i<3;i++){
			var arr = [];
			for(j=0; j<3; j++){
				var s = new HoleSprite(80, 30, 80+250*i, 180+150*j, 'show', holeImg); 
				arr[j] = s;
			}
			holes[i] = arr;
		}		
	}
	
	var heart = new Image();
	heart.src = 'img/love.png';
	
	heart.onload = function(){
		for(i=0;i<3;i++){
			Hearts[i] = new Love(25, 25, 670+30*i, 30, 'show', heart); 
		}		
	}
	
	
	setInterval(drawScreen, 30);
	setInterval(updateLogic, 950);
	
};

function hammerDown(){
	manPress = true;
}

function hammerUp(){
	info.innerHTML=event.x+':'+event.y;
	if ( button.state == 'Unpressed' && event.x > button.x && event.x < button.x+button.w && event.y > button.y && event.y < button.y+button.h) {
            button.state = 'pressed';
            DrawDialog = false;
            button.imageShift = 262;
			for(i=0;i<3;i++){
				Hearts[i].state ='show';
			}
			Downtime = new Date().getTime();
	}
	manPress = false;
	hit(event.x, event.y);
}

function hideCursor(obj){
	obj.style.cursor='none';
}

function showCursor(obj){
	obj.style.cursor='';
}