import { Inputs, MovableComponentState } from '../types';

const MAX_VELOCITY = 10;
const SPEED = 20;
const SPEED_INSIDE = 40;

const updateVelocity = (speed: number, target: number, velocity: number) => {
    return (velocity += (target - velocity) / speed);
};

export function computeVelocityX(
    delta: number,
    input: Inputs,
    state: MovableComponentState,
    velocityX: number,
) {
    const deltaInverse = 1 / delta / (60 * 60);
    const hasReachedMaxLeftSpeed = velocityX < -MAX_VELOCITY;
    const hasReachedMaxRightSpeed = velocityX > MAX_VELOCITY;
    const minimumThreshold = 0.001;
    const speed = (() => {
        if (state === MovableComponentState.inside) {
            return SPEED_INSIDE * deltaInverse * 60;
        }
        return SPEED * deltaInverse * 60;
    })();
    if (input.left) {
        if (hasReachedMaxLeftSpeed) {
            velocityX = -MAX_VELOCITY;
        } else {
            velocityX = updateVelocity(speed, -MAX_VELOCITY, velocityX);
        }
    }

    if (input.right) {
        if (hasReachedMaxRightSpeed) {
            velocityX = MAX_VELOCITY;
        } else {
            velocityX = updateVelocity(speed, MAX_VELOCITY, velocityX);
        }
    }

    if (!input.left && !input.right) {
        velocityX = updateVelocity(speed, 0, velocityX);

        if (Math.abs(velocityX) < minimumThreshold) {
            velocityX = 0;
        }
    }

    return velocityX;
}

export function computeVelocityY(
    delta: number,
    input: Inputs,
    velocityY: number,
) {
    const deltaInverse = 1 / delta / (60 * 60);
    const hasReachedMaxLeftSpeed = velocityY < -MAX_VELOCITY;
    const hasReachedMaxRightSpeed = velocityY > MAX_VELOCITY;
    if (input.bottom) {
        if (hasReachedMaxLeftSpeed) {
            velocityY = -MAX_VELOCITY;
        } else {
            velocityY = updateVelocity(deltaInverse, -MAX_VELOCITY, velocityY);
        }
    }

    if (input.top) {
        if (hasReachedMaxRightSpeed) {
            velocityY = MAX_VELOCITY;
        } else {
            velocityY = updateVelocity(deltaInverse, MAX_VELOCITY, velocityY);
        }
    }

    if (!input.top && !input.bottom) {
        velocityY = updateVelocity(deltaInverse, 0, velocityY);
    }

    return velocityY;
}
