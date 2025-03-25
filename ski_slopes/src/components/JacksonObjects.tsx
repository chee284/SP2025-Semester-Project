import { Mesh } from 'three';
import { useState, useRef, useEffect, Suspense } from 'react';
import { Html } from '@react-three/drei';


type Resort = {
    name: string;
    imagePath: string;
    url: string;
}

const resortInfo: Resort = {
    name: "Jackson Hole",
    imagePath: "/assets/jackson_hole/resort.jpg",
    url: "https://www.jacksonhole.com/"
}

export const ResortMarker = () => {
    return (
        <group position={[-716.76, 5078.31, -1562.35]} rotation={[0, Math.PI * 0.20, 0]} renderOrder={-50} >
            <Html
                position={[0, 0, 0]}
                center
                distanceFactor={20000}
                transform
            >
                <div className="rounded-lg shadow-xl overflow-hidden w-64 transform transition-transform hover:scale-105">
                    <div className="relative">
                        <img 
                            src={resortInfo.imagePath} 
                            alt={resortInfo.name} 
                            className="w-full h-24 object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col items-center justify-end p-4">
                            <h3 className="text-white text-2xl font-bold mb-2">{resortInfo.name}</h3>
                            <a href={resortInfo.url} target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm">Click to visit resort</a>
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
        name: "Jackson Hole Airport (JAC)",
        position: [14765.80, 1600.18, -780.87],
    },
    {
        name: "Jackson Hole Mountain Resort",
        position: [4441.05, 2026.75, 2599.17],
    }
];

export const MapMarker = () => {
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
                <meshStandardMaterial color={'white'} />
            </mesh>
            
            {hovered && (
                <Html
                    position={[0, 1000, 0]}
                    className="pointer-events-none"
                    center
                    distanceFactor={20000}
                    occlude
                >
                    <div className="bg-white p-3 rounded-lg shadow-lg w-48">
                        <h4 className="text-md font-bold mb-1">{marker.name}</h4>
                    </div>
                </Html>
            )}
        </group>
    );
}

type Advertisement = {
    title: string;
    imagePath: string;
    url: string;
}

const advertisementData: Advertisement[] = [
    {
        title: "Lodging Specials & Packages",
        imagePath: "/assets/jackson_hole/lodging.jpg", 
        url: "https://www.jacksonhole.com/lodging-packages"
    },
    {
        title: "Buy 4, get 5",
        imagePath: "/assets/jackson_hole/mountain.jpg",
        url: "https://www.jacksonhole.com/buy-4-get-5"
    },
    {
        title: "$400 Air Credit",
        imagePath: "/assets/jackson_hole/air.jpg",
        url: "https://www.jacksonhole.com/300-off"
    },
    {
        title: "Save with a Mountain Collective Pass",
        imagePath: "/assets/jackson_hole/resort.jpg",
        url: "https://www.jacksonhole.com/mountain-collective-lodging-specials"
    }
];

export const Billboard = () => {
    return (
        <group position={[0, 17000, -25000]} rotation={[0, 0, 0]} renderOrder={-100} >
            <Html
                position={[0, 0, 0]}
                center
                distanceFactor={20000}
                transform
            >
                <div className="rounded-lg shadow-lg overflow-hidden p-3 w-[1500px]" >
                    <h2 className="text-2xl font-bold text-center mb-3">Claim Offers</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {advertisementData.map((ad, index) => (
                            <a 
                                key={index}
                                href={ad.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block cursor-pointer bg-white rounded-lg shadow overflow-hidden transition transform hover:scale-105"
                            >
                                <div className="relative">
                                    <img 
                                        src={ad.imagePath} 
                                        alt={ad.title}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-3">
                                        <h3 className="text-lg font-bold uppercase animate-pulse">{ad.title}</h3>
                                        <p className="text-sm text-gray-600">Click for more info</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </Html>
        </group>
    );
}