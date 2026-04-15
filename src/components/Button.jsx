import { Icon } from './Icon'

export function Button({
  children,
  variant = 'primary',
  icon,
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={`ui-button ui-button--${variant}`} {...props}>
      {icon ? <Icon name={icon} size={16} /> : null}
      <span>{children}</span>
    </button>
  )
}