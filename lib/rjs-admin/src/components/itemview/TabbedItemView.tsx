import { ItemView, ItemViewProps } from "./ItemView";

/**
 * TabbedItemView component that inherits from ItemView with no modifications.
 * This component provides the same functionality as ItemView but with a more specific name
 * to indicate its tabbed nature.
 */
export class TabbedItemView extends ItemView {
  static TabItem = ItemView.TabItem;
}

export type { ItemViewProps as TabbedItemViewProps };
export default TabbedItemView;
