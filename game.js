import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ======================================================
// TEMEL AYARLAR
// ======================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x8bd5ff);

scene.fog = new THREE.Fog(
    0x8bd5ff,
    35,
    180
);


// ======================================================
// KAMERA
// ======================================================

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(
    0,
    5,
    10
);


// ======================================================
// RENDER
// ======================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

document
    .getElementById("game")
    .appendChild(renderer.domElement);


// ======================================================
// IŞIKLAR
// ======================================================

const skyLight =
    new THREE.HemisphereLight(
        0xbfeaff,
        0x35552d,
        2
    );

scene.add(skyLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sun.position.set(
    -30,
    50,
    20
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

scene.add(sun);


// ======================================================
// ZEMİN
// ======================================================

const groundGeometry =
    new THREE.PlaneGeometry(
        220,
        220
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x4f9b45,
        roughness: 1
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// ======================================================
// YOLLAR
// ======================================================

function createRoad(
    x,
    z,
    width,
    length
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            .08,
            length
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 1
        });

    const road =
        new THREE.Mesh(
            geometry,
            material
        );

    road.position.set(
        x,
        .04,
        z
    );

    road.receiveShadow = true;

    scene.add(road);
}

createRoad(
    0,
    0,
    12,
    180
);

createRoad(
    35,
    -20,
    70,
    8
);

createRoad(
    -40,
    35,
    70,
    8
);


// ======================================================
// AĞAÇ
// ======================================================

function createTree(x, z, scale = 1) {

    const group =
        new THREE.Group();


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .45 * scale,
                .6 * scale,
                3 * scale,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: 0x70452c
            })
        );

    trunk.position.y =
        1.5 * scale;

    trunk.castShadow = true;

    group.add(trunk);


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.2 * scale,
                12,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: 0x237a38
            })
        );

    leaves.position.y =
        4 * scale;

    leaves.castShadow = true;

    group.add(leaves);


    group.position.set(
        x,
        0,
        z
    );

    scene.add(group);
}


// Orman

for (let i = 0; i < 70; i++) {

    const side =
        Math.random() > .5
            ? 1
            : -1;

    const x =
        side *
        (12 + Math.random() * 45);

    const z =
        -80 + Math.random() * 160;

    createTree(
        x,
        z,
        .7 + Math.random() * .7
    );
}


// ======================================================
// EV
// ======================================================

function createHouse(x, z) {

    const house =
        new THREE.Group();


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                8,
                5,
                7
            ),

            new THREE.MeshStandardMaterial({
                color: 0xc28a62
            })
        );

    body.position.y = 2.5;

    body.castShadow = true;

    house.add(body);


    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                5.8,
                3,
                4
            ),

            new THREE.MeshStandardMaterial({
                color: 0x9e3029
            })
        );

    roof.position.y = 6.5;

    roof.rotation.y =
        Math.PI / 4;

    roof.castShadow = true;

    house.add(roof);


    const door =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                2.7,
                .2
            ),

            new THREE.MeshStandardMaterial({
                color: 0x4a2b1b
            })
        );

    door.position.set(
        0,
        1.35,
        3.55
    );

    house.add(door);


    house.position.set(
        x,
        0,
        z
    );

    scene.add(house);
}


createHouse(-22, -30);
createHouse(25, -48);
createHouse(-30, 50);


// ======================================================
// AYI KARAKTERİ
// ======================================================

function createBear() {

    const bear =
        new THREE.Group();


    const brown =
        new THREE.MeshStandardMaterial({
            color: 0x8b5a3c,
            roughness: .8
        });


    const lightBrown =
        new THREE.MeshStandardMaterial({
            color: 0xd29b70
        });


    // Gövde

    const body =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.25,
                20,
                16
            ),
            brown
        );

    body.scale.set(
        .85,
        1.15,
        .65
    );

    body.position.y =
        1.7;

    body.castShadow = true;

    bear.add(body);


    // Kafa

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.05,
                20,
                16
            ),
            brown
        );

    head.position.y =
        3.15;

    head.castShadow = true;

    bear.add(head);


    // Kulaklar

    function ear(x) {

        const e =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    .35,
                    16,
                    12
                ),
                brown
            );

        e.position.set(
            x,
            3.85,
            0
        );

        e.castShadow = true;

        bear.add(e);
    }

    ear(-.75);
    ear(.75);


    // Burun bölgesi

    const muzzle =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .45,
                16,
                12
            ),
            lightBrown
        );

    muzzle.scale.z = .7;

    muzzle.position.set(
        0,
        2.95,
        -.88
    );

    bear.add(muzzle);


    // Gözler

    function eye(x) {

        const e =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    .11,
                    10,
                    8
                ),

                new THREE.MeshStandardMaterial({
                    color: 0x111111
                })
            );

        e.position.set(
            x,
            3.35,
            -.96
        );

        bear.add(e);
    }

    eye(-.35);
    eye(.35);


    // Burun

    const nose =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .16,
                12,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: 0x151515
            })
        );

    nose.position.set(
        0,
        2.95,
        -1.27
    );

    bear.add(nose);


    // Kollar

    function arm(x) {

        const a =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    .28,
                    1.1,
                    6,
                    12
                ),
                brown
            );

        a.position.set(
            x,
            1.8,
            0
        );

        a.rotation.z =
            x > 0 ? -.15 : .15;

        a.castShadow = true;

        bear.add(a);
    }

    arm(-1.15);
    arm(1.15);


    // Bacaklar

    function leg(x) {

        const l =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    .32,
                    .8,
                    6,
                    12
                ),
                brown
            );

        l.position.set(
            x,
            .55,
            0
        );

        l.castShadow = true;

        bear.add(l);
    }

    leg(-.55);
    leg(.55);


    return bear;
}


