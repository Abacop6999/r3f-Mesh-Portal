import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  Text,
  useCursor,
  useTexture,
} from "@react-three/drei";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { Demon } from "./Demon";
import { Bunny } from "./Bunny";
import { Birb } from "./Birb";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  useCursor(hovered);
  const controlsRef = useRef();

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <MonsterStage
        name="Birb"
        color={"#387acf"}
        texture={
          "textures/manga_anime_art_style_a_water_based_pokemon_like_e.jpg"
        }
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Birb scale={0.6} position-y={-1} hovered={hovered === "Birb"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/manga_full_lava_world.jpg"}
        name="Demon"
        color={"#c53e37"}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Demon scale={0.5} position-y={-1} hovered={hovered === "Demon"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/manga_anime_art_style_bunny_carrot_world.jpg"}
        name="Bunny"
        color={"#c4dde4"}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Bunny scale={0.45} position-y={-1} hovered={hovered === "Bunny"} />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });

  return (
    <group {...props}>
      <Text
        font="fonts/Caprasimo-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.3, 0.051]}
        anchorY={"bottom"}
      >
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}
      >
        <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide}>
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
