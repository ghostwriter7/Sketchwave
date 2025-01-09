import { MenuGroup } from '../../../../components/menu/menu-group/menu-group.tsx';
import { Divider } from '../../../../components/menu/divider.tsx';

const JugglingTools = () => {
  return <>
    <MenuGroup label="Grid" />
    <Divider />
    <MenuGroup label="Props" />
  </>
}

export default JugglingTools;
