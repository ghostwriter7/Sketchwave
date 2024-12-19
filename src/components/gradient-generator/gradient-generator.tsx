import { GradientPreview } from './gradient-preview.tsx';
import { Color } from '../../types/Color.ts';
import { createStore } from 'solid-js/store';

export type GradientDefinition = { color: Color, stop: number };
export type GradientDefinitions = GradientDefinition[];

type GradientStore = {
  gradientDefinitions: GradientDefinitions;
  gradientType: GradientType;
}

export type GradientType = 'linear' | 'radial' | 'conic';

export const GradientGenerator = () => {
  const [state, setState] = createStore<GradientStore>({
    gradientDefinitions: [
      { color: Color.fromHsl(174, 100, 50), stop: 0 },
      { color: Color.fromHsl(280, 100, 50), stop: .5 },
      { color: Color.fromHsl(212, 100, 50), stop: 1 },
    ],
    gradientType: 'linear'
  });


  return <div>
      <GradientPreview
        gradientDefinitions={state.gradientDefinitions}
        gradientType={state.gradientType}  />
    </div>;
}
