import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  TextField,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  MenuItem,
  Modal,
  Fade,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PaletteIcon from "@mui/icons-material/Palette";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import ImageIcon from "@mui/icons-material/Image";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TuneIcon from "@mui/icons-material/Tune";
import BoltIcon from "@mui/icons-material/Bolt";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import HdIcon from "@mui/icons-material/Hd";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
// ── NEW: reference icon
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import api from "../api/client";
import framingGosave from "../assets/framming/Framing GOSAVE.png";
import framingBrand from "../assets/framming/Keperluan Brand Toko Online.png";

const FRAMES = [
  { key: "gosave",  label: "GOSAVE Border",   src: framingGosave },
  { key: "brand",   label: "Brand Toko Online", src: framingBrand },
];

/* ─── Google Fonts ─── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    @keyframes fbf { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
    @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes orbDrift0 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-18px) scale(1.04)} }
    @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.03)} }
    @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(16px,18px) scale(1.05)} }
    @keyframes gridPulse { 0%,100%{opacity:0.45} 50%{opacity:0.7} }
    @keyframes fadeR { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
    @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  `}</style>
);

/* ══════════════════════════════════════════════
   CARD BACKGROUND — gradient soft blue #233971
══════════════════════════════════════════════ */
function CardBg({ variant = "left" }) {
  const isLeft = variant === "left";
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "inherit" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: isLeft
            ? "linear-gradient(145deg, #e8edf8 0%, #f0f4fb 30%, #e6edf9 60%, #eaf0fb 100%)"
            : "linear-gradient(145deg, #eaf0fb 0%, #e6edf9 30%, #f0f4fb 60%, #e8edf8 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(35,57,113,0.18) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          animation: "gridPulse 6s ease-in-out infinite",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: isLeft ? "-20%" : "60%",
          left: isLeft ? "-10%" : "55%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: isLeft
            ? "radial-gradient(circle, rgba(35,57,113,0.13) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(35,57,113,0.12) 0%, transparent 70%)",
          animation: "orbDrift0 14s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: isLeft ? "50%" : "-15%",
          right: isLeft ? "-8%" : "-10%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: isLeft
            ? "radial-gradient(circle, rgba(55,80,145,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(35,57,113,0.11) 0%, transparent 70%)",
          animation: "orbDrift1 18s ease-in-out infinite 2s",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: isLeft ? "-10%" : "10%",
          left: isLeft ? "40%" : "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: isLeft
            ? "radial-gradient(circle, rgba(35,57,113,0.09) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(55,80,145,0.09) 0%, transparent 70%)",
          animation: "orbDrift2 22s ease-in-out infinite 4s",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(35,57,113,0.35), transparent)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(35,57,113,0.22), transparent)",
        }}
      />
    </Box>
  );
}

const PRESETS = [
  {
    key: "my-prompt",
    label: "My Prompt",
    icon: <CenterFocusStrongIcon />,
    group: "position",
    prompt:
      "Design a professional marketplace banner for an e-commerce product. The main product is (Product), placed on the left with a large, clean object, realistic lighting, and premium commercial style. Create a background relevant to the product, use a 1:1 image ratio for marketplace, no text whatsoever.",
  },
];

const GROUP_META = {
  color: { label: "Warna", color: "#233971", bg: "rgba(35,57,113,0.08)", border: "rgba(35,57,113,0.22)" },
  angle: { label: "Sudut", color: "#2a4a9e", bg: "rgba(42,74,158,0.08)", border: "rgba(42,74,158,0.22)" },
  position: { label: "Posisi", color: "#1a5276", bg: "rgba(26,82,118,0.08)", border: "rgba(26,82,118,0.22)" },
  bg: { label: "Background", color: "#1a3a6e", bg: "rgba(26,58,110,0.08)", border: "rgba(26,58,110,0.22)" },
  enhance: { label: "Enhance", color: "#2e5da6", bg: "rgba(46,93,166,0.08)", border: "rgba(46,93,166,0.22)" },
  safe: { label: "Safe", color: "#233971", bg: "rgba(35,57,113,0.08)", border: "rgba(35,57,113,0.22)" },
};

const ASPECT_RATIO_OPTIONS = [
  { value: "original", label: "Original" },
  { value: "1:1", label: "1:1" },
  { value: "4:5", label: "4:5" },
  { value: "3:4", label: "3:4" },
  { value: "9:16", label: "9:16" },
  { value: "16:9", label: "16:9" },
  { value: "3:2", label: "3:2" },
];

const RESOLUTION_OPTIONS = [
  { value: "original",  label: "Original" },
  { value: "hd",       label: "HD  (~720p)" },
  { value: "full-hd",  label: "Full HD  (~1080p)" },
  { value: "2k",       label: "2K  (~1440p)" },
  { value: "4k",       label: "4K  (~2160p)" },
];

// Maps resolution key → max long-edge pixels (preserves aspect ratio)
const RESOLUTION_MAX_PX = {
  "hd":      1280,
  "full-hd": 1920,
  "2k":      2560,
  "4k":      3840,
};

const BATCH_OPTIONS = [
  { value: 1, label: "1 Image" },
  { value: 2, label: "2 Images" },
  { value: 3, label: "3 Images" },
  { value: 4, label: "4 Images" },
];

function getAspectRatioValue(v) {
  const map = {
    "1:1": "1 / 1",
    "4:5": "4 / 5",
    "3:4": "3 / 4",
    "9:16": "9 / 16",
    "16:9": "16 / 9",
    "3:2": "3 / 2",
  };
  return map[v] || null;
}

