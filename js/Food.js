class Food {

  constructor() {

    this.image = loadImage("Images/Milk.png");
    this.foodStock = 0;
  }

  updateFoodStock(food){

   this.foodStock = food

  }

  livingRoom() {

    background(livingRoomImg, 550, 500);

  }

  clinic() {

    background(clinicImg, 550, 500);

  }

  garden() {

    background(gardenImg, 550, 500);

  }

  washRoom() {

    background(washRoomImg, 550, 500);

  }

  park() {

    background(parkImg, 550, 500);

  }

  bedRoom() {

    background(bedRoomImg, 550, 500);

  }

  display() {

    var x = 30;
    var y = 100;

    if(this.foodStock !== 0) {
      for(var i = 0; i < this.foodStock; i++) {

        if(i % 10 === 0) {

          x = 30;
          y = y + 50;

        }

        imageMode(CENTER);
        image(this.image, x, y, 60, 60);

        x = x + 30;

      }

    }

   

  }
 
}