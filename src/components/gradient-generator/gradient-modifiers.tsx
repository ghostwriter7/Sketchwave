import styles from './gradient-generator.module.css';
import { useGradientContext } from './gradient-generator.tsx';

export const GradientModifiers = () => {
  const { setGradientType } = useGradientContext();



  return <div class={styles.gradientModifiers}>
    <input type="radio" id="radial" name="gradientType" value="radial" onChange={() => setGradientType("radial")} />
    <label for="radial">Radial</label>

    <input type="radio" id="linear" name="gradientType" value="linear"onChange={() => setGradientType("linear")} checked/>
    <label for="linear">Linear</label>

    <input type="radio" id="conic" name="gradientType" value="conic"onChange={() => setGradientType("conic")} />
    <label for="conic">Conic</label>
  </div>
}
