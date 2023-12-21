import type { Intersection, Object3D, Vec2 } from 'three';
import { RANGE, detectCollidingObjects } from './collision.system';
import {
    GamePlayerInputPayload,
    Inputs,
    MovableComponentState,
    Side,
    InputsDev,
} from '../types';
import {
    GameState,
    LevelState,
    Levels,
    PositionLevelState,
} from '../GameState';
import { computeVelocityX, computeVelocityY } from './velocity';
import { INearestObjects } from './raycaster';
import { AREA_DOOR_OPENER_SUFFIX, ElementName } from '../levels';
import { ElementToBounce, InteractiveArea } from '../elements';

const MAX_FALL_SPEED = 20;
const JUMP_POWER = 15;
const BOUNCE_POWER = 15;
const GRAVITY = 20;

// full of side effect
function applyPlayerUpdate(
    delta: number,
    input: Inputs,
    collisionResult: INearestObjects,
    player: { position: Vec2; velocity: Vec2 },
    freeMovementMode?: boolean,
) {
    const { velocity, position } = player;
    let state: MovableComponentState = MovableComponentState.onFloor;

    if (collisionResult.left) {
        if ((collisionResult.left.object as ElementToBounce).bounce) {
            velocity.y = BOUNCE_POWER;
            velocity.x = 10;
        } else {
            velocity.x = 0;
            position.x = collisionResult.left.point.x + RANGE;
        }
    }

    if (collisionResult.right) {
        if ((collisionResult.right.object as ElementToBounce).bounce) {
            velocity.y = BOUNCE_POWER;
            velocity.x = -10;
        } else {
            velocity.x = 0;
            position.x = collisionResult.right.point.x - RANGE;
        }
    }

    if (collisionResult.up) {
        if ((collisionResult.up.object as ElementToBounce).bounce) {
            velocity.y = -BOUNCE_POWER;
        } else {
            velocity.y = 0;
        }
        position.y = collisionResult.up.point.y - RANGE;
    }

    if (collisionResult.down) {
        if ((collisionResult.down.object as ElementToBounce).bounce) {
            velocity.y = BOUNCE_POWER;
        } else {
            state = MovableComponentState.onFloor;
            velocity.y = 0;
            position.y = collisionResult.down.point.y + RANGE;
        }
    } else {
        state = MovableComponentState.inAir;
    }

    // jump if possible
    if (input.jump && state === MovableComponentState.onFloor) {
        velocity.y = JUMP_POWER;
    }

    if (state === MovableComponentState.inAir && !freeMovementMode) {
        // apply gravity
        const hasReachedMaxFallSpeed = velocity.y <= -MAX_FALL_SPEED;
        if (hasReachedMaxFallSpeed) {
            velocity.y = -MAX_FALL_SPEED;
        } else {
            velocity.y -= GRAVITY * delta;
        }
    }

    // use velocity to update position
    position.x += velocity.x * delta * 60;
    position.y += velocity.y * delta * 60;
}

export interface InteractiveComponent {
    shouldActivate: boolean;
    isActive: boolean;
}

type Context = 'client' | 'server';

export function applySingleInput(
    delta: number,
    side: Side,
    inputs: Inputs,
    collidingElems: Object3D[],
    gameState: GameState,
    context: Context,
    freeMovementMode?: boolean,
) {
    const player = gameState.players[side];
    // side effect
    player.velocity.x = computeVelocityX(delta, inputs, player.velocity.x);
    if (freeMovementMode) {
        player.velocity.y = computeVelocityY(
            delta,
            inputs as InputsDev,
            player.velocity.y,
        );
    }

    const collisionResult = detectCollidingObjects(
        collidingElems,
        player,
        freeMovementMode,
    );
    applyPlayerUpdate(delta, inputs, collisionResult, player, freeMovementMode);
    applyWorldUpdate(side, collidingElems, gameState, collisionResult, context);
}

