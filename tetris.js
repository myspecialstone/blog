import BLOCKS from "./blocks.js"

//DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

//Block
let blockArray = Object.entries(BLOCKS);

//Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score= 0;
let downInterval;
let duration = 500;
let tempMovingItem;


const movingItem = {
    type: "",
    direction: 2,
    top: 0,
    left: 0,
};

init()

// fuctions
function init() {
    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    generateNewBlock()
}

function prependNewLine(){
    const li = document.createElement("li")
    const ul = document.createElement("ul")
    for(let j=0; j < GAME_COLS; j++) {
        const matrix= document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}

function renderBlocks(moveType=""){
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
        console.log(moving)
    })
    BLOCKS[type][direction].some(block=>{
        const x = block[0] + left;
        const y = block[1] + top ;
        console.log(playground.childNodes[y])
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving")
        } else {
            tempMovingItem = {...movingItem}
            if(moveType === 'retry'){
                clearInterval(downInterval)
                showGameOverText()
            }
            setTimeout(()=> {
                renderBlocks('retry')
                if(moveType === "top"){
                    seizeBlock();
                }
            },0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem. direction = direction;
}

function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
    generateNewBlock()
}

function generateNewBlock() {

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top',1)
    }, duration);

    if ( blockArray.length === 0 ){
        blockArray = Object.entries(BLOCKS);
    }
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    blockArray.splice(randomIndex,1);
    renderBlocks()
}

function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}

function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}

function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction=0 : tempMovingItem.direction+=1;
    renderBlocks()
}

function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top",1)
    }, 10);
}
function showGameOverText() {
    gameText.style.display = "flex"
}

function checkMatch(){

    const childNodes =playground.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if (!li.classList.contains("seized")){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine()
            score++;
            duration = duration / 1.01
            scoreDisplay.innerText = score;
        }
    })
}

// event handling
document.addEventListener("keydown", e => {
    switch(e.keyCode){
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top",1);
            break;
        case 38:
            changeDirection();
            break;
        case 32:
            dropBlock()
        default:
            break;
    }
    //console.log(e)
})

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none"
    score = 0;
    duration = 500;
    init()
})
