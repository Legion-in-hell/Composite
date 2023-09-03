import { Group, BoxGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import { createArchGroup, createWall } from './levels.utils';
import { CollidingElem } from '../types';

export class PositionLevel extends Group {
    public collidingElements: CollidingElem[] = [];

    constructor() {
        super();

        const wallBlockingLeftPath = createWall(
            new Vector3(3, 2, 0),
            new Vector3(-2, 0, 1),
            new Vector3(0, 90, 0),
        );
        this.add(wallBlockingLeftPath);
        this.collidingElements.push(wallBlockingLeftPath);

        const arches = [
            createArchGroup(1, new Vector3(2, 0, 0)),
            createArchGroup(2, new Vector3(4, 0, 0)),
            createArchGroup(3, new Vector3(6, 0, 0)),
        ];

        arches.forEach((arch) => {
            this.add(arch);
            // TODO: Add only the platform to the list of colliding elements
            this.collidingElements.push(arch);
        });
    }
}
