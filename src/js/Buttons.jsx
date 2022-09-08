export const PrimaryButton = props => {
  const { href = "#", children, className = "" } = props;

  return (
    <a href={href}
       className={`text-white shadow-md border border-blue-500 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:border-blue-400 ${className}`}>
      {children}
    </a>
  )
}

export const SpectatorButton = props => {
  const { href, children, count = 0 } = props;
  return (
    <a
      href={href}
      className="bg-gray-100/10 border border-gray-600 w-full p-1 rounded-md text-center flex items-center justify-center hover:bg-blue-600"
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
