import React from "react";
import { Card, Flex, Button } from "@sanity/ui";
import type { ModuleArrayItem } from "./ModuleArrayInput";

interface ModuleArrayItemProps {
  value: ModuleArrayItem;
  renderDefault: (props: ModuleArrayItemProps) => React.ReactNode;
  onEditCasting?: (key: string) => void;
}

export default function ModuleArrayItem(props: ModuleArrayItemProps) {
  // props.value is the module reference
  // props.renderDefault(props) renders the default preview
  // props.onEditCasting is a function passed from the parent
  return (
    <Card padding={2} radius={2} shadow={1} tone="primary">
      <Flex align="center" justify="space-between">
        {props.renderDefault(props)}
        <Button
          text="Edit Casting"
          size={1}
          onClick={() => props.onEditCasting?.(props.value?._key)}
        />
      </Flex>
    </Card>
  );
}
