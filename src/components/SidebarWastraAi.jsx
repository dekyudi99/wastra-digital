import { useNavigate } from "react-router-dom";
import { Bars3Icon, PencilSquareIcon, ArrowLeftEndOnRectangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SidebarWastraAi = ({ collapse, setCollapse, activeTopicId, setActiveTopicId, topics, onCreateTopic }) => {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }
    return (
        <>
            {/* Overlay Mobile: Muncul jika sidebar dibuka di layar kecil */}
            {!collapse && (
                <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setCollapse(true)} />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0
                transition-all duration-300 ease-in-out bg-gray-900 border-r border-gray-800
                ${collapse ? '-translate-x-full md:w-20' : 'translate-x-0 w-80'}
            `}>
                <div className="p-4 flex items-center justify-between">
                    {!collapse && <span className="text-white font-bold ml-2">Wastra AI</span>}
                    <button onClick={() => setCollapse(!collapse)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
                        {collapse ? <Bars3Icon className="h-6 w-6" /> : <XMarkIcon className="h-6 w-6" />}
                    </button>
                </div>

                <button 
                    onClick={onCreateTopic}
                    className="m-3 flex items-center gap-3 p-3 w-[calc(100%-1.5rem)] bg-blue-600/10 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all group"
                >
                    <PencilSquareIcon className="h-6 w-6 shrink-0" />
                    {!collapse && <span className="font-medium truncate">Percakapan Baru</span>}    
                </button>

                <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                    {!collapse && topics?.map(topic => (
                        <button 
                            key={topic.id}
                            onClick={() => setActiveTopicId(topic.id)}
                            className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-200 truncate
                                ${activeTopicId === topic.id ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}
                        >
                            {topic.title}
                        </button>
                    ))}
                </div>

                <div onClick={handleBack} className="p-3 border-t border-gray-800">
                    <button className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 transition-colors">
                        <ArrowLeftEndOnRectangleIcon className="h-6 w-6 shrink-0" />
                        {!collapse && <span>Kembali</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SidebarWastraAi;