import { Player } from '/js/player.js';
import { InputHandler } from '/js/input.js';
import { Background } from '/js/background.js';
import { FlyingEnemy, ClimbingEnemy,  GroundEnemy} from '/js/enemies.js';
import { UI } from '/js/UI.js';


window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 40;
            this.speed = 0;
            this.maxSpeed = 5;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.maxParticles = 50;
            this.collisions = [];
            this.floatingMessages = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 100;
            this.fontColor = 'rgb(0, 24, 31)';
            this.time = 0;
            this.maxTime = 100000;
            this.gameOver = false;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();

        }
        update(deltaTime){
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            //handle Enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
             //handle messages
             this.floatingMessages.forEach(message =>{
                message.update();
            });
            //handle particles
            this.particles.forEach((particle, index) =>{
                particle.update();
            });
            if(this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }
            //handle collision sprites
            this.collisions.forEach((collision, index) =>{
                collision.update(deltaTime);
            });
            this.collisions = this.collisions.filter(collision=> !collision.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);

        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);

        }
        addEnemy(){
            if(this.speed > 0 && Math.random() < 0.5)  this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        var bgMusic = document.getElementById('bgMusic');
        if(!game.gameOver) requestAnimationFrame(animate);
        if(!game.gameOver){
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    }
    animate(0);
    
});

