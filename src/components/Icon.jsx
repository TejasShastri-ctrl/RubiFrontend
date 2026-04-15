const paths = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  search:
    'M15.5 15.5 21 21M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z',
  user: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0',
  export:
    'M12 3v12m0 0 4-4m-4 4-4-4M5 19h14',
  plus: 'M12 5v14M5 12h14',
  filter: 'M4 7h16M7 12h10M10 17h4',
  save: 'M5 5h14v14H5zM8 5v5h8V5',
  approve: 'm5 12 4 4L19 7',
  reject: 'm7 7 10 10M17 7 7 17',
  edit: 'M4 20h4l10-10-4-4L4 16v4ZM14 6l4 4',
  warning:
    'M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
  settings:
    'M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm0-5 1.2 2.37 2.63.38-1.9 1.85.45 2.62L12 9.95l-2.38 1.27.45-2.62-1.9-1.85 2.63-.38Z',
  audit:
    'M8 6h10M8 12h10M8 18h10M4 6h.01M4 12h.01M4 18h.01',
  'arrow-left': 'M19 12H5m6-6-6 6 6 6',
}

export function Icon({ name, size = 18, stroke = 1.8, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
