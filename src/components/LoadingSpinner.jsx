export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}