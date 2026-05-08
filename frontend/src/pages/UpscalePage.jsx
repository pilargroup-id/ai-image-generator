import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  Paper,
  IconButton,
  Modal,
  Fade,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ImageIcon from "@mui/icons-material/Image";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HdIcon from "@mui/icons-material/Hd";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import api from "../api/client";

/* ─── Google Fonts ─── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    @keyframes orbDrift0 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-18px) scale(1.04)} }
    @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.03)} }
    @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(16px,18px) scale(1.05)} }
    @keyframes gridPulse { 0%,100%{opacity:0.45} 50%{opacity:0.7} }
    @keyframes fadeR { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
    @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes pulseRing {
      0%,100%{ box-shadow:0 0 0 0 rgba(35,57,113,0.18); }
      50%     { box-shadow:0 0 0 8px rgba(35,57,113,0.0); }
    }
  `}</style>
);

function CardBg({ variant = "left" }) {
  const isLeft = variant === "left";
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "inherit" }}>
      <Box sx={{ position: "absolute", inset: 0, background: isLeft ? "linear-gradient(145deg,#e8edf8 0%,#f0f4fb 30%,#e6edf9 60%,#eaf0fb 100%)" : "linear-gradient(145deg,#eaf0fb 0%,#e6edf9 30%,#f0f4fb 60%,#e8edf8 100%)" }} />
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(35,57,113,0.18) 1px,transparent 1px)", backgroundSize: "28px 28px", animation: "gridPulse 6s ease-in-out infinite" }} />
      <Box sx={{ position: "absolute", top: isLeft ? "-20%" : "60%", left: isLeft ? "-10%" : "55%", width: 280, height: 280, borderRadius: "50%", background: isLeft ? "radial-gradient(circle,rgba(35,57,113,0.13) 0%,transparent 70%)" : "radial-gradient(circle,rgba(35,57,113,0.12) 0%,transparent 70%)", animation: "orbDrift0 14s ease-in-out infinite" }} />
      <Box sx={{ position: "absolute", top: isLeft ? "50%" : "-15%", right: isLeft ? "-8%" : "-10%", width: 240, height: 240, borderRadius: "50%", background: isLeft ? "radial-gradient(circle,rgba(55,80,145,0.10) 0%,transparent 70%)" : "radial-gradient(circle,rgba(35,57,113,0.11) 0%,transparent 70%)", animation: "orbDrift1 18s ease-in-out infinite 2s" }} />
      <Box sx={{ position: "absolute", bottom: isLeft ? "-10%" : "10%", left: isLeft ? "40%" : "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(35,57,113,0.09) 0%,transparent 70%)", animation: "orbDrift2 22s ease-in-out infinite 4s" }} />
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(35,57,113,0.35),transparent)" }} />
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(35,57,113,0.22),transparent)" }} />
    </Box>
  );
}

function CardBadgeIcon({ icon, gradient, glow }) {
  return (
    <Box sx={{ position: "absolute", top: -22, right: 28, width: 54, height: 54, borderRadius: "17px", background: gradient, boxShadow: `0 10px 28px ${glow},0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.35)`, display: "flex", alignItems: "center", justifyContent: "center", border: "2.5px solid rgba(255,255,255,0.55)", zIndex: 10, "& svg": { fontSize: 24, color: "#fff", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" }, transition: "transform 0.3s ease,box-shadow 0.3s ease", "&:hover": { transform: "translateY(-5px) rotate(8deg)", boxShadow: `0 18px 36px ${glow},0 4px 12px rgba(0,0,0,0.2)` } }}>
      {icon}
    </Box>
  );
}

function Lightbox({ open, src, onClose, onDownload }) {
  if (!src) return null;
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2, zIndex: 9999 }} BackdropProps={{ sx: { background: "rgba(2,6,23,0.88)", backdropFilter: "blur(12px)" } }}>
      <Fade in={open}>
        <Box sx={{ position: "relative", maxWidth: "92vw", maxHeight: "92vh", outline: "none" }}>
          <IconButton onClick={onClose} sx={{ position: "absolute", top: -16, right: -16, zIndex: 1, width: 36, height: 36, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", "&:hover": { background: "rgba(255,255,255,0.22)" } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box component="img" src={src} alt="Preview" sx={{ display: "block", maxWidth: "88vw", maxHeight: "84vh", objectFit: "contain", borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, borderRadius: "0 0 20px 20px", background: "linear-gradient(to top,rgba(2,6,23,0.72),transparent)", p: "20px 16px 14px", display: "flex", justifyContent: "center" }}>
            <Button size="small" variant="contained" startIcon={<DownloadIcon />} onClick={onDownload} sx={{ borderRadius: "999px", px: 2.5, py: 0.8, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.8rem", textTransform: "none", background: "linear-gradient(135deg,#233971,#2e4fa3)", boxShadow: "0 6px 18px rgba(35,57,113,0.4)", "&:hover": { background: "linear-gradient(135deg,#1a2d5a,#233971)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
              Download
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

function DimBadge({ w, h, label, color = "#233971" }) {
  if (!w || !h) return null;
  return (
    <Chip
      size="small"
      label={`${label} · ${w}×${h}px`}
      sx={{
        fontFamily: "'Sora',sans-serif",
        fontWeight: 700,
        fontSize: "0.68rem",
        borderRadius: "999px",
        background: `${color}14`,
        color,
        border: `1px solid ${color}30`,
        height: 22,
      }}
    />
  );
}

export default function UpscalePage() {
  const fileInputRef = useRef(null);

  const [file, setFile]           = useState(null);
  const [scale, setScale]         = useState("2x");
  const [loading, setLoading]     = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [resultMeta, setResultMeta] = useState(null);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc]   = useState("");
  const [hoverBefore, setHoverBefore]   = useState(false);
  const [hoverAfter, setHoverAfter]     = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => { return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }; }, [previewUrl]);

  const [origDim, setOrigDim] = useState(null);
  useEffect(() => {
    if (!previewUrl) { setOrigDim(null); return; }
    const img = new Image();
    img.onload = () => setOrigDim({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = previewUrl;
  }, [previewUrl]);

  const openLightbox = (src) => { setLightboxSrc(src); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);

  const prepareFile = (incoming) => {
    const f = Array.from(incoming || [])[0];
    if (!f) return;
    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)) {
      setError("File harus berupa PNG, JPG, JPEG, atau WEBP.");
      return;
    }
    setFile(f);
    setResultUrl("");
    setResultMeta(null);
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e) => prepareFile(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); setDragActive(false); prepareFile(e.dataTransfer.files); };

  const getAppOrigin = () => (typeof window !== "undefined" && window.location?.origin) ? window.location.origin : "";
  const normalizeUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const origin = getAppOrigin();
    return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
  };

  const handleSubmit = async () => {
    if (!file) { setError("Silakan upload gambar terlebih dahulu."); return; }
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setResultUrl("");
      setResultMeta(null);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("scale", scale);

      const res = await api.post("/image/upscale", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const data = res?.data;
      const url = normalizeUrl(data?.image_url || data?.api_image_url || (data?.filename ? `/image/${data.filename}` : ""));

      if (!url) throw new Error("URL gambar tidak ditemukan.");

      setResultUrl(url);
      setResultMeta({
        width: data.width,
        height: data.height,
        scale: data.scale || scale,
        method: data.method || "lanczos",
      });

      // Save to gallery
      try {
        const old = JSON.parse(localStorage.getItem("generated_images_gallery") || "[]");
        localStorage.setItem("generated_images_gallery", JSON.stringify([{
          id: Date.now() + Math.floor(Math.random() * 10000),
          imageUrl: url,
          prompt: `Upscale ${scale}`,
          fileName: file.name,
          createdAt: new Date().toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        }, ...old]));
      } catch (_) {}

      setSuccess(`Gambar berhasil diupscale ${scale}.`);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, name) => {
    if (!url) return;
    try {
      const blob = await (await fetch(url)).blob();
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: name || `upscaled-${Date.now()}.png` });
      document.body.appendChild(a); a.click(); a.remove();
    } catch { setError("Gagal download gambar."); }
  };

  const handleClearAll = () => {
    setFile(null); setScale("2x"); setLoading(false); setResultUrl(""); setResultMeta(null);
    setError(""); setSuccess(""); setDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const F = { fontFamily: "'Sora',sans-serif" };
  const cardShell = {
    borderRadius: "24px",
    border: "1px solid rgba(35,57,113,0.18)",
    background: "transparent",
    backdropFilter: "blur(2px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05),0 16px 40px -8px rgba(35,57,113,0.13),inset 0 1px 0 rgba(255,255,255,0.9)",
    overflow: "hidden",
    position: "relative",
    transition: "box-shadow 0.3s ease,border-color 0.3s ease",
    "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.07),0 24px 52px -8px rgba(35,57,113,0.18),inset 0 1px 0 rgba(255,255,255,0.95)", borderColor: "rgba(35,57,113,0.35)" },
  };

  return (
    <Box sx={{ position: "relative", ...F }}>
      <FontStyle />
      <Lightbox open={lightboxOpen} src={lightboxSrc} onClose={closeLightbox} onDownload={() => handleDownload(lightboxSrc, `upscaled-preview-${Date.now()}.png`)} />

      <Stack spacing={4}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="stretch">

          {/* ══ LEFT CARD — Input ══ */}
          <Card elevation={0} sx={{ ...cardShell, flex: 1.05 }}>
            <CardBg variant="left" />
            <Box sx={{ position: "absolute", bottom: 0, left: 0, width: 130, height: 130, borderRadius: "0 28px 0 24px", background: "linear-gradient(135deg,rgba(35,57,113,0.10) 0%,rgba(46,79,163,0.14) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <LayersRoundedIcon sx={{ fontSize: 48, color: "#233971", opacity: 0.35, transform: "rotate(-8deg)" }} />
            </Box>
            <Box sx={{ position: "absolute", top: 0, right: 0, width: 160, height: 160, borderRadius: "0 24px 0 40px", background: "linear-gradient(135deg,rgba(35,57,113,0.08) 0%,rgba(46,79,163,0.12) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <ZoomOutMapIcon sx={{ fontSize: 72, color: "#233971", opacity: 0.16, transform: "rotate(-12deg)" }} />
            </Box>

            <CardBadgeIcon icon={<HdIcon />} gradient="linear-gradient(135deg,#233971 0%,#2e4fa3 60%,#5b7ec7 100%)" glow="rgba(35,57,113,0.45)" />

            <CardContent sx={{ p: { xs: 3, md: "36px 36px" }, position: "relative", zIndex: 2 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ ...F, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    Upscale Image
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.82rem", color: "#64748b", mt: "2px" }}>
                    Tingkatkan resolusi & kejernihan gambar dengan AI
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* Upload area */}
                <Box>
                  <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b", mb: 1.2 }}>
                    Upload Gambar
                  </Typography>
                  <Paper
                    variant="outlined"
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                    onDrop={handleDrop}
                    sx={{
                      p: 2.5,
                      borderRadius: "18px",
                      borderStyle: "dashed",
                      borderWidth: 2,
                      borderColor: dragActive ? "#233971" : "rgba(35,57,113,0.3)",
                      background: dragActive ? "rgba(35,57,113,0.06)" : "rgba(255,255,255,0.55)",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <Stack spacing={1.5} alignItems="center">
                      <Box sx={{ width: 54, height: 54, borderRadius: "16px", background: dragActive ? "linear-gradient(135deg,#233971,#2e4fa3)" : "linear-gradient(135deg,rgba(35,57,113,0.12),rgba(46,79,163,0.18))", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: dragActive ? "0 8px 20px rgba(35,57,113,0.35)" : "none" }}>
                        <CloudUploadIcon sx={{ fontSize: 26, color: dragActive ? "#fff" : "#233971", transition: "color 0.25s" }} />
                      </Box>
                      <Box textAlign="center">
                        <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.9rem", color: "#1e293b" }}>Upload gambar untuk diupscale</Typography>
                        <Typography sx={{ ...F, fontSize: "0.78rem", color: "#94a3b8" }}>Drag & drop atau klik · PNG · JPG · WEBP</Typography>
                      </Box>
                      <Button variant="contained" component="label" size="medium" startIcon={<CloudUploadIcon />}
                        sx={{ ...F, borderRadius: "999px", px: 2.5, py: 0.9, textTransform: "none", fontWeight: 700, fontSize: "0.85rem", background: "linear-gradient(135deg,#233971,#2e4fa3)", boxShadow: "0 6px 18px rgba(35,57,113,0.32)", "&:hover": { background: "linear-gradient(135deg,#1a2d5a,#233971)", transform: "translateY(-1px)" }, transition: "all 0.2s ease" }}>
                        Pilih Gambar
                        <input ref={fileInputRef} hidden type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleFileChange} />
                      </Button>
                      {file && (
                        <Alert severity="info" sx={{ width: "100%", borderRadius: "12px", ...F, fontSize: "0.82rem", background: "rgba(35,57,113,0.08)", border: "1px solid rgba(35,57,113,0.18)", color: "#233971", "& .MuiAlert-icon": { color: "#233971" } }}>
                          <strong>{file.name}</strong>
                          {origDim && <span style={{ color: "#4a6aa0", fontWeight: 600 }}> · {origDim.w}×{origDim.h}px</span>}
                        </Alert>
                      )}
                    </Stack>
                  </Paper>
                </Box>

                {/* Scale selector */}
                <Box>
                  <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b", mb: 1.2 }}>
                    Pilih Skala Upscale
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    {[
                      { val: "2x", title: "2× Upscale", desc: "Resolusi ×2", hint: origDim ? `→ ${origDim.w * 2}×${origDim.h * 2}px` : "Lebih cepat" },
                      { val: "4x", title: "4× Upscale", desc: "Resolusi ×4", hint: origDim ? `→ ${Math.min(origDim.w * 4, 3840)}×${Math.min(origDim.h * 4, 3840)}px` : "Lebih detail" },
                    ].map(({ val, title, desc, hint }) => {
                      const active = scale === val;
                      return (
                        <Paper
                          key={val}
                          onClick={() => setScale(val)}
                          variant="outlined"
                          sx={{
                            flex: 1,
                            p: "14px 16px",
                            borderRadius: "16px",
                            cursor: "pointer",
                            border: active ? "2px solid #233971" : "1.5px solid rgba(35,57,113,0.2)",
                            background: active ? "rgba(35,57,113,0.07)" : "rgba(255,255,255,0.7)",
                            transition: "all 0.18s ease",
                            "&:hover": { borderColor: "#233971", background: "rgba(35,57,113,0.05)", transform: "translateY(-1px)" },
                            boxShadow: active ? "0 4px 16px rgba(35,57,113,0.15)" : "none",
                          }}
                        >
                          <Stack spacing={0.4}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ width: 28, height: 28, borderRadius: "9px", background: active ? "linear-gradient(135deg,#233971,#2e4fa3)" : "rgba(35,57,113,0.10)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
                                <HdIcon sx={{ fontSize: 15, color: active ? "#fff" : "#233971" }} />
                              </Box>
                              <Typography sx={{ ...F, fontWeight: 800, fontSize: "0.88rem", color: active ? "#233971" : "#1e293b" }}>
                                {title}
                              </Typography>
                            </Stack>
                            <Typography sx={{ ...F, fontSize: "0.72rem", color: active ? "#2e4fa3" : "#64748b", fontWeight: 600 }}>
                              {desc}
                            </Typography>
                            <Typography sx={{ ...F, fontSize: "0.70rem", color: active ? "#4a6aa0" : "#94a3b8" }}>
                              {hint}
                            </Typography>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Info box */}
                <Paper variant="outlined" sx={{ p: "12px 16px", borderRadius: "14px", background: "rgba(35,57,113,0.04)", border: "1px solid rgba(35,57,113,0.14)" }}>
                  <Stack direction="row" spacing={1.2} alignItems="flex-start">
                    <Box sx={{ width: 30, height: 30, borderRadius: "9px", background: "linear-gradient(135deg,#233971,#2e4fa3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: "1px" }}>
                      <AutoAwesomeIcon sx={{ fontSize: 15, color: "#fff" }} />
                    </Box>
                    <Box>
                      <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", color: "#1a2d5a", mb: "3px" }}>
                        High-Quality Upscaling
                      </Typography>
                      <Typography sx={{ ...F, fontSize: "0.74rem", color: "#64748b", lineHeight: 1.65 }}>
                        Multi-step Lanczos upscaling dengan UnsharpMask + sharpening otomatis di setiap tahap. Proses lokal, cepat, tidak pakai API. Resolusi maksimal 3840px.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Actions */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ZoomOutMapIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      flex: 1,
                      borderRadius: "999px",
                      py: 1.4,
                      textTransform: "none",
                      ...F,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      background: "linear-gradient(135deg,#233971,#2e4fa3)",
                      boxShadow: "0 8px 22px rgba(35,57,113,0.32)",
                      "&:hover": { background: "linear-gradient(135deg,#1a2d5a,#233971)", boxShadow: "0 12px 30px rgba(35,57,113,0.42)", transform: "translateY(-2px)" },
                      "&:disabled": { background: "rgba(148,163,184,0.28)", boxShadow: "none" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    {loading ? "Processing…" : `Upscale ${scale}`}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<RestartAltIcon />}
                    onClick={handleClearAll}
                    disabled={loading}
                    sx={{ borderRadius: "999px", py: 1.4, px: 2.5, textTransform: "none", ...F, fontWeight: 700, fontSize: "0.9rem", borderColor: "rgba(35,57,113,0.25)", color: "#64748b", background: "rgba(255,255,255,0.5)", "&:hover": { borderColor: "rgba(35,57,113,0.4)", background: "rgba(35,57,113,0.05)", color: "#233971", transform: "translateY(-1px)" }, transition: "all 0.2s ease" }}
                  >
                    Reset
                  </Button>
                </Stack>

                {loading && (
                  <Box>
                    <LinearProgress sx={{ height: 5, borderRadius: "999px", background: "rgba(35,57,113,0.1)", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#233971,#2e4fa3,#5b7ec7)" } }} />
                    <Typography sx={{ ...F, fontSize: "0.78rem", color: "#233971", mt: 0.8, fontWeight: 500 }}>
                      Sedang memproses & upscaling gambar…
                    </Typography>
                  </Box>
                )}
                {error && (
                  <Alert severity="error" sx={{ borderRadius: "14px", ...F, fontSize: "0.82rem", border: "1px solid rgba(239,68,68,0.18)", background: "rgba(254,242,242,0.9)" }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ borderRadius: "14px", ...F, fontSize: "0.82rem", border: "1px solid rgba(35,57,113,0.18)", background: "rgba(232,237,248,0.9)" }}>
                    {success}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* ══ RIGHT CARD — Preview ══ */}
          <Card elevation={0} sx={{ ...cardShell, flex: 1 }}>
            <CardBg variant="right" />
            <Box sx={{ position: "absolute", bottom: 0, left: 0, width: 130, height: 130, borderRadius: "0 28px 0 24px", background: "linear-gradient(135deg,rgba(35,57,113,0.10) 0%,rgba(26,82,118,0.14) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <DownloadIcon sx={{ fontSize: 48, color: "#233971", opacity: 0.35, transform: "rotate(-8deg)" }} />
            </Box>
            <Box sx={{ position: "absolute", top: 0, right: 0, width: 160, height: 160, borderRadius: "0 24px 0 40px", background: "linear-gradient(135deg,rgba(35,57,113,0.08) 0%,rgba(46,79,163,0.12) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <CollectionsRoundedIcon sx={{ fontSize: 72, color: "#233971", opacity: 0.16, transform: "rotate(-10deg)" }} />
            </Box>
            <CardBadgeIcon icon={<ImageIcon />} gradient="linear-gradient(135deg,#233971 0%,#2e4fa3 60%,#5b7ec7 100%)" glow="rgba(35,57,113,0.45)" />

            <CardContent sx={{ p: { xs: 3, md: "36px 36px" }, position: "relative", zIndex: 2 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ ...F, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    Before &amp; After
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.82rem", color: "#64748b", mt: "2px" }}>
                    Bandingkan gambar asli vs hasil upscale — klik untuk preview penuh
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* Before */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>Before</Typography>
                    <Stack direction="row" spacing={0.8}>
                      <DimBadge w={origDim?.w} h={origDim?.h} label="Original" color="#233971" />
                      <Chip size="small" label={file ? "Loaded" : "No File"} sx={{ ...F, fontWeight: 600, fontSize: "0.72rem", borderRadius: "999px", background: file ? "rgba(35,57,113,0.09)" : "rgba(148,163,184,0.09)", color: file ? "#233971" : "#94a3b8", border: `1px solid ${file ? "rgba(35,57,113,0.25)" : "rgba(148,163,184,0.22)"}` }} />
                    </Stack>
                  </Stack>
                  <Paper
                    variant="outlined"
                    onMouseEnter={() => setHoverBefore(true)}
                    onMouseLeave={() => setHoverBefore(false)}
                    onWheel={(e) => e.preventDefault()}
                    onClick={() => previewUrl && openLightbox(previewUrl)}
                    sx={{ minHeight: 220, borderRadius: "18px", overflow: "hidden", background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(35,57,113,0.18)", display: "flex", alignItems: "center", justifyContent: "center", p: 2, cursor: previewUrl ? "zoom-in" : "default", position: "relative", transition: "border-color 0.2s", "&:hover": previewUrl ? { borderColor: "rgba(35,57,113,0.3)" } : {} }}
                  >
                    {previewUrl ? (
                      <>
                        <Box component="img" src={previewUrl} alt="Before" sx={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain", borderRadius: "12px", boxShadow: "0 8px 22px rgba(0,0,0,0.07)", transition: "transform 0.3s ease", ...(hoverBefore && { transform: "scale(1.012)" }) }} />
                        <Box sx={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "10px", background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", opacity: hoverBefore ? 1 : 0, transition: "opacity 0.2s" }}>
                          <ZoomInIcon sx={{ fontSize: 16, color: "#fff" }} />
                        </Box>
                      </>
                    ) : (
                      <Stack spacing={1} alignItems="center">
                        <Box sx={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(35,57,113,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ImageIcon sx={{ fontSize: 24, color: "#7a9bd4" }} />
                        </Box>
                        <Typography sx={{ ...F, fontSize: "0.82rem", color: "#94a3b8", fontWeight: 500 }}>
                          Belum ada gambar upload
                        </Typography>
                      </Stack>
                    )}
                  </Paper>
                </Box>

                {/* After */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>After</Typography>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <DimBadge w={resultMeta?.width} h={resultMeta?.height} label={`Upscale ${resultMeta?.scale || scale}`} color="#2a4a9e" />
                      {resultMeta?.method === "edsr" && (
                        <Chip size="small" label="EDSR Neural" sx={{ ...F, fontWeight: 700, fontSize: "0.68rem", borderRadius: "999px", background: "linear-gradient(135deg,#233971,#2e4fa3)", color: "#fff", height: 22, border: "none" }} />
                      )}
<Chip size="small" label={loading ? "Processing…" : resultUrl ? "Done ✓" : "Waiting"} sx={{ ...F, fontWeight: 600, fontSize: "0.72rem", borderRadius: "999px", background: loading ? "rgba(245,158,11,0.09)" : resultUrl ? "rgba(35,57,113,0.09)" : "rgba(148,163,184,0.09)", color: loading ? "#f59e0b" : resultUrl ? "#233971" : "#94a3b8", border: `1px solid ${loading ? "rgba(245,158,11,0.25)" : resultUrl ? "rgba(35,57,113,0.25)" : "rgba(148,163,184,0.22)"}` }} />
                    </Stack>
                  </Stack>
                  <Paper
                    variant="outlined"
                    onMouseEnter={() => setHoverAfter(true)}
                    onMouseLeave={() => setHoverAfter(false)}
                    onWheel={(e) => e.preventDefault()}
                    onClick={() => resultUrl && openLightbox(resultUrl)}
                    sx={{ minHeight: 220, borderRadius: "18px", overflow: "hidden", background: resultUrl ? "linear-gradient(135deg,rgba(232,237,248,0.6),rgba(240,244,251,0.6))" : "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", border: `1px solid ${resultUrl ? "rgba(35,57,113,0.2)" : "rgba(35,57,113,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", p: 2, cursor: resultUrl ? "zoom-in" : "default", position: "relative", transition: "all 0.3s ease" }}
                  >
                    {resultUrl ? (
                      <>
                        <Box component="img" src={resultUrl} alt="After" sx={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain", borderRadius: "12px", boxShadow: "0 8px 22px rgba(0,0,0,0.07)", animation: "fadeR 0.5s ease", transition: "transform 0.3s ease", ...(hoverAfter && { transform: "scale(1.012)" }) }} />
                        <Box sx={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "10px", background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", opacity: hoverAfter ? 1 : 0, transition: "opacity 0.2s" }}>
                          <ZoomInIcon sx={{ fontSize: 16, color: "#fff" }} />
                        </Box>
                      </>
                    ) : (
                      <Stack spacing={1} alignItems="center">
                        {loading ? (
                          <>
                            <AutoAwesomeIcon sx={{ fontSize: 28, color: "#7a9bd4", animation: "spinSlow 2s linear infinite" }} />
                            <Typography sx={{ ...F, fontSize: "0.82rem", color: "#94a3b8", fontWeight: 500 }}>
                              AI sedang memproses…
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Box sx={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(35,57,113,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <AutoAwesomeIcon sx={{ fontSize: 24, color: "#7a9bd4" }} />
                            </Box>
                            <Typography sx={{ ...F, fontSize: "0.82rem", color: "#94a3b8", fontWeight: 500 }}>
                              Hasil upscale akan muncul di sini
                            </Typography>
                          </>
                        )}
                      </Stack>
                    )}
                  </Paper>
                </Box>

                {/* Download button */}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(resultUrl, `upscaled-${scale}-${file?.name || Date.now() + ".png"}`)}
                  disabled={!resultUrl}
                  fullWidth
                  sx={{
                    borderRadius: "999px",
                    py: 1.4,
                    textTransform: "none",
                    ...F,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    background: resultUrl ? "linear-gradient(135deg,#233971,#2e4fa3)" : "rgba(148,163,184,0.22)",
                    boxShadow: resultUrl ? "0 8px 22px rgba(35,57,113,0.32)" : "none",
                    "&:hover": resultUrl ? { background: "linear-gradient(135deg,#1a2d5a,#233971)", boxShadow: "0 12px 30px rgba(35,57,113,0.42)", transform: "translateY(-2px)" } : {},
                    "&:disabled": { background: "rgba(148,163,184,0.18)", color: "rgba(148,163,184,0.55)", boxShadow: "none" },
                    transition: "all 0.25s ease",
                  }}
                >
                  Download Hasil Upscale
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}
