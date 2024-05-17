import { useState } from "react";
import { useCanvas } from "@src/context/CanvasContext";

export default function Color() {
  const { setSelectedColor } = useCanvas();
  const [showColorMenu, setShowColorMenu] = useState<boolean>(false);

  const colors = [
    "rgb(228, 89, 81)",
    "rgb(219, 142, 239)",
    "rgb(255, 132, 19)",
    "rgb(251, 188, 5)",
    "rgb(69, 186, 119)",
    "rgb(255, 255, 255)",
    "rgb(72, 130, 238)",
    "rgb(109, 76, 179)",
    "rgb(139, 149, 161)",
    "rgb(25, 31, 40)",
  ];

  return (
    <>
      <button onClick={() => setShowColorMenu(!showColorMenu)}>
        Select Color
      </button>
      {showColorMenu && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "120px",
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedColor(color);
                setShowColorMenu(false);
              }}
              style={{ backgroundColor: color, width: "20px", height: "20px" }}
            ></button>
          ))}
        </div>
      )}
    </>
  );
}
