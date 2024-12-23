import {SelectGradientButton} from '../select-gradient-button/select-gradient-button.tsx';
import {GradientGeneratorButton} from '../gradient-generator-button/gradient-generator-button.tsx';
import {MenuGroup} from '../menu/menu-group/menu-group.tsx';
import {useGlobalContext} from '../../global-provider.tsx';
import styles from './gradient-menu-group.module.css';

export const GradientMenuGroup = () => {
    const {state, setFillGradientId, setOutlineGradientId} = useGlobalContext();

    const findGradientById = (id?: string) =>
        id ? state.gradients.find((gradient) => gradient.id === id) : undefined;
    const activeFillGradient = () => findGradientById(state.fillGradientId);
    const activeOutlineGradient = () => findGradientById(state.outlineGradientId);

    return <MenuGroup label="Gradients (G)">
        <div class={styles.gradientMenuGroup}>
            <div class={styles.activeGradients}>
                <SelectGradientButton
                    activeGradient={activeFillGradient()}
                    icon="colors"
                    title="Fill Gradient"
                    onChange={(id) => setFillGradientId(id)}
                />
                <SelectGradientButton
                    activeGradient={activeOutlineGradient()}
                    icon="check_box_outline_blank"
                    title="Outline Gradient"
                    onChange={(id) => setOutlineGradientId(id)}
                />
            </div>
            <GradientGeneratorButton/>
        </div>
    </MenuGroup>
}
