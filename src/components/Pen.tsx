import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";

export default function Pen() {
  const { canvas, setMode } = useCanvas();

  const startDraw = () => {
    if (canvas) {
      setMode("pencil");
      const brush = new fabric.PencilBrush(canvas);
      brush.color = "black";
      brush.width = 3;
      canvas.freeDrawingBrush = brush;
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
  };

  return <button onClick={startDraw}>Start Drawing</button>;
}