const player =
    createBear();

scene.add(player);

player.position.set(
    0,
    0,
    10
);


// ======================================================
// ALTINLAR
// ======================================================

const coins = [];

function createCoin(x, z) {

    const geometry =
        new THREE.TorusGeometry(
            .55,
            .16,
            12,
            24
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xffc400,
            metalness: .8,
            roughness: .2
        });

    const coin =
        new THREE.Mesh(
            geometry,
            material
        );

    coin.position.set(
        x,
        1.4,
        z
    );

    coin.rotation.x =
        Math.PI / 2;

    coin.castShadow = true;

    scene.add(coin);

    coins.push({
        mesh: coin,
        collected: false
    });
}


for (let i = 0; i < 25; i++) {

    createCoin(
        (Math.random() - .5) * 70,
        -70 + Math.random() * 140
    );
}


// ======================================================
// DÜŞMAN
// ======================================================

const enemies = [];

function createEnemy(x, z) {

    const enemy =
        new THREE.Group();


    const body =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1,
                16,
                12
            ),

            new THREE.MeshStandardMaterial({
                color: 0x713f2c
            })
        );

    body.position.y =
        1;

    body.scale.y =
        1.15;

    body.castShadow = true;

    enemy.add(body);


    const eyeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xff3333
        });


    for (const eyeX of [-.32, .32]) {

        const eye =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    .12,
                    8,
                    8
                ),
                eyeMaterial
            );

        eye.position.set(
            eyeX,
            1.3,
            -.85
        );

        enemy.add(eye);
    }


    enemy.position.set(
        x,
        0,
        z
    );

    scene.add(enemy);

    enemies.push({
        mesh: enemy,
        startX: x,
        direction: 1
    });
}


for (let i = 0; i < 10; i++) {

    createEnemy(
        -30 + Math.random() * 60,
        -70 + Math.random() * 140
    );
}


// ======================================================
// OYUNCU DURUMU
// ======================================================

let health = 3;
let coinCount = 0;
let score = 0;

let velocityY = 0;

let grounded = true;

const speed = .16;

const gravity = .025;

const jumpPower = .55;


// ======================================================
// JOYSTICK
// ======================================================

const joystick =
    document.getElementById("joystick");

const stick =
    document.getElementById("stick");

let joystickX = 0;
let joystickY = 0;

let joystickActive = false;


function joystickMove(event) {

    const rect =
        joystick.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + rect.height / 2;

    let dx =
        event.clientX - centerX;

    let dy =
        event.clientY - centerY;

    const max =
        rect.width / 2 - 27;

    const distance =
        Math.sqrt(dx * dx + dy * dy);

    if (distance > max) {

        dx =
            dx / distance * max;

        dy =
            dy / distance * max;
    }

    joystickX =
        dx / max;

    joystickY =
        dy / max;

    stick.style.transform =
        `translate(${dx}px, ${dy}px)`;
}


joystick.addEventListener(
    "pointerdown",
    event => {

        joystickActive = true;

        joystick.setPointerCapture(
            event.pointerId
        );

        joystickMove(event);
    }
);


joystick.addEventListener(
    "pointermove",
    event => {

        if (joystickActive) {
            joystickMove(event);
        }
    }
);


joystick.addEventListener(
    "pointerup",
    resetJoystick
);

joystick.addEventListener(
    "pointercancel",
    resetJoystick
);


