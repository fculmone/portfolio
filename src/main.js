import "./style.css";
import Phaser, { GameObjects } from "phaser";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// desktop by default
// More comprehensive mobile detection
function isMobileDevice() {
  const isMobileByAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isMobileBySize = window.innerWidth < 500;

  return isMobileByAgent || isMobileBySize;
}

if (isMobileDevice()) {
  var sizes = {
    width: 500,
    height: 700,
  };
} else {
  var sizes = {
    width: 700,
    height: 500,
  };
}

const worldSize = {
  width: 1300,
  height: 1200,
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
  }

  // Add this method to your GameScene class
  createHouse() {
    // Position the house near the top of the map
    const houseX = worldSize.width / 2 + 220;
    const houseY = 130;

    // Add the house sprite
    const house = this.physics.add
      .sprite(houseX, houseY, "house")
      .setOrigin(0.5)
      .setScale(3)
      .setDepth(1)
      .setImmovable(true);

    // Create collision with the house
    this.physics.add.collider(this.player, house);

    // Create an invisible zone for the door
    const doorWidth = 60;
    const doorHeight = 30;
    const doorX = houseX; // Center the door on the house
    const doorY = houseY + 110; // Position at the bottom of the house (adjust as needed)

    // Create the door zone
    const doorZone = this.add.zone(doorX, doorY, doorWidth, doorHeight);
    this.physics.world.enable(doorZone);
    doorZone.body.setAllowGravity(false);
    doorZone.body.setImmovable(true);

    // Add a sign to indicate the door's purpose
    this.createSign(
      doorX + 90,
      doorY + 20,
      "Enter to visit my\nFull Portfolio Website"
    );

    // Create overlap with the door
    this.physics.add.overlap(
      this.player,
      doorZone,
      this.enterHouse,
      null,
      this
    );
  }

  // Method to handle entering the house
  enterHouse() {
    // Check if we've already triggered redirection
    if (this.redirecting) return;

    // Set flag to prevent multiple redirects
    this.redirecting = true;

    // Create a transition effect
    const transition = this.add
      .rectangle(0, 0, worldSize.width * 2, worldSize.height * 2, 0x000000)
      .setOrigin(0)
      .setDepth(100)
      .setAlpha(0);

    // Fade to black
    this.tweens.add({
      targets: transition,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        // Redirect to your webpage
        window.location.href = "/portfolio/aboutme/"; // Replace with your actual URL
      },
    });
  }

  // Add this method to your GameScene class
  createAnimeGallery() {
    // Define the area for the anime gallery (left side of the map)
    const leftSideX = 50;
    const startY = 200;

    // Define character positions and data
    const characters = [
      {
        name: "goku",
        title: "Goku",
        description: "From Dragon Ball Z",
        frames: 3,
        scale: 0.34,
        x: leftSideX + 60,
        y: startY - 100,
        flipX: true, // Flip Goku horizontally
      },
      {
        name: "itachi",
        title: "Itachi",
        description: "From Naruto",
        frames: 8,
        scale: 1.6,
        x: leftSideX,
        y: startY + 100,
        flipX: false, // Itachi faces right
      },
      {
        name: "kakashi",
        title: "Kakashi",
        description: "From Naruto",
        frames: 23,
        scale: 0.5,
        x: leftSideX + 120,
        y: startY + 50,
        flipX: true, // Kakashi faces left
      },
      {
        name: "link",
        title: "Link",
        description: "From The Legend of Zelda",
        frames: 18,
        scale: 0.2,
        x: leftSideX + 60,
        y: startY + 300,
        flipX: false, // Link faces right
      },
      {
        name: "sasuke",
        title: "Sasuke",
        description: "From Naruto",
        frames: 4,
        scale: 2,
        x: leftSideX + 120,
        y: startY + 170,
        flipX: true, // Sasuke faces left
      },
    ];

    // Create animations for each character
    characters.forEach((char) => {
      this.anims.create({
        key: `${char.name}_anim`,
        frames: this.anims.generateFrameNumbers(char.name, {
          start: 0,
          end: char.frames - 1,
        }),
        frameRate: 10,
        repeat: -1,
      });
    });

    // Create a sign to introduce the anime gallery
    this.createSign(leftSideX + 270, startY + 350, "My Anime Favorites!");

    // Add each character
    characters.forEach((char, index) => {
      // Create sprite for each character
      const sprite = this.physics.add
        .sprite(leftSideX + char.x, startY + char.y, char.name)
        .setOrigin(0.5)
        .setScale(char.scale) // Adjust scale as needed
        .setDepth(1);

      sprite.flipX = char.flipX; // Flip the sprite horizontallyßßsßßß

      // Play the animation
      sprite.play(`${char.name}_anim`);

      // Adjust the hitbox to be smaller than the visual sprite
      // This creates a better interaction area
      const hitboxWidth = sprite.width * 0.6;
      const hitboxHeight = sprite.height * 0.6;
      sprite.body.setSize(hitboxWidth, hitboxHeight);
      sprite.body.setOffset(
        (sprite.width - hitboxWidth) / 2,
        (sprite.height - hitboxHeight) / 2
      );

      // Store character info on the sprite for use in the callback
      sprite.characterInfo = {
        title: char.title,
        description: char.description,
      };

      // Add overlap detection with player
      this.physics.add.overlap(
        this.player,
        sprite,
        this.showAnimeInfo,
        null,
        this
      );

      // Hide info when not hovering
      sprite.on("pointerout", () => {
        if (this.animeText) this.animeText.destroy();
      });
    });
  }

  // Add this method to your GameScene class
  showAnimeInfo(player, animeChar) {
    // Only show if we don't already have text displayed or it's a different character
    if (this.animeText && this.currentAnimeChar === animeChar) return;

    // Remove any existing text
    if (this.animeText) this.animeText.destroy();

    // Create text object
    this.animeText = this.add
      .text(
        animeChar.x + 80,
        animeChar.y,
        `${animeChar.characterInfo.title}\n${animeChar.characterInfo.description}`,
        {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0, 0.5)
      .setDepth(20);

    // Save the current anime character to check if player moves away
    this.currentAnimeChar = animeChar;

    // Set a flag to check in update method
    this.animeTextActive = true;
  }

  // Replace your current createGooseForest method with this
  createGooseForest() {
    // Define the area for the forest (bottom of the map)
    const forestStartX = 200;
    const forestEndX = worldSize.width - 200;
    const forestY = worldSize.height - 400; // Near the bottom

    // Create predefined positions for trees in a more natural pattern
    const treePositions = [
      { x: forestStartX + 0, y: forestY + 80 },
      { x: forestStartX + 150, y: forestY + 240 },
      { x: forestStartX + 200, y: forestY + 70 },
      { x: forestStartX + 730, y: forestY + 250 },
      { x: forestEndX - 150, y: forestY + 110 },
      { x: forestEndX - 30, y: forestY + 60 },
      { x: forestEndX - 450, y: forestY + 300 },
    ];

    // Add trees at predefined positions
    treePositions.forEach((pos) => {
      const tree = this.physics.add
        .sprite(pos.x, pos.y, "tree")
        .setOrigin(0.5, 0.8) // Set origin to bottom center
        .setScale(2)
        .setDepth(1)
        .setImmovable(true);

      // Make collision box only at the base of the tree
      tree.body.setSize(20, 25);
      tree.body.setOffset(tree.width / 2 - 10, tree.height - 25);

      this.physics.add.collider(this.player, tree);
    });

    // Create predefined positions for geese in between and around trees
    const geesePositions = [
      { x: forestStartX + 10, y: forestY + 160 },
      { x: forestStartX + 200, y: forestY + 130 },
      { x: forestEndX - 300, y: forestY + 200 },
      { x: forestEndX - 0, y: forestY + 150 },
    ];

    // Add geese at predefined positions
    geesePositions.forEach((pos) => {
      const goose = this.physics.add
        .sprite(pos.x, pos.y, "goose")
        .setOrigin(0.5)
        .setScale(0.1)
        .setDepth(2)
        .setImmovable(false); // Allow goose to be moved slightly

      // Add overlap handler to make the goose honk when player approaches
      this.physics.add.overlap(this.player, goose, this.gooseHonk, null, this);
    });
  }

  // Handler for goose interaction
  gooseHonk(player, goose) {
    // Only show if we don't already have a honk displayed for this goose
    if (goose.honkText) return;

    // Create "Honk!" text
    goose.honkText = this.add
      .text(goose.x, goose.y - 30, "Honk!", {
        font: "bold 16px Arial",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(30);

    // Add a small "startled" movement to the goose
    this.tweens.add({
      targets: goose,
      x: goose.x + (Math.random() * 20 - 10),
      y: goose.y + (Math.random() * 20 - 10),
      duration: 300,
      ease: "Power2",
    });

    // Remove the text after a short delay
    this.time.delayedCall(1500, () => {
      if (goose.honkText) {
        goose.honkText.destroy();
        goose.honkText = null;
      }
    });
  }

  // Add this function to your GameScene class
  createSign(x, y, message) {
    // Create the sign sprite
    const sign = this.physics.add
      .sprite(x, y, "sign")
      .setOrigin(0.5)
      .setScale(2)
      .setDepth(1)
      .setImmovable(true);

    // Set smaller collision box for the sign
    sign.body.setSize(16, 8);
    sign.body.setOffset(0, 8);

    // Add message property to the sign
    sign.message = message;

    // Add overlap with player
    this.physics.add.collider(
      this.player,
      sign,
      this.showSignMessage,
      null,
      this
    );

    return sign;
  }

  // Add this method to handle sign interactions
  showSignMessage(player, sign) {
    // Only show if we don't already have text displayed
    if (this.signText) this.signText.destroy();

    // Create text object
    this.signText = this.add
      .text(sign.x, sign.y - 50, sign.message, {
        font: "16px Arial",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(20);

    // Save the current sign to check if player moves away
    this.currentSign = sign;

    // Set a timer to remove the text after the player moves away
    if (this.signTextTimer) this.signTextTimer.remove();

    // Will be checked in update method
    this.signTextActive = true;
  }

  // Add this method to your GameScene class
  placeFlowers() {
    // Define the grass area (avoiding the edges where water and edge tiles are)
    const grassStartX = 2 * 32 * 2; // 2 tiles in from the edge, accounting for 2x scale
    const grassStartY = 2 * 32 * 2;
    const grassEndX = worldSize.width - grassStartX;
    const grassEndY = worldSize.height - grassStartY;

    // Define number of flowers to place
    const numFlowers = 100; // Adjust as needed

    // Create flowers
    for (let i = 0; i < numFlowers; i++) {
      // Generate random position within grass area
      const x = Phaser.Math.Between(grassStartX, grassEndX);
      const y = Phaser.Math.Between(grassStartY, grassEndY);

      const flowerTypes = ["flower1", "flower2", "flower3"];
      const randomFlowerType =
        flowerTypes[Phaser.Math.Between(0, flowerTypes.length - 1)];
      const flower = this.add
        .image(x, y, randomFlowerType)
        .setOrigin(0.5)
        .setScale(2) // Same scale as grass tiles
        .setDepth(0.5); // Higher than grass (0) but lower than other objects (1+)

      // Add slight random rotation for natural look
      flower.setRotation(Phaser.Math.FloatBetween(-0.1, 0.1));

      // Small random scale variation
      const scaleVariation = Phaser.Math.FloatBetween(1.8, 2.2);
      flower.setScale(scaleVariation);
    }
  }

  preload() {
    this.load.image("grass", "assets/world/grass.png");
    this.load.image("topleft", "assets/world/topleft.png");
    this.load.image("topright", "assets/world/topright.png");
    this.load.image("bottomleft", "assets/world/bottomleft.png");
    this.load.image("bottomright", "assets/world/bottomright.png");
    this.load.image("topedge", "assets/world/topedge.png");
    this.load.image("bottomedge", "assets/world/bottomedge.png");
    this.load.image("leftedge", "assets/world/leftedge.png");
    this.load.image("rightedge", "assets/world/rightedge.png");
    this.load.image("tree", "assets/world/tree.png");
    this.load.image("goose", "assets/world/goose.png");
    this.load.image("flower1", "assets/world/flower1.png");
    this.load.image("flower2", "assets/world/flower2.png");
    this.load.image("flower3", "assets/world/flower3.png");

    this.load.image("Korra", "assets/dogs/Korra.png");
    this.load.image("Zelda", "assets/dogs/Zelda.png");
    this.load.image("Leia", "assets/dogs/Leia.png");
    this.load.image("heart", "assets/heart.png");

    this.load.image("sign", "assets/sign.png");
    this.load.image("house", "assets/world/house.png");

    this.load.spritesheet("forward", "assets/character/forward.png", {
      frameWidth: 16,
      frameHeight: 23,
    });

    this.load.spritesheet("backward", "assets/character/backward.png", {
      frameWidth: 16,
      frameHeight: 23,
    });

    this.load.spritesheet("right", "assets/character/right.png", {
      frameWidth: 16,
      frameHeight: 23,
    });

    this.load.spritesheet("left", "assets/character/left.png", {
      frameWidth: 16,
      frameHeight: 23,
    });

    this.load.spritesheet("water", "assets/world/simplewater.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("fountain", "assets/world/fountain.png", {
      frameWidth: 48,
      frameHeight: 47,
    });

    // Load anime character spritesheets
    this.load.spritesheet("goku", "assets/anime/goku.png", {
      frameWidth: 500,
      frameHeight: 637,
    });

    this.load.spritesheet("itachi", "assets/anime/itachi.png", {
      frameWidth: 68,
      frameHeight: 114,
    });

    this.load.spritesheet("kakashi", "assets/anime/kakashi.png", {
      frameWidth: 256,
      frameHeight: 256,
    });

    this.load.spritesheet("link", "assets/anime/link.png", {
      frameWidth: 500,
      frameHeight: 583,
    });

    this.load.spritesheet("sasuke", "assets/anime/sasuke.png", {
      frameWidth: 75,
      frameHeight: 75,
    });
  }

  create() {
    if (isMobileDevice()) {
      this.joystick = new JoyStick(
        "joyDiv",
        {
          // Customize appearance
          internalFillColor: "rgba(255, 255, 255, 0.5)",
          internalStrokeColor: "#ffffff",
          externalStrokeColor: "#ffffff",
          externalLineWidth: 3,
          autoReturnToCenter: true,
        },
        (stickData) => {
          // Store joystick data for use in update method
          this.stickData = stickData;
        }
      );
    }
    // Create a map with grass in the middle and water around the edges
    const mapWidth = Math.ceil(worldSize.width / 32); // Assuming 32x32 tiles
    const mapHeight = Math.ceil(worldSize.height / 32);

    // Create a group for water tiles (will have collision)
    this.waterTiles = this.physics.add.staticGroup();
    this.anims.create({
      key: "water_anim",
      frames: this.anims.generateFrameNumbers("water", { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });

    // Place tiles
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        // Create water around the edges (border of 2 tiles)
        if (x < 2 || y < 2 || x >= mapWidth - 2 || y >= mapHeight - 2) {
          // Add water tile with collision
          const waterTile = this.waterTiles
            .create(x * 32, y * 32, "water")
            .setOrigin(0, 0)
            .setScale(2, 2);
          // Play the animation on each water tile
          const random = getRandomInt(1, 3); // Randomly choose an animation
          waterTile.anims.play("water_anim", true);
        } else {
          // Add grass tile (no collision)
          if (x === 2) {
            if (y === 2) {
              this.add
                .image(x * 32, y * 32, "topleft")
                .setOrigin(0, 0)
                .setScale(2, 2);
            } else if (y === mapHeight - 3) {
              this.add
                .image(x * 32, y * 32, "bottomleft")
                .setOrigin(0, 0)
                .setScale(2, 2);
            } else {
              this.add
                .image(x * 32, y * 32, "leftedge")
                .setOrigin(0, 0)
                .setScale(2, 2);
            }
          } else if (x === mapWidth - 3) {
            if (y === 2) {
              this.add
                .image(x * 32, y * 32, "topright")
                .setOrigin(0, 0)
                .setScale(2, 2);
            } else if (y === mapHeight - 3) {
              this.add
                .image(x * 32, y * 32, "bottomright")
                .setOrigin(0, 0)
                .setScale(2, 2);
            } else {
              this.add
                .image(x * 32, y * 32, "rightedge")
                .setOrigin(0, 0)
                .setScale(2, 2);
            }
          } else if (y === 2) {
            this.add
              .image(x * 32, y * 32, "topedge")
              .setOrigin(0, 0)
              .setScale(2, 2);
          } else if (y === mapHeight - 3) {
            this.add
              .image(x * 32, y * 32, "bottomedge")
              .setOrigin(0, 0)
              .setScale(2, 2);
          } else {
            // Add grass tile
            // Only add grass tiles in the middle area
            this.add
              .image(x * 32, y * 32, "grass")
              .setOrigin(0, 0)
              .setScale(2, 2);
          }
        }
      }
    }

    this.placeFlowers();

    // Add the fountain
    this.anims.create({
      key: "fountain_anim",
      frames: this.anims.generateFrameNumbers("fountain", { start: 0, end: 2 }),
      frameRate: 9,
      repeat: -1,
    });

    const fountain = this.physics.add
      .sprite(
        worldSize.width / 2,
        worldSize.height / 2 - 200, // Position fountain in front of player's starting position
        "fountain"
      )
      .setOrigin(0.5)
      .setScale(3) // Scale the fountain to match your world
      .setDepth(1) // Set depth between ground (0) and player (2)
      .setImmovable(true); // Make fountain immovable when player collides

    // Set circular collision bounds
    fountain.body.setCircle(20); // Radius in pixels
    fountain.body.setOffset(4, 4); // Center the circle (adjust as needed)

    // Play the fountain animation
    fountain.anims.play("fountain_anim", true);

    this.anims.create({
      key: "walk_forward",
      frames: this.anims.generateFrameNumbers("forward", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_backward",
      frames: this.anims.generateFrameNumbers("backward", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_right",
      frames: this.anims.generateFrameNumbers("right", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_left",
      frames: this.anims.generateFrameNumbers("left", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    // Add the sprite
    this.player = this.physics.add.sprite(
      worldSize.width / 2,
      worldSize.height / 2,
      "forward",
      0
    );
    this.player.setScale(4, 4);
    this.player.setDepth(3);

    // Fix physics body to match visual size

    this.player.body.setSize(16, 11); // Original width, but only half height
    this.player.body.setOffset(0, 12); // Offset to bottom half of sprite

    // Calculate the player's size after scaling
    const playerWidth = this.player.width;
    const playerHeight = this.player.height;

    // Make player collide with water
    this.physics.add.collider(this.player, this.waterTiles);
    // and fountain
    this.physics.add.collider(this.player, fountain);

    // Remove the world bounds collision since we're using the water as boundaries
    this.player.setCollideWorldBounds(false);

    // Set world physics bounds, accounting for player size
    this.physics.world.setBounds(
      0,
      0,
      worldSize.width - playerWidth / 2, // Subtract half player width for right boundary
      worldSize.height - playerHeight / 2 // Subtract half player height for bottom boundary
    );

    // Make player collide with world boundaries
    this.player.setCollideWorldBounds(true);

    // Setup camera to follow player
    this.cameras.main.setBounds(0, 0, worldSize.width, worldSize.height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Optional: set deadzone for smoother camera following
    this.cameras.main.setDeadzone(100, 100);

    // Add all the signs
    this.createSign(
      worldSize.width / 2,
      worldSize.height / 2 - 100, // Place it between player starting position and fountain
      "Explore to learn more\n about Francesco!"
    );

    // Create a forest area with trees and geese
    // Add the goose forest
    this.createGooseForest();

    // Add anime gallery
    this.createAnimeGallery();

    // Add a sign explaining the geese
    this.createSign(
      worldSize.width / 2,
      worldSize.height - 300,
      "UWaterloo's famous geese!\nThey're everywhere on campus!"
    );
    // Create Korra dog as physics sprite
    const korra = this.physics.add
      .sprite(worldSize.width - 150, worldSize.height / 2 - 120, "Korra")
      .setOrigin(0.5)
      .setScale(0.2)
      .setImmovable(true)
      .setDepth(1); // Make the dog immovable when collided with

    // Create Zelda dog
    const zelda = this.physics.add
      .sprite(worldSize.width - 200, worldSize.height / 2 + 30, "Zelda")
      .setOrigin(0.5)
      .setScale(0.2)
      .setImmovable(true)
      .setDepth(1);

    // Create Leia dog
    const leia = this.physics.add
      .sprite(worldSize.width - 120, worldSize.height / 2 + 170, "Leia")
      .setOrigin(0.5)
      .setScale(0.2)
      .setImmovable(true)
      .setDepth(1);

    // put sign in front of the dogs
    this.createSign(
      worldSize.width - 320,
      worldSize.height / 2 - 50,
      "These are my dogs!\nFeel free to pet them!"
    );

    // Keep your existing animation tweens
    this.tweens.add({
      targets: [korra, zelda, leia],
      y: "+=5",
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Create heart particle emitter
    const heartParticleEmmiter = this.add.particles(300, 300, "heart", {
      x: 100,
      y: 100,
      speed: { min: 50, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.2, end: 0 },
      lifespan: 1000,
      gravityY: -50,
      quantity: 0,
      on: false, // Don't emit automatically
    });
    heartParticleEmmiter.setScale(0.3);
    heartParticleEmmiter.setDepth(0);

    // Define dogCollider
    const dogCollider = (player, dog) => {
      if (!dog.isShowingText) {
        console.log("Dog collision with: " + dog.texture.key);

        // Emit hearts at the dog's position
        heartParticleEmmiter.setPosition(dog.x, dog.y);
        heartParticleEmmiter.explode(20, 0, 0);

        // Store the dog's base position (without the animation offset)
        const baseY = Math.floor(dog.y / 10) * 10;

        // Create text at a fixed position that won't be affected by tweens
        this.dogText = this.add
          .text(dog.x - 50, baseY - 55, "Hello, I'm " + dog.texture.key + "!", {
            font: "16px Arial",
            fill: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 5, y: 5 },
          })
          .setDepth(20);

        // Mark this dog as showing text and store the current active dog
        dog.isShowingText = true;
        this.activeDog = dog;
      }

      // Always update the "last contact" time whenever there's an overlap
      this.lastDogContact = this.time.now;
    };

    // Add collider for all dogs
    this.physics.add.overlap(this.player, korra, dogCollider);
    this.physics.add.overlap(this.player, zelda, dogCollider);
    this.physics.add.overlap(this.player, leia, dogCollider);

    // Create the house
    this.createHouse();

    //stop animation on key up
    this.input.keyboard.on("keyup", () => {
      if (this.player.anims.currentAnim) {
        const lastFrameIndex = this.player.anims.currentAnim.frames.length - 1;
        this.player.anims.stop();
        this.player.setFrame(lastFrameIndex);
      }
    });
  }

  update() {
    const speed = 200;
    console.log(this.stickData);

    // Reset velocity each frame
    this.player.setVelocity(0);
    if (isMobileDevice() && this.stickData) {
      const direction = this.stickData.cardinalDirection;
      // Only move if not centered (C)
      if (direction !== "C") {
        // Prioritize cardinal directions and prevent diagonal movement
        // Priority order: North, South, East, West
        if (direction.includes("N")) {
          this.player.anims.play("walk_backward", true);
          this.player.setVelocityY(-speed);
        } else if (direction.includes("S")) {
          this.player.anims.play("walk_forward", true);
          this.player.setVelocityY(speed);
        } else if (direction.includes("E")) {
          this.player.anims.play("walk_right", true);
          this.player.setVelocityX(speed);
        } else if (direction.includes("W")) {
          this.player.anims.play("walk_left", true);
          this.player.setVelocityX(-speed);
        }
      } else {
        // Center position - stop animations
        this.player.anims.stop();
      }
    } else {
      // Keyboard controls for desktop
      const cursors = this.input.keyboard.createCursorKeys();

      if (
        cursors.up.isDown ||
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown
      ) {
        this.player.anims.play("walk_backward", true);
        this.player.setVelocityY(-speed);
      } else if (
        cursors.down.isDown ||
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown
      ) {
        this.player.anims.play("walk_forward", true);
        this.player.setVelocityY(speed);
      } else if (
        cursors.left.isDown ||
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown
      ) {
        this.player.anims.play("walk_left", true);
        this.player.setVelocityX(-speed);
      } else if (
        cursors.right.isDown ||
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown
      ) {
        this.player.anims.play("walk_right", true);
        this.player.setVelocityX(speed);
      }
    }

    // Check if player is still in contact with the dog
    if (this.dogText && this.activeDog) {
      // If we haven't had contact with the dog in the last frame
      if (this.time.now - this.lastDogContact > 100) {
        // Player is no longer in contact, destroy the text
        this.dogText.destroy();
        this.dogText = null;

        // Reset the dog's text display state
        if (this.activeDog) {
          this.activeDog.isShowingText = false;
          this.activeDog = null;
        }
      }
    }

    // Check if player moved away from sign
    if (this.signTextActive && this.currentSign) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.currentSign.x,
        this.currentSign.y
      );

      if (distance > 100) {
        // Adjust this value as needed
        if (this.signText) this.signText.destroy();
        this.signTextActive = false;
      }
    }

    // Check if player moved away from anime character
    if (this.animeTextActive && this.currentAnimeChar) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.currentAnimeChar.x,
        this.currentAnimeChar.y
      );

      if (distance > 150) {
        // Adjust this value as needed
        if (this.animeText) this.animeText.destroy();
        this.animeTextActive = false;
      }
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "gameCanvas",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: sizes.width,
    height: sizes.height,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
