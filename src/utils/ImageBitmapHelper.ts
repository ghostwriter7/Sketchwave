export class ImageBitmapHelper {
  public static async scaleImageBitmapToFitDimensions(imageBitmap: ImageBitmap, width: number, height: number): Promise<ImageBitmap> {
    const widthScale = width / imageBitmap.width;
    const heightScale = height / imageBitmap.height;
    const scaleFactor = Math.min(widthScale, heightScale);
    return await createImageBitmap(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height, {
      resizeWidth: imageBitmap.width * scaleFactor,
      resizeHeight: imageBitmap.height * scaleFactor,
      resizeQuality: 'high',
    });
  }
}
