const Loader = ({ fullScreen = false }) => {
  const loaderContent = (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    )
  }

  return loaderContent
}

export default Loader