export function applyInputList(
    delta: number,
    lastPlayerInput: GamePlayerInputPayload | undefined,
    inputs: GamePlayerInputPayload[],
    collidingElements: Object3D[],
    gameState: GameState,
    context: Context,
    dev?: boolean,
    freeMovementMode?: boolean,
) {
    if (dev) {
        console.log(gameState.game_time);
    }
    let lastInput = lastPlayerInput;

    // if there are inputs for this time tick, we process them
    if (inputs.length) {
        for (let j = 0; j < inputs.length; j++) {
            const input = inputs[j];
            if (dev) {
                console.log('applying input', input.time, input.sequence);
                console.log(
                    'applying input from position',
                    gameState.players[input.player].position,
                );
                console.log(
                    'applying input from velocity',
                    gameState.players[input.player].velocity,
                );
            }
            applySingleInput(
                delta,
                input.player,
                input.inputs,
                collidingElements,
                gameState,
                context,
                freeMovementMode,
            );
            if (dev) {
                console.log(
                    'applying input to position',
                    gameState.players[input.player].position,
                );
                console.log(
                    'applying input to velocity',
                    gameState.players[input.player].velocity,
                );
            }
            // side effect
            lastInput = input;
        }
    } else {
        // if there are no inputs for this tick, we have to deduce / interpolate player position
        // regarding the last action he did.
        if (dev) {
            console.log('last player input', lastInput);
        }

        if (lastInput) {
            if (dev) {
                console.log(
                    `no input for player ${lastInput.player} reapply last input`,
                );
                console.log(
                    'applying input',
                    lastInput.time,
                    lastInput.sequence,
                );
                console.log(
                    'applying input from position',
                    gameState.players[lastInput.player].position,
                );
                console.log(
                    'applying input from velocity',
                    gameState.players[lastInput.player].velocity,
                );
            }
            applySingleInput(
                delta,
                lastInput.player,
                lastInput.inputs,
                collidingElements,
                gameState,
                context,
                freeMovementMode,
            );
            if (dev) {
                console.log(
                    'applying input to position',
                    gameState.players[lastInput.player].position,
                );
                console.log(
                    'applying input to velocity',
                    gameState.players[lastInput.player].velocity,
                );
            }
        }
    }
    return lastInput;
}

const isTouchingDoorOpener = (objectDown: Intersection) => {
    const { parent } = objectDown.object;
    return parent?.name.includes(AREA_DOOR_OPENER_SUFFIX) || false;
};

const isTouchingEndLevel = (objectDown: Intersection) => {
    const { parent } = objectDown.object;
    return parent?.name.includes(ElementName.END_LEVEL) || false;
};

function updateDoor(wallDoor: Object3D, open: boolean) {
    const ratio = open ? 1 : 0;
    const doorLeft = wallDoor.children.find(
        (child) => child.name === 'doorLeft',
    )!;
    const doorRight = wallDoor.children.find(
        (child) => child.name === 'doorRight',
    )!;
    doorLeft.position.setX(-100 * ratio);
    doorRight.position.setX(100 * ratio);
    wallDoor.updateMatrixWorld();
}

// we could easily detect the activation area using position precalculated eventually.
// but if we update the level, we have to update it as well.
function applyWorldUpdate(
    side: Side,
    obstacles: Object3D[],
    gameState: GameState,
    collisionResult: INearestObjects,
    context: Context,
) {
    const isPositionLevel = (value: LevelState): value is PositionLevelState =>
        Boolean((value as PositionLevelState).doors);

    if (isPositionLevel(gameState.level)) {
        let doorNameActivating: string | undefined = undefined;
        if (
            collisionResult.down &&
            isTouchingDoorOpener(collisionResult.down)
        ) {
            const elem = collisionResult.down.object.parent as InteractiveArea;
            doorNameActivating = `${elem.name.replace(
                `_${AREA_DOOR_OPENER_SUFFIX}`,
                '',
            )}`;
            if (
                gameState.level.doors[doorNameActivating].indexOf(side) === -1
            ) {
                gameState.level.doors[doorNameActivating].push(side);
            }
        }

        for (const key in gameState.level.doors) {
            const activators = gameState.level.doors[key];

            // if this door opener is not the one we are currently activating
            // remove us from the list of activators
            if (key !== doorNameActivating) {
                const index = activators.indexOf(side);
                if (index !== -1) {
                    activators.splice(index, 1);
                }
            }

            if (context === 'server') {
                const wallDoor = obstacles.find(
                    (e) => e.name === ElementName.WALL_DOOR(key),
                );
                if (wallDoor) {
                    updateDoor(wallDoor, activators.length > 0);
                }
            }
        }
    }

    const endLevelIndex = gameState.level.end_level.indexOf(side);
    if (collisionResult.down && isTouchingEndLevel(collisionResult.down)) {
        if (endLevelIndex === -1) {
            gameState.level.end_level.push(side);
        }
    } else if (endLevelIndex !== -1) {
        gameState.level.end_level.splice(endLevelIndex, 1);
    }
}
