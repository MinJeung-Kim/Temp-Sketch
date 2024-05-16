import "fabric";

declare module "fabric" {
  namespace fabric {
    interface Object {
      id?: number;
    }
    class ExtendedPencilBrush extends PencilBrush {
      globalCompositeOperation?: string;
    }
  }
}
