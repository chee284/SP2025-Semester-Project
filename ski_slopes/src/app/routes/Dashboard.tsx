import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame  } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, useProgress, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from 'three';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

// Preload the model so that it's cached on subsequent renders
const availableModels = [
    { name: "Jackson Hole", path: "/models/jackson-hole.glb" },
    { name: "Telluride", path: "/models/telluride.glb" },
    // { name: "Mt. Baker", path: "/models/mt-baker.glb" },
    // { name: "Snowbird", path: "/models/snowbird.glb" }
];

// useGLTF.preload("/models/jackson-hole.glb");
availableModels.forEach(model => {
    useGLTF.preload(model.path);
});

const Loader: React.FC = () => {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
};

const MountainModel: React.FC<{ modelPath: string }> = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);
    useEffect(() => {
        // Center the model at origin
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center); 
        scene.position.y += 50;
        console.log("Model loaded:", modelPath, scene);
    }, [scene, modelPath]);

    return <primitive 
        object={scene} 
        scale={0.1}
        position={[0, 0, 0]}
        rotation={[Math.PI, 0, 0]}
    />;
};

const CameraPosition = () => {
    const { camera } = useThree();
    useFrame(() => {
        const pos = camera.position.toArray().map(n => n.toFixed(2));
        const div = document.getElementById('camera-position');
        if (div) {
            div.textContent = `X: ${pos[0]} Y: ${pos[1]} Z: ${pos[2]}`;
        }
    });

    return null;
};

const Scene: React.FC = () => {
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    }, []);

    return (
        <div className="col-span-8 h-full relative bg-[#202020]">
            {/* Coordinate display overlay */}
            <div id="camera-position" className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded font-mono z-10">
                X: 0 Y: 0 Z: 0
            </div>
    
            <Canvas
                camera={{
                    position: [363.77, 313.07, -369.16], 
                    fov: 75,
                    near: 0.1,
                    far: 15000
                }}
            >
                <Suspense fallback={<Loader />}>
                    <gridHelper args={[10000, 10000]} position={[0, 0, 0]} />
                    <ambientLight intensity={1} />
                    <MountainModel modelPath="/models/jackson-hole.glb"/>
                    {/* <MountainModel modelPath="/models/telluride.glb"/> */}
                    <OrbitControls 
                        ref={controlsRef} 
                        target={[0, 0, 0]}
                        minDistance={100}
                        maxDistance={800}
                        enableRotate={true}
                        // rotateSpeed={0.5}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2}
                        enableDamping={true}
                        dampingFactor={0.25}
                    />
                    
                    {/* X, Y, Z axis */}
                    <GizmoHelper alignment="top-right" margin={[80, 80]}>
                        <GizmoViewport axisColors={['#ff3653', '#0adb50', '#2c8fdf']} labelColor="black"/>
                    </GizmoHelper>
                    
                    {/* Display current camera position */}
                    <CameraPosition />
                </Suspense>
            </Canvas>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const ResizeHandle: React.FC = () => {
        return (
            <PanelResizeHandle className="w-2 group flex items-center justify-center hover:bg-gray-200 transition-colors">
                <div className="flex flex-col gap-1">
                    <div className="w-1 h-screen rounded-full bg-gray-300 group-hover:bg-gray-400 transition-colors" />            </div>
            </PanelResizeHandle>
        );
    };
    return (
        <main className="h-[calc(100vh-3rem)] mt-12 w-full">
            <PanelGroup direction="horizontal">
                <Panel defaultSize={75} minSize={30}>
                    <Scene />
                </Panel>
                
                <ResizeHandle />
                
                <Panel defaultSize={25} minSize={20}>
                    {/* Left half grid container */}
                    <div className="h-full grid grid-rows-2">
                        {/* Top half */}
                        <div className="bg-[#202020] border-b border-gray-500">
                        </div>
                        {/* Bottom half */}
                        <div className="bg-[#202020]"></div>
                    </div>
                </Panel>
            </PanelGroup>
        </main>
    );
};

export default Dashboard;