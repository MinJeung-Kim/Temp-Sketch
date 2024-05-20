import { useCanvas } from "@src/context/CanvasContext";

export default function Canvas() {
  const { canvasRef } = useCanvas();

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid #ccc" }}
    />
  );
}
