import { Mesh } from 'three';
import { useState, useRef } from 'react';
import { Html } from '@react-three/drei';

type Resort = {
    name: string;
    imagePath: string;
    url: string;
}

const resortInfo: Resort = {
    name: "Baker",
    imagePath: "/assets/baker/mtbaker.png",
    url: "https://www.mtbaker.us/"
}

export const BakerResortMarker = () => {
    return (
        <group position={[22698.90, 7000.00, -24528.46]} rotation={[0, Math.PI * -0.20, 0]} renderOrder={-50} >
            <Html
                position={[0, 0, 0]}
                center
                distanceFactor={25000}
                transform
            >
                <div className="rounded-lg shadow-xl overflow-hidden w-64 transform transition-transform hover:scale-105 select-none">
                    <div className="relative">
                        <img 
                            src={resortInfo.imagePath} 
                            alt={resortInfo.name} 
                            className="w-full h-24 object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col items-center justify-end p-4">
                            <h3 className="text-white text-2xl font-bold mb-2">{resortInfo.name}</h3>
                            <a href={resortInfo.url} target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm animate-pulse">Click to visit resort</a>
                        </div>
                    </div>
                </div>
            </Html>
        </group>
    );
}

type MapMarker = {
    name: string;
    position: [number, number, number];
}

const mapMarkers: MapMarker[] = [
    {
        name: "Mt. Baker",
        position: [211.55, 5614.53, 2035.05],
    },
    {
        name: "Mt. Baker Ski Area",
        position: [14010.19, 3203.12, -6801.96],
    }
];

export const BakerMapMarker = () => {
    return (
        <>
            {mapMarkers.map((marker, index) => (
                <MapMarkerItem key={index} marker={marker}/>
            ))}
        </>
    );
}

const MapMarkerItem = ({ marker }: { marker: MapMarker }) => {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<Mesh>(null);
    
    return (
        <group position={marker.position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.2 : 1}
                renderOrder={2}
            >
                <sphereGeometry args={[200, 16, 16]} />
                <meshStandardMaterial 
                    color={'white'} 
                    emissive={'#ff3b3b'}
                    emissiveIntensity={0.5}
                    toneMapped={false}
                />
            </mesh>
            
            {hovered && (
                <Html
                    position={[0, 1000, 0]}
                    className="pointer-events-none"
                    center
                    occlude
                >
                    <div className="bg-white p-3 rounded-lg shadow-lg w-64">
                        <h4 className="text-md font-bold mb-1">{marker.name}</h4>
                    </div>
                </Html>
            )}
        </group>
    );
}