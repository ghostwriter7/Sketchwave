import styles from './gradient-generator.module.css';
import { type GradientType, useGradientContext } from './gradient-generator.tsx';
import { RadioGroup } from '../form-controls/radio-group/radio-group.tsx';

export const GradientModifiers = () => {
  const { setGradientType, state } = useGradientContext();
  const gradientTypes = [
    { label: 'Radial', value: 'radial' },
    { label: 'Linear', value: 'linear' },
    { label: 'Conic', value: 'conic' }
  ];

  return <div class={styles.gradientModifiers}>
    <RadioGroup
      options={gradientTypes}
      value={state.gradientType}
      onChange={(value) => setGradientType(value as GradientType)}
    />
  </div>
}