/* ─── Lightbox modal ─── */
function Lightbox({ open, src, onClose, onDownload }) {
  if (!src) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2, zIndex: 9999 }}
      BackdropProps={{ sx: { background: "rgba(2,6,23,0.88)", backdropFilter: "blur(12px)" } }}
    >
      <Fade in={open}>
        <Box sx={{ position: "relative", maxWidth: "92vw", maxHeight: "92vh", outline: "none" }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: -16,
              right: -16,
              zIndex: 1,
              width: 36,
              height: 36,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              "&:hover": { background: "rgba(255,255,255,0.22)" },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box
            component="img"
            src={src}
            alt="Preview"
            sx={{
              display: "block",
              maxWidth: "88vw",
              maxHeight: "84vh",
              objectFit: "contain",
              borderRadius: "20px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: "0 0 20px 20px",
              background: "linear-gradient(to top,rgba(2,6,23,0.72),transparent)",
              p: "20px 16px 14px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              size="small"
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={onDownload}
              sx={{
                borderRadius: "999px",
                px: 2.5,
                py: 0.8,
                fontFamily: "'Sora',sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                textTransform: "none",
                background: "linear-gradient(135deg,#233971,#2e4fa3)",
                boxShadow: "0 6px 18px rgba(35,57,113,0.4)",
                "&:hover": { background: "linear-gradient(135deg,#1a2d5a,#233971)", transform: "translateY(-1px)" },
                transition: "all 0.2s",
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

/* ─── Preview image wrapper ─── */
function PreviewBox({ src, alt, aspectRatio, minHeight = 240, onPreview }) {
  const [hover, setHover] = useState(false);
  const ar = getAspectRatioValue(aspectRatio);
  return (
    <Paper
      variant="outlined"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onWheel={(e) => e.preventDefault()}
      sx={{
        minHeight,
        borderRadius: "18px",
        overflow: "hidden",
        background: src
          ? "linear-gradient(135deg,rgba(232,237,248,0.6),rgba(240,244,251,0.6))"
          : "linear-gradient(135deg,rgba(232,237,248,0.7),rgba(234,240,251,0.7))",
        border: `1px solid ${src ? "rgba(35,57,113,0.2)" : "rgba(35,57,113,0.15)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        cursor: src ? "zoom-in" : "default",
        transition: "all 0.3s ease",
      }}
    >
      {src ? (
        <>
          <Box
            sx={
              ar
                ? {
                    width: "100%",
                    maxWidth: 520,
                    aspectRatio: ar,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    margin: "0 auto",
                  }
                : {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
          >
            <Box
              component="img"
              src={src}
              alt={alt}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 8px 22px rgba(0,0,0,0.07)",
                animation: "fadeR 0.5s ease",
                "@keyframes fadeR": {
                  from: { opacity: 0, transform: "scale(0.97)" },
                  to: { opacity: 1, transform: "scale(1)" },
                },
                transition: "transform 0.3s ease",
                ...(hover && { transform: "scale(1.015)" }),
              }}
            />
          </Box>
          <Box
            onClick={onPreview}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              background: hover ? "rgba(15,23,42,0.28)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
              opacity: hover ? 1 : 0,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                transform: hover ? "scale(1)" : "scale(0.8)",
                transition: "transform 0.25s ease",
              }}
            >
              <ZoomInIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
          </Box>
        </>
      ) : (
        <Stack spacing={1} alignItems="center">
          <Box sx={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(35,57,113,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AutoAwesomeIcon sx={{ fontSize: 24, color: "#7a9bd4" }} />
          </Box>
          <Typography sx={{ fontFamily: "'Sora',sans-serif", fontSize: "0.82rem", color: "#94a3b8", fontWeight: 500 }}>
            AI result will appear here
          </Typography>
        </Stack>
      )}
    </Paper>
  );
}

/* ─── Batch result card ─── */
function BatchCard({ item, index, aspectRatio, onPreview, onDownload, F }) {
  const [hover, setHover] = useState(false);
  const ar = getAspectRatioValue(aspectRatio);
  return (
    <Paper
      variant="outlined"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        p: 1,
        width: { xs: "100%", sm: "calc(50% - 6px)" },
        borderRadius: "16px",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(35,57,113,0.18)",
        transition: "box-shadow 0.2s, transform 0.2s",
        ...(hover && { boxShadow: "0 8px 24px rgba(35,57,113,0.14)", transform: "translateY(-2px)" }),
      }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
            background: "linear-gradient(135deg,rgba(232,237,248,0.9),rgba(234,240,251,0.9))",
            aspectRatio: ar || undefined,
            minHeight: ar ? "auto" : 140,
            cursor: "zoom-in",
          }}
          onClick={onPreview}
          onWheel={(e) => e.preventDefault()}
        >
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.fileName}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.3s ease",
              ...(hover && { transform: "scale(1.04)" }),
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: hover ? "rgba(15,23,42,0.22)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s",
              opacity: hover ? 1 : 0,
            }}
          >
            <ZoomInMapIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
        </Box>
        <Typography
          sx={{
            ...F,
            fontWeight: 700,
            fontSize: "0.74rem",
            color: "#334155",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {index + 1}. {item.fileName}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            ...F,
            fontWeight: 700,
            borderColor: "rgba(35,57,113,0.25)",
            color: "#233971",
            "&:hover": { borderColor: "rgba(35,57,113,0.45)", background: "rgba(35,57,113,0.06)" },
          }}
        >
          Download
        </Button>
      </Stack>
    </Paper>
  );
}

/* ─── CardBadgeIcon ─── */
function CardBadgeIcon({ icon, gradient, glow }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: -22,
        right: 28,
        width: 54,
        height: 54,
        borderRadius: "17px",
        background: gradient,
        boxShadow: `0 10px 28px ${glow}, 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.35)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2.5px solid rgba(255,255,255,0.55)",
        zIndex: 10,
        "& svg": { fontSize: 24, color: "#fff", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" },
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": { transform: "translateY(-5px) rotate(8deg)", boxShadow: `0 18px 36px ${glow}, 0 4px 12px rgba(0,0,0,0.2)` },
      }}
    >
      {icon}
    </Box>
  );
}

/* ══════════════════════════════════════════════
   NEW ── Reference Image Upload Section
══════════════════════════════════════════════ */
function ReferenceImageSection({ refPreviews, onAdd, onRemove, onPreview, dragActiveRef, onDragOver, onDragLeave, onDrop, inputRef, F }) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AddPhotoAlternateIcon sx={{ fontSize: 16, color: "#2a4a9e" }} />
          <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>
            Reference Images
          </Typography>
          <Chip
            size="small"
            label="Optional"
            sx={{
              ...F,
              fontWeight: 600,
              fontSize: "0.68rem",
              borderRadius: "999px",
              height: 20,
              background: "rgba(42,74,158,0.08)",
              color: "#2a4a9e",
              border: "1px solid rgba(42,74,158,0.22)",
            }}
          />
        </Stack>
        <Typography sx={{ ...F, fontSize: "0.75rem", color: "#94a3b8" }}>
          Max 4 references
        </Typography>
      </Stack>

      <Paper
        variant="outlined"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        sx={{
          p: 2,
          borderRadius: "16px",
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: dragActiveRef ? "#2a4a9e" : "rgba(42,74,158,0.25)",
          background: dragActiveRef ? "rgba(42,74,158,0.06)" : "rgba(255,255,255,0.45)",
          backdropFilter: "blur(8px)",
          transition: "all 0.25s ease",
        }}
      >
        {refPreviews.length === 0 ? (
          <Stack spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: "14px",
                background: dragActiveRef
                  ? "linear-gradient(135deg,#2a4a9e,#3b5fc0)"
                  : "linear-gradient(135deg,rgba(42,74,158,0.12),rgba(59,95,192,0.18))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
                boxShadow: dragActiveRef ? "0 8px 20px rgba(42,74,158,0.35)" : "none",
              }}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 22, color: dragActiveRef ? "#fff" : "#2a4a9e", transition: "color 0.25s" }} />
            </Box>
            <Box textAlign="center">
              <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.85rem", color: "#1e293b" }}>
                Upload reference images (style, visual, mood)
              </Typography>
              <Typography sx={{ ...F, fontSize: "0.75rem", color: "#94a3b8" }}>
                Drag & drop or click · PNG · JPG · WEBP · Up to 4 images
              </Typography>
            </Box>
            <Button
              variant="outlined"
              component="label"
              size="small"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{
                ...F,
                borderRadius: "999px",
                px: 2,
                py: 0.7,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.8rem",
                borderColor: "rgba(42,74,158,0.35)",
                color: "#2a4a9e",
                background: "rgba(42,74,158,0.04)",
                "&:hover": {
                  borderColor: "rgba(42,74,158,0.55)",
                  background: "rgba(42,74,158,0.09)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Select Reference
              <input
                ref={inputRef}
                hidden
                multiple
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={onAdd}
              />
            </Button>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {refPreviews.map((item, idx) => (
                <Box
                  key={`ref-${item.file.name}-${idx}`}
                  sx={{
                    position: "relative",
                    width: 72,
                    height: 72,
                    borderRadius: "12px",
                    overflow: "visible",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={item.url}
                    alt={item.file.name}
                    onClick={() => onPreview(item.url)}
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "12px",
                      objectFit: "cover",
                      display: "block",
                      border: "1.5px solid rgba(42,74,158,0.28)",
                      boxShadow: "0 4px 12px rgba(42,74,158,0.12)",
                      cursor: "zoom-in",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": { transform: "scale(1.06)", boxShadow: "0 8px 20px rgba(42,74,158,0.22)" },
                    }}
                  />
                  {/* Label badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg,#2a4a9e,#3b5fc0)",
                      borderRadius: "999px",
                      px: 0.8,
                      py: "1px",
                      minWidth: 22,
                      textAlign: "center",
                      boxShadow: "0 2px 6px rgba(42,74,158,0.35)",
                      border: "1.5px solid #fff",
                      zIndex: 2,
                    }}
                  >
                    <Typography sx={{ fontFamily: "'Sora',sans-serif", fontSize: "0.6rem", fontWeight: 800, color: "#fff", lineHeight: 1.4 }}>
                      R{idx + 1}
                    </Typography>
                  </Box>
                  {/* Remove button */}
                  <IconButton
                    size="small"
                    onClick={() => onRemove(idx)}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 20,
                      height: 20,
                      background: "rgba(239,68,68,0.88)",
                      border: "1.5px solid #fff",
                      color: "#fff",
                      zIndex: 3,
                      "&:hover": { background: "rgba(220,38,38,0.95)" },
                      "& svg": { fontSize: "11px !important" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))}

              {/* Add more button if < 4 */}
              {refPreviews.length < 4 && (
                <Box
                  component="label"
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "12px",
                    border: "2px dashed rgba(42,74,158,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "rgba(42,74,158,0.04)",
                    flexShrink: 0,
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "rgba(42,74,158,0.55)", background: "rgba(42,74,158,0.09)", transform: "scale(1.04)" },
                  }}
                >
                  <Stack spacing={0.3} alignItems="center">
                    <AddPhotoAlternateIcon sx={{ fontSize: 18, color: "#2a4a9e" }} />
                    <Typography sx={{ fontFamily: "'Sora',sans-serif", fontSize: "0.6rem", fontWeight: 700, color: "#2a4a9e" }}>
                      + Add
                    </Typography>
                  </Stack>
                  <input
                    hidden
                    multiple
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={onAdd}
                  />
                </Box>
              )}
            </Stack>

            <Alert
              severity="info"
              sx={{
                borderRadius: "10px",
                ...F,
                fontSize: "0.78rem",
                background: "rgba(42,74,158,0.07)",
                border: "1px solid rgba(42,74,158,0.18)",
                color: "#2a4a9e",
                "& .MuiAlert-icon": { color: "#2a4a9e" },
                py: 0.5,
              }}
            >
              <strong>{refPreviews.length}</strong> reference image{refPreviews.length > 1 ? "s" : ""} active — will be included when generating
            </Alert>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

export default function ImageEditorPage() {
  const fileInputRef = useRef(null);
  // ── NEW: ref image input
  const refFileInputRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [fromGallery, setFromGallery] = useState(Boolean(location.state?.fromGalleryUrl));
  const fromGalleryInitName = location.state?.fromGalleryName || "";

  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [batchResults, setBatchResults] = useState([]);
  const [resultMeta, setResultMeta] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("original");
  const [resolution, setResolution] = useState("original");
  const [batchCount, setBatchCount] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");
  const [lightboxMeta, setLightboxMeta] = useState(null);

  // ── NEW: reference images state
  const [refFiles, setRefFiles] = useState([]);
  const [dragActiveRef, setDragActiveRef] = useState(false);

  // ── Frame size reference (auto-sets aspect ratio to match the frame dimensions)
  const [selectedFrame, setSelectedFrame] = useState(null);

  const openLightbox = (payload) => {
    if (typeof payload === "string") {
      setLightboxSrc(payload);
      setLightboxMeta(null);
    } else {
      setLightboxSrc(payload?.imageUrl || "");
      setLightboxMeta(payload || null);
    }
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxMeta(null);
  };

  const previewUrls = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files]);

  // ── NEW: ref preview urls
  const refPreviewUrls = useMemo(() => refFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [refFiles]);

  useEffect(() => {
    return () => previewUrls.forEach((i) => URL.revokeObjectURL(i.url));
  }, [previewUrls]);

  // ── NEW: cleanup ref URLs
  useEffect(() => {
    return () => refPreviewUrls.forEach((i) => URL.revokeObjectURL(i.url));
  }, [refPreviewUrls]);

  // Auto-load image + prompt when navigated from Gallery
  useEffect(() => {
    const { fromGalleryUrl, fromGalleryName, fromGalleryPrompt } = location.state || {};
    if (!fromGalleryUrl) return;
    // Clear the navigation state so refresh doesn't re-trigger
    navigate(location.pathname, { replace: true, state: {} });
    if (fromGalleryPrompt) setPrompt(fromGalleryPrompt);
    fetch(fromGalleryUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const name = fromGalleryName || "gallery-image.png";
        const ext  = name.split(".").pop() || "png";
        const mime = blob.type || `image/${ext}`;
        const file = new File([blob], name, { type: mime });
        setFiles([file]);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const primaryPreviewUrl = previewUrls[0]?.url || "";
  const isSingleSourceMode = files.length <= 1;
  const activePresetData = useMemo(() => PRESETS.find((i) => i.key === activePreset) || null, [activePreset]);

  const resultPromptTags = useMemo(() => {
    if (!activePresetData) return [];
    const relevantGroups = ["color", "angle"];
    if (!relevantGroups.includes(activePresetData.group)) return [];
    const meta = GROUP_META[activePresetData.group];
    return [{ label: activePresetData.label, color: meta.color, bg: meta.bg, border: meta.border }];
  }, [activePresetData]);

  const buildFinalPrompt = () => {
    const r = aspectRatio !== "original" ? ` Use aspect ratio ${aspectRatio}.` : "";
    const maxPx = RESOLUTION_MAX_PX[resolution];
    const res = maxPx
      ? ` Output at the highest quality possible, with the longest side at most ${maxPx}px. Do NOT change the aspect ratio — keep the original image proportions exactly.`
      : "";
    const ref = refFiles.length > 0
      ? ` Use the provided ${refFiles.length} reference image${refFiles.length > 1 ? "s" : ""} as visual/style reference.`
      : "";
    return `${prompt.trim()}${ref}${r}${res}`.trim();
  };

  const getAppOrigin = () => {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return "";
  };

  const normalizeUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;

    const origin = getAppOrigin();

    if (url.startsWith("/")) {
      return `${origin}${url}`;
    }

    return `${origin}/${url}`;
  };

  const extractImageResults = (data) => {
    if (!data) return [];

    if (Array.isArray(data?.images)) {
      return data
        .images
        .map((item, index) => {
          if (typeof item === "string") {
            return {
              id: `result-${index}-${Date.now()}`,
              imageUrl: normalizeUrl(item),
              downloadUrl: normalizeUrl(item),
              fileName: `generated-${index + 1}.png`,
              width: null,
              height: null,
            };
          }

          const rawUrl = item?.api_image_url || item?.image_url || item?.url || (item?.filename ? `/api/image/${item.filename}` : "");
          if (!rawUrl) return null;

          return {
            id: item?.filename || `result-${index}-${Date.now()}`,
            imageUrl: normalizeUrl(item?.image_url || item?.api_image_url || rawUrl),
            downloadUrl: normalizeUrl(rawUrl),
            fileName: item?.filename || `generated-${index + 1}.png`,
            width: item?.width ?? null,
            height: item?.height ?? null,
            requestedResolution: item?.requested_resolution || "original",
          };
        })
        .filter(Boolean);
    }

    const rawUrl = data?.api_image_url || data?.image_url || data?.url || (data?.filename ? `/api/image/${data.filename}` : "");
    if (!rawUrl) return [];

    return [{
      id: data?.filename || `result-${Date.now()}`,
      imageUrl: normalizeUrl(data?.image_url || data?.api_image_url || rawUrl),
      downloadUrl: normalizeUrl(rawUrl),
      fileName: data?.filename || `generated-${Date.now()}.png`,
      width: data?.width ?? null,
      height: data?.height ?? null,
      requestedResolution: data?.requested_resolution || "original",
    }];
  };

  const prepareFiles = (incoming) => {
    const valid = Array.from(incoming || []).filter((f) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)
    );

    if (!valid.length) {
      setError("File must be PNG, JPG, JPEG, or WEBP.");
      return;
    }

    if (valid.length > 4) {
      setError("Maximum 4 images allowed.");
      return;
    }

    setFiles(valid);
    setResultUrl("");
    setBatchResults([]);
    setResultMeta(null);
    setError("");
    setSuccess("");
    setBatchCount((prev) => (valid.length === 1 ? (prev > 4 ? 4 : prev || 1) : valid.length));
  };

  // ── NEW: prepare reference files
  const prepareRefFiles = (incoming) => {
    const valid = Array.from(incoming || []).filter((f) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)
    );

    if (!valid.length) {
      setError("Reference file must be PNG, JPG, JPEG, or WEBP.");
      return;
    }

    const combined = [...refFiles, ...valid].slice(0, 4);
    setRefFiles(combined);
    setError("");
  };

  // ── NEW: remove single ref file by index
  const removeRefFile = (idx) => {
    setRefFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e) => prepareFiles(e.target.files);

  // ── NEW: handle ref file input change
  const handleRefFileChange = (e) => {
    prepareRefFiles(e.target.files);
    // reset input so same file can be re-added if needed
    if (refFileInputRef.current) refFileInputRef.current.value = "";
  };

  const handlePresetClick = (key, p) => {
    setActivePreset(key);
    setPrompt(p);
  };

  const handleClearAll = () => {
    setFiles([]);
    setPrompt("");
    setLoading(false);
    setResultUrl("");
    setBatchResults([]);
    setResultMeta(null);
    setError("");
    setSuccess("");
    setCopied(false);
    setActivePreset("");
    setDragActive(false);
    setAspectRatio("original");
    setResolution("original");
    setBatchCount(1);
    // ── NEW: clear ref files
    setRefFiles([]);
    setDragActiveRef(false);
    setSelectedFrame(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (refFileInputRef.current) refFileInputRef.current.value = "";
  };

  const createResultItem = ({ imageUrl, downloadUrl, fileName, promptText, variantIndex, width = null, height = null, requestedResolution = "original" }) => ({
    id: `${Date.now()}-${fileName}-${variantIndex}-${Math.random()}`,
    imageUrl,
    downloadUrl: downloadUrl || imageUrl,
    fileName,
    prompt: promptText,
    variantIndex,
    width,
    height,
    requestedResolution,
  });

  const saveToGallery = ({ imageUrl, promptText, originalFile }) => {
    try {
      const old = JSON.parse(localStorage.getItem(" _images_gallery") || "[]");
      const item = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        imageUrl,
        prompt: promptText || "",
        fileName: originalFile?.name || `generated-${Date.now()}.png`,
        createdAt: new Date().toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      localStorage.setItem("generated_images_gallery", JSON.stringify([item, ...old]));
    } catch (e) {
      console.error("Failed to save to gallery:", e);
    }
  };

  // ── UPDATED: requestSingleEdit now appends ref files
  const requestSingleEdit = async ({ file, finalPrompt, requestedBatch }) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("prompt", finalPrompt);
    fd.append("batch_size", String(requestedBatch));
    fd.append("aspect_ratio", aspectRatio);
    // Send max long-edge px to backend (or "original" if not set)
    const maxPx = RESOLUTION_MAX_PX[resolution];
    fd.append("resolution", maxPx ? String(maxPx) : "original");

    // ── NEW: append each reference image
    refFiles.forEach((refFile, idx) => {
      fd.append(`reference_image_${idx}`, refFile);
    });
    // ── NEW: send count so backend knows how many
    if (refFiles.length > 0) {
      fd.append("reference_image_count", String(refFiles.length));
    }

    const res = await api.post("/image/edit", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return extractImageResults(res?.data);
  };

  const handleSubmit = async () => {
    if (!files.length) {
      setError("Please upload an image first.");
      return;
    }

    if (!prompt.trim()) {
      setError("Prompt is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setResultUrl("");
      setBatchResults([]);
      setResultMeta(null);

      const fp = buildFinalPrompt();
      const results = [];

      if (files.length === 1) {
        const src = files[0];
        let generatedItems = await requestSingleEdit({
          file: src,
          finalPrompt: fp,
          requestedBatch: batchCount,
        });

        if (!generatedItems.length) throw new Error("No image_url found in response.");

        if (generatedItems.length === 1 && batchCount > 1) {
          const fallbackItems = [generatedItems[0]];
          for (let i = 1; i < batchCount; i++) {
            const retry = await requestSingleEdit({
              file: src,
              finalPrompt: fp,
              requestedBatch: 1,
            });
            if (retry[0]) fallbackItems.push(retry[0]);
          }
          generatedItems = fallbackItems;
        }

        generatedItems.slice(0, batchCount).forEach((item, idx) => {
          results.push(
            createResultItem({
              imageUrl: item.imageUrl,
              downloadUrl: item.downloadUrl,
              fileName:
                item.fileName || (batchCount > 1
                  ? `${src.name.replace(/(\.[^.]+)$/u, "") || src.name}-varian-${idx + 1}.png`
                  : src.name),
              promptText: fp,
              variantIndex: idx + 1,
              width: item.width,
              height: item.height,
              requestedResolution: item.requestedResolution,
            })
          );
          saveToGallery({ imageUrl: item.imageUrl, promptText: fp, originalFile: src });
        });
      } else {
        for (const cf of files) {
          const generatedItems = await requestSingleEdit({
            file: cf,
            finalPrompt: fp,
            requestedBatch: 1,
          });

          if (!generatedItems.length) throw new Error(`No image_url found for file ${cf.name}.`);

          results.push(
            createResultItem({
              imageUrl: generatedItems[0].imageUrl,
              downloadUrl: generatedItems[0].downloadUrl,
              fileName: generatedItems[0].fileName || cf.name,
              promptText: fp,
              variantIndex: 1,
              width: generatedItems[0].width,
              height: generatedItems[0].height,
              requestedResolution: generatedItems[0].requestedResolution,
            })
          );
          saveToGallery({ imageUrl: generatedItems[0].imageUrl, promptText: fp, originalFile: cf });
        }
      }

      setBatchResults(results);
      setResultUrl(results[0]?.imageUrl || "");
      setResultMeta(results[0] || null);
      setSuccess(
        files.length === 1 && batchCount > 1
          ? `Successfully generated ${results.length} images.`
          : results.length > 1
          ? `Batch of ${results.length} images processed successfully.`
          : "Image processed successfully."
      );
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSingle = async (target, fallbackFilename = `edited-${Date.now()}.png`) => {
    const url = typeof target === "string" ? target : target?.downloadUrl || target?.imageUrl;
    const filename = typeof target === "string" ? fallbackFilename : target?.fileName || fallbackFilename;
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob),
        download: filename,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError("Failed to download result image.");
    }
  };

  const handleCopyPrompt = async () => {
    if (!prompt.trim()) return;
    try {
      await navigator.clipboard.writeText(buildFinalPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Failed to copy prompt.");
    }
  };

  const handleFrameSelect = (frame) => {
    if (selectedFrame?.key === frame.key) {
      setSelectedFrame(null);
      return;
    }
    setSelectedFrame(frame);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const ratio = w / h;
      const RATIO_MAP = [
        { label: "1:1",  value: 1 / 1 },
        { label: "4:5",  value: 4 / 5 },
        { label: "3:4",  value: 3 / 4 },
        { label: "9:16", value: 9 / 16 },
        { label: "16:9", value: 16 / 9 },
        { label: "3:2",  value: 3 / 2 },
        { label: "4:3",  value: 4 / 3 },
      ];
      const closest = RATIO_MAP.reduce((best, r) =>
        Math.abs(r.value - ratio) < Math.abs(best.value - ratio) ? r : best
      );
      setAspectRatio(closest.label);
    };
    img.src = frame.src;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    prepareFiles(e.dataTransfer.files);
  };

  // ── NEW: ref drag handlers
  const handleRefDragOver = (e) => { e.preventDefault(); setDragActiveRef(true); };
  const handleRefDragLeave = (e) => { e.preventDefault(); setDragActiveRef(false); };
  const handleRefDrop = (e) => {
    e.preventDefault();
    setDragActiveRef(false);
    prepareRefFiles(e.dataTransfer.files);
  };

  const F = { fontFamily: "'Sora',sans-serif" };

  const cardShell = {
    borderRadius: "24px",
    border: "1px solid rgba(35,57,113,0.18)",
    background: "#fff",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.05), 0 16px 40px -8px rgba(35,57,113,0.13), inset 0 1px 0 rgba(255,255,255,0.9)",
    overflow: "hidden",
    position: "relative",
    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
    "&:hover": {
      boxShadow:
        "0 2px 8px rgba(0,0,0,0.07), 0 24px 52px -8px rgba(35,57,113,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
      borderColor: "rgba(35,57,113,0.35)",
    },
  };

  const grouped = ["color", "angle", "position"].map((g) => ({
    group: g,
    meta: GROUP_META[g],
    items: PRESETS.filter((p) => p.group === g),
  })).filter((g) => g.items.length > 0);

  return (
    <Box sx={{ position: "relative", ...F }}>
      <FontStyle />

        <Lightbox
          open={lightboxOpen}
          src={lightboxSrc}
          onClose={closeLightbox}
          onDownload={() => handleDownloadSingle(lightboxMeta || resultMeta || lightboxSrc, `preview-${Date.now()}.png`)}
        />

      <Stack spacing={4}>

        {/* ── Back to Gallery banner (shown when user came from Gallery) ── */}
        {fromGallery && (
          <Box
            sx={{
              display:"flex", alignItems:{ xs:"flex-start", sm:"center" }, flexDirection:{ xs:"column", sm:"row" }, gap:1.5,
              px:2.5, py:1.6,
              borderRadius:"16px",
              background:"#fff",
              border:"1px solid rgba(35,57,113,0.18)",
              boxShadow:"0 2px 8px rgba(0,0,0,0.05), 0 8px 24px -4px rgba(35,57,113,0.10)",
              animation:"slideUp 0.3s ease",
            }}
          >
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flex:1, minWidth:0 }}>
              <Box sx={{ width:36, height:36, borderRadius:"11px", flexShrink:0, background:"rgba(35,57,113,0.08)", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(35,57,113,0.15)" }}>
                <PhotoLibraryRoundedIcon sx={{ fontSize:18, color:"#233971" }}/>
              </Box>
              <Box sx={{ minWidth:0 }}>
                <Typography sx={{ ...F, fontSize:"0.83rem", fontWeight:700, color:"#0f172a", lineHeight:1.3 }}>
                  Image &amp; prompt from Gallery loaded
                </Typography>
                {fromGalleryInitName && (
                  <Typography sx={{ ...F, fontSize:"0.71rem", color:"#64748b", mt:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:360 }}>
                    {fromGalleryInitName}
                  </Typography>
                )}
                <Typography sx={{ ...F, fontSize:"0.71rem", color:"#94a3b8", mt:"1px" }}>
                  Edit the prompt and click Generate to create a new version.
                </Typography>
              </Box>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon sx={{ fontSize:"16px !important" }}/>}
              onClick={()=>navigate("/")}
              sx={{
                fontFamily:"'Sora',sans-serif",
                textTransform:"none", fontWeight:700, fontSize:"0.80rem",
                borderRadius:"12px",
                color:"#233971",
                borderColor:"rgba(35,57,113,0.3)",
                background:"transparent",
                px:2, py:0.7, flexShrink:0,
                "&:hover":{ background:"rgba(35,57,113,0.05)", borderColor:"rgba(35,57,113,0.5)" },
              }}
            >
              Back to Gallery
            </Button>
          </Box>
        )}

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="stretch">
          <Card elevation={0} sx={{ ...cardShell, flex: 1.05 }}>

            <Box sx={{ position: "absolute", bottom: 0, left: 0, width: 130, height: 130, borderRadius: "0 28px 0 24px", background: "linear-gradient(135deg,rgba(35,57,113,0.10) 0%,rgba(46,79,163,0.14) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <LayersRoundedIcon sx={{ fontSize: 48, color: "#233971", opacity: 0.35, transform: "rotate(-8deg)" }} />
            </Box>
            <Box sx={{ position: "absolute", top: 0, right: 0, width: 160, height: 160, borderRadius: "0 24px 0 40px", background: "linear-gradient(135deg,rgba(35,57,113,0.08) 0%,rgba(46,79,163,0.12) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <AutoAwesomeIcon sx={{ fontSize: 72, color: "#233971", opacity: 0.16, transform: "rotate(-12deg)" }} />
            </Box>

            <CardBadgeIcon icon={<CloudUploadIcon />} gradient="linear-gradient(135deg,#233971 0%,#2e4fa3 60%,#5b7ec7 100%)" glow="rgba(35,57,113,0.45)" />
            <CardContent sx={{ p: { xs: 3, md: "36px 36px" }, position: "relative", zIndex: 2 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ ...F, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    Image Editor
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.82rem", color: "#64748b", mt: "2px" }}>
                    Upload image & enter prompt for AI editing
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                <Box>
                  <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b", mb: 1.2 }}>
                    Upload Image
                  </Typography>
                  <Paper
                    variant="outlined"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                    }}
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
                        <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.9rem", color: "#1e293b" }}>Upload image to start editing</Typography>
                        <Typography sx={{ ...F, fontSize: "0.78rem", color: "#94a3b8" }}>Drag & drop or click · PNG · JPG · WEBP · Max 4 images</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        component="label"
                        size="medium"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          ...F,
                          borderRadius: "999px",
                          px: 2.5,
                          py: 0.9,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          background: "linear-gradient(135deg,#233971,#2e4fa3)",
                          boxShadow: "0 6px 18px rgba(35,57,113,0.32)",
                          "&:hover": {
                            background: "linear-gradient(135deg,#1a2d5a,#233971)",
                            boxShadow: "0 10px 26px rgba(35,57,113,0.42)",
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        Select Image
                        <input
                          ref={fileInputRef}
                          hidden
                          multiple
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleFileChange}
                        />
                      </Button>
                      {!!files.length && (
                        <Alert
                          severity="info"
                          sx={{
                            width: "100%",
                            borderRadius: "12px",
                            ...F,
                            fontSize: "0.82rem",
                            background: "rgba(35,57,113,0.08)",
                            border: "1px solid rgba(35,57,113,0.18)",
                            color: "#233971",
                            "& .MuiAlert-icon": { color: "#233971" },
                          }}
                        >
                          <strong>{files.length}</strong> image{files.length === 1 ? "" : "s"} selected{files.length === 1 ? "" : " · multi upload active"}
                        </Alert>
                      )}
                    </Stack>
                  </Paper>
                </Box>

                {/* ── NEW: Reference Images Section ── */}
                <ReferenceImageSection
                  refFiles={refFiles}
                  refPreviews={refPreviewUrls}
                  onAdd={handleRefFileChange}
                  onRemove={removeRefFile}
                  onPreview={(url) => openLightbox(url)}
                  dragActiveRef={dragActiveRef}
                  onDragOver={handleRefDragOver}
                  onDragLeave={handleRefDragLeave}
                  onDrop={handleRefDrop}
                  inputRef={refFileInputRef}
                  F={F}
                />

                {/* ── Frame Size Reference ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <PhotoSizeSelectLargeIcon sx={{ fontSize: 15, color: "#233971" }} />
                      <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>
                        Frame Size Reference
                      </Typography>
                      <Chip size="small" label="Auto aspect ratio" sx={{ ...F, fontWeight: 600, fontSize: "0.65rem", borderRadius: "999px", height: 18, background: "rgba(35,57,113,0.07)", color: "#233971", border: "1px solid rgba(35,57,113,0.18)" }} />
                    </Stack>
                    {selectedFrame && (
                      <Button size="small" onClick={() => { setSelectedFrame(null); setAspectRatio("original"); }}
                        sx={{ ...F, fontSize: "0.72rem", textTransform: "none", color: "#94a3b8", minWidth: "auto", p: "2px 8px", borderRadius: "999px", "&:hover": { color: "#ef4444", background: "rgba(239,68,68,0.06)" } }}>
                        Reset
                      </Button>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    {FRAMES.map((frame) => {
                      const isActive = selectedFrame?.key === frame.key;
                      return (
                        <Box key={frame.key} onClick={() => handleFrameSelect(frame)}
                          sx={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                            cursor: "pointer", transition: "all 0.2s ease",
                          }}
                        >
                          <Box sx={{
                            position: "relative", width: 72, height: 72, borderRadius: "12px", overflow: "hidden",
                            border: isActive ? "2.5px solid #233971" : "1.5px solid rgba(35,57,113,0.22)",
                            background: "rgba(232,237,248,0.5)",
                            boxShadow: isActive ? "0 4px 14px rgba(35,57,113,0.28)" : "none",
                            transition: "all 0.2s ease",
                            "&:hover": { borderColor: "#233971", transform: "scale(1.05)", boxShadow: "0 4px 14px rgba(35,57,113,0.2)" },
                          }}>
                            <Box component="img" src={frame.src} alt={frame.label} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            {isActive && (
                              <Box sx={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#233971", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #fff" }}>
                                <Typography sx={{ fontSize: "0.6rem", color: "#fff", fontWeight: 800, lineHeight: 1 }}>✓</Typography>
                              </Box>
                            )}
                          </Box>
                          <Typography sx={{ ...F, fontSize: "0.7rem", fontWeight: isActive ? 700 : 500, color: isActive ? "#233971" : "#64748b", textAlign: "center", maxWidth: 72, lineHeight: 1.2 }}>
                            {frame.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                  {selectedFrame && (
                    <Alert severity="info" sx={{ mt: 1.5, borderRadius: "10px", ...F, fontSize: "0.78rem", background: "rgba(35,57,113,0.07)", border: "1px solid rgba(35,57,113,0.18)", color: "#233971", "& .MuiAlert-icon": { color: "#233971" }, py: 0.5 }}>
                      Aspect ratio auto-set to match <strong>{selectedFrame.label}</strong> frame dimensions
                    </Alert>
                  )}
                </Box>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  {[
                    {
                      label: "Batch Generate",
                      value: batchCount,
                      onChange: (e) => setBatchCount(Number(e.target.value)),
                      options: BATCH_OPTIONS,
                      icon: <LayersRoundedIcon sx={{ color: "#233971", mr: 1, fontSize: 18 }} />,
                      accentColor: "#233971",
                      helper: isSingleSourceMode ? "" : "In multi upload mode, each file produces 1 result",
                    },
                    {
                      label: "Aspect Ratio",
                      value: aspectRatio,
                      onChange: (e) => setAspectRatio(e.target.value),
                      options: ASPECT_RATIO_OPTIONS,
                      icon: <PhotoSizeSelectLargeIcon sx={{ color: "#2a4a9e", mr: 1, fontSize: 18 }} />,
                      accentColor: "#2a4a9e",
                    },
                    {
                      label: "Resolution",
                      value: resolution,
                      onChange: (e) => setResolution(e.target.value),
                      options: RESOLUTION_OPTIONS,
                      icon: <HdIcon sx={{ color: "#1a5276", mr: 1, fontSize: 18 }} />,
                      accentColor: "#1a5276",
                    },
                  ].map(({ label, value, onChange, options, icon, accentColor, helper }) => (
                    <TextField
                      key={label}
                      select
                      fullWidth
                      label={label}
                      value={value}
                      onChange={onChange}
                      helperText={helper}
                      InputProps={{ startAdornment: icon }}
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "16px",
                          background: "rgba(255,255,255,0.72)",
                          backdropFilter: "blur(8px)",
                          ...F,
                          "& fieldset": { borderColor: "rgba(35,57,113,0.25)" },
                          "&:hover fieldset": { borderColor: `${accentColor}55` },
                          "&.Mui-focused fieldset": { borderColor: accentColor, borderWidth: "1.5px" },
                        },
                        "& .MuiInputLabel-root": { ...F, "&.Mui-focused": { color: accentColor } },
                        "& .MuiFormHelperText-root": { ...F, ml: 0.5 },
                      }}
                    >
                      {options.map((o) => (
                        <MenuItem key={o.value} value={o.value} disabled={label === "Batch Generate" && !isSingleSourceMode && o.value > files.length}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ))}
                </Stack>

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>Prompt Presets</Typography>
                    <Typography sx={{ ...F, fontSize: "0.75rem", color: "#94a3b8" }}>Click preset → auto-fill prompt</Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    {grouped.map(({ group, meta, items }) => (
                      <Box key={group}>
                        <Stack direction="row" spacing={0.8} alignItems="center" mb={0.75}>
                          <Box sx={{ width: 3, height: 13, borderRadius: "2px", background: meta.color, flexShrink: 0 }} />
                          <Typography sx={{ ...F, fontWeight: 600, fontSize: "0.68rem", color: meta.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{meta.label}</Typography>
                        </Stack>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {items.map((item) => {
                            const isActive = activePreset === item.key;
                            return (
                              <Chip
                                key={item.key}
                                label={item.label}
                                onClick={() => handlePresetClick(item.key, item.prompt)}
                                clickable
                                size="small"
                                icon={
                                  <Box component="span" sx={{ display: "flex", alignItems: "center", "& svg": { fontSize: "12px !important" } }}>
                                    {item.icon}
                                  </Box>
                                }
                                sx={{
                                  borderRadius: "999px",
                                  height: 26,
                                  ...F,
                                  fontWeight: 600,
                                  fontSize: "0.73rem",
                                  background: isActive ? meta.color : meta.bg,
                                  color: isActive ? "#fff" : meta.color,
                                  border: `1px solid ${isActive ? meta.color : meta.border}`,
                                  boxShadow: isActive ? `0 3px 10px ${meta.color}45` : "none",
                                  "& .MuiChip-icon": { color: isActive ? "#fff" : meta.color, ml: "5px", mr: "-2px" },
                                  "& .MuiChip-label": { px: "7px" },
                                  transition: "all 0.18s ease",
                                  "&:hover": {
                                    background: isActive ? meta.color : `${meta.color}22`,
                                    transform: "translateY(-1px)",
                                    boxShadow: `0 4px 12px ${meta.color}30`,
                                  },
                                }}
                              />
                            );
                          })}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>Edit Prompt</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ ...F, fontSize: "0.74rem", color: "#94a3b8" }}>{buildFinalPrompt().length} chars</Typography>
                      <Tooltip title={copied ? "Copied!" : "Copy prompt"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={handleCopyPrompt}
                            disabled={!prompt.trim()}
                            sx={{
                              width: 28,
                              height: 28,
                              border: "1px solid rgba(35,57,113,0.25)",
                              background: "rgba(255,255,255,0.7)",
                              backdropFilter: "blur(6px)",
                              "&:hover": { background: "rgba(35,57,113,0.06)", borderColor: "rgba(35,57,113,0.35)" },
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 13, color: "#233971" }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Stack>
                  <Box
                    sx={{
                      borderRadius: "16px",
                      border: "1.5px solid rgba(35,57,113,0.22)",
                      background: "rgba(255,255,255,0.72)",
                      backdropFilter: "blur(8px)",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" },
                      "&:hover": { borderColor: "rgba(35,57,113,0.35)" },
                      overflow: "hidden",
                    }}
                  >
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Example: Rotate the product to a left-side view and keep the exact same identity, lighting, and background."
                      rows={6}
                      style={{
                        display: "block",
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "vertical",
                        minHeight: 130,
                        maxHeight: 320,
                        padding: "14px 16px",
                        fontFamily: "Sora, sans-serif",
                        fontSize: "16px",
                        lineHeight: 1.65,
                        color: "#1e293b",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        borderRadius: "16px",
                        WebkitAppearance: "none",
                      }}
                    />
                  </Box>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AutoAwesomeIcon />}
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
                      "&:hover": {
                        background: "linear-gradient(135deg,#1a2d5a,#233971)",
                        boxShadow: "0 12px 30px rgba(35,57,113,0.42)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": { background: "rgba(148,163,184,0.28)", boxShadow: "none" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    {loading ? "Processing…" : "Generate Edit"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<RestartAltIcon />}
                    onClick={handleClearAll}
                    disabled={loading}
                    sx={{
                      borderRadius: "999px",
                      py: 1.4,
                      px: 2.5,
                      textTransform: "none",
                      ...F,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      borderColor: "rgba(35,57,113,0.25)",
                      color: "#64748b",
                      background: "rgba(255,255,255,0.5)",
                      "&:hover": {
                        borderColor: "rgba(35,57,113,0.4)",
                        background: "rgba(35,57,113,0.05)",
                        color: "#233971",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Reset
                  </Button>
                </Stack>

                {loading && (
                  <Box>
                    <LinearProgress
                      sx={{
                        height: 5,
                        borderRadius: "999px",
                        background: "rgba(35,57,113,0.1)",
                        "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#233971,#2e4fa3,#5b7ec7)" },
                      }}
                    />
                    <Typography sx={{ ...F, fontSize: "0.78rem", color: "#233971", mt: 0.8, fontWeight: 500 }}>
                      Processing image…
                    </Typography>
                  </Box>
                )}
                {error && (
                  <Alert severity="error" sx={{ borderRadius: "14px", ...F, fontSize: "0.82rem", border: "1px solid rgba(239,68,68,0.18)", background: "rgba(254,242,242,0.9)" }}>
                    {error}
                  </Alert>
                )}
                {successMessage && (
                  <Alert severity="success" sx={{ borderRadius: "14px", ...F, fontSize: "0.82rem", border: "1px solid rgba(35,57,113,0.18)", background: "rgba(232,237,248,0.9)" }}>
                    {successMessage}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ ...cardShell, flex: 1 }}>

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
                    Preview Result
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.82rem", color: "#64748b", mt: "2px" }}>
                    Compare before & after — click image to preview full size
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>Before</Typography>
                    <Chip
                      size="small"
                      label={files.length ? `${files.length} Image Loaded` : "No File"}
                      sx={{
                        ...F,
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        borderRadius: "999px",
                        background: files.length ? "rgba(35,57,113,0.09)" : "rgba(148,163,184,0.09)",
                        color: files.length ? "#233971" : "#94a3b8",
                        border: `1px solid ${files.length ? "rgba(35,57,113,0.25)" : "rgba(148,163,184,0.22)"}`,
                      }}
                    />
                  </Stack>
                  <Paper
                    variant="outlined"
                    onClick={() => primaryPreviewUrl && openLightbox(primaryPreviewUrl)}
                    onWheel={(e) => e.preventDefault()}
                    sx={{
                      minHeight: 240,
                      borderRadius: "18px",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.55)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(35,57,113,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2,
                      cursor: primaryPreviewUrl ? "zoom-in" : "default",
                      position: "relative",
                      transition: "border-color 0.2s",
                      "&:hover": primaryPreviewUrl ? { borderColor: "rgba(35,57,113,0.3)" } : {},
                    }}
                  >
                    {primaryPreviewUrl ? (
                      <>
                        <Box
                          component="img"
                          src={primaryPreviewUrl}
                          alt="Before"
                          sx={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain", borderRadius: "12px", boxShadow: "0 8px 22px rgba(0,0,0,0.07)" }}
                        />
                        <Box sx={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "10px", background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s", ".MuiPaper-root:hover &": { opacity: 1 } }}>
                          <ZoomInIcon sx={{ fontSize: 16, color: "#fff" }} />
                        </Box>
                      </>
                    ) : (
                      <Stack spacing={1} alignItems="center">
                        <Box sx={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(35,57,113,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ImageIcon sx={{ fontSize: 24, color: "#7a9bd4" }} />
                        </Box>
                        <Typography sx={{ ...F, fontSize: "0.82rem", color: "#94a3b8", fontWeight: 500 }}>
                          No image uploaded yet
                        </Typography>
                      </Stack>
                    )}
                  </Paper>
                </Box>

                {previewUrls.length > 1 && (
                  <Box>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b", mb: 1.2 }}>
                      Batch Preview
                    </Typography>
                    <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
                      {previewUrls.map((item, idx) => (
                        <Box
                          key={`${item.file.name}-${idx}`}
                          onClick={() => openLightbox(item.url)}
                          onWheel={(e) => e.preventDefault()}
                          sx={{
                            width: 78,
                            height: 78,
                            borderRadius: "14px",
                            overflow: "hidden",
                            border: "1px solid rgba(35,57,113,0.22)",
                            background: "rgba(255,255,255,0.7)",
                            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
                            cursor: "zoom-in",
                            transition: "transform 0.2s,box-shadow 0.2s",
                            "&:hover": { transform: "scale(1.06)", boxShadow: "0 8px 20px rgba(35,57,113,0.16)" },
                          }}
                        >
                          <Box component="img" src={item.url} alt={item.file.name} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* ── NEW: Reference preview strip in result card ── */}
                {refPreviewUrls.length > 0 && (
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <AddPhotoAlternateIcon sx={{ fontSize: 14, color: "#2a4a9e" }} />
                        <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>
                          Reference Images
                        </Typography>
                      </Stack>
                      <Chip
                        size="small"
                        label={`${refPreviewUrls.length} active`}
                        sx={{
                          ...F,
                          fontWeight: 700,
                          borderRadius: "999px",
                          background: "rgba(42,74,158,0.08)",
                          color: "#2a4a9e",
                          border: "1px solid rgba(42,74,158,0.2)",
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {refPreviewUrls.map((item, idx) => (
                        <Box
                          key={`ref-preview-${item.file.name}-${idx}`}
                          onClick={() => openLightbox(item.url)}
                          onWheel={(e) => e.preventDefault()}
                          sx={{
                            position: "relative",
                            width: 72,
                            height: 72,
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "1.5px solid rgba(42,74,158,0.28)",
                            background: "rgba(255,255,255,0.7)",
                            cursor: "zoom-in",
                            flexShrink: 0,
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": { transform: "scale(1.06)", boxShadow: "0 8px 20px rgba(42,74,158,0.22)" },
                          }}
                        >
                          <Box component="img" src={item.url} alt={item.file.name} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "linear-gradient(to top,rgba(42,74,158,0.75),transparent)",
                              py: "3px",
                              textAlign: "center",
                            }}
                          >
                            <Typography sx={{ fontFamily: "'Sora',sans-serif", fontSize: "0.58rem", fontWeight: 800, color: "#fff" }}>
                              REF {idx + 1}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>After</Typography>
                    <Chip
                      size="small"
                      label={loading ? "Generating…" : resultUrl ? "Generated ✓" : "Waiting Result"}
                      sx={{
                        ...F,
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        borderRadius: "999px",
                        background: loading ? "rgba(245,158,11,0.09)" : resultUrl ? "rgba(35,57,113,0.09)" : "rgba(148,163,184,0.09)",
                        color: loading ? "#f59e0b" : resultUrl ? "#233971" : "#94a3b8",
                        border: `1px solid ${
                          loading ? "rgba(245,158,11,0.25)" : resultUrl ? "rgba(35,57,113,0.25)" : "rgba(148,163,184,0.22)"
                        }`,
                      }}
                    />
                  </Stack>

                  {resultPromptTags.length > 0 && (
                    <Box mb={1.4}>
                      <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", color: "#475569", mb: 0.8 }}>
                        Prompt Result
                      </Typography>
                      <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                        {resultPromptTags.map((tag) => (
                          <Chip
                            key={tag.label}
                            label={tag.label}
                            size="small"
                            sx={{
                              ...F,
                              fontWeight: 700,
                              fontSize: "0.72rem",
                              borderRadius: "999px",
                              background: tag.bg,
                              color: tag.color,
                              border: `1px solid ${tag.border}`,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <PreviewBox
                    src={resultUrl}
                    alt="After"
                    aspectRatio={aspectRatio}
                    minHeight={240}
                    onPreview={() => resultUrl && openLightbox(resultMeta || resultUrl)}
                  />

                  {resultMeta?.width && resultMeta?.height && (
                    <Typography sx={{ ...F, mt: 1, fontSize: "0.76rem", color: "#64748b", fontWeight: 600 }}>
                      Output size: {resultMeta.width} x {resultMeta.height}px
                    </Typography>
                  )}

                  {!resultUrl && loading && (
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <AutoAwesomeIcon
                        sx={{
                          fontSize: 16,
                          color: "#7a9bd4",
                          animation: "spinSlow 2s linear infinite",
                          "@keyframes spinSlow": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                      <Typography sx={{ ...F, fontSize: "0.78rem", color: "#94a3b8" }}>
                        AI is processing…
                      </Typography>
                    </Box>
                  )}
                </Box>

                {!!batchResults.length && (
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                      <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }}>Batch Results</Typography>
                      <Chip
                        size="small"
                        label={`${batchResults.length} result`}
                        sx={{
                          ...F,
                          fontWeight: 700,
                          borderRadius: "999px",
                          background: "rgba(35,57,113,0.08)",
                          color: "#233971",
                          border: "1px solid rgba(35,57,113,0.2)",
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
                      {batchResults.map((item, idx) => (
                        <BatchCard
                          key={item.id}
                          item={item}
                          index={idx}
                          aspectRatio={aspectRatio}
                          onPreview={() => openLightbox(item)}
                          onDownload={() => handleDownloadSingle(item, `edited-${idx + 1}-${item.fileName || Date.now()}.png`)}
                          F={F}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownloadSingle(resultMeta || resultUrl, `edited-${Date.now()}.png`)}
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
                    "&:hover": resultUrl
                      ? {
                          background: "linear-gradient(135deg,#1a2d5a,#233971)",
                          boxShadow: "0 12px 30px rgba(35,57,113,0.42)",
                          transform: "translateY(-2px)",
                        }
                      : {},
                    "&:disabled": {
                      background: "rgba(148,163,184,0.18)",
                      color: "rgba(148,163,184,0.55)",
                      boxShadow: "none",
                    },
                    transition: "all 0.25s ease",
                  }}
                >
                  Download Result
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}
