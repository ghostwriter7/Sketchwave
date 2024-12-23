import styles from './select-gradient-button.module.css';
import {For, Show, type VoidProps} from 'solid-js';
import type {Gradient} from '../gradient-generator/gradient-generator.tsx';
import {GradientPreview} from '../gradient-generator/gradient-preview.tsx';
import {Dialog, type DialogApi} from '../dialog/dialog.tsx';
import {Icon} from '../icon/icon.tsx';
import {useGlobalContext} from "../../global-provider.tsx";

type SelectGradientButtonProps = {
    activeGradient?: Gradient;
    icon: string;
    title: string;
    onChange: (id: string) => void;
}

export const SelectGradientButton = (props: VoidProps<SelectGradientButtonProps>) => {
    const {state} = useGlobalContext();

    let dialogRef!: DialogApi;

    return <>
        <Show
            when={props.activeGradient}
            fallback={
                <button
                    disabled={state.gradients.length == 0}
                    title={props.title}
                    onClick={() => dialogRef.open()}>
                    <Icon icon={props.icon}/>
                </button>}>
            <div
                class={`${styles.selectGradientButton} interactive`}
                title={props.title}
                onClick={() => dialogRef.open()}>
                <GradientPreview gradient={props.activeGradient!} width={25} height={25}/>
            </div>
        </Show>
        <Dialog
            setRef={(ref) => dialogRef = ref}
            title="Gradients">
            <For each={state.gradients}>
                {(gradient) =>
                    <GradientPreview
                        gradient={gradient}
                        width={100}
                        height={50}
                        onClick={() => {
                            props.onChange(gradient.id!);
                            dialogRef.close();
                        }}
                    />
                }
            </For>
        </Dialog>
    </>
}
