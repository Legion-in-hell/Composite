// vendors
import { gsap } from 'gsap';
// our libs
import { Side } from '@benjaminbours/composite-core';
// project
import { MenuScene } from './types';
import CanvasBlack from './canvas/CanvasBlack';
import CanvasWhite from './canvas/CanvasWhite';
import Curve, { defaultWaveOptions } from './canvas/Curve';

export interface TweenOptions {
    step: MenuScene;
    isMobileDevice: boolean;
    side?: Side;
}

export interface RefHashMap {
    canvasBlack: React.MutableRefObject<CanvasBlack | undefined>;
    canvasWhite: React.MutableRefObject<CanvasWhite | undefined>;
    homeRef: React.RefObject<HTMLDivElement>;
    levelRef: React.RefObject<HTMLDivElement>;
    sideRef: React.RefObject<HTMLDivElement>;
    queueRef: React.RefObject<HTMLDivElement>;
    endLevelRef: React.RefObject<HTMLDivElement>;
    inviteFriendRef: React.RefObject<HTMLDivElement>;
    teamLobbyRef: React.RefObject<HTMLDivElement>;
    notFoundRef: React.RefObject<HTMLDivElement>;
}

/**
 * Curve
 */
export function curveToStep(options: TweenOptions, canvasBlack: CanvasBlack) {
    const { step, isMobileDevice, side } = options;
    return gsap.to(canvasBlack.curve, {
        duration: 0.5,
        origin: canvasBlack.curve.resizeOptions[step](
            canvasBlack.ctx.canvas.width,
            canvasBlack.ctx.canvas.height,
            isMobileDevice,
            side,
        ),
        onComplete: () => {
            Curve.setWaveOptions({
                ...defaultWaveOptions,
            });
        },
    });
}

/**
 * Light
 */
export function lightToStep(options: TweenOptions, canvasBlack: CanvasBlack) {
    const { step, isMobileDevice, side } = options;
    const coordinate = canvasBlack.light.resizeOptions[step](
        canvasBlack.ctx.canvas.width,
        canvasBlack.ctx.canvas.height,
        isMobileDevice,
        side,
    );

    return gsap.to(canvasBlack.light, {
        duration: 0.5,
        delay: 0.1,
        startX: coordinate.x,
        startY: coordinate.y,
    });
}

/**
 * Shadow
 */
export function shadowToStep(options: TweenOptions, canvasWhite: CanvasWhite) {
    const { step, isMobileDevice, side } = options;
    const coordinate = canvasWhite.shadow.resizeOptions[step](
        canvasWhite.ctx.canvas.width,
        canvasWhite.ctx.canvas.height,
        isMobileDevice,
        side,
    );

    return gsap.to(canvasWhite.shadow, {
        duration: 0.5,
        delay: 0.1,
        startX: coordinate.x,
        startY: coordinate.y,
    });
}

/**
 * Home
 */
function homeOut(homeInterface: HTMLDivElement) {
    return gsap.to('.home-container > *', {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            homeInterface.style.display = 'none';
        },
    });
}

export function homeIn(homeInterface: HTMLDivElement) {
    return gsap.fromTo(
        '.home-container > *',
        {
            opacity: 0,
        },
        {
            duration: 0.5,
            opacity: 1,
            onStart: () => {
                homeInterface.style.display = 'block';
            },
        },
    );
}

/**
 * Invite friend
 */

function inviteFriendOut(inviteFriendInterface: HTMLDivElement) {
    return gsap.to(inviteFriendInterface, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            inviteFriendInterface.style.display = 'none';
        },
    });
}

export function inviteFriendIn(inviteFriendInterface: HTMLDivElement) {
    return gsap.fromTo(
        inviteFriendInterface,
        {
            opacity: 0,
        },
        {
            duration: 0.5,
            opacity: 1,
            onStart: () => {
                inviteFriendInterface.style.display = 'flex';
            },
        },
    );
}

/**
 * Level
 */
function levelOut(levelInterface: HTMLDivElement) {
    return gsap.to(levelInterface, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            levelInterface.style.display = 'none';
        },
    });
}

export function levelIn(levelInterface: HTMLDivElement) {
    return gsap.fromTo(
        levelInterface,
        {
            opacity: 0,
        },
        {
            duration: 0.5,
            opacity: 1,
            onStart: () => {
                levelInterface.style.display = 'block';
            },
        },
    );
}

/**
 * Faction
 */
function factionOut(factionInterface: HTMLDivElement) {
    return gsap.to(factionInterface, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            factionInterface.style.display = 'none';
        },
    });
}