function resetJoystick() {

    joystickActive = false;

    joystickX = 0;
    joystickY = 0;

    stick.style.transform =
        "translate(0px, 0px)";
}


// ======================================================
// ZIPLAMA
// ======================================================

document
    .getElementById("jumpButton")
    .addEventListener(
        "pointerdown",
        () => {

            if (grounded) {

                velocityY =
                    jumpPower;

                grounded = false;
            }
        }
    );


// ======================================================
// OYUNU BAŞLAT
// ======================================================

let gameStarted = false;


document
    .getElementById("startButton")
    .addEventListener(
        "click",
        () => {

            gameStarted = true;

            document
                .getElementById("menu")
                .style.display = "none";
        }
    );


// ======================================================
// ÇARPIŞMA / TOPLAMA
// ======================================================

function checkCoins() {

    for (const coin of coins) {

        if (coin.collected)
            continue;

        const distance =
            player.position.distanceTo(
                coin.mesh.position
            );

        if (distance < 2) {

            coin.collected = true;

            scene.remove(
                coin.mesh
            );

            coinCount++;

            score += 100;

            updateHUD();
        }
    }
}


function checkEnemies() {

    for (const enemy of enemies) {

        const distance =
            player.position.distanceTo(
                enemy.mesh.position
            );

        if (distance < 2) {

            health--;

            updateHUD();

            player.position.z += 2;

            if (health <= 0) {

                gameOver();
            }
        }
    }
}


// ======================================================
// DÜŞMAN HAREKETİ
// ======================================================

function updateEnemies() {

    for (const enemy of enemies) {

        enemy.mesh.position.x +=
            .015 * enemy.direction;

        if (
            enemy.mesh.position.x >
                enemy.startX + 5
        ) {

            enemy.direction = -1;
        }

        if (
            enemy.mesh.position.x <
                enemy.startX - 5
        ) {

            enemy.direction = 1;
        }

        enemy.mesh.rotation.y +=
            .01;
    }
}


// ======================================================
// OYUNCU
// ======================================================

function updatePlayer() {

    if (!gameStarted)
        return;


    const moving =
        Math.abs(joystickX) > .05 ||
        Math.abs(joystickY) > .05;


    if (moving) {

        player.position.x +=
            joystickX * speed;

        player.position.z +=
            joystickY * speed;

        player.rotation.y =
            Math.atan2(
                joystickX,
                joystickY
            );
    }


    velocityY -= gravity;

    player.position.y +=
        velocityY;


    if (player.position.y <= 0) {

        player.position.y = 0;

        velocityY = 0;

        grounded = true;
    }


    // Dünya sınırı

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -95,
            95
        );

    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -95,
            95
        );


    // Yürüyüş animasyonu

    if (moving) {

        player.position.y +=
            Math.sin(
                performance.now() * .015
            ) * .025;
    }
}


// ======================================================
// KAMERA TAKİBİ
// ======================================================

function updateCamera() {

    const desired =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 5,
            player.position.z + 9
        );


    camera.position.lerp(
        desired,
        .08
    );


    camera.lookAt(
        player.position.x,
        player.position.y + 2,
        player.position.z
    );
}


// ======================================================
// HUD
// ======================================================

function updateHUD() {

    document
        .getElementById("health")
        .textContent = health;

    document
        .getElementById("coins")
        .textContent = coinCount;

    document
        .getElementById("score")
        .textContent = score;
}


// ======================================================
// OYUN BİTTİ
// ======================================================

function gameOver() {

    gameStarted = false;

    const menu =
        document.getElementById("menu");

    menu.style.display = "flex";

    menu.querySelector("h1")
        .textContent =
        "OYUN BİTTİ";

    menu.querySelector("p")
        .textContent =
        `Skor: ${score} • Altın: ${coinCount}`;

    document
        .getElementById("startButton")
        .textContent =
        "TEKRAR OYNA";


    health = 3;
    coinCount = 0;
    score = 0;

    player.position.set(
        0,
        0,
        10
    );

    updateHUD();
}


// ======================================================
// PENCERE BOYUTU
// ======================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);


// ======================================================
// ANA OYUN DÖNGÜSÜ
// ======================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    updatePlayer();

    updateEnemies();

    checkCoins();

    checkEnemies();

    updateCamera();


    // Altınları döndür

    for (const coin of coins) {

        if (!coin.collected) {

            coin.mesh.rotation.z +=
                .03;

            coin.mesh.rotation.y +=
                .02;
        }
    }


    renderer.render(
        scene,
        camera
    );
}


// ======================================================
// BAŞLAT
// ======================================================

document
    .getElementById("loading")
    .style.display = "none";

updateHUD();

animate();
