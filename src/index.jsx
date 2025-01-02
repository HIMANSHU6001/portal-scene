import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { Leva } from "leva";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
    <Leva />
    <Canvas
      flat
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [3, 0.5, 4],
      }}
    >
      <Experience />
    </Canvas>
  </>
);
