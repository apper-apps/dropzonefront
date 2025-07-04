import { motion } from 'framer-motion'

const Loading = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="space-y-4 w-full max-w-md">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="shimmer h-8 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="shimmer h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Drop Zone Skeleton */}
        <div className="shimmer h-48 bg-gray-200 rounded-xl"></div>

        {/* File Cards Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <div className="shimmer w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="shimmer h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading