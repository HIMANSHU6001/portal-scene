import {
  Center,
  OrbitControls,
  shaderMaterial,
  Sparkles,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import { Color } from "three";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { button, useControls } from "leva";

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new Color(0xffffff),
    uColorEnd: new Color(0x000000),
  },
  portalVertexShader,
  portalFragmentShader
);

extend({ PortalMaterial });

export default function Experience() {
  const object = useGLTF("./model/Portal-compressed-merged.glb");
  const { nodes } = object;

  const bakedTexture = useTexture("./model/baked-final.jpg");
  const portalRef = useRef();

  useFrame(({ clock }) => {
    portalRef.current.uTime = clock.elapsedTime * portalSpeed;
  });

  const { bgColor } = useControls({
    bgColor: {
      value: "#030202",
    },
  });

  const { count, speed, opacity, size, scale, positionY } = useControls(
    "FireFlies",
    {
      count: {
        value: 40,
        min: 0,
        max: 100,
        step: 1,
      },
      speed: {
        value: 0.6,
        min: 0,
        max: 1,
        step: 0.1,
      },
      opacity: {
        value: 0.4,
        min: 0,
        max: 1,
        step: 0.1,
      },
      size: {
        value: 6,
        min: 0,
        max: 10,
        step: 1,
      },
      scale: {
        value: [4, 2, 4],
        step: 0.1,
      },
      positionY: {
        value: 1,
        step: 0.1,
      },
    },
    {
      collapsed: true,
    }
  );
  const { portalSpeed, OutsideColor, InsideColor } = useControls(
    "Portal",
    {
      portalSpeed: {
        value: 1,
        min: 0,
        max: 2,
        step: 0.1,
      },
      OutsideColor: {
        value: "#ffffff",
        onChange: (color) => {
          portalRef.current.uColorEnd = new Color(color);
        },
      },
      InsideColor: {
        value: "#000000",
        onChange: (color) => {
          portalRef.current.uColorStart = new Color(color);
        },
      },
    },
    {
      collapsed: true,
    }
  );

  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight />
      <color attach="background" args={[bgColor]} />

      <Center>
        <group rotation-y={Math.PI}>
          <mesh
            geometry={nodes.mergedScene.geometry}
            position={nodes.mergedScene.position}
            scale={nodes.mergedScene.scale}
          >
            <meshBasicMaterial map={bakedTexture} map-flipY={false} />
          </mesh>
          <mesh
            geometry={nodes.PoleLightA.geometry}
            position={nodes.PoleLightA.position}
            scale={nodes.PoleLightA.scale}
          />
          <mesh
            geometry={nodes.PoleLightA.geometry}
            position={nodes.PoleLightB.position}
            scale={nodes.PoleLightB.scale}
          >
            <meshBasicMaterial color="#ffffe5" />
          </mesh>
          <mesh
            geometry={nodes.PortalLight.geometry}
            position={nodes.PortalLight.position}
            scale={nodes.PortalLight.scale}
            rotation={nodes.PortalLight.rotation}
          >
            <portalMaterial ref={portalRef} />
            {/* <shaderMaterial
              uniforms={{
                uTime: { value: 0 },
                uColorStart: { value: new Color(0xffffff) },
                uColorEng: { value: new Color(0x000000) },
              }}
              vertexShader={portalVertexShader}
              fragmentShader={portalFragmentShader}
            /> */}
          </mesh>
        </group>
        <Sparkles
          count={count}
          speed={speed}
          opacity={opacity}
          size={size}
          scale={scale}
          position-y={positionY}
        />
      </Center>
    </>
  );
}
