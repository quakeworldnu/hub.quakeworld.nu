import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Demo } from "../services/supabase/supabase.types.ts";

type SortableDemoItem = {
  id: number;
  demo: Demo;
};

type SortableItem = SortableDemoItem;
type SortableItemRenderer = (item: SortableItem) => ReactNode;

export function SortableItemList({
  items = [],
  handleChange,
  renderItem,
}: {
  items: SortableItem[];
  handleChange: (items: SortableItem[]) => void;
  renderItem: SortableItemRenderer;
}) {
  const sensors = useSensors(useSensor(PointerSensor));
  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over?.id || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    handleChange(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <div>
      <DndContext
        measuring={measuringConfig}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} renderItem={renderItem} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export function SortableItem({
  item,
  renderItem,
}: {
  item: SortableItem;
  renderItem: SortableItemRenderer;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
      animateLayoutChanges: () => true,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Item = renderItem(item);

  return (
    <div itemID={item.id.toString()} ref={setNodeRef} style={style}>
      <div className="flex items-center">
        <button
          className="py-2 px-4 text-slate-500 hover:text-slate-300 cursor-grab transition-colors"
          {...attributes}
          {...listeners}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        {Item}
      </div>
    </div>
  );
}
