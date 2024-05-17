import { fabric } from "fabric";

export class ExtendedPencilBrush extends fabric.PencilBrush {
  globalCompositeOperation: string;

  constructor(canvas: fabric.Canvas) {
    super(canvas);
    this.globalCompositeOperation = "source-over";
  }
}