export function factionIn(factionInterface: HTMLDivElement) {
    return [
        gsap.fromTo(
            factionInterface,
            {
                opacity: 0,
            },
            {
                duration: 0.5,
                opacity: 1,
                onStart: () => {
                    factionInterface.style.display = 'block';
                },
            },
        ),
    ];
}

/**
 * Queue
 */
export function queueIn(queueInterface: HTMLDivElement) {
    return gsap.fromTo(
        queueInterface,
        {
            opacity: 0,
        },
        {
            duration: 0.5,
            opacity: 1,
            onStart: () => {
                queueInterface.style.display = 'block';
            },
        },
    );
}

function queueOut(queueInterface: HTMLDivElement) {
    return gsap.to(queueInterface, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            queueInterface.style.display = 'none';
        },
    });
}

function endLevelOut(endLevelInterface: HTMLDivElement) {
    return gsap.to(endLevelInterface, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            endLevelInterface.style.display = 'none';
        },
    });
}

function teamLobbyIn(teamLobbyInterface: HTMLDivElement) {
    return gsap.fromTo(
        teamLobbyInterface,
        {
            opacity: 0,
        },
        {
            duration: 0.5,
            opacity: 1,
            onComplete: () => {
                teamLobbyInterface.style.display = 'flex';
            },
        },
    );
}

function teamLobbyOut(teamLobbyInterface: HTMLDivElement) {
    return gsap.fromTo(
        teamLobbyInterface,
        {
            opacity: 1,
        },
        {
            duration: 0.5,
            opacity: 0,
            onComplete: () => {
                teamLobbyInterface.style.display = 'none';
            },
        },
    );
}

function notFoundOut(notFoundInterface: HTMLDivElement) {
    return gsap.to(notFoundInterface, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            notFoundInterface.style.display = 'none';
        },
    });
}

export function allMenuScenesOut(refHashMap: RefHashMap) {
    return [
        homeOut(refHashMap.homeRef.current!),
        levelOut(refHashMap.levelRef.current!),
        factionOut(refHashMap.sideRef.current!),
        queueOut(refHashMap.queueRef.current!),
        endLevelOut(refHashMap.endLevelRef.current!),
        inviteFriendOut(refHashMap.inviteFriendRef.current!),
        notFoundOut(refHashMap.notFoundRef.current!),
        teamLobbyOut(refHashMap.teamLobbyRef.current!),
    ];
}

export function goToStep(
    refHashMap: RefHashMap,
    tweenOptions: TweenOptions,
    onComplete: () => void,
) {
    const allRefsExist = Object.values(refHashMap).every(
        (ref) => ref && ref.current,
    );

    if (!allRefsExist) {
        return;
    }
    const inAnimation = () => {
        switch (tweenOptions.step) {
            case MenuScene.HOME:
                refHashMap.homeRef.current!.style.display = 'none';
                return homeIn(refHashMap.homeRef.current!);
            case MenuScene.LEVEL:
                refHashMap.levelRef.current!.style.display = 'none';
                return levelIn(refHashMap.levelRef.current!);
            case MenuScene.FACTION:
                refHashMap.sideRef.current!.style.display = 'none';
                return factionIn(refHashMap.sideRef.current!);
            case MenuScene.QUEUE:
                refHashMap.queueRef.current!.style.display = 'none';
                return queueIn(refHashMap.queueRef.current!);
            case MenuScene.INVITE_FRIEND:
                refHashMap.inviteFriendRef.current!.style.display = 'none';
                return inviteFriendIn(refHashMap.inviteFriendRef.current!);
            case MenuScene.TEAM_LOBBY:
                refHashMap.teamLobbyRef.current!.style.display = 'none';
                return teamLobbyIn(refHashMap.teamLobbyRef.current!);
                default:
                refHashMap.homeRef.current!.style.display = 'none';
                return homeIn(refHashMap.homeRef.current!);
        }
    };
    Curve.setWaveOptions({
        viscosity: 40,
        damping: 0.2,
    });
    gsap.timeline({
        onComplete: () => {
            onComplete();
        },
    })
        .add(curveToStep(tweenOptions, refHashMap.canvasBlack.current!))
        .add(
            [
                lightToStep(tweenOptions, refHashMap.canvasBlack.current!),
                shadowToStep(tweenOptions, refHashMap.canvasWhite.current!),
                ...allMenuScenesOut(refHashMap),
            ],
            '-=0.5',
        )
        .add(inAnimation());
}
