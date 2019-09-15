
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
c.width = 720; 
c.height = 480;
document.body.appendChild(c);

var perm = [];
while (perm.length < 255){
    while(perm.includes(val = Math.floor(Math.random()*255)));
    perm.push(val);
}

var lerp = (a,b,t) => a + (b-a) * (1-Math.cos(t*Math.PI))/2;
var noise = x=>{
    x = x * 0.01 % 254;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

var Player =  function(){
    this.x = c.width/2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;
    this.img = new Image();
    this.img.src = "assets/truck.png";
    this.draw = function(){
        var p1 =  c.height - noise(t + this.x) * 0.25;
        var p2 =  c.height - noise(t+5 + this.x) * 0.25;

        var grounded = 0;
        if(p1-12 > this.y){
            this.ySpeed += 0.1;
        }else{
            this.ySpeed -= this.y - (p1-12);
            this.y = p1 - 12;
            grounded = 1;         
        }

        var angle = Math.atan2((p2-12) - this.y, (this.x+5) - this.x);
        this.y += this.ySpeed;

        if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
            playing = false;
            this.rSpeed = 5;
            k.ArrowUp = 1;
            this.x -= speed * 5;
            
        }

        if(playing && k.ArrowUp === 1){
            distance ++;
            distanceTraveled.innerHTML = "Distance: "+ distance + " KM";

        } 
        if(grounded && playing){
            this.rot -= (this.rot - angle) * 0.65;
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }
        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        this.rot -= this.rSpeed * 0.1;
        if(this.rot > Math.PI) this.rot = -Math.PI;
        if(this.rot < -Math.PI) this.rot = Math.PI;
        ctx.save();
        ctx.translate(this.x, this.y - 3);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -20, -20, 60, 60);
        ctx.restore();
    }
}

var player = new Player();
var t = 0;
var speed = 0;
var playing = true;
var k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};
var distance = 0;
function loop(){
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
    t += 10 * speed;
    var img = document.getElementById("mapBackground");
    var pat = ctx.createPattern(img, "repeat");
    ctx.rect(0, 0, 150, 100);
    ctx.fillStyle = pat;
    ctx.fillRect(0,0,c.width, c.height);

    ctx.fillStyle = "#4d1a00";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width; i++)
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    player.draw();
    if(player.x < 0)
        restart();
    requestAnimationFrame(loop);
}

onkeydown = d=>{
    k[d.key] = 1;
} 
onkeyup = d=> {
    k[d.key] = 0;
}

function restart(){
    
    player = new Player();
    t = 0;
    distance = 0;
    distanceTraveled.innerHTML = "Distance: 0 KM";
    speed = 0;
    playing = true;
    k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};

}
loop();

var distanceTraveled = document.createElement("div");
distanceTraveled.id = "::img";
distanceTraveled.style.cssText = 'font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif; text-align:center; font-size:25px; color:rgb(17, 14, 54)';
distanceTraveled.innerHTML = "Distance: 0 KM";
document.body.appendChild(distanceTraveled);

