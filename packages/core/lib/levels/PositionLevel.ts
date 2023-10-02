// vendors
import { Group, Object3D, Vector3 } from 'three';
// local
import {
    ElementName,
    createArchGroup,
    createWall,
    createWallDoor,
    positionOnGrid,
} from './levels.utils';
import { InteractiveArea } from '../elements/InteractiveArea';
import { Levels, PositionLevelState } from '../types';

export class PositionLevel extends Group {
    public collidingElements: Object3D[] = [];
    public interactiveElements: any[] = [];
    public name = 'position-level';

    public startPosition = {
        light: new Vector3(10, 20, 0), // start level
        shadow: new Vector3(200, 20, 0),
    };

    public state: PositionLevelState = {
        id: Levels.CRACK_THE_DOOR,
        ground_door: 0,
        roof_door: 0,
        end_level: 0,
    };

    constructor() {
        super();
        // use name on mesh to understand better the data
        const wallBlockingLeftPath = createWall(
            new Vector3(4, 2, 0),
            new Vector3(-2, 0, 2),
            new Vector3(0, 90, 0),
            'wall left',
        );
        this.add(wallBlockingLeftPath);
        this.collidingElements.push(wallBlockingLeftPath);

        const outsideArches = [
            createArchGroup(1, new Vector3(2, 0, 0)),
            createArchGroup(2, new Vector3(4, 0, 0)),
            createArchGroup(3, new Vector3(6, 0, 0)),
        ];

        outsideArches.forEach((arch) => {
            this.add(arch);
            // TODO: Add only the platform to the list of colliding elements
            this.collidingElements.push(arch);
        });

        const templeEndWall = createWall(
            new Vector3(4, 5, 0),
            new Vector3(13, 0, 2),
            new Vector3(0, 90, 0),
        );
        this.add(templeEndWall);
        this.collidingElements.push(templeEndWall);

        const wallInsideTemple = createWall(
            new Vector3(6, 3, 0),
            new Vector3(9, 0, -2),
            new Vector3(0, 0, 0),
        );
        this.add(wallInsideTemple);

        // ground door
        const wallDoorGroundFloor = createWallDoor(
            new Vector3(0, 3, 0),
            new Vector3(9, 0, 0),
            new Vector3(0, 0, 0),
            'vertical',
        );
        wallDoorGroundFloor.name = ElementName.WALL_DOOR('GROUND');
        this.add(wallDoorGroundFloor);
        this.collidingElements.push(wallDoorGroundFloor);

        const groundFloorDoorOpener = new InteractiveArea(
            ElementName.AREA_DOOR_OPENER('GROUND'),
        );
        this.collidingElements.push(groundFloorDoorOpener);
        this.interactiveElements.push(groundFloorDoorOpener);
        positionOnGrid(groundFloorDoorOpener, new Vector3(10, 1.02, 0));
        this.add(groundFloorDoorOpener);

        // roof door
        const wallDoorRoof = createWallDoor(
            new Vector3(2, 6, 0),
            new Vector3(8, 3, 0),
            new Vector3(0, 3, 0),
            'horizontal',
        );
        wallDoorRoof.name = ElementName.WALL_DOOR('ROOF');
        this.add(wallDoorRoof);
        this.collidingElements.push(wallDoorRoof);

        const roofDoorOpener = new InteractiveArea(
            ElementName.AREA_DOOR_OPENER('ROOF'),
        );
        this.collidingElements.push(roofDoorOpener);
        this.interactiveElements.push(roofDoorOpener);
        positionOnGrid(roofDoorOpener, new Vector3(10, 3, 0));
        this.add(roofDoorOpener);

        const insideArches = [
            createArchGroup(1, new Vector3(10, 0, 0)),
            createArchGroup(2, new Vector3(12, 0, 0)),
        ];

        insideArches.forEach((arch) => {
            this.add(arch);
            // TODO: Add only the platform to the list of colliding elements
            this.collidingElements.push(arch);
        });

        const endLevel = new InteractiveArea(ElementName.AREA_END_LEVEL);
        this.add(endLevel);
        this.collidingElements.push(endLevel);
        this.interactiveElements.push(endLevel);
        positionOnGrid(endLevel, new Vector3(11, 0, 0));
    }
}
