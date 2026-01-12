'use client';

import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Table container with retro border styling
 */
export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={clsx('w-full overflow-auto', className)}>
      <table className="w-full border-collapse border border-edge-primary">
        {children}
      </table>
    </div>
  );
}

/**
 * Table header section
 */
export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return <thead className={className}>{children}</thead>;
}

/**
 * Table body section
 */
export function TableBody({ children, className = '' }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

/**
 * Table row with hover and selected states
 */
export function TableRow({
  children,
  className = '',
  selected = false,
}: TableRowProps) {
  return (
    <tr
      className={clsx(
        'border-b border-edge-primary',
        'hover:bg-surface-secondary/5',
        selected && 'bg-surface-secondary/10',
        className
      )}
    >
      {children}
    </tr>
  );
}

/**
 * Table header cell (th)
 */
export function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <th
      className={clsx(
        'px-4 py-2',
        'text-left',
        'font-joystix text-xs uppercase',
        'text-content-primary',
        'bg-surface-primary',
        'border-r border-b border-edge-primary',
        'last:border-r-0',
        className
      )}
    >
      {children}
    </th>
  );
}

/**
 * Table data cell (td)
 */
export function TableCell({ children, className = '' }: TableCellProps) {
  return (
    <td
      className={clsx(
        'px-4 py-2',
        'font-mondwest text-base',
        'text-content-primary',
        'border-r border-edge-primary',
        'last:border-r-0',
        className
      )}
    >
      {children}
    </td>
  );
}

export default Table;
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
};
