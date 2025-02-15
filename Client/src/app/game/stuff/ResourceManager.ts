import { Material } from 'babylonjs-materials';
import { GameScene } from '../bases/GameScene';

type Callback = (model: Model) => void;

export class Model {
    name: string;
    path: string;
    texturePath: string[];

    meshes: BABYLON.AbstractMesh[];
    skeletons: BABYLON.Skeleton[];
    materials: BABYLON.Material[];
}

export class ResourceManager {
    models: Map<string, Model> = new Map<string, Model>();

    constructor(private scene: GameScene) {}

    bind(name: string, path: string, ...texturePath: string[]) {
        const model = new Model();
        model.name = name;
        model.path = path;
        model.texturePath = texturePath;

        this.models.set(name, model);
    }

    load(name: string, callback: Callback) {
        const model = this.models.get(name);

        if (model != null && model.meshes == null) {
            BABYLON.SceneLoader.ImportMesh('', './assets/', model.path, this.scene.core,
            (newMeshes, particleSystems, skeletons) => {
                model.meshes = newMeshes;
                model.skeletons = skeletons;

                model.materials = new Array<BABYLON.Material>();

                let currentMesh = 0;
                model.meshes.forEach(mesh => {
                    mesh.isVisible = false;

                    if (currentMesh >= model.texturePath.length || model.texturePath.length === 0) {
                        //mesh.material = new BABYLON.StandardMaterial(model.name + '_standart_mat' + currentMesh, this.core);
                    } else {
                        const material = new BABYLON.PBRMetallicRoughnessMaterial(model.name + '_pbr_mat' + currentMesh, this.scene.core);
                        material.baseTexture = new BABYLON.Texture('./assets/' + model.texturePath[currentMesh], this.scene.core);
                        mesh.material = material;
                    }

                    model.materials.push(mesh.material);

                    ++currentMesh;
                });

                this.models.set(name, model);

                callback(model);
            });
        } else if (model != null) {
            callback(model);
        } else {
            callback(null);
        }
    }
}
