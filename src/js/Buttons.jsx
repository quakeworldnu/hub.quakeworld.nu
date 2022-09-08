const hoverClasses = "hover:from-blue-500 hover:to-blue-600 hover:border-blue-400"

export const PrimaryButton = props => {
  const { href = "#", children, className = "" } = props;

  return (
    <a href={href}
       className={`text-white shadow-md border border-blue-500 bg-gradient-to-b from-blue-600 to-blue-700 ${hoverClasses}  ${className}`}>
      {children}
    </a>
  )
}

export const SpectatorButton = props => {
  const { href, children, count = 0 } = props;
  return (
    <a
      href={href}
      className={`p-1 text-center shadow-md w-full rounded text-white shadow-md border border-gray-600 bg-gradient-to-b from-gray-600 to-gray-700 ${hoverClasses}`}
    >
      {children}

      {count > 0 && (
        <span className="ml-1 text-gray-400 text-xs">
          ({count})
        </span>
      )}
    </a>
  )
}
