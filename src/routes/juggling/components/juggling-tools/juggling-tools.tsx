import { MenuGroup } from '../../../../components/menu/menu-group/menu-group.tsx';
import { Divider } from '../../../../components/menu/divider.tsx';
import { GridSettings } from '../grid-settings/grid-settings.tsx';

const JugglingTools = () => {
  return <>
    <MenuGroup label="Grid">
      <GridSettings />
    </MenuGroup>
    <Divider />
    <MenuGroup label="Props" />
  </>
}

export default JugglingTools;
