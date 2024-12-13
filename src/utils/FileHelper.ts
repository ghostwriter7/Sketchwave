export class FileHelper {
  public static tryGetImageBitmap(): Promise<ImageBitmap> {
    return new Promise(async (resolve, reject) => {
        try {
          const [fileHandle] = await window.showOpenFilePicker({
            multiple: false,
            startIn: 'pictures',
            types: [
              {
                description: 'Images',
                accept: {
                  'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                },
              },
            ],
          });
          const file = await fileHandle.getFile();
          const imageBitmap = await createImageBitmap(file);
          resolve(imageBitmap);
        } catch (error) {
          const message = (error as Error).name === 'AbortError'
            ? 'User has not selected any image'
            : `Unknown error: ${(error as Error).message}`;
          reject(message);
        }
      }
    );
  }
}
