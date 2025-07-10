'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { LayoutGroup, motion } from 'framer-motion'
import { default as React, useId } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

export function Sidebar({ className, ...props }) {
  return <nav {...props} className={clsx(className, 'flex h-full flex-col glass-strong')} />
}

export function SidebarHeader({ className, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-col border-b border-white/20 p-4 dark:border-white/20 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    />
  )
}

export function SidebarBody({ className, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8'
      )}
    />
  )
}

export function SidebarFooter({ className, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-col border-t border-white/20 p-4 dark:border-white/20 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    />
  )
}

export function SidebarSection({ className, ...props }) {
  let id = useId()

  return (
    <LayoutGroup id={id}>
      <div {...props} data-slot="section" className={clsx(className, 'flex flex-col gap-0.5 sidebar-links')} />
    </LayoutGroup>
  )
}

export function SidebarDivider({ className, ...props }) {
  return <hr {...props} className={clsx(className, 'my-4 border-t border-white/20 lg:-mx-4 dark:border-white/5')} />
}

export function SidebarSpacer({ className, ...props }) {
  return <div aria-hidden="true" {...props} className={clsx(className, 'mt-8 flex-1')} />
}

export function SidebarHeading({ className, ...props }) {
  return (
    <h3 {...props} className={clsx(className, 'mb-1 px-2 text-xs/6 font-medium text-red-500 dark:white')} />
  )
}

export const SidebarItem = React.forwardRef(function SidebarItem(
  { current, className, children, ...props },

  ref
) {
  let classes = clsx(
    // Base
    'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-white sm:py-2 sm:text-sm/5 no-underline',
    // Leading icon/icon-only
    'data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5 no-underline',
    // Trailing icon (down chevron or similar)
    'data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4 no-underline',
    // Avatar
    'data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6 data-[hover]:no-underline data-[hover]:text-[#0edbff] no-underline',
    // Hover
    'data-[hover]:glass-subtle data-[slot=icon]:*:data-[hover]:fill-white data-[hover]:no-underline data-[hover]:text-white !text-white no-underline',
    // Active
    'data-[active]:glass-subtle data-[slot=icon]:*:data-[active]:fill-white data-[hover]:no-underline data-[hover]:text-white no-underline',
    // Current
    'data-[slot=icon]:*:data-[current]:fill-white data-[hover]:no-underline data-[hover]:text-[#c57a7a] no-underline',
    // Dark mode
    'dark:text-white dark:data-[slot=icon]:*:fill-zinc-400 data-[hover]:no-underline no-underline',
    'dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white data-[hover]:no-underline data-[hover]:text-[#9727ff] no-underline',
    'dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white data-[hover]:no-underline data-[hover]:text-[#ff2768] no-underline',
    'dark:data-[slot=icon]:*:data-[current]:fill-white data-[hover]:no-underline data-[hover]:text-[#069240d1fffd1] no-underline'
  )

  return (
    <span className={clsx(className, 'relative')}>
      {current && (
        <motion.span
          layoutId="current-indicator"
          className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-white dark:bg-white"
        />
      )}
      {'href' in props ? (
        <Headless.CloseButton
          as={Link}
          {...props}
          className={classes}
          data-current={current ? 'true' : undefined}
          data-active={props['aria-current'] ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.CloseButton>
      ) : (
        <Headless.Button
          {...props}
          className={clsx('cursor-default', classes)}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
})

export function SidebarLabel({ className, ...props }) {
  return <span {...props} className={`${clsx(className, 'truncate !no-underline')} !no-underline text-white/70 hover:text-white`} />
}
