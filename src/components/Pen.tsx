import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";
import { useEffect } from "react";

export default function Pen() {
  const { canvas, setMode, selectedColor } = useCanvas();

  const updateBrush = () => {
    if (canvas) {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = selectedColor;
      brush.width = 3;
      canvas.freeDrawingBrush = brush;
      canvas.renderAll();
    }
  };

  useEffect(() => {
    if (canvas && canvas.isDrawingMode) {
      updateBrush();
    }
  }, [selectedColor, canvas]);

  const startDraw = () => {
    if (canvas) {
      setMode("pencil");
      updateBrush();
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
  };

  return <button onClick={startDraw}>Start Drawing</button>;
}
