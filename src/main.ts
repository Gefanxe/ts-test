import * as fgui from 'fairygui-createjs'
import * as Stats from "stats.js";
import { LoadingView } from './LoadingView';
// import { WindowA } from './WindowA';
// import { WindowB } from './WindowB';
// import { WindowWait } from './WindowWait';

class Main {
    stats: Stats;
    loader: fgui.AssetLoader;
    manifest: Array<{ [key: string]: string }> = [];
    canvas: HTMLCanvasElement;
    stage: createjs.Stage;
    contentlayer: fgui.GComponent;
    loadingView: LoadingView;
    constructor(canvas: HTMLCanvasElement, manifest: { [key: string]: string; }[]) {
        this.canvas = canvas;
        this.manifest = manifest;
        this.stage = new createjs.Stage(canvas);
        this.init();
    }

    init() {
        this.initStats();
        this.createStage();
        this.createLoader();
    }

    createStage() {
        fgui.GRoot.inst.attachTo(this.stage, {
            designWidth: 800,
            designHeight: 600,
            scaleMode: fgui.StageScaleMode.FIXED_WIDTH,
            orientation: fgui.StageOrientation.LANDSCAPE,
            alignV: fgui.StageAlign.TOP,
            alignH: fgui.StageAlign.LEFT
        });

        createjs.Ticker.framerate = 60;
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.on('tick', this.tick, this);
    }

    tick(e: { [key: string]: any }) {
        if (e.paused !== 1) {
            this.stage.update();
        } else {
            console.log('pause!')
        }
    }

    createLoader() {
        this.loader = new fgui.AssetLoader(false, "", "Anonymous");
        createjs.Sound.alternateExtensions = ["mp3"];
        this.loader.installPlugin(createjs.Sound);
        this.loader.loadManifest(this.manifest);
        // this.loader.on("progress", this.loadProgress, this);
        this.loader.on("complete", this.resLoaded, this);
    }

    initStats() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }

    loadProgress(e:Object): void {
        let p = (e as createjs.ProgressEvent).progress * 100;
        this.loadingView.setProgress(p);
        if (p >= 100) {
            this.loader.off("progress", this.loadProgress);
            this.loadingView.dispose();
            this.loadingView = null;
            this.contentlayer.dispose();
            fgui.GRoot.inst.removeChild(this.contentlayer);
        }
    }

    resLoaded() {
        this.loader.destroy();
        fgui.UIPackage.addPackage("uitest");
        let ins = fgui.UIPackage.createObject("uitest", "TestView") as fgui.GComponent;
        // console.log(fgui.UIPackage.addPackage("uitest"));
        ins.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        ins.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);
        fgui.GRoot.inst.addChild(ins);

        this.animate();
    }

    animate() {
        this.stats.begin();
        this.stats.end();
        requestAnimationFrame(this.animate.bind(this));
    }

}

let canvas = document.querySelector('#mainView') as HTMLCanvasElement;
let manifest = [
    { id: "uitest", src: 'public/ui/uitest.fui', type: "binary" },
    { id: 'uitest@atlas0', src: 'public/ui/uitest@atlas0.jpg', type: "image" },
    // { id: 'test@atlas0_1', src: 'ui/test@atlas0_1.png', type: "image" }
];
new Main(canvas, manifest);