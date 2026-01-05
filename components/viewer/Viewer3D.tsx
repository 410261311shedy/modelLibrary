"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";

interface Viewer3DProps {
    file?: File | null;
}

export interface Viewer3DRef {
    takeScreenshot: () => string | null;
}

const Viewer3D = forwardRef<Viewer3DRef, Viewer3DProps>(({ file }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const componentsRef = useRef<OBC.Components | null>(null);

    // 暴露方法給父元件 (Step 2 封面擷取)
    useImperativeHandle(ref, () => ({
        takeScreenshot: () => {
            if (!componentsRef.current) return null;
            const worlds = componentsRef.current.get(OBC.Worlds);
            const world = worlds.list.values().next().value;
            if (world && world.renderer) {
                // 強制渲染一幀以確保截圖不是黑屏
                const renderer = world.renderer as OBC.SimpleRenderer;
                renderer.three.render(world.scene.three, world.camera.three);
                return renderer.three.domElement.toDataURL('image/png');
            }
            return null;
        }
    }));

    // 初始化 Engine
    useEffect(() => {
        if (!containerRef.current) return;

        // 0. 初始化 BUI 管理器
        BUI.Manager.init();

        // 1. 建立 OBC.Components 實例
        const components = new OBC.Components();
        componentsRef.current = components;

        // 2. 建立 World 環境 (使用 OrthoPerspectiveCamera)
        const worlds = components.get(OBC.Worlds);
        const world = worlds.create<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer>();

        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
        world.camera = new OBC.OrthoPerspectiveCamera(components);

        // 3. 配置 IfcLoader WASM
        const ifcLoader = components.get(OBC.IfcLoader);
        ifcLoader.settings.autoSetWasm = false;
        ifcLoader.settings.wasm = {
            absolute: true,
            path: "https://unpkg.com/web-ifc@0.0.72/"
        };

        // 4. 初始化 FragmentsManager 並配置 Worker (關鍵優化)
        const fragments = components.get(OBC.FragmentsManager);
        //The worker is set from the node_module for simplicity purpose.
        //To build the app, the worker file should be set inside the public folder
        //at the root of the project and be referenced as "worker.mjs"
        console.log("Initializing Fragments with worker at /worker.mjs");
        fragments.init("/worker.mjs");

        // 5. 設定 Fragments 載入監聽
        fragments.list.onItemSet.add(async ({ value: model }) => {
            // 連結攝影機以啟用 Culling 與 LOD
            model.useCamera(world.camera.three);
            
            // 將模型物件加入 Three.js 場景
            world.scene.three.add(model.object);
            
            // 更新核心數據
            await fragments.core.update(true);

            // 自動調整相機位置
            if (world.camera.controls) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (world.camera.controls as any).fitToSphere(model.object, true);
            }
        });

        // 6. 加入 Raycaster 與 Grid (增加互動感)
        components.get(OBC.Raycasters).get(world);
        const grids = components.get(OBC.Grids);
        grids.create(world);

        // 7. 設定場景背景
        world.scene.setup();
        world.scene.three.background = new THREE.Color(0x202124);

        // 8. 最後才呼叫 components.init() (順序優化)
        components.init();

        // 視窗大小自適應
        const handleResize = () => world.renderer?.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            components.dispose();
            componentsRef.current = null;
        };
    }, []);

    // 處理檔案載入邏輯
    useEffect(() => {
        const loadModel = async () => {
            if (!file || !componentsRef.current) return;

            const components = componentsRef.current;
            const extension = file.name.split('.').pop()?.toLowerCase();
            
            try {
                const buffer = await file.arrayBuffer();

                if (extension === 'ifc') {
                    const bytes = new Uint8Array(buffer);
                    const ifcLoader = components.get(OBC.IfcLoader);
                    await ifcLoader.load(
                        bytes,
                        true,
                        file.name.replace(".ifc", "")
                    );
                } else if (extension === 'frag') {
                    const fragments = components.get(OBC.FragmentsManager);
                    console.log("Loading .frag file, buffer size:", buffer.byteLength);
                    await fragments.core.load(buffer, {
                        modelId: file.name.replace(".frag", "")
                    });
                    console.log(".frag file loaded successfully");
                }
            } catch (error) {
                console.error("載入模型失敗:", error);
            }
        };

        loadModel();
    }, [file]);

    return (
        <div className="flex flex-col w-full h-full relative">
            <div 
                ref={containerRef} 
                className='w-full h-full rounded-lg overflow-hidden'
            />
            {!file && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-gray-500 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                        請從左側上傳並選取 IFC 或 FRAG 模型
                    </p>
                </div>
            )}
        </div>
    );
});

Viewer3D.displayName = "Viewer3D";

export default Viewer3D;