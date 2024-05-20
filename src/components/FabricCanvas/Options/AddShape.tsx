import { useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";
import ShapeIcon from "@src/components/ui/icons/ShapeIcon";
import HexagonIcon from "@src/components/ui/icons/HexagonIcon";
import TriangleIcon from "@src/components/ui/icons/TriangleIcon";
import RectangleIcon from "@src/components/ui/icons/RectangleIcon";
import { S } from "./styles";

export default function AddShape() {
  const { saveState, canvas } = useCanvas();
  const [showShapeMenu, setShowShapeMenu] = useState<boolean>(false);

  const addShape = (shape: fabric.Object) => {
    if (canvas) {
      canvas.add(shape);
      saveState(canvas);
    }
  };

  const createPolygon = (sideCount: number, radius: number) => {
    const sweep = (Math.PI * 2) / sideCount;
    const points = [];
    for (let i = 0; i < sideCount; i++) {
      points.push({
        x: radius + radius * Math.cos(i * sweep),
        y: radius + radius * Math.sin(i * sweep),
      });
    }
    return points;
  };

  const addHex = () => {
    const points = createPolygon(6, 50);
    const hex = new fabric.Polygon(points, {
      left: canvas!.width! / 2,
      top: canvas!.height! / 2,
      fill: "rgba(0,0,0,0)",
      stroke: "black",
      strokeWidth: 3,
      originX: "center",
      originY: "center",
    } as fabric.Polygon);
    addShape(hex);
    setShowShapeMenu(false); // 메뉴 닫기
  };

  const addRect = () => {
    const rect = new fabric.Rect({
      left: canvas!.width! / 2,
      top: canvas!.height! / 2,
      fill: "rgba(0,0,0,0)",
      stroke: "black",
      width: 50,
      height: 50,
      originX: "center",
      originY: "center",
      strokeWidth: 3,
    } as fabric.Rect);
    addShape(rect);
    setShowShapeMenu(false); // 메뉴 닫기
  };

  const addTriangle = () => {
    const triangle = new fabric.Triangle({
      left: canvas!.width! / 2,
      top: canvas!.height! / 2,
      fill: "rgba(0,0,0,0)",
      stroke: "black",
      width: 44,
      height: 44,
      originX: "center",
      originY: "center",
      strokeWidth: 3,
    } as fabric.Triangle);
    addShape(triangle);
    setShowShapeMenu(false); // 메뉴 닫기
  };

  return (
    <S.Wrap>
      <S.Button onClick={() => setShowShapeMenu(!showShapeMenu)}>
        <ShapeIcon /> 도형
        {showShapeMenu && (
          <S.ShapeOptions>
            <button onClick={addHex}>
              <HexagonIcon />
            </button>
            <button onClick={addRect}>
              <RectangleIcon />
            </button>
            <button onClick={addTriangle}>
              <TriangleIcon />
            </button>
          </S.ShapeOptions>
        )}
      </S.Button>
    </S.Wrap>
  );
}
