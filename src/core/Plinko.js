import Matter from "matter-js";
import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import { GlobalFunc } from "./GlobalFunc";
import { store, mutations } from "./Store";
import { bettingBus } from "~/core/bus";
import { GAMES_LIST_ENUM } from "feie-ui";

export function Plinko(element) {
  /********** Begin Settings For Engine, PIXI  **********/
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Composite = Matter.Composite;
  const Events = Matter.Events;
  const canvasWidth = 800;
  const canvasHeight = 630;
  const engine = Engine.create();

  const initialWidth = 1200;
  const secondWidth = 1100;
  engine.timing.timeScale = 1.6;

  const sceneObjects = [];

  const app = new PIXI.Application({
    backgroundAlpha: 0,
    resizeTo: element,
    width: canvasWidth,
    height: canvasHeight,
    antialias: true,
    resolution: 4,
    autoDensity: true,
  });

  let scale = 1;
  app.stage.scale.set(scale);

  element.appendChild(app.view);

  app.ticker.add(() => {
    sceneObjects.forEach((object) => {
      object.sprite.position = object.body.position;
      object.sprite.rotation = object.body.angle;
    });
  });

  Runner.run(engine);
  Events.on(engine, "collisionStart", collision);

  /********** End Settings For Engine, PIXI  **********/

  /********** Begin Global Variables  **********/
  const globalFunc = GlobalFunc();
  const ParticleRadius = globalFunc.initialDrawValue.ParticleRadius;
  const GapWidth = globalFunc.initialDrawValue.GapWidth;
  const PointRadius = globalFunc.initialDrawValue.PointRadius;
  const MapGap = globalFunc.initialDrawValue.MapGap;
  /********** End Global Variables  **********/

  /********** Begin Local Variables  **********/
  let levelState = localStorage.getItem("PLINKO_DEFAULT_LEVEL") ?? "middle";
  let rowNumState = 16;
  let last = 0;
  let originalY = 0;

  let maskX = 0;
  let maskY = 0;
  let maskWidth = 0;
  let maskHeight = 0;
  let heightScale = 1;

  let objects = [];
  let tweensArray = [];

  const mask = new PIXI.Graphics();
  /********** End Local Variables  **********/

  /********** Begin Draw functions  **********/
  function Point(x, y, row, col, color = 0xd3d3d3) {
    const options = {
      isStatic: true,
    };

    const metter = Bodies.circle(x, y, PointRadius, options);
    metter.label = "point";
    metter.row = row;
    metter.col = col;
    Composite.add(engine.world, metter);

    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawCircle(x, y, PointRadius);
    graphics.zIndex = 2;
    graphics.endFill();
    app.stage.addChild(graphics);
  }

  function Particle(x, y, r, road, id) {
    const options = {
      restitution: 0,
      friction: 0,
      collisionFilter: {
        group: -1,
      },
    };

    const metter = Bodies.circle(x, y, r, options);
    metter.label = "particle";
    metter.road = {
      list: road,
      id: [],
      ballId: id,
    };
    Composite.add(engine.world, metter);
    let texture = PIXI.Texture.from("./image/ball.svg?8");
    if (levelState === "low") {
      texture = PIXI.Texture.from("./image/ball-low.svg?8");
    } else if (levelState === "middle") {
      texture = PIXI.Texture.from("./image/ball.svg?8");
    } else {
      texture = PIXI.Texture.from("./image/ball-high.svg?8");
    }
    const sprite = new PIXI.Sprite(texture);
    sprite.width = ParticleRadius * 2;
    sprite.height = ParticleRadius * 2;
    sprite.pivot.set(ParticleRadius, ParticleRadius);
    app.stage.addChild(sprite);

    sceneObjects.push({
      body: metter,
      sprite: sprite,
    });
  }

  function Basket(x, y, gap, text) {
    const options = {
      isStatic: true,
    };

    const metter = Bodies.rectangle(x, y, gap, gap, options);
    metter.label = "basket";
    Composite.add(engine.world, metter);

    if (text === undefined) {
      return;
    }

    let color = globalFunc.selectFromText(
      rowNumState,
      levelState,
      text,
      "color"
    );

    let shadowColor = globalFunc.selectFromText(
      rowNumState,
      levelState,
      text,
      "shadow"
    );

    let fontSize = (12 * heightScale) / scale;

    const rectangle = new PIXI.Graphics();
    const shadow = new PIXI.Graphics();
    rectangle.beginFill(color);
    shadow.beginFill(shadowColor);

    const cornerRadius = (gap * 10) / 120;
    if (window.innerWidth < 1100) {
      rectangle.drawRoundedRect(
        -gap / 2 + 4,
        -gap / 8 / scale,
        gap - 8,
        (2 * gap) / 8 / scale,
        cornerRadius
      );
      shadow.drawRoundedRect(
        -gap / 2 + 4,
        -gap / 8 / scale + 2 / scale,
        gap - 8,
        (2 * gap) / 8 / scale,
        cornerRadius
      );
      fontSize = 6 / scale;
    } else {
      rectangle.drawRoundedRect(
        -gap / 2 + 4,
        -gap / 4 / scale,
        gap - 8,
        (2 * gap) / 4 / scale,
        cornerRadius
      );
      shadow.drawRoundedRect(
        -gap / 2 + 4,
        -gap / 4 / scale + 4 / scale,
        gap - 8,
        (2 * gap) / 4 / scale,
        cornerRadius
      );
    }
    rectangle.endFill();
    shadow.endFill();

    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontWeight: 600,
      fontSize: fontSize,
      fill: "#000000",
      align: "center",
    });

    let scoreText = text.toString();
    if (scoreText.replace(".", "").length < 3) {
      scoreText += "x";
    }
    const label = new PIXI.Text(scoreText, style);
    label.anchor.set(0.5, 0.5);

    const container = new PIXI.Container();
    container.position.x = x;
    container.position.y = y;
    container.interactive = true;
    container.buttonMode = true;
    container.addChild(shadow);
    container.addChild(rectangle);
    container.addChild(label);

    const object = {
      body: metter,
      sprite: container,
    };

    sceneObjects.push(object);
    app.stage.addChild(container);

    container.on("mouseover", function (e) {
      let pro = globalFunc.selectFromText(rowNumState, levelState, text, "pro");
      mutations.changeShowPro(true, text, pro);
    });

    container.on("mouseout", function (e) {
      mutations.changeShowPro(false);
    });

    metter.metter = {
      text: text,
      color: color,
      x: x,
      y: y,
      gap: gap,
    };
  }

  function ScoreBoard(x, y, gap, text, ballID) {
    const options = {
      isStatic: true,
    };
    const metter = Bodies.rectangle(x, y, gap, gap, options);
    metter.label = "scoreboard";

    if (text === undefined) {
      return;
    }

    let color = globalFunc.selectFromText(
      rowNumState,
      levelState,
      text,
      "color"
    );

    const rectangle = new PIXI.Graphics();
    const border = new PIXI.Graphics();
    rectangle.beginFill(color);
    border.beginFill(0x557086);
    rectangle.drawRect(
      -gap / 2 / scale,
      -gap / 2 / scale,
      gap / scale,
      gap / scale - 1
    );
    border.drawRect(-gap / 2 / scale, -gap / 2 / scale - 1, gap / scale, 1);
    border.endFill();
    rectangle.endFill();

    let fontSize = 16;
    if (window.innerWidth < 1100) {
      fontSize = 8;
    }

    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: fontSize / scale,
      fontWeight: 600,
      fill: "#000000",
      align: "center",
    });

    const label = new PIXI.Text(text + "x", style);
    label.anchor.set(0.5, 0.5);

    const container = new PIXI.Container();
    container.position.x = x;
    container.position.y = y;
    container.interactive = true;
    container.buttonMode = true;
    rectangle.blendMode = PIXI.BLEND_MODES.NORMAL;
    label.blendMode = PIXI.BLEND_MODES.NORMAL;
    container.addChild(rectangle);
    container.addChild(border);
    container.addChild(label);

    const object = {
      body: metter,
      sprite: container,
    };

    sceneObjects.push(object);
    app.stage.addChild(container);

    metter.metter = {
      text: text,
      color: color,
      x: x,
      y: y,
      gap: gap,
    };

    container.on("mouseover", function (e) {
      let newColor = globalFunc.selectFromText(
        rowNumState,
        levelState,
        text,
        "shadow"
      );

      rectangle.clear();
      rectangle.beginFill(newColor);
      rectangle.drawRect(
        -gap / 2 / scale,
        -gap / 2 / scale,
        gap / scale,
        gap / scale - 1
      );
      rectangle.endFill();
      app.renderer.render(app.stage);
    });

    container.on("mouseout", function (e) {
      let newColor = globalFunc.selectFromText(
        rowNumState,
        levelState,
        text,
        "color"
      );

      rectangle.clear();
      rectangle.beginFill(newColor);
      rectangle.drawRect(
        -gap / 2 / scale,
        -gap / 2 / scale,
        gap / scale,
        gap / scale - 1
      );
      rectangle.endFill();
      app.renderer.render(app.stage);
    });

    container.on("pointerdown", function (e) {
      window.miniGameWujie.bus.$emit("openDialogBetRecord", {
        id: ballID,
        game: GAMES_LIST_ENUM.PLINKO,
      });
    });

    if (parseFloat(text) > 1) {
      const graphics = new PIXI.Graphics();

      var reqAnim;
      var breathSpeed = 2;
      var rMax = 15;
      var rMin = 0;
      var r = rMin;
      var opacity = 0.7;
      var rDiff = rMax - rMin;
      var opacityIncr = 1 / rDiff / 1.2;

      animate();

      function animate() {
        graphics.clear();
        graphics.lineStyle(r, color, opacity);
        graphics.beginFill(0, 0);

        const rectWidth = gap / scale;
        const rectHeight = gap / scale;
        const rectX = x - rectWidth / 2;
        let rectY = y + 25 / scale;
        if (window.innerWidth < 1100) {
          rectY = y + 25 / scale / 2;
        }
        graphics.drawRoundedRect(rectX, rectY, rectWidth, rectHeight, 5);
        graphics.endFill();

        app.stage.addChild(graphics);
        if (r === rMax) {
          cancelAnimationFrame(reqAnim);
          reqAnim = undefined;
          return;
        }
        r += breathSpeed;
        opacity -= opacityIncr;
        reqAnim = requestAnimationFrame(animate);
      }

      setTimeout(() => {
        if (reqAnim) {
          cancelAnimationFrame(reqAnim);
          reqAnim = undefined;
        }
        graphics.destroy();
      }, 400);
    }

    object.sprite.mask = mask;

    return object;
  }
  /********** End Draw functions  **********/

  /********** Begin Animations  **********/
  function Splash(body) {
    const graphics = new PIXI.Graphics();

    var reqAnim;
    var breathSpeed = 2;
    var rMax = 15;
    var rMin = 0;
    var r = rMin;
    var opacity = 0.9;
    var rDiff = rMax - rMin;
    var opacityIncr = 1 / rDiff / 1.2;

    animate();
    function animate() {
      graphics.clear();
      graphics.lineStyle(r, 0xffffff, opacity);
      graphics.beginFill(0, 0);
      graphics.drawCircle(
        body.position.x,
        body.position.y,
        body.circleRadius * 1.8
      );
      graphics.endFill();

      app.stage.addChild(graphics);
      if (r === rMax) {
        cancelAnimationFrame(reqAnim);
        reqAnim = undefined;
        return;
      }
      r += breathSpeed;
      opacity -= opacityIncr;
      reqAnim = requestAnimationFrame(animate);
    }
    setTimeout(() => {
      if (reqAnim) {
        cancelAnimationFrame(reqAnim);
        reqAnim = undefined;
      }
      graphics.destroy();
    }, 400);
  }

  function BasketSplash(body) {
    const graphics = new PIXI.Graphics();

    var reqAnim;
    var breathSpeed = 2;
    var rMax = 15;
    var rMin = 0;
    var r = rMin;
    var opacity = 0.7;
    var rDiff = rMax - rMin;
    var opacityIncr = 1 / rDiff / 1.2;

    animate();

    function animate() {
      graphics.clear();
      graphics.lineStyle(r, body.metter.color, opacity);
      graphics.beginFill(0, 0);

      let rectWidth = 60;
      let rectHeight = 40 / scale;
      if (window.innerWidth < 1100) {
        rectHeight = 20 / scale;
      }
      const rectX = body.position.x - rectWidth / 2;
      const rectY = body.position.y - rectHeight / 2;
      graphics.drawRoundedRect(rectX, rectY, rectWidth, rectHeight, 10);

      graphics.endFill();

      app.stage.addChild(graphics);
      if (r === rMax) {
        cancelAnimationFrame(reqAnim);
        reqAnim = undefined;
        return;
      }
      r += breathSpeed;
      opacity -= opacityIncr;
      reqAnim = requestAnimationFrame(animate);
    }

    setTimeout(() => {
      if (reqAnim) {
        cancelAnimationFrame(reqAnim);
        reqAnim = undefined;
      }
      graphics.destroy();
    }, 400);

    const targetY = originalY + 10;
    if (body.position.y !== targetY) {
      const moveDownTween = new TWEEN.Tween(body.position)
        .to({ y: targetY }, 100)
        .easing(TWEEN.Easing.Quadratic.Out);

      const moveBackTween = new TWEEN.Tween(body.position)
        .to({ y: originalY }, 100)
        .easing(TWEEN.Easing.Quadratic.Out);

      moveDownTween.chain(moveBackTween);
      moveDownTween.start();

      app.ticker.add(() => {
        TWEEN.update();
      });
    }
  }
  /********** End Animations  **********/

  /********** Begin Assist Functions  **********/
  function getIndexFromCoordinate(row, col) {
    return (row * (row - 1)) / 2 + (row - 1) * 2 + col;
  }

  function GetSettings(betLevel, betRowNum) {
    if (betLevel === undefined || betRowNum === undefined) {
      return;
    } else {
      levelState = betLevel;
      rowNumState = betRowNum;
    }
  }

  function SearchRoute(target) {
    const pointIds = [];
    const pointDirs = [];

    let rows = parseInt(rowNumState);
    let gapLeft = target - 1;
    let gapRight = rows + 1 - target;
    let currentIndex = getIndexFromCoordinate(rows, target);

    for (let i = rows; i > 0; i--) {
      let flag = gapLeft > 0 ? (Math.random() > 0.5 ? 0 : 1) : 1;
      if (gapRight === 0) {
        flag = 0;
      }
      if (flag === 0) {
        last = Math.random() < 0.5 ? 1 : 3;
        gapLeft--;
      }
      if (flag === 1) {
        last = Math.random() < 0.5 ? 0 : 2;
        gapRight--;
      }
      currentIndex += flag;
      if (i === 1 && flag === 0) {
        currentIndex = Math.random() > 0.5 ? 2 : 3;
        last = currentIndex === 2 ? 3 : 2;
        pointIds.push(currentIndex);
        currentIndex === 3 ? pointDirs.unshift(last) : pointDirs.push(last);
      } else if (i === 1 && flag === 1) {
        currentIndex = Math.random() > 0.5 ? 2 : 1;
        last = currentIndex === 2 ? 2 : 3;
        pointIds.push(currentIndex);
        currentIndex === 1 ? pointDirs.unshift(last) : pointDirs.push(last);
      } else {
        pointIds.push(currentIndex);
        if (last === 0 || last === 1) {
          pointDirs.push(last, last + 4);
        } else {
          pointDirs.push(last);
        }
        currentIndex -= i + 2;
      }
    }
    return [pointIds, pointDirs];
  }

  function UpdateScore(body, ballID) {
    let lastPos = canvasHeight / 3 / scale - 50 / scale;
    if (objects.length > 1) {
      lastPos = objects[objects.length - 1].body.position.y - 50 / scale;
    }
    if (window.innerWidth < 1100) {
      if (window.innerWidth > 400) {
        lastPos = canvasHeight / 6 / scale - 25 / scale / 2;
      } else {
        if (window.innerWidth > 350) {
          lastPos = canvasHeight / 8 / scale - 25 / scale / 2;
        } else {
          lastPos = canvasHeight / 10 / scale - 25 / scale / 2;
        }
      }

      if (objects.length > 1) {
        lastPos = objects[objects.length - 1].body.position.y - 25 / scale;
      }
    }
    const text = body.metter.text;
    const object = ScoreBoard(
      maskX + maskWidth / 2,
      lastPos,
      maskWidth * scale,
      text,
      ballID
    );

    stopTween();
    objects.push(object);
    tweenUpdate();
  }

  function stopTween() {
    for (let i = 0; i < tweensArray.length; i++) {
      tweensArray[i].stop();
    }
    tweensArray = [];
    removeScoreboard();
  }

  function tweenUpdate() {
    let distance = -50 / scale;
    if (objects.length > 1) {
      distance =
        objects[objects.length - 1].body.position.y - canvasHeight / 3 / scale;
    }
    if (window.innerWidth < 1100) {
      distance = -25 / scale;
      if (objects.length > 1) {
        if (window.innerWidth > 400) {
          distance =
            objects[objects.length - 1].body.position.y -
            canvasHeight / 6 / scale -
            maskHeight / 8;
        } else {
          if (window.innerWidth > 350) {
            distance =
              objects[objects.length - 1].body.position.y -
              canvasHeight / 8 / scale -
              maskHeight / 8;
          } else {
            distance =
              objects[objects.length - 1].body.position.y -
              canvasHeight / 10 / scale -
              maskHeight / 8;
          }
        }
      }
    }
    for (let i = 0; i < objects.length; i++) {
      const targetY = objects[i].body.position.y - distance;
      const object = objects[i];
      const moveDown = new TWEEN.Tween(object.body.position)
        .to({ y: targetY }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      tweensArray.push(moveDown);
    }
  }

  function removeScoreboard() {
    for (let i = 0; i < objects.length; i++) {
      if (window.innerWidth < 1100) {
        if (
          objects[i].body.position.y >
          canvasHeight / 8 / scale + 150 / scale
        ) {
          const object = objects.splice(i, 1);
          app.stage.removeChild(object[0].sprite);
          delete object[0];
          i--;
        }
      } else {
        if (
          objects[i].body.position.y >
          canvasHeight / 3 / scale + 200 / scale
        ) {
          const object = objects.splice(i, 1);
          app.stage.removeChild(object[0].sprite);
          delete object[0];
          i--;
        }
      }
    }
  }
  /********** End Assist Functions  **********/

  /********** Begin Engine, Canvas functionalities  **********/
  function collision(event) {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const bodyA = pairs[i].bodyA;
      const bodyB = pairs[i].bodyB;
      if (bodyA.label === "point") {
        Splash(bodyA);
      }
      if (bodyB.label === "point") {
        Splash(bodyB);
      }
      if (bodyA.label === "particle" && bodyB.label === "point") {
        Road(bodyA, bodyB);
      }
      if (bodyB.label === "particle" && bodyA.label === "point") {
        Road(bodyB, bodyA);
      }
      if (bodyA.label === "basket" && bodyB.label === "particle") {
        RemoveParticle(bodyB);
        BasketSplash(bodyA);
        UpdateScore(bodyA, bodyB.road.ballId);
        sendDataToVue(2);
      }
      if (bodyB.label === "basket" && bodyA.label === "particle") {
        RemoveParticle(bodyA);
        BasketSplash(bodyB);
        UpdateScore(bodyB, bodyA.road.ballId);
        sendDataToVue(1);
      }
    }
  }

  function sendDataToVue(data) {
    bettingBus.emit(data);
  }

  function Road(body, point) {
    let previousVelocity = { x: 0, y: 0 };
    Body.setStatic(body, true);
    if (!body.road.id.includes(point.id)) {
      const road = body.road.list.shift();
      let velocity = { x: 0, y: 0 };
      if (road === 0 || road === 1) {
        velocity = { x: road === 0 ? -2.3 : 2.3, y: -3 };
      } else if (road === 2 || road === 3) {
        Body.setPosition(body, {
          x: point.position.x,
          y: point.position.y - point.circleRadius * 2,
        });
        velocity = { x: road === 2 ? -1.2 : 1.2, y: -3 };
      } else if (road === 4 || road === 5) {
        velocity = { x: road === 4 ? 0.7 : -0.7, y: 0 };
      } else if (road === 6 || road === 7) {
        Body.setPosition(body, {
          x: point.position.x,
          y: point.position.y - point.circleRadius * 2,
        });
        velocity = { x: road === 6 ? -0.7 : 0.7, y: -1.5 };
        previousVelocity = { x: road === 6 ? -0.7 : 0.7, y: -1.5 };
      }
      setTimeout(() => {
        Body.setVelocity(body, velocity);
      }, 0);
      body.road.id.push(point.id);
    } else {
      setTimeout(() => {
        Body.setVelocity(body, previousVelocity);
      }, 0);
    }
    Body.setStatic(body, false);
  }

  function map() {
    let newWindowWidth = window.innerWidth;

    if (newWindowWidth > initialWidth) {
      heightScale = 1;
    } else if (newWindowWidth <= initialWidth && newWindowWidth > secondWidth) {
      heightScale = newWindowWidth / initialWidth;
    } else {
      heightScale = element.offsetHeight / canvasHeight;
    }

    app.stage.position._x = 0;
    const rows = globalFunc.baskets[levelState]["_" + rowNumState];
    const increment = 1;
    const gap = GapWidth * 2 * MapGap;
    let col = 3;
    let id = 0;

    clear();
    scale = (10 * heightScale) / rows.length;
    originalY = rows.length * gap - 15 * scale;
    for (let i = 1; i <= rows.length; i++) {
      const space = (canvasWidth - (gap + 8) * col) / 2;
      for (let j = 1; j <= col; j++) {
        if (i < rows.length) {
          id++;
          new Point(
            space + j * (gap + 8) - (GapWidth * MapGap + 4),
            i * gap,
            i,
            id
          );
        } else {
          if (j > 1) {
            new Basket(
              space + j * (gap + 8) - (GapWidth * MapGap + 4),
              i * gap - 15 * scale,
              gap + 8,
              rows[j - 2]
            );
          }
        }
      }
      col += increment;
    }
    app.stage.scale.set(scale);
    if (newWindowWidth > 1100) {
      app.stage.position.x = ((1 - scale) * canvasWidth) / 2;
    } else {
      if (newWindowWidth > 400) {
        app.stage.position.x = (canvasWidth - scale * canvasWidth) / 2 - 200;
      } else {
        if (newWindowWidth > 350) {
          app.stage.position.x = (canvasWidth - scale * canvasWidth) / 2 - 220;
        } else {
          app.stage.position.x = (canvasWidth - scale * canvasWidth) / 2 - 250;
        }
      }
    }

    mask.clear();
    mask.beginFill(0xffffff);
    if (newWindowWidth > initialWidth) {
      if (scale === 1) {
        maskX = 750;
        maskY = canvasHeight / 3 / scale - 25 / scale;
        maskHeight = 198 / scale;
        maskWidth = 50 / scale;
      } else {
        maskX = app.stage.position.x / (1 - scale) + 350 / scale;
        maskY = canvasHeight / 3 / scale - 25 / scale;
        maskHeight = 198 / scale;
        maskWidth = 50 / scale;
      }
    } else {
      if (newWindowWidth <= initialWidth && newWindowWidth > secondWidth) {
        maskX =
          app.stage.position.x / (1 - scale) +
          (350 + (newWindowWidth - initialWidth) / 2) / scale;
        maskY = canvasHeight / 3 / scale - 25 / scale;
        maskHeight = 198 / scale;
        maskWidth = 50 / scale;
      } else {
        if (newWindowWidth > 400) {
          maskX =
            (canvasWidth - 100) / scale / 2 +
            5 / scale -
            app.stage.position.x / scale;
          maskY = canvasHeight / 6 / scale;
          maskHeight = 98 / scale;
          maskWidth = 25 / scale;
        } else {
          if (newWindowWidth > 350) {
            maskX =
              (canvasWidth - 200) / scale / 2 +
              5 / scale -
              app.stage.position.x / scale;
            maskY = canvasHeight / 8 / scale;
            maskHeight = 98 / scale;
            maskWidth = 25 / scale;
          } else {
            maskX =
              (canvasWidth - 300) / scale / 2 +
              5 / scale -
              app.stage.position.x / scale;
            maskY = canvasHeight / 10 / scale;
            maskHeight = 98 / scale;
            maskWidth = 25 / scale;
          }
        }
      }
    }
    mask.drawRoundedRect(
      maskX,
      maskY,
      maskWidth,
      maskHeight,
      newWindowWidth > 1100 ? 10 / scale : 4 / scale
    );
    mask.endFill();
    app.stage.addChild(mask);

    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xffffff);
    rectangle.drawRect(
      -gap / 2 / scale,
      -gap / 4 / scale,
      (gap - 4) / scale,
      gap / 2 / scale
    );
    rectangle.endFill();
    rectangle.mask = mask;
  }

  function getStartPositionAndRoute(firstpoint, route) {
    let startPosition = 0;
    let ballRoute = [];
    const frequency = 0.1;
    if (firstpoint === "1") {
      startPosition = canvasWidth / 2 - 68;
      ballRoute = route;
    } else if (firstpoint === "2") {
      let compareNumber = Math.random();
      if (compareNumber > frequency) {
        startPosition = canvasWidth / 2;
        ballRoute = route;
      } else {
        if (route[0] === 0) {
          startPosition = canvasWidth / 2 - 34;
          ballRoute = route.slice(2);
        } else if (route[0] === 1) {
          startPosition = canvasWidth / 2 + 34;
          ballRoute = route.slice(2);
        } else if (route[0] === 2) {
          startPosition = canvasWidth / 2 - 34;
          ballRoute = route.slice(1);
        } else if (route[0] === 3) {
          startPosition = canvasWidth / 2 + 34;
          ballRoute = route.slice(1);
        }
      }
    } else if (firstpoint === "3") {
      ballRoute = route;
      startPosition = canvasWidth / 2 + 68;
    }
    return { startPosition, ballRoute };
  }

  function getRoute(firstPoint, path) {
    let dirRoute = [];
    if (firstPoint === "1") {
      Math.random() > 0.5 ? dirRoute.push(1, 5) : dirRoute.push(3);
      for (let i = 1; i < path.length; i++) {
        if (path[i] === "L") {
          Math.random() > 0.4
            ? dirRoute.push(0, 4)
            : Math.random() > 0.8
            ? path[i - 1] === 4 || path[i - 1] === 5
              ? dirRoute.push(2)
              : dirRoute.push(6)
            : dirRoute.push(2);
        } else {
          Math.random() > 0.4
            ? dirRoute.push(1, 5)
            : Math.random() > 0.8
            ? path[i - 1] === 4 || path[i - 1] === 5
              ? dirRoute.push(3)
              : dirRoute.push(7)
            : dirRoute.push(3);
        }
      }
    } else if (firstPoint === "2") {
      for (let i = 0; i < path.length; i++) {
        if (path[i] === "L") {
          Math.random() > 0.5 ? dirRoute.push(0, 4) : dirRoute.push(2);
        } else {
          Math.random() > 0.5 ? dirRoute.push(1, 5) : dirRoute.push(3);
        }
      }
    } else if (firstPoint === "3") {
      Math.random() > 0.5 ? dirRoute.push(0, 4) : dirRoute.push(2);
      for (let i = 1; i < path.length; i++) {
        if (path[i] === "L") {
          Math.random() > 0.4
            ? dirRoute.push(0, 4)
            : Math.random() > 0.8
            ? path[i - 1] === 4 || path[i - 1] === 5
              ? dirRoute.push(2)
              : dirRoute.push(6)
            : dirRoute.push(2);
        } else {
          Math.random() > 0.4
            ? dirRoute.push(1, 5)
            : Math.random() > 0.8
            ? path[i - 1] === 4 || path[i - 1] === 5
              ? dirRoute.push(3)
              : dirRoute.push(7)
            : dirRoute.push(3);
        }
      }
    }
    return dirRoute;
  }

  function add(path, firstPoint, id) {
    let initialRoute = getRoute(firstPoint, path);
    let optimize = getStartPositionAndRoute(firstPoint, initialRoute);
    new Particle(
      optimize.startPosition,
      0,
      ParticleRadius,
      optimize.ballRoute,
      id
    );
  }

  function clear() {
    Composite.clear(engine.world);
    app.stage.removeChildren();
    app.stage.children.forEach(function (child) {
      child.destroy(true);
    });
  }

  function RemoveParticle(body) {
    for (let i = 0; i < sceneObjects.length; i++) {
      if (sceneObjects[i].body.id === body.id) {
        Composite.remove(engine.world, sceneObjects[i].body);
        app.stage.removeChild(sceneObjects[i].sprite);
        delete sceneObjects[i];
        sceneObjects.splice(i, 1);
        break;
      }
    }
  }
  /********** End Engine, Canvas functionalities  **********/

  return {
    map,
    add,
    clear,
    GetSettings,
  };
}
