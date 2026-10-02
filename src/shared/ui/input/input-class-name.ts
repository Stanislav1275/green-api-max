/**
 * MAX text field: filled, borderless, 12px radius. Focus and invalid rings are drawn inset,
 * so scroll containers and tight layouts never clip them.
 */
export const inputClassName =
  'h-12 w-full min-w-0 rounded-lg bg-input px-4 text-base text-foreground transition-shadow outline-none placeholder:text-subtle-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive aria-invalid:ring-inset md:text-[15px]'
