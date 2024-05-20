// src/types/react-table-config.d.ts
import { UseSortByColumnProps, UseSortByInstanceProps } from "react-table";

declare module "react-table" {
  export interface TableInstance<D extends object = object>
    extends UseSortByInstanceProps<D> {}

  export interface ColumnInstance<D extends object = object>
    extends UseSortByColumnProps<D> {}
}
