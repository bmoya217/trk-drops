export const getMenuMaxHeight = (
  anchor: HTMLElement | null,
  viewportHeight: number,
) => {
  if (!anchor || !viewportHeight) return 360;

  const margin = 16;
  const availableHeight =
    viewportHeight - anchor.getBoundingClientRect().bottom - margin;

  return Math.max(availableHeight, 96);
};

export const menuPositionProps = {
  anchorOrigin: { horizontal: "left", vertical: "bottom" } as const,
  transformOrigin: { horizontal: "left", vertical: "top" } as const,
};
