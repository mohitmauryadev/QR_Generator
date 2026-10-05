import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Home = () => {
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [qrValue, setQrValue] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [logoBase64, setLogoBase64] = useState(null);
    const [qrSize, setQrSize] = useState(280);
    const fileInputRef = useRef(null);

    // Responsive QR Size Logic
    useEffect(() => {
        const updateSize = () => {
            if (window.innerWidth < 640) {
                setQrSize(200); // Mobile size
            } else {
                setQrSize(280); // Desktop size
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoBase64(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = () => {
        if (!url || !name) {
            alert("Please enter both URL and Name");
            return;
        }
        setQrValue(url);
        setDisplayName(name);
        // Scroll to QR on mobile for better UX
        if (window.innerWidth < 1024) {
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    };

    const handleDownload = () => {
        const qrCanvas = document.getElementById("qr-code-canvas");
        if (!qrCanvas) return;

        const size = qrCanvas.width;

        // New canvas create karo
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = size;
        finalCanvas.height = size;

        const ctx = finalCanvas.getContext("2d");

        // Step 1: QR draw karo
        ctx.drawImage(qrCanvas, 0, 0);

        // Step 2: Logo draw karo (agar hai)
        if (logoBase64) {
            const img = new Image();
            img.src = logoBase64;

            img.onload = () => {
                const logoSize = size * 0.22;
                const x = (size - logoSize) / 2;
                const y = (size - logoSize) / 2;

                // Circle mask create
                ctx.save();
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, logoSize / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(img, x, y, logoSize, logoSize);
                ctx.restore();

                // Download
                const pngUrl = finalCanvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = pngUrl;
                link.download = `${name.replace(/\s+/g, "-")}-QR.png`;
                link.click();
            };
        } else {
            const pngUrl = finalCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = pngUrl;
            link.download = `${name.replace(/\s+/g, "-")}-QR.png`;
            link.click();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">

            {/* Navbar */}
            <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-5 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#0078d4] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                            <path d="M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm10-8c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-800">QR Generator</span>
                </div>
                <div className="hidden sm:block">
                    <span className="px-3 py-1 bg-blue-50 text-[#0078d4] text-[10px] font-black rounded-x border border-blue-100 uppercase tracking-widest">
                        WeboraX UI
                    </span>
                </div>
            </nav>

            {/* Main Container */}
            <main className="flex-grow container mx-auto px-4 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* Left: Input Form (Always Top on Mobile) */}
                    <div className="bg-white p-6 md:p-10  shadow-xl shadow-slate-200/60 border border-white order-1">
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Create Asset</h1>
                            <p className="text-slate-400 text-sm font-medium mt-1">Configure your professional QR code.</p>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#0078d4] uppercase tracking-widest ml-1">Destination URL</label>
                                <input
                                    type="text"
                                    placeholder="https://weborax.in"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-[#0078d4] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#0078d4] uppercase tracking-widest ml-1">Asset Name</label>
                                <input
                                    type="text"
                                    placeholder="WeboraX"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-[#0078d4] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#0078d4] uppercase tracking-widest ml-1">Brand Logo (Optional)</label>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full px-5 py-3.5  bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#0078d4] transition-all flex justify-between items-center group"
                                >
                                    <span className="text-xs font-bold text-slate-500 truncate">
                                        {logoBase64 ? "Image Uploaded ✓" : "Upload PNG/JPG"}
                                    </span>
                                    <svg className="w-5 h-5 text-[#0078d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                    </svg>
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </div>

                            <button
                                onClick={handleGenerate}
                                className="w-full bg-[#0078d4] hover:bg-[#005a9e] text-white font-bold py-4 cursor-pointer shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] text-sm md:text-base"
                            >
                                Generate QR
                            </button>
                        </div>
                    </div>

                    {/* Right: Preview Area */}
                    <div className="flex flex-col items-center justify-center order-2">
                        {qrValue ? (
                            <div className="w-full animate-in fade-in slide-in-from-bottom-5 duration-500 flex flex-col items-center">
                                <div className="relative p-6 md:p-10 bg-white shadow-2xl border border-slate-50">
                                    {/* High Density QR Rendering */}
                                    <div className="relative inline-block overflow-hidden">
                                        <QRCodeCanvas
                                            id="qr-code-canvas"
                                            value={qrValue}
                                            size={qrSize}
                                            level="H"
                                            includeMargin={false}
                                            fgColor="#0f172a"
                                            bgColor="#ffffff"

                                        />

                                        {/* Circle Mask Overlay */}
                                        {logoBase64 && (
                                            <div
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-sm bg-white overflow-hidden"
                                                style={{ width: qrSize * 0.21, height: qrSize * 0.21 }}
                                            >
                                                <img src={logoBase64} alt="logo" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 break-all px-4">{displayName}</h3>
                                    <p className="text-[10px] font-bold text-[#0078d4] tracking-[0.3em] uppercase mt-2">Enterprise Ready</p>
                                </div>

                                <button
                                    onClick={handleDownload}
                                    className="mt-6 md:mt-10 flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-8 md:px-12 py-4 cursor-pointer font-bold shadow-xl transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                    </svg>
                                    Download QR
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-[320px] aspect-square border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 p-6 text-center">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest">Waiting for Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile-Optimized Footer */}
            <footer className="py-8 px-6 border-t border-slate-100 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Architected By</p>
                        <p className="text-base font-black text-slate-800">WeboraX Pvt. Ltd.</p>
                    </div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                        © {new Date().getFullYear()} QR Generator Enterprise
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
