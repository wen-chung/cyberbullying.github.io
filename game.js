//http://www.w3school.com.cn/tiy/t.asp?f=jseg_timing1
var canvas, ctx, info;
var bg, button, X;
var hammer, hamX, hamY;
var manState, manFrmLen = 10, manPress = false;
var sprites = [], holes = [], Hearts = [];
var score = 0;
var sHitSound, eHitSound, successful;	//sound
var time = 0;
var Downtime = 0;
var right_source = 0;

var rword = ["杜絕跟風", "轉發侮辱言論", 
			 "不發惡意文字", "惡作劇留言", 
			 "不發不良訊息", "發惡意文字", 
			 "弄清事實", "發佈傷害訊息", 
			 "理性發文", "發不負責言論", 
			 "不惡搞他人圖像", "惡搞他人照片", 
			 "不暱稱罵人", "暱稱罵人", 
			 "杜絕電郵恐嚇", "電郵恐嚇", 
			 "杜絕簡訊恐嚇", "簡訊恐嚇", 
			 "不公佈他人資料", "洩露資料", 
			 "不參與惡意票選","惡意票選", ];
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
var Sprite = function(w, h, x, y, state, image, check, word, check_w){
	var self = this;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.image = image;
	this.state = state;
	this.check = check;
	this.word = word;
	this.check_w = check_w;
	
	this.draw = function(){
		if(this.state == 'show'){
			ctx.fillText(this.word, this.x+48, this.y-27);
			ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
			setTimeout(function(){
				self.state = 'hide';
			},2000);
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
            ctx.fillText('Game', ctx.canvas.width/2, 150);
            ctx.font = '20px DS-Digital';
            ctx.shadowColor = '#000';
            ctx.fillText('根據鍵盤俠頭部上方的訊息，', ctx.canvas.width/2, 240);
            ctx.fillText('判斷若出現霸凌的行為，', ctx.canvas.width/2, 290);
            ctx.fillText('則利用錘子打擊，然後便可獲得洗白的能量，', ctx.canvas.width/2, 340);
            ctx.fillText('現在開始你的洗白之旅吧！', ctx.canvas.width/2, 390);
            ctx.fillText(' ', ctx.canvas.width/2, 280);
			right_source = 0;
			error_source = 0;
        }
		if (DialogPage == 'Success') {
            ctx.fillText('Success', ctx.canvas.width/2, 150);
            ctx.font = '28px DS-Digital';
            ctx.fillText('恭 喜 你 成 功 逃 離 鍵 盤 俠 組 織！', (ctx.canvas.width/2), 280);
			
			successful.play();
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
		if(right_source <5){
			//setTimeout("document.getElementById('txt').value='2 秒'",60s000);
			//绘制得分
			/*ctx.font = "40px serif"
			ctx.fillStyle = "#ff0000";
			ctx.fillText(time,450,50);*/
			ctx.fillText('Hit：'+ right_source , ctx.canvas.width-80, 20);
	
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
		ctx.fillText('Source：'+ right_source , ctx.canvas.width-80, 20);
	}
	var a = Math.round(Math.random()*100)%3;
	var b = Math.round(Math.random()*100)%3;
	if(sprites[a][b].state !='show')
	{
		var m = Math.round(Math.random()*20);
		var check_w = 'true';
		if(m%2 == 0){
			check_w = 'false';
		}
		sprites[a][b].check_w = check_w;
		sprites[a][b].word = rword[m];
		sprites[a][b].state='show';
		sprites[a][b].check = 'false';
	}
	
}


function hammerMove(e){
	if(hammer){
		hammer.x = event.clientX-((document.body.clientWidth-800)/2);
		hammer.y = event.clientY-40;
	}
}

function hit(x, y){	//打擊判斷
	for(i=0;i<3;i++){
		for(j=0;j<3;j++){
			var s = sprites[i][j];
			if(s.state=='show'){
				if(x>s.x+15 && y>s.y && x<(s.x+s.w+15) && y<(s.y+s.h) && s.check_w == 'true'){
					s.state = 'hide';
					s.check = 'false';		//hit
					ctx.drawImage(X, s.x, s.y,s.w, s.h);
					// play sound
					sHitSound.currentTime = 0;
					sHitSound.play();
					right_source++;
				}
				else if(x>s.x+15 && y>s.y && x<(s.x+s.w+15) && y<(s.y+s.h) && s.check_w == 'false'){				
					s.check = 'true';		//hit
					updateLogic();
					s.state = 'hide';
					ctx.drawImage(X, s.x, s.y,s.w, s.h);
					// play sound
					eHitSound.currentTime = 0;
					eHitSound.play();
					right_source--;
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
	
	
	// 'right-hit' music init
    sHitSound = new Audio('media/right.wav');
    sHitSound.volume = 0.9;
	
	// 'error-hit' music init
    eHitSound = new Audio('media/wrong.wav');
    eHitSound.volume = 0.9;
	
	//'successful' music
	successful = new Audio('media/sfinish.mp3');
	successful.volume = 0.9;
	successful.loop = false;
	
	var hamImg = new Image();
	hamImg.src = 'img/hammer.png';
	hamImg.onload = function(){
		hammer = new HammerSprite(48, 48, 10, 10, hamImg);
	}
	
	var msImg = new Image();
	msImg.src = 'img/sayman.png';
	
	msImg.onload = function(){
		for(i=0;i<3;i++){
			var arr = [];
			for(j=0; j<3; j++){
				var a = Math.round(Math.random()*20);
				var check_w = 'true';
				if(a%2 == 0){
				check_w = 'false';
				}
				var s = new Sprite(80, 100, 77+250*i, 88+180*j, 'hide', msImg, 'false', rword[a], check_w); 
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
				var s = new HoleSprite(80, 30, 80+250*i, 180+180*j, 'show', holeImg); 
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
	
	
	setInterval(drawScreen, 20);
	setInterval(updateLogic, 2000);
	
};

function hammerDown(){
	manPress = true;
}

function hammerUp(){
	info.innerHTML=event.x+':'+event.y;
	if ( button.state == 'Unpressed' && (event.clientX-((document.body.clientWidth-800)/2)) > button.x && (event.clientX-((document.body.clientWidth-800)/2)) < button.x+button.w && event.clientY-40 > button.y && event.clientY-40 < button.y+button.h) {
            button.state = 'pressed';
            DrawDialog = false;
            button.imageShift = 262;
			for(i=0;i<3;i++){
				Hearts[i].state ='show';
			}
			Downtime = new Date().getTime();
	}
	manPress = false;
	hit((event.clientX-((document.body.clientWidth-800)/2)), (event.clientY-40));
}

function hideCursor(obj){
	obj.style.cursor='none';
}

function showCursor(obj){
	obj.style.cursor='';
}