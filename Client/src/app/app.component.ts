import { Component, ViewChild, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Engine, Scene, Vector3, PointLight, HemisphericLight, ArcRotateCamera } from 'babylonjs';
import { CarryScene } from './game/scenes/CarryScene';
import { SocketIoService } from './services/socket-io.service';
import { VRExperienceHelper, MeshBuilder } from 'babylonjs-materials';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @ViewChild('canva') canvasEl: ElementRef;
    constructor(private socket: SocketIoService) { }

    // Логика клиентской части
    ngOnInit(): void {
        const canvas = this.canvasEl.nativeElement;
        const engine = new Engine(canvas, true);

        const scene = new Scene(engine);
        // scene.debugLayer.show();

        engine.enableOfflineSupport = false;

        const currentScene = new CarryScene(scene, this.socket);
        this.socket.setScene(currentScene);

        currentScene.onStart();

        engine.runRenderLoop(function () {
            currentScene.preUpdate();
            currentScene.onGui();
            currentScene.onUpdate();
            currentScene.onDraw();
        });

        window.addEventListener('resize', function () {
            engine.resize();
            currentScene.onResize();
        });
    }
}
