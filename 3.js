const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;

class Particle {
    constructor(effect){
      this.effect = effect;
      this.x =Math.floor(Math.random()*this.effect.width);
      this.y = Math.floor(Math.random()*this.effect.height);
    //   this.speedX = Math.random()*5-2.5;
    //   this.speedY = Math.random()*5-2.5;
      this.speedX;
      this.speedY;
      this.speeddModifier = Math.floor(Math.random()*3+1)
      this.history = [{x:this.x,y:this.y}]
      this.maxLength = Math.floor(Math.random()*200+10);
      this.angle = 0;
      this.timer = this.maxLength*2;
      this.colors = ["#4c026b","#730d9e","#9622c7","#b44ae0","#cd72f2"];
      this.color = this.colors[Math.floor(Math.random()*this.colors.length)];
    }
    draw(context){
    //    context.fillRect(this.x,this.y,10,10);
       
       context.beginPath();
       context.moveTo(this.history[0].x,this.history[0].y);
       for(let i=0; i<this.history.length; i++){
           context.lineTo(this.history[i].x,this.history[i].y);
       }
       context.strokeStyle = this.color;
       context.stroke();
    }

    update(){
        this.timer--;
        if(this.timer>=1){
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = y*this.effect.cols + x;
            this.angle = this.effect.flowfield[index];
            this.angle += 0.5;
    
            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);
            this.x += this.speedX*this.speeddModifier;
            this.y += this.speedY*this.speeddModifier;
    
    
            // this.x += this.speedX + Math.sin(this.angle)*2;
            // this.y += this.speedY + Math.cos(this.angle)*2;
            this.history.push({x:this.x,y:this.y})
            if(this.history.length>this.maxLength){
                this.history.shift();
            }
        }
        else if(this.history.length>1){
            this.history.shift()
        }
        else{
            this.reset();
        }
   
    }
    reset(){
        this.x =Math.floor(Math.random()*this.effect.width);
        this.y = Math.floor(Math.random()*this.effect.height);
        this.history = [{x:this.x,y:this.y}]
        this.timer = this.maxLength*2;
    }

   
}

class Mouseparticle{
    constructor(moueffect){
        this.effect = moueffect;
        this.mouseHistory = [{x:this.effect.mouseX,y:this.effect.mouseY}]
        this.speedX = Math.random()*5-2.5;
        this.speedY = Math.random()*5-2.5;
        // this.speedX = Math.sin(90);
        // this.speedY = Math.cos(90);
        this.maxLength = Math.floor(Math.random()*50+10);
        this.hue = Math.random()*360;
        this.color = `hsl(${this.hue},100%,50%)`
        this.angle = 0;
    }
    mousedraw(context){
        ctx.fillStyle = this.color;
        // context.fillRect(this.effect.mouseX,this.effect.mouseY,10,10);
        context.beginPath()
        context.arc(this.effect.mouseX,this.effect.mouseY,5,0,Math.PI*2);
        context.fill()

        context.beginPath();
        context.moveTo(this.mouseHistory[0].x,this.mouseHistory[0].y);
        for(let i=0; i<this.mouseHistory.length; i++){
            context.lineTo(this.mouseHistory[i].x,this.mouseHistory[i].y);
        }
        context.stroke();
    }
    mouseUpdate(){
        // this.effect.mouseX += this.speedX + Math.random()*15-7.5;
        // this.effect.mouseY += this.speedY + Math.random()*15-7.5;
        this.angle += 0.5;
        this.effect.mouseX += this.speedX + Math.sin(this.angle)*2;
        this.effect.mouseY += this.speedY + Math.cos(this.angle)*2;
        this.mouseHistory.push({x:this.effect.mouseX,y:this.effect.mouseY})
        if(this.mouseHistory.length>this.maxLength){
            this.mouseHistory.shift();
        }
    }
}

let debug = false;
window.addEventListener("keypress",(e)=>{
   if(e.key === 'd'){
    debug = !debug;
   }
})

class Effect {
    constructor(width,height){
      this.width = width;
      this.height = height;
      this.particles = [];
      this.numberOfParticles = 1000;
      this.cellSize = 5; 
      this.rows;
      this.cols;
      this.flowfield = [];
      this.curve = 1;
      this.zoom = 0.11;
      this.init()
    }
    init(){
        this.rows = Math.floor(this.height/this.cellSize);
        this.cols = Math.floor(this.width/this.cellSize);
        this.flowfield = [];
        for(let y=0; y<this.rows; y++){
            for(let x=0; x<this.cols; x++){
                let angle = (Math.cos(x*this.zoom) + Math.sin(y*this.zoom))*this.curve;
                this.flowfield.push(angle);
            }
        }
        console.log(this.flowfield)
        for(let i=0; i<this.numberOfParticles; i++){
            this.particles.push(new Particle(this)); 
        }
    }
    drawgrid(context){
        if(debug){
            context.save();
            context.strokeStyle = "white"
            for(let c=0; c<this.cols; c++){
                context.beginPath();
                context.moveTo(this.cellSize*c,0);
                context.lineTo(this.cellSize*c,this.height);
                context.stroke();
                  }
                  for(let k=0; k<this.rows; k++){
                    context.beginPath();
                    context.moveTo(0,this.cellSize*k);
                    context.lineTo(this.width ,this.cellSize*k);
                    context.stroke();
                  }
                  context.restore();
        }
 
    }
    render(context){
        this.drawgrid(context);
        this.particles.forEach((particle)=>{
            particle.update()
            particle.draw(context);
        })
    }
  

}

class MouseEffect{
  constructor(width,height,mouseX,mouseY){
    this.width = width;
    this.height = height;
    this.Mouseparticles = [];
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.init()
  }
    init(){

            this.Mouseparticles.push(new Mouseparticle(this))
        
    }
    mouseRender(context){
        this.Mouseparticles.forEach((particle)=>{
            particle.mouseUpdate()
            particle.mousedraw(context);
        })
    }
}
 
let numberOfParticles = 20;
let mouseparticle = [];
let aa = 0
canvas.addEventListener("click",(event)=>{    
        for(let i=0; i<numberOfParticles; i++){
            mouseparticle[aa] = new MouseEffect(canvas.width,canvas.height,event.x,event.y)
            mouseparticle[aa].mouseRender(ctx);
            aa++;
        }

})


const effect1 = new Effect(canvas.width,canvas.height)
effect1.render(ctx)

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    mouseparticle.forEach((mp)=>{
         mp.mouseRender(ctx)
    })
    effect1.render(ctx)
    requestAnimationFrame(animate)
}
animate();