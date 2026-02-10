// components/AiFloatingButton.jsx
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const AiFloatingButton = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/ai')}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-indigo-600 hover:bg-indigo-700
        text-white shadow-lg
        flex items-center justify-center
        transition-all
      "
      aria-label="AI Insight"
    >
      <Sparkles size={24} />
    </button>
  )
}

export default AiFloatingButton
