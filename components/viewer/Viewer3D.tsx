"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as Frags from "@thatopen/fragments";
import { setupComponents } from '../bim-components';
import { FileItem } from '@/app/(uploadAndDashboard)/upload/page';
import * as THREE from 'three';

export interface Viewer3DRef {
    focusAllModel: () => void;
    focusModel: (modelId:string) => void;
    takeScreenshot: () => string | null;
    exportModelFrag: (modelId: string) => Promise<ArrayBuffer | null>;
    deleteModel: (modelId: string) => void;
}

interface Viewer3DProps {
    allFiles: FileItem[];
    file?: File | null;
    onIFCProcessingChange?: (isProcessing: boolean, fileName: string | null) => void;
}

const Viewer3D = forwardRef<Viewer3DRef, Viewer3DProps>(({ allFiles, file, onIFCProcessingChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const componentsRef = useRef<OBC.Components | null>(null);

    
    useImperativeHandle(ref, () => ({
        focusAllModel: async() => {
            if (!componentsRef.current) return;
            const worlds = componentsRef.current.get(OBC.Worlds);
            //get the first world in the list for we just created only one
            const world = worlds.list.values().next().value;
            //make sure this camera is a obc.simplecamera so ts will allow you 
            //to use simplecamera's method fitToItems;
            if(!(world?.camera instanceof OBC.SimpleCamera)) return;

            
            const highlighter = componentsRef.current.get(OBF.Highlighter);
            const selection = highlighter.selection.select;
            //if there's anything highlighted focus the thing
            //else focus the whole
            await world?.camera.fitToItems(
                    OBC.ModelIdMapUtils.isEmpty(selection)? undefined : selection,
                );
        },
        focusModel: (modelId: string) => {
            if (!componentsRef.current) return;

            const fragments = componentsRef.current.get(OBC.FragmentsManager);
            const model = fragments.list.get(modelId); 

            if (model) {
                const worlds = componentsRef.current.get(OBC.Worlds);
                // 取得當前的 world (通常只有一個)
                const world = worlds.list.values().next().value;
                
                if (world){
                    
                    world.camera.controls?.fitToBox(model.object,true);
                    
                    console.log(`聚焦至模型: ${modelId}`);
                }
            } else {
                console.warn(`找不到模型 ${modelId} 無法聚焦`);
            }
        },
        //screen shot the model
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
        },
        //export the model as .frag file
        exportModelFrag: async(modelId: string) => {
            if(!componentsRef.current) return null;

            const fragments = componentsRef.current.get(OBC.FragmentsManager);
            //find the corresponding group thru modelId
            const model = fragments.list.get(modelId);

            if (model) {
                try {
                    // ✅ 正確用法：使用 getBuffer()
                    // 參數 true 代表包含幾何與屬性資料
                    const fragsBuffer = await model.getBuffer(false);
                    return fragsBuffer;

                } catch (error) {
                    console.error("匯出模型時發生錯誤:", error);
                    return null;
                }
            }
            console.log(`找不到 ID 為 ${modelId} 的模型`);
            return null;
        },
        //delete the model
        deleteModel:(modelId: string)=> {
            if (!componentsRef.current) return;

            const fragments = componentsRef.current.get(OBC.FragmentsManager);
            
            const model = fragments.list.get(modelId);

            if(model){
                //release the memory
                model.dispose();
                //remove from FragmentsManager's list
                fragments.list.delete(modelId);
                console.log(`模型${modelId} 已從場景與記憶體中完全移除`);
            }
        },
    }));

    // Initialize BIM Engine (only on client side)
    useEffect(() => {
        let isMounted = true;

        const initViewer = async () => {
            if (!containerRef.current) return;

            // 呼叫 .ts 模組中的標準 setup
            const { components, viewport } = await setupComponents();
            
            if(!isMounted){
                components.dispose();
                return;
            }
            
            componentsRef.current = components;
            // 將 BUI Viewport (Web Component) 掛載到 React 容器
            containerRef.current.appendChild(viewport);
        };

        initViewer();

        return () => {
            isMounted = false;

            if (componentsRef.current) {
                componentsRef.current.dispose();
                componentsRef.current = null;
                console.warn("component unmounted")
            }
        };
    }, []);

    // 處理檔案載入邏輯
    useEffect(() => {
    const syncModels = async () => {
        if (!allFiles || !componentsRef.current) return;

        const fragments = componentsRef.current.get(OBC.FragmentsManager);
        const ifcLoader = componentsRef.current.get(OBC.IfcLoader);

        // 1. 先過濾出「真正需要載入」的新檔案
        const filesToLoad = allFiles.filter(fileItem => {
            const modelId = fileItem.name.replace(/\.(ifc|frag)$/i, "");
            return !fragments.list.has(modelId);
        });

        // 如果沒有新檔案需要處理，直接結束，不要觸發任何狀態更新
        if (filesToLoad.length === 0) return;

        try {
            // 2. 只有在確定有檔案要載入時，才開啟遮罩
            onIFCProcessingChange?.(true, "Initializing...");

            for (const fileItem of filesToLoad) {
                const modelId = fileItem.name.replace(/\.(ifc|frag)$/i, "");
                
                // 更新目前正在處理的檔名
                onIFCProcessingChange?.(true, fileItem.name);

                try {
                    console.log(`正在自動載入新模型: ${fileItem.name}`);
                    const buffer = await fileItem.file.arrayBuffer();
                    const extension = fileItem.name.split('.').pop()?.toLowerCase();

                    if (extension === 'ifc') {
                        await ifcLoader.load(new Uint8Array(buffer), true, modelId);
                    } 
                    else if (extension === 'frag') {
                        await fragments.core.load(buffer, { modelId });
                    } 
                } catch (error) {
                    console.error(`載入 ${fileItem.name} 失敗:`, error);
                }
            }
        } finally {
            // 3. ✅ 關鍵：在 try...finally 的 finally 區塊關閉遮罩
            // 這樣無論成功或失敗，最後一定會關閉遮罩
            onIFCProcessingChange?.(false, null);
        }
    };
        syncModels();
    }, [allFiles,onIFCProcessingChange]); // 👈 監聽整個陣列的變化

    return (
        <div className="flex flex-col w-full h-full relative">
            <div 
                ref={containerRef} 
                className='w-full h-full rounded-lg overflow-hidden'
            />
            {!file && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
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