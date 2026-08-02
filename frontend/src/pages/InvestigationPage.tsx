import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Camera, 
  PhoneCall, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  Database,
  FolderOpen,
  QrCode,
  UserCheck,
  Upload,
  Sparkles,
  Plus,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Video,
  VideoOff,
  CheckCircle,
  X
} from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';
import { motion, AnimatePresence } from 'framer-motion';
import jsQR from 'jsqr';

interface TimelineEvent {
  title: string;
  timestamp: string;
  description: string;
  type: 'INGEST' | 'SIGNAL' | 'CONNECTION' | 'CALIBRATION' | 'DISPATCH';
}

interface EvidenceFile {
  name: string;
  type: 'LOG' | 'SCREENSHOT' | 'TRANSCRIPT';
  size: string;
}

interface Case {
  id: string;
  target: string;
  targetType: 'LINKEDIN' | 'QR_CODE';
  risk: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  status: 'OPEN' | 'ESCALATED' | 'RESOLVED';
  timeCreated: string;
  description: string;
  riskIndicators: string[];
  timeline: TimelineEvent[];
  evidence: EvidenceFile[];
}

export const InvestigationPage: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Investigation Mode: 'linkedin' or 'qr'
  const [activeTab, setActiveTab] = useState<'linkedin' | 'qr'>('linkedin');

  // LinkedIn form state
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');
  const [linkedinText, setLinkedinText] = useState<string>('');
  const [linkedinCompany, setLinkedinCompany] = useState<string>('');

  // QR form state
  const [qrInputMode, setQrInputMode] = useState<'laptop' | 'camera'>('laptop');
  const [qrPayload, setQrPayload] = useState<string>('');
  const [qrImageB64, setQrImageB64] = useState<string>('');
  const [qrFileName, setQrFileName] = useState<string>('');
  const [decodeStatus, setDecodeStatus] = useState<string>('');

  // Live Camera Scanner State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Auto-play timeline loop
  useEffect(() => {
    let interval: any;
    if (isPlaying && selectedCase) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= selectedCase.timeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000 / playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, selectedCase]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCaseSelect = (c: Case) => {
    setSelectedCase(c);
    setCurrentStep(c.timeline.length - 1);
    setIsPlaying(false);
  };

  const getStatusColor = (risk: Case['risk']) => {
    if (risk === 'CRITICAL' || risk === 'HIGH') return 'danger';
    if (risk === 'MEDIUM') return 'warning';
    return 'success';
  };

  const getStepIconColor = (type: TimelineEvent['type'], isPassed: boolean) => {
    if (!isPassed) return 'bg-[#1E293B] border-slate-600 text-slate-500';
    if (type === 'INGEST') return 'bg-[#0B1220] border-[#00E5FF] text-[#00E5FF]';
    if (type === 'SIGNAL') return 'bg-[#0B1220] border-[#F59E0B] text-[#F59E0B]';
    if (type === 'CONNECTION') return 'bg-[#0B1220] border-[#6366F1] text-[#6366F1]';
    if (type === 'CALIBRATION') return 'bg-[#0B1220] border-[#22C55E] text-[#22C55E]';
    return 'bg-[#EF4444] border-[#EF4444] text-slate-100';
  };

  // Decode QR code from image file uploaded from laptop
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFileName(file.name);
      setDecodeStatus('Reading file from laptop...');

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setQrImageB64(result);

        // Load into JS Image object for QR decoding
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              setQrPayload(code.data);
              setDecodeStatus(`Successfully decoded QR payload from ${file.name}`);
            } else {
              setDecodeStatus(`Uploaded image attached. Base64 payload stored for backend matrix scan.`);
            }
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Live Camera Web Scanner
  const startCamera = async () => {
    setCameraError('');
    setDecodeStatus('Requesting webcam access...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setDecodeStatus('Camera active. Point your camera at a QR code...');
        scanCameraFrame();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Please ensure webcam permissions are enabled.');
      setDecodeStatus('Camera access error.');
      setIsCameraActive(false);
    }
  };

  // Stop Live Camera Stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Continuously scan frames from live camera stream
  const scanCameraFrame = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          // QR code found!
          setQrPayload(code.data);
          const frameB64 = canvas.toDataURL('image/png');
          setQrImageB64(frameB64);
          setQrFileName('camera_scan_capture.png');
          setDecodeStatus(`Decoded QR code from Camera: ${code.data}`);
          stopCamera();
          return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(scanCameraFrame);
  };

  // Run LinkedIn Analysis against Backend
  const runLinkedInInvestigation = async () => {
    if (!linkedinUrl && !linkedinText && !linkedinCompany) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/analyze/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_url: linkedinUrl || undefined,
          profile_text: linkedinText || undefined,
          claimed_company: linkedinCompany || undefined
        })
      });

      const data = await response.json();
      
      const newCase: Case = {
        id: data.scan_id || `INC-LN-${Date.now().toString().slice(-5)}`,
        target: data.target || linkedinUrl || 'LinkedIn Profile Target',
        targetType: 'LINKEDIN',
        risk: data.risk_level as Case['risk'],
        status: data.is_suspicious ? 'ESCALATED' : 'OPEN',
        timeCreated: new Date().toLocaleTimeString(),
        description: data.explanation,
        riskIndicators: data.risk_indicators || [],
        timeline: data.forensic_timeline || [],
        evidence: (data.evidence_locker || []).map((f: any) => ({
          name: f.name,
          type: f.type,
          size: f.size
        }))
      };

      setCases(prev => [newCase, ...prev]);
      setSelectedCase(newCase);
      setCurrentStep(newCase.timeline.length - 1);
      setIsPlaying(false);

      // Reset form
      setLinkedinUrl('');
      setLinkedinText('');
      setLinkedinCompany('');
    } catch (error) {
      console.error('LinkedIn investigation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run QR Code Analysis against Backend
  const runQRInvestigation = async () => {
    if (!qrPayload && !qrImageB64) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/analyze/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qr_payload: qrPayload || undefined,
          qr_image_b64: qrImageB64 || undefined
        })
      });

      const data = await response.json();
      
      const newCase: Case = {
        id: data.scan_id || `INC-QR-${Date.now().toString().slice(-5)}`,
        target: data.target || qrPayload || 'QR Code Target',
        targetType: 'QR_CODE',
        risk: data.risk_level as Case['risk'],
        status: data.is_suspicious ? 'ESCALATED' : 'OPEN',
        timeCreated: new Date().toLocaleTimeString(),
        description: data.explanation,
        riskIndicators: data.risk_indicators || [],
        timeline: data.forensic_timeline || [],
        evidence: (data.evidence_locker || []).map((f: any) => ({
          name: f.name,
          type: f.type,
          size: f.size
        }))
      };

      setCases(prev => [newCase, ...prev]);
      setSelectedCase(newCase);
      setCurrentStep(newCase.timeline.length - 1);
      setIsPlaying(false);

      // Reset form
      setQrPayload('');
      setQrImageB64('');
      setQrFileName('');
      setDecodeStatus('');
      stopCamera();
    } catch (error) {
      console.error('QR investigation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample Presets
  const applyLinkedInPreset = (type: 'fake' | 'safe') => {
    if (type === 'fake') {
      setLinkedinUrl('https://www.linkedn-security-jobs.top/in/hr-talent-recruiter');
      setLinkedinText('Urgent hiring for Senior Talent Manager! Daily payout $500/day. No experience needed. Contact HR directly on WhatsApp: +91 9988776655 to claim position.');
      setLinkedinCompany('Global Crypto Ventures Ltd');
    } else {
      setLinkedinUrl('https://www.linkedin.com/in/satyanadella');
      setLinkedinText('Chairman and CEO at Microsoft. Empowering every person and every organization on the planet to achieve more.');
      setLinkedinCompany('Microsoft');
    }
  };

  const applyQRPreset = (type: 'upi' | 'quishing' | 'safe') => {
    stopCamera();
    setQrInputMode('laptop');
    if (type === 'upi') {
      setQrPayload('upi://pay?pa=scammer-mule@ybl&pn=RefundBonus&am=5000&tn=ClaimRefundBonusNow');
      setQrFileName('sample_upi_refund_qr.png');
      setDecodeStatus('Sample UPI QR payload loaded: Reverse payment debit scam');
    } else if (type === 'quishing') {
      setQrPayload('https://lotto-rewards-claim-qr.top/login-verify');
      setQrFileName('sample_phishing_qr.png');
      setDecodeStatus('Sample Quishing QR payload loaded: Phishing link');
    } else {
      setQrPayload('upi://pay?pa=store-merchant@icici&pn=CoffeeShop&am=150&tn=BillPayment');
      setQrFileName('sample_merchant_qr.png');
      setDecodeStatus('Sample Safe QR payload loaded');
    }
  };

  return (
    <div className="space-y-4 text-left font-sans">
      <AppPageHeader 
        title="Investigation Room" 
        description="Run deep forensic threat investigations for Fake LinkedIn Profiles and Malicious QR Code Scams."
        rightElement={
          <div className="flex items-center space-x-2">
            <AppBadge color={cases.length > 0 ? 'info' : 'muted'}>
              {cases.length} ACTIVE CASES
            </AppBadge>
          </div>
        }
      />

      {/* Top Section: Live Investigation Launchpad */}
      <AppCard className="p-5 border-l-4 border-l-[#00E5FF]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1E293B] mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
                Launch Target Investigation
              </h3>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                Select a specialized detector below to analyze live indicators against the TrustNet AI backend.
              </p>
            </div>
          </div>

          {/* Detector Mode Selector */}
          <div className="flex space-x-2 bg-[#050811] p-1 rounded-xl border border-[#1E293B]">
            <button
              onClick={() => {
                setActiveTab('linkedin');
                stopCamera();
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'linkedin' 
                  ? 'bg-[#00E5FF] text-slate-900 shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Fake LinkedIn Detector</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'qr' 
                  ? 'bg-[#00E5FF] text-slate-900 shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Fake QR Code Detector</span>
            </button>
          </div>
        </div>

        {/* Tab 1: LinkedIn Form */}
        {activeTab === 'linkedin' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  LinkedIn Profile / Job URL
                </label>
                <input 
                  type="text"
                  placeholder="https://www.linkedin.com/in/username or https://www.linkedn-verify.top/..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full bg-[#050811] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Claimed Company / Employer
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Microsoft, Google, or Crypto Ventures Ltd"
                  value={linkedinCompany}
                  onChange={(e) => setLinkedinCompany(e.target.value)}
                  className="w-full bg-[#050811] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Profile Bio / Connection Message / Job Offer Lure
              </label>
              <textarea 
                rows={2}
                placeholder="Paste the profile bio, connection request text, or job offer details..."
                value={linkedinText}
                onChange={(e) => setLinkedinText(e.target.value)}
                className="w-full bg-[#050811] border border-[#1E293B] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-all font-sans resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono text-slate-500">Sample Test Presets:</span>
                <button
                  onClick={() => applyLinkedInPreset('fake')}
                  className="px-2.5 py-1 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] rounded-lg text-[9px] font-mono hover:bg-[#EF4444]/20 cursor-pointer"
                >
                  Fake Recruiter Scam Lure
                </button>
                <button
                  onClick={() => applyLinkedInPreset('safe')}
                  className="px-2.5 py-1 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded-lg text-[9px] font-mono hover:bg-[#22C55E]/20 cursor-pointer"
                >
                  Verified Official Profile
                </button>
              </div>

              <button
                onClick={runLinkedInInvestigation}
                disabled={loading || (!linkedinUrl && !linkedinText && !linkedinCompany)}
                className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-mono font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 active:scale-95 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing LinkedIn Traces...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Run Deep LinkedIn Investigation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: QR Form with Camera & Laptop Upload */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            {/* Input Method Switcher */}
            <div className="flex items-center justify-between bg-[#050811] p-1.5 rounded-xl border border-[#1E293B]">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setQrInputMode('laptop');
                    stopCamera();
                  }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    qrInputMode === 'laptop'
                      ? 'bg-[#1E293B] text-[#00E5FF] border border-[#00E5FF]/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image from Laptop</span>
                </button>
                <button
                  onClick={() => {
                    setQrInputMode('camera');
                    startCamera();
                  }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    qrInputMode === 'camera'
                      ? 'bg-[#1E293B] text-[#00E5FF] border border-[#00E5FF]/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Scan via Live Laptop Camera</span>
                </button>
              </div>

              {decodeStatus && (
                <span className="text-[9px] font-mono text-[#00E5FF] truncate max-w-[320px] px-2 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-[#22C55E]" />
                  <span>{decodeStatus}</span>
                </span>
              )}
            </div>

            {/* Mode A: Live Laptop Camera */}
            {qrInputMode === 'camera' && (
              <div className="bg-[#050811] border border-[#1E293B] p-4 rounded-xl flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                <canvas ref={canvasRef} className="hidden" />

                {isCameraActive ? (
                  <div className="relative w-full max-w-md h-56 bg-black rounded-xl overflow-hidden border-2 border-[#00E5FF]/50 shadow-lg flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    {/* Scanning animation overlay */}
                    <div className="absolute inset-0 border-2 border-[#00E5FF]/30 rounded-xl pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-dashed border-[#00E5FF] rounded-lg animate-pulse relative">
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-black/70 text-[#00E5FF] px-2 py-0.5 rounded text-[8px] font-mono">
                      LIVE CAMERA SCANNING...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <Video className="w-10 h-10 text-slate-600" />
                    <p className="text-xs font-mono text-slate-300">Live Camera Scanner</p>
                    {cameraError ? (
                      <p className="text-[10px] font-mono text-[#EF4444] max-w-sm">{cameraError}</p>
                    ) : (
                      <p className="text-[10px] text-slate-500 font-mono">
                        Point your laptop or device webcam directly at any physical or digital QR code.
                      </p>
                    )}
                    <button
                      onClick={startCamera}
                      className="mt-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 px-4 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Camera Scanner</span>
                    </button>
                  </div>
                )}

                {isCameraActive && (
                  <button
                    onClick={stopCamera}
                    className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20 px-3 py-1 rounded-lg text-[9px] font-mono font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <VideoOff className="w-3 h-3" />
                    <span>Stop Camera</span>
                  </button>
                )}
              </div>
            )}

            {/* Mode B: Upload from Laptop */}
            {qrInputMode === 'laptop' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Upload QR Image File from Laptop
                  </label>
                  <div className="relative">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="qr-upload-input"
                    />
                    <label 
                      htmlFor="qr-upload-input"
                      className="w-full bg-[#050811] border border-dashed border-[#1E293B] hover:border-[#00E5FF]/60 rounded-xl p-4 text-xs text-slate-300 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all h-[100px]"
                    >
                      <Upload className="w-6 h-6 text-[#00E5FF]" />
                      <span className="font-mono text-[10px] text-slate-300 font-bold">
                        {qrFileName ? `File: ${qrFileName}` : 'Drop QR Image or Click to Browse Laptop...'}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500">Supports PNG, JPG, JPEG, WEBP</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Decoded QR Payload String / UPI Handle
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Auto-populated upon scanning camera/file, or paste payload directly (e.g. upi://pay?pa=scammer@ybl...)"
                    value={qrPayload}
                    onChange={(e) => setQrPayload(e.target.value)}
                    className="w-full bg-[#050811] border border-[#1E293B] rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-all font-mono h-[100px] resize-none"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono text-slate-500">Sample Test Presets:</span>
                <button
                  onClick={() => applyQRPreset('upi')}
                  className="px-2.5 py-1 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] rounded-lg text-[9px] font-mono hover:bg-[#EF4444]/20 cursor-pointer"
                >
                  Reverse UPI Payment Scam
                </button>
                <button
                  onClick={() => applyQRPreset('quishing')}
                  className="px-2.5 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] rounded-lg text-[9px] font-mono hover:bg-[#F59E0B]/20 cursor-pointer"
                >
                  Quishing Phishing Link
                </button>
                <button
                  onClick={() => applyQRPreset('safe')}
                  className="px-2.5 py-1 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded-lg text-[9px] font-mono hover:bg-[#22C55E]/20 cursor-pointer"
                >
                  Safe Merchant Payment QR
                </button>
              </div>

              <button
                onClick={runQRInvestigation}
                disabled={loading || (!qrPayload && !qrImageB64)}
                className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-mono font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 active:scale-95 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Decoding & Scanning QR...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Run Deep QR Investigation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </AppCard>

      {/* Main Section: Incident Cases & Forensics Replay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Incident Directory */}
        <div className="lg:col-span-3 space-y-4">
          <AppCard className="p-4 flex flex-col h-[540px]">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 mb-3 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <FolderOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>INCIDENT DIRECTORY</span>
              </span>
              <span className="text-[9px] font-mono text-[#00E5FF]">{cases.length}</span>
            </span>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {cases.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-500 space-y-2">
                  <FolderOpen className="w-8 h-8 opacity-30 text-slate-400" />
                  <p className="text-xs font-mono">No Active Cases</p>
                  <p className="text-[9px] text-slate-600 leading-normal">
                    Launch a new investigation using the LinkedIn or QR Scam Detector above.
                  </p>
                </div>
              ) : (
                cases.map((c) => {
                  const isActive = selectedCase?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleCaseSelect(c)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                        isActive 
                          ? 'bg-[#1E293B] border-[#00E5FF]/40 shadow-md' 
                          : 'bg-[#0B1220] border-[#1E293B] hover:border-[#1E293B]/80'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#00E5FF]' : 'text-slate-300'}`}>
                          {c.id}
                        </span>
                        <AppBadge color={getStatusColor(c.risk)} className="scale-75 origin-right">
                          {c.risk}
                        </AppBadge>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate mb-1.5">{c.target}</div>
                      <div className="flex justify-between text-[8px] font-mono text-slate-500">
                        <span>TYPE: {c.targetType}</span>
                        <span>{c.timeCreated}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AppCard>
        </div>

        {/* Center Column: Replay Scrubber and Event Timeline */}
        <div className="lg:col-span-6 space-y-4">
          <AppCard className="p-5 flex flex-col justify-between h-[540px]">
            {selectedCase ? (
              <>
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  {/* Header Details */}
                  <div className="border-b border-[#1E293B] pb-3 text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">ACTIVE FORENSIC METADATA</span>
                        <h3 className="text-sm font-bold text-slate-200 mt-0.5 flex items-center space-x-2">
                          <span>{selectedCase.id}:</span>
                          <span className="text-[#00E5FF] font-mono text-xs truncate max-w-[280px]">
                            {selectedCase.target}
                          </span>
                        </h3>
                      </div>
                      <AppBadge color={getStatusColor(selectedCase.risk)}>
                        {selectedCase.risk} THREAT
                      </AppBadge>
                    </div>
                    
                    <p className="text-[10px] text-slate-300 mt-2 leading-relaxed font-sans bg-[#050811] p-2.5 rounded-xl border border-[#1E293B]/60">
                      {selectedCase.description}
                    </p>

                    {/* Risk Indicators */}
                    {selectedCase.riskIndicators.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {selectedCase.riskIndicators.map((ind, i) => (
                          <span key={i} className="text-[9px] font-mono bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] px-2 py-0.5 rounded-md flex items-center space-x-1">
                            <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                            <span>{ind}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Event timeline replay display */}
                  <div className="relative border-l border-[#1E293B] ml-4 pl-6 space-y-5 py-2 min-h-[220px]">
                    {selectedCase.timeline.map((step, idx) => {
                      const isPassed = currentStep >= idx;
                      const isActive = currentStep === idx;
                      return (
                        <motion.div 
                          key={idx}
                          className={`relative text-xs transition-opacity duration-300 ${
                            isPassed ? 'opacity-100' : 'opacity-25'
                          }`}
                        >
                          {/* Node Bullet */}
                          <span 
                            className={`absolute -left-[33px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold ${getStepIconColor(step.type, isPassed)}`}
                          >
                            {idx + 1}
                          </span>

                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className={`font-bold ${isActive ? 'text-[#00E5FF]' : 'text-slate-200'}`}>
                              {step.title}
                            </span>
                            <span className="text-slate-500">{step.timestamp}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1 font-mono tracking-tight leading-relaxed">{step.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Playback Controls & Scrubber */}
                <div className="border-t border-[#1E293B] pt-3 space-y-2.5 mt-2">
                  {/* Scrubber track */}
                  <div className="flex items-center space-x-3 text-[9px] font-mono text-slate-400">
                    <span>1</span>
                    <input 
                      type="range"
                      min="0"
                      max={selectedCase.timeline.length - 1}
                      value={currentStep}
                      onChange={(e) => {
                        setCurrentStep(Number(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="flex-1 accent-[#00E5FF] bg-[#050811] h-1 rounded-full cursor-pointer appearance-none border border-[#1E293B]"
                    />
                    <span>{selectedCase.timeline.length}</span>
                  </div>

                  {/* Controls bar */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {[1, 2, 5].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaySpeed(speed)}
                          className={`px-2 py-1 rounded font-mono text-[9px] border cursor-pointer ${
                            playSpeed === speed 
                              ? 'bg-[#00E5FF]/15 border-[#00E5FF]/30 text-[#00E5FF]' 
                              : 'bg-[#111827] border-[#1E293B] text-slate-500'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => {
                          setCurrentStep(prev => Math.max(0, prev - 1));
                          setIsPlaying(false);
                        }}
                        disabled={currentStep === 0}
                        className="p-2 rounded-xl bg-[#111827] border border-[#1E293B] hover:border-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-300" />
                      </button>
                      <button
                        onClick={() => {
                          if (currentStep === selectedCase.timeline.length - 1) {
                            setCurrentStep(0);
                            setIsPlaying(true);
                          } else {
                            setIsPlaying(prev => !prev);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-[#00E5FF] text-slate-900 hover:bg-[#00E5FF]/90 cursor-pointer"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-slate-900" />
                        ) : (
                          <Play className="w-4 h-4 fill-slate-900" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setCurrentStep(prev => Math.min(selectedCase.timeline.length - 1, prev + 1));
                          setIsPlaying(false);
                        }}
                        disabled={currentStep === selectedCase.timeline.length - 1}
                        className="p-2 rounded-xl bg-[#111827] border border-[#1E293B] hover:border-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </button>
                    </div>

                    <span className="text-[9px] font-mono text-slate-500">
                      STEP {currentStep + 1} OF {selectedCase.timeline.length}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-6 text-slate-500">
                <Search className="w-10 h-10 text-slate-600 opacity-40" />
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                  No Active Case Selected
                </h4>
                <p className="text-[10px] text-slate-400 max-w-sm leading-normal">
                  Use the top launchpad form to enter a LinkedIn profile link or QR code payload and click "Run Deep Investigation".
                </p>
              </div>
            )}
          </AppCard>
        </div>

        {/* Right Column: Evidence Locker Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <AppCard className="p-4 flex flex-col h-[540px]">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 mb-3 flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>EVIDENCE LOCKER</span>
            </span>

            {selectedCase ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-left">
                  {selectedCase.evidence.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0B1220] border border-[#1E293B] p-3 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="bg-[#111827] p-2 rounded-lg border border-[#1E293B]">
                          {file.type === 'LOG' && <FileText className="w-4 h-4 text-[#00E5FF]" />}
                          {file.type === 'SCREENSHOT' && <Camera className="w-4 h-4 text-[#6366F1]" />}
                          {file.type === 'TRANSCRIPT' && <PhoneCall className="w-4 h-4 text-[#F59E0B]" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-mono text-slate-300 truncate font-semibold">
                            {file.name}
                          </h4>
                          <span className="text-[8px] font-mono text-slate-500 block uppercase">{file.size} • {file.type}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-[#00E5FF]" />
                    </div>
                  ))}
                </div>
                
                <div className="bg-[#050811] p-3 rounded-xl border border-[#1E293B]/60 text-[9px] font-mono text-slate-500 mt-3 leading-normal text-left">
                  <Info className="w-3.5 h-3.5 text-[#00E5FF] mb-1" />
                  <span>All evidence items are cryptographically signed with SHA-256 hashes to maintain court-admissible integrity chains.</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-500 space-y-2">
                <Database className="w-8 h-8 opacity-30 text-slate-400" />
                <p className="text-xs font-mono">Evidence Empty</p>
                <p className="text-[9px] text-slate-600 leading-normal">
                  Evidence files will be generated once an investigation is executed.
                </p>
              </div>
            )}
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPage;
