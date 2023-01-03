import type { ReactElement, ReactNode } from "react";

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean;
  wrapper: (children: ReactNode) => ReactElement;
  children: ReactElement;
}) => (condition ? wrapper(children) : children);
