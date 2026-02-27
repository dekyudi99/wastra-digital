import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "antd";
import { Sparkles, SendHorizontal, Menu } from "lucide-react";
import SidebarWastraAi from "../components/SidebarWastraAi";
import aiApi from "../api/AiApi";

const OpenAi = () => {
    const [collapse, setCollapse] = useState(true);
    const [body, setBody] = useState('');
    const [activeTopicId, setActiveTopicId] = useState(null);
    const [messages, setMessages] = useState([]); 
    const [isPending, setIsPending] = useState(false); 
    const queryClient = useQueryClient();
    const scrollRef = useRef(null);

    // 1. Fetch Daftar Topik
    const { data: topics } = useQuery({ 
        queryKey: ['topics'], 
        queryFn: aiApi.getTopics 
    });

    // 2. Sinkronkan riwayat pesan
    useEffect(() => {
        if (activeTopicId) {
            aiApi.getMessages(activeTopicId).then(data => {
                setMessages(data);
            });
        } else {
            setMessages([]);
        }
    }, [activeTopicId]);

    // Auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 3. Mutasi: Tambah Topik
    const createTopic = useMutation({
        mutationFn: aiApi.createTopic,
        onSuccess: (newTopic) => {
            queryClient.invalidateQueries(['topics']);
            setActiveTopicId(newTopic.id);
            setMessages([]);
        }
    });

    // 4. Fungsi Utama: Kirim Pesan (Teks & Gambar)
    const handleSendMessage = async () => {
        if (!body.trim() || !activeTopicId || isPending) return;

        setIsPending(true);
        const currentMsg = body;
        setBody(''); 
        
        const newUserMsg = { role: 'user', content: currentMsg };
        const aiResponseId = Date.now();
        setMessages(prev => [...prev, newUserMsg, { id: aiResponseId, role: 'assistant', content: '', isStreaming: true }]);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}ai/ask`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('AUTH_TOKEN')}` 
                },
                body: JSON.stringify({ message: currentMsg, topic_id: activeTopicId })
            });

            if (!response.ok) throw new Error("Gagal menghubungi server");

            const contentType = response.headers.get("content-type");

            // --- PENANGANAN RESPONS GAMBAR (JSON) ---
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                setMessages(prev => prev.map(m => 
                    m.id === aiResponseId ? { 
                        ...m, 
                        type: 'image', 
                        image_path: result.image_path, 
                        content: result.content,
                        isStreaming: false 
                    } : m
                ));
                setIsPending(false);
                return;
            }

            // --- PENANGANAN RESPONS TEKS (STREAM) ---
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n\n");

                lines.forEach(line => {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.replace("data: ", "");
                        if (dataStr === "[DONE]") return;
                        
                        try {
                            const json = JSON.parse(dataStr);
                            if (json.text) {
                                accumulatedText += json.text;
                                setMessages(prev => prev.map(m => 
                                    m.id === aiResponseId ? { ...m, content: accumulatedText } : m
                                ));
                            }
                        } catch (e) { console.error("Parse Error:", e); }
                    }
                });
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => prev.filter(m => m.id !== aiResponseId));
        } finally {
            setMessages(prev => prev.map(m => m.id === aiResponseId ? { ...m, isStreaming: false } : m));
            setIsPending(false);
        }
    };

    return (
        <div className="bg-[#0d1117] min-h-screen flex flex-col md:flex-row overflow-hidden text-gray-100">
            <SidebarWastraAi 
                collapse={collapse} setCollapse={setCollapse}
                activeTopicId={activeTopicId} setActiveTopicId={setActiveTopicId}
                topics={topics} onCreateTopic={() => createTopic.mutate()}
            />

            <main className="flex-1 flex flex-col h-screen relative">
                <header className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 fixed top-0 w-full z-10">
                    <button onClick={() => setCollapse(false)}><Menu className="w-6 h-6 text-white" /></button>
                    <span className="font-bold">Wastra AI</span>
                    <Sparkles className="w-5 h-5 text-blue-400" />
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 mt-12 mb-24 md:mt-0 md:mb-0">
                    {(!activeTopicId || messages.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Sparkles size={64} className="mb-4 text-blue-500 animate-pulse" />
                            <h2 className="text-2xl font-semibold text-white">Apa yang bisa saya bantu?</h2>
                            {!activeTopicId ? (
                            <p className="text-blue-400 text-sm animate-bounce">Pilih atau buat percakapan di sidebar untuk mulai bertanya.</p>
                            ) : (
                                <p className="text-gray-400 text-sm max-w-xs">Tanyakan apa saja atau minta buatkan gambar (contoh: "Gambarkan wastra khas Sidemen Bali")</p>
                            )}
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-8">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
                                    <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-xl ${
                                        msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 border border-gray-700 rounded-tl-none text-gray-100'
                                    }`}>
                                        {/* RENDER GAMBAR */}
                                        {(msg.type === 'image' || msg.image_path) ? (
                                            <div className="space-y-3">
                                                <img 
                                                    src={msg.image_path.startsWith('http') ? msg.image_path : `${import.meta.env.VITE_API_BASE_URL}${msg.image_path}`} 
                                                    alt="AI Content" 
                                                    className="rounded-lg w-full h-auto shadow-lg bg-gray-900"
                                                    onError={(e) => { e.target.src = `${import.meta.env.VITE_API_URL}/${msg.image_path}` || "https://placehold.co/600x400?text=Gambar+Gagal+Dimuat"; }}
                                                />
                                                <p className="text-xs italic opacity-70">{msg.content}</p>
                                            </div>
                                        ) : (
                                            /* RENDER TEKS */
                                            <p className="whitespace-pre-wrap text-[15px]">
                                                {msg.content}
                                                {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-blue-400 animate-pulse" />}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </div>

                <div className="p-4 md:p-8 bg-gradient-to-t from-[#0d1117] via-[#0d1117] to-transparent fixed bottom-0 w-full md:relative md:bg-transparent">
                    <div className="max-w-4xl mx-auto relative group">
                        <Input.TextArea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            placeholder={!activeTopicId ? "Pilih topik..." : "Tanyakan sesuatu..."}
                            disabled={!activeTopicId || isPending}
                            autoSize={{ minRows: 1, maxRows: 6 }}
                            style={{ backgroundColor: isPending ? '#0f172a' : '#1f2937', color: 'white', borderColor: '#374151' }}
                            className="pr-14 py-4 rounded-2xl border transition-all"
                            onPressEnter={(e) => { if(!e.shiftKey && body.trim() && !isPending) { e.preventDefault(); handleSendMessage(); } }}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!body.trim() || !activeTopicId || isPending}
                            className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-blue-600 text-white disabled:bg-gray-700"
                        >
                            <SendHorizontal size={20} className={isPending ? 'animate-pulse' : ''} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OpenAi;