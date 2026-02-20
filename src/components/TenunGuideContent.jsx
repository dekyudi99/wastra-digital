import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TenunGuideContent = ({ data }) => {
  const printRef = useRef();
  
  // Normalisasi data: Ambil dari ai_result jika berasal dari database riwayat
  // Jika sedang proses generate baru, biasanya data langsung berada di level root
  const content = data.ai_result ? data.ai_result : data;
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Logika pengambilan gambar: prioritas URL absolut dari AI, lalu fallback ke base URL
  const rawImage = content.image || data.image;
  const imageUrl = rawImage?.startsWith('http') 
    ? rawImage 
    : `${baseUrl}${rawImage?.startsWith('/') ? '' : '/'}${rawImage}`;

  const downloadPDF = async () => {
    const element = printRef.current;
    // useCORS wajib true agar gambar dari backend bisa masuk ke PDF
    const canvas = await html2canvas(element, { 
      scale: 2, 
      useCORS: true, 
      allowTaint: false,
      logging: false 
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Panduan-Tenun-${data.design_name || 'AI'}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-end">
        <button 
          onClick={downloadPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Simpan PDF Panduan
        </button>
      </div>

      <div ref={printRef} className="bg-white p-8 border border-gray-100 rounded-2xl shadow-xl space-y-8">
        <header className="text-center border-b-2 border-indigo-900 pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-indigo-950">Panduan Teknis Tenun Digital</h1>
          <p className="text-sm text-gray-500 font-medium">Motif: <span className="text-indigo-600 uppercase">{data.design_name || 'Tanpa Nama'}</span></p>
        </header>

        {/* Area Gambar Hasil AI */}
        {rawImage && (
          <div className="flex flex-col items-center space-y-3">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25"></div>
                <img 
                  src={imageUrl} 
                  alt="AI Motif Result" 
                  className="relative max-w-sm h-auto rounded-xl shadow-2xl border-4 border-white" 
                  crossOrigin="anonymous"
                />
             </div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visualisasi Motif Master AI</p>
          </div>
        )}

        {/* Ringkasan Filosofi */}
        <section className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
          <h3 className="text-sm font-black text-indigo-900 uppercase mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analisis Teknis & Filosofi
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed italic">"{content.summary}"</p>
        </section>

        {/* Tabel Weaving Steps - Sekarang mendukung 60 baris dengan rapi */}
        <section>
          <h3 className="text-sm font-black text-gray-900 uppercase mb-4 border-l-4 border-indigo-600 pl-3">
            Instruksi Penenunan (Baris demi Baris)
          </h3>
          <div className="overflow-hidden border border-gray-100 rounded-xl shadow-sm">
            <table className="w-full text-[12px] text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 w-20 font-bold">BARIS</th>
                  <th className="p-4 w-32 font-bold">LIFT (LUNGSIN)</th>
                  <th className="p-4 font-bold">INSTRUKSI TEKNIS</th>
                  <th className="p-4 w-24 font-bold">WARNA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {content.weaving_steps?.map((step, i) => (
                  <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-4 font-black text-indigo-600 bg-gray-50/50 text-center">{step.row}</td>
                    <td className="p-4 font-mono font-bold text-gray-500">{step.lift}</td>
                    <td className="p-4 text-gray-700 leading-snug">{step.instruction}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md bg-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                        {step.thread_color}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips & Perhatian */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
            <h4 className="text-emerald-900 font-black text-xs uppercase mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips Ahli Penenun
            </h4>
            <ul className="space-y-2">
              {(content.tips_ahli || content.tips_penenun)?.map((t, i) => (
                <li key={i} className="text-[11px] text-emerald-800 flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 bg-emerald-400 rounded-full shrink-0"></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
            <h4 className="text-rose-900 font-black text-xs uppercase mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Perhatian Khusus
            </h4>
            <ul className="space-y-2">
              {content.perhatian?.map((k, i) => (
                <li key={i} className="text-[11px] text-rose-800 flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 bg-rose-400 rounded-full shrink-0"></span>
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="text-center pt-6 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium italic">
              Dihasilkan secara otomatis oleh Sistem Pakar Tenun AI Sidemen - {new Date().toLocaleDateString('id-ID')}
            </p>
        </footer>
      </div>
    </div>
  );
};

export default TenunGuideContent;