import { createSignal, Show } from 'solid-js';
import { useGlobalContext } from '../../global-provider.tsx';
import './save-button.css';

export const SaveButton = () => {
  const { state } = useGlobalContext();
  const [fileHandle, setFileHandle] = createSignal<FileSystemFileHandle | null>(null)

  const handleClick = async () => {
    try {
      if (!fileHandle()) {
        setFileHandle(await window.showSaveFilePicker({
          suggestedName: 'SketchWave',
          types: [{
            description: 'PNG Image',
            accept: { 'image/png': ['.png'] },
          }]
        }));
      }

      const blob: Blob = await new Promise((resolve) =>
        state.ctx!.canvas.toBlob(resolve as BlobCallback, 'image/png'));

      const writableStream = await fileHandle()!.createWritable({ keepExistingData: false });
      await writableStream.write(blob);
      await writableStream.close();
    } catch (e) {
      alert(`Oopsy, Sketchwave couldn't save the file. Take a cup of coffee and try again later.`);
    }
  }

  return <button class="save-button" onClick={handleClick} title="Save (CTRL + S)">
    <Show when={fileHandle()}>{fileHandle()!.name}</Show>
    <span class="material-symbols-outlined">save</span>
  </button>
}
