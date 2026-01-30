// components/AiSkeleton.jsx
const SkeletonBlock = ({ h = 'h-4', w = 'w-full' }) => (
  <div className={`bg-gray-200 rounded ${h} ${w} animate-pulse`} />
)

const AiSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white p-4 rounded shadow space-y-3">
        <SkeletonBlock h="h-5" w="w-1/3" />
        <SkeletonBlock />
        <SkeletonBlock w="w-3/4" />
      </div>
    ))}
  </div>
)

export default AiSkeleton
