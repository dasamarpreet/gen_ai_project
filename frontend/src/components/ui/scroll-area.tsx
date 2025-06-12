import React from "react";

export const ScrollArea = ({
  children,
  className,
  onScroll,
}: {
  children: React.ReactNode;
  className?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      onScroll={onScroll}
      className={`overflow-y-auto scrollbar-thin ${className}`}
    >
      {children}
    </div>
  );
};
