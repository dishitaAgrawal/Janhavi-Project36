//Create variables here
var dogImg;
var runningRightImg;
var livingRoomImg, bedRoomImg, washRoomImg, gardenImg, parkImg, clinicImg;

var database;

var dogName = "Dog";
var input, changeNameButton;

var food, foodObj;
var feedDogButton, addFoodButton;

var fedTime, lastFed;

var readGameState, changeGameState;
var gamestate;

var dogHealth;
var vaccinate_button;

function preload() {
  //dog images
  dogImg = loadImage("Images/Dog.png");
  runningRightImg = loadImage("Images/RunningRight.png");

  //background images
  livingRoomImg = loadImage("Images/Livingroom.png");
  bedRoomImg = loadImage("Images/Bedroom.png");
  washRoomImg = loadImage("Images/Washroom.png");
  gardenImg = loadImage("Images/Garden.png");
  parkImg = loadImage("Images/Park.jpeg");
  clinicImg = loadImage("Images/Clinic.jpeg");
}

function setup() {
  createCanvas(500, 500);

  database = firebase.database();

  foodObj = new Food();

  vaccinate_button = createButton("Vaccinate " + dogName);

  database.ref("Food").on("value", readStock);

  database.ref("Name").on("value", readName);

  database.ref("Health").on("value", readHealth);

  readGameState = database.ref("gameState");
  readGameState.on("value", readState);

  //button to feed the dog
  feedDogButton = createButton("Feed Food");
  feedDogButton.position(375, 350);
  feedDogButton.mousePressed(feedDog);

  //button to add food
  addFoodButton = createButton("Add Food");
  addFoodButton.position(520, 350);
  addFoodButton.mousePressed(addFood);

  //input for name
  input = createInput(dogName);
  input.position(130, 50);

  //button to change name
  changeNameButton = createButton("Change Pet's name");
  changeNameButton.position(202, 70);
  changeNameButton.mousePressed(petName);
}

function draw() {
  background(46, 139, 87);

  image(dogImg, 300, 300, 150, 150);

  //displaying the last fed time
  fill("black");
  textSize(30);
  if (lastFed >= 12) {
    text("Last Fed: " + (lastFed % 12) + " PM ", 10, 40);
  } else if (lastFed === 0) {
    text("Last Fed: 12 AM", 10, 40);
  } else {
    text("Last Fed: " + lastFed + " AM ", 10, 40);
  }

  //displaying the amount of food left
  if (food !== undefined) {
    text("Milk Bottles Remaining: " + food, 10, 100);
  } else {
    text("Milk Bottles Remaining: ", 10, 100);
  }

  //displaying the pet's health
  text("Your Pet's Health: " + dogHealth, 10, 70);

  database.ref("feedTime").on("value", function (data) {
    lastFed = data.val();
  });

  //changing the BG depending on the time
  currentTime = hour();
  if (currentTime === lastFed + 2) {
    updateState("napping");
    foodObj.livingRoom();
    vaccinate_button.hide();
  } else if (currentTime === lastFed + 4) {
    updateState("checkup");
    foodObj.clinic();

    vaccinate_button.position(202, 100);
    vaccinate_button.mousePressed(health);
  } else if (currentTime === lastFed + 6) {
    updateState("running");
    foodObj.park();
    vaccinate_button.hide();
    image(runningRightImg, 300, 300, 150, 150);
  } else if (currentTime === lastFed + 8) {
    updateState("playing");
    foodObj.garden();
    vaccinate_button.hide();
  } else if (currentTime === lastFed + 10) {
    updateState("bathing");
    foodObj.washRoom();
    vaccinate_button.hide();
  } else if (currentTime === lastFed + 12) {
    updateState("sleeping");
    foodObj.bedRoom();
    vaccinate_button.hide();
  } else {
    updateState("hungry");
    foodObj.display();
    vaccinate_button.hide();
  }

  if (gamestate !== "hungry") {
    feedDogButton.hide();
    addFoodButton.hide();
    changeNameButton.hide();
    input.hide();
  } else {
    feedDogButton.show();
    addFoodButton.show();

    fill("white");
    textSize(12);
    textFont("Georgia");
    text("Dog Name: " + dogName, 350, 250);

    // //condition to check if name is not equal to input text
    if (input.value() === "") {
      fill("red");
      textSize(40);
      text("Enter Pet's Name", 15, 490);
    }
  }

  drawSprites();
}

function readName(data) {
  dogName = data.val();
}

//function to read food stock from DB
function readStock(data) {
  food = data.val();
  foodObj.updateFoodStock(food);
}

//function to read pet's health from DB
function readHealth(data) {
  dogHealth = data.val();
}

//function to read game state from DB
function readState(data) {
  gamestate = data.val();
}

//function to update game state
function updateState(state) {
  database.ref("/").update({
    gameState: state,
  });
}

//function to add in food stock count
function addFood() {
  if (food >= 20) {
    food = 20;
  } else {
    food++;
  }

  database.ref("/").update({
    Food: food,
  });
}

//function to deduct food stock count
function feedDog() {
  if (food <= 0) {
    food = 0;
  } else {
    food = food - 1;
  }

  database.ref("/").update({
    Food: food,
    feedTime: hour(),
  });
}

//function to update pet's name
function petName() {
  database.ref("/").update({
    Name: input.value(),
  });
}

//function to update pet's health
function health() {
  dogHealth = dogHealth + 50;

  database.ref("/").update({
    Health: dogHealth,
  });
}
