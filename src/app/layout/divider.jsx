import clsx from 'clsx'

export function Divider({ soft = false, className, ...props }) {
  return (
    <hr
      {...props}
      className={clsx(
        className,
        'w-full border-t',
        soft && 'border-white/50 dark:border-white/5',
        !soft && 'border-white/10 dark:border-white/10'
      )}
    />
  )
}
