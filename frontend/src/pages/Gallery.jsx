  import { useEffect, useMemo, useRef, useState } from "react";
  import { useSearchParams, useNavigate } from "react-router-dom";
  import { useAuth } from "../auth/AuthContext";
  import api from "../api/client";
  import {
    Box, Card, CardContent, Stack, Typography, Chip, Button,
    IconButton, Dialog, DialogContent, DialogTitle, TextField,
    Paper, Tooltip, Divider, Zoom,
  } from "@mui/material";
  import PhotoLibraryRoundedIcon        from "@mui/icons-material/PhotoLibraryRounded";
  import DeleteOutlineRoundedIcon       from "@mui/icons-material/DeleteOutlineRounded";
  import DownloadRoundedIcon            from "@mui/icons-material/DownloadRounded";
  import VisibilityRoundedIcon          from "@mui/icons-material/VisibilityRounded";
  import SearchRoundedIcon              from "@mui/icons-material/SearchRounded";
  import CollectionsRoundedIcon         from "@mui/icons-material/CollectionsRounded";
  import ImageIcon                      from "@mui/icons-material/Image";
  import BoltIcon                       from "@mui/icons-material/Bolt";
  import InfoOutlinedIcon               from "@mui/icons-material/InfoOutlined";
  import FolderDeleteRoundedIcon        from "@mui/icons-material/FolderDeleteRounded";
  import AutoFixHighRoundedIcon         from "@mui/icons-material/AutoFixHighRounded";
  import PaletteRoundedIcon             from "@mui/icons-material/PaletteRounded";
  import FavoriteRoundedIcon            from "@mui/icons-material/FavoriteRounded";
  import InsightsRoundedIcon            from "@mui/icons-material/InsightsRounded";
  import CloudDoneRoundedIcon           from "@mui/icons-material/CloudDoneRounded";
  import TuneRoundedIcon                from "@mui/icons-material/TuneRounded";
  import AutoAwesomeIcon                from "@mui/icons-material/AutoAwesome";
  import StorefrontIcon                 from "@mui/icons-material/Storefront";
  import CalendarMonthRoundedIcon       from "@mui/icons-material/CalendarMonthRounded";
  import RestartAltRoundedIcon          from "@mui/icons-material/RestartAltRounded";
  import CheckBoxRoundedIcon            from "@mui/icons-material/CheckBoxRounded";
  import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
  import DeleteSweepRoundedIcon         from "@mui/icons-material/DeleteSweepRounded";
  import CloseRoundedIcon               from "@mui/icons-material/CloseRounded";
  import SelectAllRoundedIcon           from "@mui/icons-material/SelectAllRounded";
  import ChevronLeftRoundedIcon         from "@mui/icons-material/ChevronLeftRounded";
  import ChevronRightRoundedIcon        from "@mui/icons-material/ChevronRightRounded";
  import GridViewRoundedIcon            from "@mui/icons-material/GridViewRounded";
  import KeyboardArrowUpRoundedIcon     from "@mui/icons-material/KeyboardArrowUpRounded";
  import LayersRoundedIcon              from "@mui/icons-material/LayersRounded";
  import CropOriginalIcon               from "@mui/icons-material/CropOriginal";
  import BlurOnIcon                     from "@mui/icons-material/BlurOn";
  import GradientIcon                   from "@mui/icons-material/Gradient";
  import EditRoundedIcon                from "@mui/icons-material/EditRounded";
  import {
    GALLERY_DATE_FROM_PARAM_KEY,
    GALLERY_DATE_TO_PARAM_KEY,
    GALLERY_SEARCH_PARAM_KEY,
    buildGalleryFilterSearchParams,
    readGalleryFilterState,
    resetGalleryFilterSearchParams,
  } from "../services/galleryFilters.js";

  /* ─── Google Fonts ─── */
  const FontStyle = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      @keyframes fbf      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
      @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes orbDrift0{ 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-18px) scale(1.04)} }
      @keyframes orbDrift1{ 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.03)} }
      @keyframes orbDrift2{ 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(16px,18px) scale(1.05)} }
      @keyframes gridPulse{ 0%,100%{opacity:0.45} 50%{opacity:0.7} }
      @keyframes fadeR    { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
      @keyframes slideUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes floatY   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(4deg)} }
      @keyframes pulseGlow{
        0%,100%{ box-shadow:0 10px 26px rgba(35,57,113,0.25); }
        50%    { box-shadow:0 14px 34px rgba(35,57,113,0.40); }
      }
    `}</style>
  );

  const F = { fontFamily:"'Sora',sans-serif" };

  const IMG_H          = 180;
  const CARD_H         = 420;
  const FILENAME_LINES = 1;
  const PROMPT_LINES   = 2;

  /* ══ CARD BACKGROUND — navy #233971 ══ */
  function CardBg({ variant = "left" }) {
    const isLeft = variant === "left";
    return (
      <Box aria-hidden sx={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden", borderRadius:"inherit" }}>
        <Box
          sx={{
            position:"absolute",
            inset:0,
            background: isLeft
              ? "linear-gradient(145deg,#e8edf8 0%,#f0f4fb 30%,#e6edf9 60%,#eaf0fb 100%)"
              : "linear-gradient(145deg,#eaf0fb 0%,#e6edf9 30%,#f0f4fb 60%,#e8edf8 100%)",
          }}
        />
        <Box
          sx={{
            position:"absolute",
            inset:0,
            backgroundImage:`radial-gradient(circle, rgba(35,57,113,0.18) 1px, transparent 1px)`,
            backgroundSize:"28px 28px",
            animation:"gridPulse 6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position:"absolute",
            top: isLeft ? "-20%" : "60%",
            left: isLeft ? "-10%" : "55%",
            width:280, height:280, borderRadius:"50%",
            background: isLeft
              ? "radial-gradient(circle,rgba(35,57,113,0.13) 0%,transparent 70%)"
              : "radial-gradient(circle,rgba(35,57,113,0.12) 0%,transparent 70%)",
            animation:"orbDrift0 14s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position:"absolute",
            top: isLeft ? "50%" : "-15%",
            right: isLeft ? "-8%" : "-10%",
            width:240, height:240, borderRadius:"50%",
            background: isLeft
              ? "radial-gradient(circle,rgba(55,80,145,0.10) 0%,transparent 70%)"
              : "radial-gradient(circle,rgba(35,57,113,0.11) 0%,transparent 70%)",
            animation:"orbDrift1 18s ease-in-out infinite 2s",
          }}
        />
        <Box
          sx={{
            position:"absolute",
            bottom: isLeft ? "-10%" : "10%",
            left: isLeft ? "40%" : "10%",
            width:200, height:200, borderRadius:"50%",
            background: isLeft
              ? "radial-gradient(circle,rgba(35,57,113,0.09) 0%,transparent 70%)"
              : "radial-gradient(circle,rgba(55,80,145,0.09) 0%,transparent 70%)",
            animation:"orbDrift2 22s ease-in-out infinite 4s",
          }}
        />
        <Box sx={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(35,57,113,0.35),transparent)" }}/>
        <Box sx={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(35,57,113,0.22),transparent)" }}/>
      </Box>
    );
  }

  /* ── card shell ── */
  const cardShell = {
    borderRadius:"24px",
    border:"1px solid rgba(35,57,113,0.18)",
    background:"transparent",
    backdropFilter:"blur(2px)",
    boxShadow:"0 2px 8px rgba(0,0,0,0.05),0 16px 40px -8px rgba(35,57,113,0.13),inset 0 1px 0 rgba(255,255,255,0.9)",
    overflow:"hidden",
    position:"relative",
    transition:"box-shadow 0.3s ease,border-color 0.3s ease",
    "&:hover":{
      boxShadow:"0 2px 8px rgba(0,0,0,0.07),0 24px 52px -8px rgba(35,57,113,0.18),inset 0 1px 0 rgba(255,255,255,0.95)",
      borderColor:"rgba(35,57,113,0.35)",
    },
  };

  /* ── Image card shell ── */
  const imageCardShell = {
    borderRadius:"20px",
    border:"1px solid rgba(35,57,113,0.18)",
    background:"transparent",
    backdropFilter:"blur(2px)",
    boxShadow:"0 2px 8px rgba(0,0,0,0.04),0 12px 36px -8px rgba(35,57,113,0.12),inset 0 1px 0 rgba(255,255,255,0.9)",
    overflow:"hidden",
    position:"relative",
    minWidth:0,
    boxSizing:"border-box",
    transition:"box-shadow 0.25s ease,border-color 0.25s ease,transform 0.25s ease",
  };

  /* ── FloatBadge ── */
  function FloatBadge({ icon, sx }) {
    return (
      <Box
        sx={{
          position:"absolute",
          width:44, height:44,
          borderRadius:"14px",
          display:"flex", alignItems:"center", justifyContent:"center",
          backdropFilter:"blur(16px)",
          border:"1.5px solid rgba(255,255,255,0.6)",
          boxShadow:"0 8px 24px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.7)",
          animation:"fbf 5s ease-in-out infinite",
          "& svg":{ fontSize:21, filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.15))" },
          ...sx
        }}
      >
        {icon}
      </Box>
    );
  }

  /* ── CardBadgeIcon ── */
  function CardBadgeIcon({ icon, gradient, glow }) {
    return (
      <Box
        sx={{
          position:"absolute",
          top:-22, right:28,
          width:54, height:54,
          borderRadius:"17px",
          background:gradient,
          boxShadow:`0 10px 28px ${glow},0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.35)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          border:"2.5px solid rgba(255,255,255,0.55)",
          zIndex:10,
          "& svg":{ fontSize:24, color:"#fff", filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.25))" },
          transition:"transform 0.3s ease,box-shadow 0.3s ease",
          "&:hover":{ transform:"translateY(-5px) rotate(8deg)", boxShadow:`0 18px 36px ${glow},0 4px 12px rgba(0,0,0,0.2)` },
        }}
      >
        {icon}
      </Box>
    );
  }

  /* ── WaterMark icons ── */
  const BG_ICONS = [
    { Icon: AutoFixHighRoundedIcon, Icon2: CollectionsRoundedIcon  },
    { Icon: PaletteRoundedIcon,     Icon2: InsightsRoundedIcon     },
    { Icon: CloudDoneRoundedIcon,   Icon2: LayersRoundedIcon       },
    { Icon: BoltIcon,               Icon2: AutoFixHighRoundedIcon  },
    { Icon: InsightsRoundedIcon,    Icon2: PaletteRoundedIcon      },
    { Icon: FavoriteRoundedIcon,    Icon2: GridViewRoundedIcon     },
  ];

  function WaterMark({ index }) {
    const { Icon, Icon2 } = BG_ICONS[index % BG_ICONS.length];
    const delay = `${(index % 6) * 0.5}s`;
    const delay2 = `${(index % 6) * 0.3 + 1}s`;
    return (
      <>
        <Box
          aria-hidden
          sx={{
            position:"absolute",
            top:0, left:0, right:0, height:"3px",
            background:"linear-gradient(90deg,#233971,#5b7ec7,transparent)",
            zIndex:2, pointerEvents:"none",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position:"absolute",
            bottom:-20, right:-20,
            zIndex:0, pointerEvents:"none",
            opacity:0.13,
            animation:`floatY 7s ease-in-out infinite`,
            animationDelay: delay,
          }}
        >
          <Icon sx={{ fontSize:120, color:"#233971" }}/>
        </Box>
        <Box
          aria-hidden
          sx={{
            position:"absolute",
            top:`${IMG_H + 8}px`,
            left:-16,
            zIndex:0, pointerEvents:"none",
            opacity:0.09,
            animation:`floatY 9s ease-in-out infinite`,
            animationDelay: delay2,
          }}
        >
          <Icon2 sx={{ fontSize:80, color:"#2e4fa3" }}/>
        </Box>
        <Box
          aria-hidden
          sx={{
            position:"absolute",
            inset:0,
            backgroundImage:`radial-gradient(circle, rgba(35,57,113,0.12) 1px, transparent 1px)`,
            backgroundSize:"24px 24px",
            animation:"gridPulse 6s ease-in-out infinite",
            zIndex:0, pointerEvents:"none",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position:"absolute",
            top:"-18%", right:"-12%",
            width:160, height:160,
            borderRadius:"50%",
            background:"radial-gradient(circle,rgba(55,80,145,0.14) 0%,transparent 70%)",
            animation:"orbDrift1 18s ease-in-out infinite 2s",
            zIndex:0, pointerEvents:"none",
          }}
        />
      </>
    );
  }

  /* ── utils ── */
  function normalizeDateOnly(v) {
    if (!v) return "";
    const d = new Date(v.replace(" ","T"));
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function getDisplayPrompt(item) {
    const name   = (item.fileName||item.filename||"").replace(/\.[^/.]+$/,"").toLowerCase().trim();
    const prompt = (item.prompt||"").toLowerCase().trim();
    return (!prompt || prompt===name) ? null : item.prompt;
  }

  /* ══════════════════ MAIN COMPONENT ══════════════════ */
  /* ── DatePickerBox: klik di mana saja → buka kalender (desktop & mobile) ── */
function DatePickerBox({ label, value, onChange }) {
  const inputRef = useRef(null);

  const openDatePicker = () => {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  return (
    <Box
      sx={{
        position:"relative",
        minWidth:{ xs:"100%", sm:200 },
        width:{ xs:"100%", sm:"auto" },
      }}
    >
        {/* Floating label — di atas segalanya */}
        <Typography
          component="span"
          sx={{
            fontFamily:"'Sora',sans-serif",
            position:"absolute",
            top:-9, left:12,
            zIndex:4,
            fontSize:"0.70rem",
            fontWeight:600,
            color:"#233971",
            background:"#fff",
            px:"5px",
            borderRadius:"4px",
            pointerEvents:"none",
            lineHeight:1,
          }}
        >
          {label}
        </Typography>

        {/* Input overlay — di bawah display secara visual (zIndex:1) tapi full area klikable */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          tabIndex={-1}
          style={{
            position:"absolute",
            top:0, left:0,
            width:1,
            height:1,
            opacity:0,
            cursor:"pointer",
            border:"none",
            background:"transparent",
            WebkitAppearance:"none",
            MozAppearance:"none",
            appearance:"none",
            boxSizing:"border-box",
            pointerEvents:"none",
            zIndex:1,
            fontSize:"16px",
          }}
        />

        {/* Display box — seluruh area klik langsung buka date picker */}
        <Box
          role="button"
          tabIndex={0}
          onClick={openDatePicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openDatePicker();
            }
          }}
          sx={{
            position:"relative",
            zIndex:3,
            borderRadius:"16px",
            border:"1.5px solid rgba(35,57,113,0.25)",
            background:"#fff",
            display:"flex",
            alignItems:"center",
            gap:"8px",
            px:"12px",
            height:52,
            cursor:"pointer",
            outline:"none",
            transition:"border-color 0.2s",
            "&:hover":{
              borderColor:"rgba(35,57,113,0.45)",
            },
            "&:focus-visible":{
              borderColor:"#233971",
              boxShadow:"0 0 0 3px rgba(35,57,113,0.12)",
            },
          }}
        >
          <CalendarMonthRoundedIcon sx={{ fontSize:18, color:"#5b7ec7", flexShrink:0 }}/>
          <Typography
            sx={{
              fontFamily:"'Sora',sans-serif",
              fontSize:"0.85rem",
              fontWeight: value ? 600 : 400,
              color: value ? "#1e293b" : "#94a3b8",
              whiteSpace:"nowrap",
              overflow:"hidden",
              textOverflow:"ellipsis",
              flex:1,
            }}
          >
            {value
              ? new Date(value + "T00:00:00").toLocaleDateString("id-ID",{ day:"numeric", month:"short", year:"numeric" })
              : "Pilih tanggal"}
          </Typography>
        </Box>
      </Box>
    );
  }

  function DatePickerGroup({ dateFrom, setDateFrom, dateTo, setDateTo }) {
    return (
      <Stack direction={{ xs:"column",sm:"row" }} spacing={1.5} alignItems={{ xs:"stretch",sm:"center" }}>
        <DatePickerBox label="Dari Tanggal"   value={dateFrom} onChange={setDateFrom}/>
        <DatePickerBox label="Sampai Tanggal" value={dateTo}   onChange={setDateTo}/>
      </Stack>
    );
  }

  export default function Gallery() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [gallery,       setGallery]       = useState([]);
    const [previewItem,   setPreviewItem]   = useState(null);
    const [previewZoom,   setPreviewZoom]   = useState(1);
    const [previewPan,    setPreviewPan]    = useState({ x:0, y:0 });
    const [isDragging,    setIsDragging]    = useState(false);
    const dragStartRef   = useRef(null);
    const panStartRef    = useRef(null);
    const touchesRef     = useRef([]);
    const [hovered,       setHovered]       = useState(null);
    const [selectMode,    setSelectMode]    = useState(false);
    const [selectedIds,   setSelectedIds]   = useState(new Set());
    const [perPage,       setPerPage]       = useState(12);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open:false, type:"", id:null, count:0 });
    const PER_PAGE_OPTIONS = [6,12,24,48];
    const { user } = useAuth();
    const authorName = user?.name || user?.username || "Guest";
    const { search, dateFrom, dateTo } = readGalleryFilterState(searchParams);
    const filterKey = `${search}\u0000${dateFrom}\u0000${dateTo}`;
    const [pagination, setPagination] = useState({ filterKey, page:1 });
    const page = pagination.filterKey === filterKey ? pagination.page : 1;
    const setPage = (nextPageValue) => {
      setPagination(current => {
        const currentPage = current.filterKey === filterKey ? current.page : 1;
        const nextPage =
          typeof nextPageValue === "function" ? nextPageValue(currentPage) : nextPageValue;

        return { filterKey, page:nextPage };
      });
    };

    const openConfirm  = (type, id=null, count=0) => setConfirmDialog({ open:true, type, id, count });
    const closeConfirm = () => setConfirmDialog({ open:false, type:"", id:null, count:0 });

    const updateGallerySearchParams = (nextValues) => {
      setSearchParams(buildGalleryFilterSearchParams(searchParams, nextValues), { replace:true });
    };

    const openPreview = (item) => {
      setPreviewZoom(1);
      setPreviewPan({ x:0, y:0 });
      setIsDragging(false);
      setPreviewItem(item);
    };

  const resetZoom = () => { setPreviewZoom(1); setPreviewPan({ x:0, y:0 }); };

  const handlePreviewWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setPreviewZoom((v) => parseFloat(Math.min(5, Math.max(0.25, v + delta)).toFixed(2)));
  };

    /* ── drag handlers (mouse) ── */
    const onMouseDown = (e) => {
      if (previewZoom <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      panStartRef.current  = { x: previewPan.x, y: previewPan.y };
    };
    const onMouseMove = (e) => {
      if (!isDragging || !dragStartRef.current) return;
      setPreviewPan({
        x: panStartRef.current.x + (e.clientX - dragStartRef.current.x),
        y: panStartRef.current.y + (e.clientY - dragStartRef.current.y),
      });
    };
    const onMouseUp = () => { setIsDragging(false); };

    /* ── pinch + pan handlers (touch) ── */
    const onTouchStart = (e) => {
      touchesRef.current = Array.from(e.touches);
      if (e.touches.length === 1) {
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStartRef.current  = { x: previewPan.x, y: previewPan.y };
      }
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        const t0 = e.touches[0], t1 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        const prev = touchesRef.current;
        if (prev.length === 2) {
          const prevDist = Math.hypot(prev[1].clientX - prev[0].clientX, prev[1].clientY - prev[0].clientY);
          const scale = dist / prevDist;
          setPreviewZoom(v => parseFloat(Math.min(5, Math.max(0.25, v * scale)).toFixed(2)));
        }
        touchesRef.current = Array.from(e.touches);
      } else if (e.touches.length === 1 && dragStartRef.current && previewZoom > 1) {
        setPreviewPan({
          x: panStartRef.current.x + (e.touches[0].clientX - dragStartRef.current.x),
          y: panStartRef.current.y + (e.touches[0].clientY - dragStartRef.current.y),
        });
      }
    };
    const onTouchEnd = () => { touchesRef.current = []; dragStartRef.current = null; };

    const handleSearchChange = (value) => {
      updateGallerySearchParams({
        [GALLERY_SEARCH_PARAM_KEY]: value,
        [GALLERY_DATE_FROM_PARAM_KEY]: dateFrom,
        [GALLERY_DATE_TO_PARAM_KEY]: dateTo,
      });
    };

    const handleDateFromChange = (value) => {
      updateGallerySearchParams({
        [GALLERY_SEARCH_PARAM_KEY]: search,
        [GALLERY_DATE_FROM_PARAM_KEY]: value,
        [GALLERY_DATE_TO_PARAM_KEY]: dateTo,
      });
    };

    const handleDateToChange = (value) => {
      updateGallerySearchParams({
        [GALLERY_SEARCH_PARAM_KEY]: search,
        [GALLERY_DATE_FROM_PARAM_KEY]: dateFrom,
        [GALLERY_DATE_TO_PARAM_KEY]: value,
      });
    };

    const handleConfirmAction = async () => {
      const { type, id } = confirmDialog;
      closeConfirm();
      if (type === "single")   { await _doDelete(id); }
      if (type === "selected") { await _doDeleteSelected(); }
      if (type === "all")      { await _doClearAll(); }
    };

    const _doDelete = async (id) => {
      try { await api.delete(`/gallery/${encodeURIComponent(id)}`); }
      catch (e) { console.error("Delete failed:", e); }
      setGallery(g => g.filter(i => i.id !== id));
      setSelectedIds(s => { const n = new Set(s); n.delete(id); return n; });
    };

    const _doClearAll = async () => {
      try { await api.delete("/gallery"); }
      catch (e) { console.error("Clear all failed:", e); }
      setGallery([]);
      setSelectedIds(new Set());
      setSelectMode(false);
    };

    const _doDeleteSelected = async () => {
      try {
        await api.delete("/gallery/bulk", { data: { ids: [...selectedIds] } });
      } catch (e) { console.error("Bulk delete failed:", e); }
      setGallery(g => g.filter(i => !selectedIds.has(i.id)));
      setSelectedIds(new Set());
      setSelectMode(false);
    };

    useEffect(() => {
      api.get("/gallery")
        .then(r => setGallery(Array.isArray(r.data) ? r.data : []))
        .catch(() => setGallery([]));
    }, []);

    useEffect(() => {
      const fn = () => setShowScrollTop(window.scrollY > 420);
      window.addEventListener("scroll", fn, { passive:true });
      fn();
      return () => window.removeEventListener("scroll", fn);
    }, []);

    const handleResetFilter = () => {
      setSearchParams(resetGalleryFilterSearchParams(searchParams), { replace:true });
      setPage(1);
    };

    const toggleSelect = (id) => {
      setSelectedIds(p => {
        const n = new Set(p);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
      });
    };

    const handleScrollTop = () => window.scrollTo({ top:0, behavior:"smooth" });

    const handleEditInEditor = (item) => {
      navigate("/image-editor", {
        state: {
          fromGalleryUrl:    item.imageUrl,
          fromGalleryName:   item.fileName || item.filename || "gallery-image.png",
          fromGalleryPrompt: item.prompt   || "",
        },
      });
    };

    const handleDownload = async (url, name="generated-image.png") => {
      try {
        const blob = await (await fetch(url)).blob();
        const a = Object.assign(document.createElement("a"), {
          href: URL.createObjectURL(blob),
          download: name
        });
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (e) { console.error(e); }
    };

    const filteredGallery = useMemo(() => {
      const kw = search.trim().toLowerCase();
      return gallery.filter(item => {
        const ok =
          !kw ||
          (item.prompt||"").toLowerCase().includes(kw) ||
          (item.fileName||"").toLowerCase().includes(kw) ||
          (item.filename||"").toLowerCase().includes(kw);
        const d = normalizeDateOnly(item.createdAt);
        return ok && (!dateFrom || d >= dateFrom) && (!dateTo || d <= dateTo);
      });
    }, [gallery, search, dateFrom, dateTo]);

    const allSelected  = filteredGallery.length > 0 && selectedIds.size === filteredGallery.length;
    const toggleAll    = () => setSelectedIds(allSelected ? new Set() : new Set(filteredGallery.map(i=>i.id)));
    const totalPages   = Math.max(1, Math.ceil(filteredGallery.length / perPage));
    const safePage     = Math.min(page, totalPages);
    const pagedGallery = filteredGallery.slice((safePage-1)*perPage, safePage*perPage);
    const formatDateLabel = (value) => value
      ? new Date(value + "T00:00:00").toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })
      : null;
    const dateRangeText = (!dateFrom && !dateTo)
      ? "Semua waktu"
      : `${dateFrom ? formatDateLabel(dateFrom) : "Mulai"} — ${dateTo ? formatDateLabel(dateTo) : "Sampai"}`;

    const pill = (extra={}) => ({
      borderRadius:"999px",
      textTransform:"none",
      fontWeight:700,
      ...F,
      whiteSpace:"nowrap",
      ...extra,
    });

    return (
      <Box sx={{ position:"relative", ...F, overflowX:"hidden", width:"100%" }}>
        <FontStyle/>

        <Stack spacing={4}>

          {/* ══ GALLERY HEADER ══ */}
          <Card
            elevation={0}
            sx={{
              ...cardShell,
              overflow:"hidden",
              background:"linear-gradient(145deg,#f8fbff 0%,#eef4fb 55%,#f5f9ff 100%)",
              backdropFilter:"none",
            }}
          >
            <CardContent sx={{ p:{ xs:3,md:"30px 34px" }, position:"relative", zIndex:2 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs:"column", lg:"row" }} alignItems={{ xs:"stretch", lg:"center" }} justifyContent="space-between" spacing={3}>
                  <Box>
                    <Typography sx={{ ...F, fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#0f172a" }}>
                      Gallery Header
                    </Typography>
                    <Typography sx={{ ...F, fontSize:"0.72rem", color:"#64748b", mt:0.8 }}>
                      Ringkasan jumlah item dan filter aktif pada galeri gambar.
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1.2} flexWrap="wrap" alignItems="center">
                    <Button
                      onClick={handleResetFilter}
                      variant="outlined"
                      startIcon={<RestartAltRoundedIcon/>}
                      sx={{
                        ...pill({ py:1, px:2.2, fontSize:"0.82rem" }),
                        borderColor:"rgba(35,57,113,0.28)",
                        color:"#233971",
                        background:"#fff",
                        "&:hover":{ background:"rgba(35,57,113,0.08)", borderColor:"rgba(35,57,113,0.38)" },
                      }}
                    >
                      Reset Filter
                    </Button>
                    <Tooltip title="Hapus semua item gallery" placement="top">
                      <Button
                        onClick={()=>openConfirm("all")}
                        variant="contained"
                        color="error"
                        startIcon={<FolderDeleteRoundedIcon/>}
                        sx={{
                          ...pill({ py:1, px:2.2, fontSize:"0.82rem" }),
                          background:"linear-gradient(135deg,#ef4444,#f87171)",
                          boxShadow:"0 10px 22px rgba(239,68,68,0.25)",
                          "&:hover":{ background:"linear-gradient(135deg,#dc2626,#ef4444)" },
                        }}
                      >
                        Hapus Semua
                      </Button>
                    </Tooltip>
                  </Stack>
                </Stack>

                <Stack direction={{ xs:"column", md:"row" }} spacing={2} alignItems={{ xs:"stretch", md:"flex-end" }}>
                  <Box sx={{ flex:1, minWidth:0 }}>
                    <Typography sx={{ ...F, fontSize:"0.75rem", color:"#64748b", mb:1 }}>Cari prompt atau nama file</Typography>
                    <TextField
                      fullWidth
                      placeholder="Cari berdasarkan prompt atau nama file..."
                      value={search}
                      onChange={e=>handleSearchChange(e.target.value)}
                      InputProps={{ startAdornment:<SearchRoundedIcon sx={{ color:"#94a3b8", mr:1, fontSize:20 }}/> }}
                      sx={{
                        "& .MuiOutlinedInput-root":{
                          borderRadius:"16px",
                          background:"#fff",
                          ...F,
                          "& fieldset":{ borderColor:"rgba(35,57,113,0.18)" },
                          "&:hover fieldset":{ borderColor:"rgba(35,57,113,0.35)" },
                          "&.Mui-focused fieldset":{ borderColor:"#233971", borderWidth:"1.5px" },
                        },
                      }}
                    />
                  </Box>

                  <DatePickerGroup
                    dateFrom={dateFrom} setDateFrom={handleDateFromChange}
                    dateTo={dateTo}     setDateTo={handleDateToChange}
                  />
                </Stack>

                <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                  <Box sx={{ flexShrink:0 }}>
                    <Typography sx={{ ...F, fontSize:"0.78rem", color:"#64748b", mb:0.5 }}>Total item</Typography>
                    <Typography sx={{ ...F, fontSize:"1.9rem", fontWeight:800, color:"#0f172a" }}>{filteredGallery.length}</Typography>
                  </Box>
                  <Box sx={{ minWidth:0, textAlign:"right" }}>
                    <Typography sx={{ ...F, fontSize:"0.78rem", color:"#64748b", mb:0.5 }}>Rentang</Typography>
                    <Typography sx={{ ...F, fontSize:{ xs:"0.85rem", sm:"1rem" }, fontWeight:700, color:"#0f172a", wordBreak:"break-word" }}>{dateRangeText}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>

            {filteredGallery.length > 0 && (
              <Box sx={{ position:"relative", borderTop:"1px solid rgba(35,57,113,0.12)", background:"linear-gradient(145deg,#e8edf8 0%,#f0f4fb 50%,#eaf0fb 100%)" }}>
                <Box sx={{ p:{ xs:"12px 16px",sm:"12px 22px" }, position:"relative" }}>
                  <GridViewRoundedIcon aria-hidden sx={{ position:"absolute", right:10, top:10, fontSize:80, color:"rgba(35,57,113,0.07)", pointerEvents:"none" }}/>

                  <Stack
                    direction={{ xs:"column",sm:"row" }}
                    alignItems={{ xs:"flex-start",sm:"center" }}
                    justifyContent="space-between"
                    spacing={{ xs:1.5,sm:0 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ ...F, fontSize:"0.80rem", fontWeight:600, color:"#64748b", whiteSpace:"nowrap" }}>
                        Tampilkan:
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        {PER_PAGE_OPTIONS.map(n=>(
                          <Box
                            key={n}
                            onClick={()=>{ setPerPage(n); setPage(1); }}
                            sx={{
                              width:38, height:32, borderRadius:"10px",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              cursor:"pointer",
                              background: perPage===n ? "linear-gradient(135deg,#233971,#2e4fa3)" : "rgba(255,255,255,0.85)",
                              border: perPage===n ? "1.5px solid #233971" : "1px solid rgba(35,57,113,0.22)",
                              color: perPage===n ? "#fff" : "#64748b",
                              fontSize:"12px", fontWeight:700, ...F,
                              boxShadow: perPage===n ? "0 4px 12px rgba(35,57,113,0.25)" : "none",
                              transition:"all 0.15s",
                              "&:hover": perPage!==n ? { background:"rgba(35,57,113,0.07)", borderColor:"rgba(35,57,113,0.3)", color:"#233971" } : {},
                            }}
                          >
                            {n}
                          </Box>
                        ))}
                      </Stack>
                    </Stack>

                    {!selectMode && (
                      <Button
                        onClick={()=>setSelectMode(true)}
                        variant="contained"
                        startIcon={<CheckBoxOutlineBlankRoundedIcon sx={{ fontSize:"17px !important" }}/>} 
                        sx={{
                          ...pill({ py:1.0, px:2.8, fontSize:"13px" }),
                          background:"linear-gradient(135deg,#1a2d5a,#233971,#2e4fa3)",
                          boxShadow:"0 10px 26px rgba(35,57,113,0.25)",
                          animation:"pulseGlow 2.8s ease-in-out infinite",
                          "&:hover":{ background:"linear-gradient(135deg,#0f1e3d,#1a2d5a,#233971)", boxShadow:"0 14px 32px rgba(35,57,113,0.34)" },
                        }}
                      >
                        Pilih Gambar
                      </Button>
                    )}

                    {selectMode && (
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Chip
                          icon={<CheckBoxRoundedIcon sx={{ fontSize:"16px !important", color:"#fff !important" }}/>} 
                          label={selectedIds.size>0 ? `${selectedIds.size} Dipilih` : "Mode Pilih Aktif"}
                          sx={{ ...F, fontWeight:800, color:"#fff", background:"linear-gradient(135deg,#233971,#2e4fa3)", borderRadius:"999px", boxShadow:"0 8px 20px rgba(35,57,113,0.22)" }}
                        />
                        <IconButton
                          onClick={()=>{ setSelectMode(false); setSelectedIds(new Set()); }}
                          size="small"
                          sx={{ width:34, height:34, borderRadius:"12px", border:"1px solid rgba(35,57,113,0.22)", background:"rgba(255,255,255,0.85)", "&:hover":{ background:"#fff" } }}
                        >
                          <CloseRoundedIcon sx={{ fontSize:17, color:"#233971" }}/>
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Box>
            )}
          </Card>

          {/* ── Select mode action bar ── */}
          {filteredGallery.length > 0 && selectMode && (
            <Box sx={{ animation:"slideUp 0.3s ease" }}>
              <Paper
                elevation={0}
                sx={{
                  position:"relative", overflow:"hidden",
                  p:{ xs:"14px 16px",sm:"14px 22px" },
                  borderRadius:"18px",
                  background:"linear-gradient(135deg,#e8edf8 0%,#eaf0fb 60%,#f0f4fb 100%)",
                  border:"1.5px solid rgba(35,57,113,0.22)",
                  boxShadow:"0 4px 20px rgba(35,57,113,0.10)",
                }}
              >
                <SelectAllRoundedIcon aria-hidden sx={{ position:"absolute", right:-10, bottom:-14, fontSize:100, color:"rgba(35,57,113,0.07)", pointerEvents:"none" }}/>

                <Stack
                  direction={{ xs:"column",sm:"row" }}
                  alignItems={{ xs:"flex-start",sm:"center" }}
                  justifyContent="space-between"
                  spacing={{ xs:1.5,sm:0 }}
                >
                  <Stack direction="row" spacing={1.4} alignItems="center">
                    <Box sx={{ width:36, height:36, borderRadius:"11px", flexShrink:0, background:"linear-gradient(135deg,#233971,#2e4fa3)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 16px rgba(35,57,113,0.28)" }}>
                      <CheckBoxRoundedIcon sx={{ color:"#fff", fontSize:18 }}/>
                    </Box>
                    <Box>
                      <Typography sx={{ ...F, fontWeight:800, fontSize:"0.88rem", color:"#1a2d5a", lineHeight:1.2 }}>
                        {selectedIds.size>0 ? `${selectedIds.size} gambar dipilih` : "Pilih gambar yang ingin dihapus"}
                      </Typography>
                      <Typography sx={{ ...F, fontSize:"0.72rem", color:"#233971", mt:"2px" }}>
                        Tap gambar untuk memilih / batalkan
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Button
                      onClick={toggleAll}
                      variant="outlined"
                      startIcon={<SelectAllRoundedIcon sx={{ fontSize:"16px !important" }}/>}
                      sx={{
                        ...pill({ fontSize:"12px", py:0.85, px:2 }),
                        borderColor:"rgba(35,57,113,0.35)", color:"#233971",
                        background:"rgba(255,255,255,0.75)",
                        "&:hover":{ borderColor:"#233971", background:"rgba(35,57,113,0.06)" },
                      }}
                    >
                      {allSelected ? "Batal Semua" : "Pilih Semua"}
                    </Button>

                    {selectedIds.size>0 && (
                      <Button
                        onClick={()=>openConfirm("selected", null, selectedIds.size)}
                        variant="contained"
                        startIcon={<DeleteSweepRoundedIcon sx={{ fontSize:"16px !important" }}/>}
                        sx={{
                          ...pill({ fontSize:"12px", py:0.85, px:2.2 }),
                          background:"linear-gradient(135deg,#ef4444,#f87171)",
                          boxShadow:"0 6px 18px rgba(239,68,68,0.28)",
                          "&:hover":{ background:"linear-gradient(135deg,#dc2626,#ef4444)" },
                        }}
                      >
                        Hapus {selectedIds.size} Terpilih
                      </Button>
                    )}

                    <IconButton
                      onClick={()=>{ setSelectMode(false); setSelectedIds(new Set()); }}
                      size="small"
                      sx={{ width:34, height:34, borderRadius:"10px", border:"1px solid rgba(35,57,113,0.22)", background:"rgba(255,255,255,0.8)", flexShrink:0, "&:hover":{ background:"#fff" } }}
                    >
                      <CloseRoundedIcon sx={{ fontSize:16, color:"#233971" }}/>
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          )}

          {/* ══ EMPTY STATE ══ */}
          {filteredGallery.length===0 ? (
            <Card
              elevation={0}
              sx={{
                ...cardShell,
                border:"1.5px dashed rgba(35,57,113,0.28)",
              }}
            >
              <CardBg variant="left"/>
              <CardContent sx={{ py:{ xs:7,md:9 }, position:"relative", zIndex:2 }}>
                <Stack spacing={2.2} alignItems="center" textAlign="center">
                  <Box sx={{ position:"relative", width:96, height:96 }}>
                    <Box sx={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px dashed rgba(35,57,113,0.22)", animation:"spinSlow 8s linear infinite" }}/>
                    <Box sx={{ width:"100%", height:"100%", borderRadius:"28px", background:"linear-gradient(135deg,rgba(35,57,113,0.12),rgba(46,79,163,0.10))", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <CollectionsRoundedIcon sx={{ fontSize:44, color:"#233971" }}/>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ ...F, fontWeight:800, color:"#0f172a" }}>
                    Belum ada hasil generate
                  </Typography>

                  <Typography sx={{ ...F, color:"#64748b", maxWidth:520, lineHeight:1.75 }}>
                    Setelah image berhasil dibuat dari halaman editor, hasilnya akan otomatis masuk ke gallery ini.
                  </Typography>

                  <Paper
                    variant="outlined"
                    sx={{
                      p:2.2, borderRadius:"18px",
                      background:"rgba(255,255,255,0.72)", backdropFilter:"blur(8px)",
                      border:"1px solid rgba(35,57,113,0.18)", maxWidth:520,
                    }}
                  >
                    <Stack direction="row" spacing={1.4} alignItems="flex-start">
                      <Box sx={{ width:32, height:32, borderRadius:"10px", background:"rgba(35,57,113,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <InfoOutlinedIcon sx={{ color:"#233971", fontSize:16 }}/>
                      </Box>
                      <Box textAlign="left">
                        <Typography sx={{ ...F, fontWeight:700, fontSize:"0.78rem", color:"#1a2d5a", mb:"3px" }}>
                          Info Penyimpanan
                        </Typography>
                        <Typography sx={{ ...F, fontSize:"0.76rem", color:"#64748b", lineHeight:1.7 }}>
                          Data gallery diambil dari backend melalui API. Kamu bisa filter berdasarkan tanggal untuk lihat history gambar.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* ══ GALLERY GRID ══ */}
              <Box
                sx={{
                  display:"grid",
                  gridTemplateColumns:{
                    xs:"repeat(1, minmax(0, 1fr))",
                    sm:"repeat(2, minmax(0, 1fr))",
                    lg:"repeat(3, minmax(0, 1fr))",
                    xl:"repeat(4, minmax(0, 1fr))",
                  },
                  gap:{ xs:2,sm:2,md:2.5 },
                  alignItems:"stretch",
                  width:"100%",
                }}
              >
                {pagedGallery.map((item, index) => {
                  const displayPrompt = getDisplayPrompt(item);
                  const isSelected    = selectedIds.has(item.id);

                  return (
                    <Card
                      key={item.id}
                      elevation={0}
                      onMouseEnter={()=>setHovered(item.id)}
                      onMouseLeave={()=>setHovered(null)}
                      onClick={()=>selectMode && toggleSelect(item.id)}
                      sx={{
                        ...imageCardShell,
                        width:"100%",
                        height:`${CARD_H}px`,
                        display:"flex",
                        flexDirection:"column",
                        background: isSelected
                          ? "linear-gradient(145deg,#dce8f7 0%,#e6edf9 100%)"
                          : "linear-gradient(145deg,#e8edf8 0%,#f0f4fb 30%,#e6edf9 60%,#eaf0fb 100%)",
                        border: isSelected
                          ? "2px solid rgba(35,57,113,0.55)"
                          : "1px solid rgba(35,57,113,0.18)",
                        cursor: selectMode ? "pointer" : "default",
                        "&:hover": !selectMode ? {
                          transform:"translateY(-5px)",
                          boxShadow:"0 8px 12px rgba(0,0,0,0.06),0 24px 52px -8px rgba(35,57,113,0.18)",
                          borderColor:"rgba(35,57,113,0.35)",
                        } : {},
                      }}
                    >
                      <WaterMark index={index}/>

                      {/* ── Image area ── */}
                      <Box
                        sx={{
                          position:"relative",
                          flexShrink:0,
                          height:`${IMG_H}px`,
                          overflow:"hidden",
                          zIndex:1,
                          background:"linear-gradient(135deg,#dce8f7,#e6edf9)",
                          borderRadius:"20px 20px 0 0",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.imageUrl}
                          alt={item.prompt||"Generated"}
                          sx={{
                            position:"absolute", top:0, left:0,
                            width:"100%", height:"100%",
                            objectFit:"cover", display:"block",
                            transition:"transform 0.4s ease",
                            ".MuiCard-root:hover &":{ transform: selectMode ? "none" : "scale(1.05)" },
                          }}
                        />

                        <Box
                          sx={{
                            position:"absolute", inset:0,
                            background:"linear-gradient(to bottom,transparent 50%,rgba(15,23,42,0.42))",
                            opacity:(hovered===item.id && !selectMode) ? 1 : 0,
                            transition:"opacity 0.25s",
                          }}
                        />

                        {selectMode && (
                          <Box
                            sx={{ position:"absolute", top:10, left:10, zIndex:3 }}
                            onClick={e=>{ e.stopPropagation(); toggleSelect(item.id); }}
                          >
                            <Box
                              sx={{
                                width:30, height:30, borderRadius:"9px",
                                background:isSelected ? "linear-gradient(135deg,#233971,#2e4fa3)" : "rgba(255,255,255,0.92)",
                                border:isSelected ? "2px solid #233971" : "2px solid rgba(255,255,255,0.85)",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                boxShadow:isSelected ? "0 4px 14px rgba(35,57,113,0.45)" : "0 2px 10px rgba(0,0,0,0.18)",
                                transition:"all 0.18s", cursor:"pointer",
                              }}
                            >
                              {isSelected && <CheckBoxRoundedIcon sx={{ fontSize:17, color:"#fff" }}/>}
                              {!isSelected && <CheckBoxOutlineBlankRoundedIcon sx={{ fontSize:17, color:"#94a3b8" }}/>}
                            </Box>
                          </Box>
                        )}

                        {!selectMode && (
                          <Box sx={{ position:"absolute", top:8, right:8, zIndex:2 }}>
                            <IconButton
                              onClick={()=>openPreview(item)}
                              size="small"
                              sx={{
                                width:32, height:32, borderRadius:"10px",
                                background:"rgba(255,255,255,0.88)", backdropFilter:"blur(10px)",
                                border:"1px solid rgba(255,255,255,0.7)",
                                "&:hover":{ background:"rgba(255,255,255,0.98)", transform:"scale(1.08)" },
                                transition:"all 0.15s",
                              }}
                            >
                              <VisibilityRoundedIcon sx={{ fontSize:16, color:"#0f172a" }}/>
                            </IconButton>
                          </Box>
                        )}

                        {!selectMode && (
                          <Box
                            sx={{
                              position:"absolute", bottom:8, left:8,
                              px:1.2, py:0.5, borderRadius:"8px",
                              background:"rgba(35,57,113,0.88)", backdropFilter:"blur(10px)",
                              display:"flex", alignItems:"center", gap:0.5,
                              opacity:hovered===item.id ? 1 : 0,
                              transition:"opacity 0.25s", zIndex:2,
                            }}
                          >
                            <AutoFixHighRoundedIcon sx={{ fontSize:11, color:"#fff" }}/>
                            <Typography sx={{ ...F, fontSize:"10px", fontWeight:700, color:"#fff" }}>
                              AI Generated
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* ── Content area ── */}
                      <CardContent
                        sx={{
                          p:"12px 14px 14px",
                          position:"relative", zIndex:1,
                          flex:1, display:"flex", flexDirection:"column",
                          overflow:"hidden", boxSizing:"border-box",
                        }}
                      >
                        <Typography
                          sx={{
                            ...F, color:"#0f172a", fontSize:"0.83rem", fontWeight:800,
                            lineHeight:1.35, mb:"4px", flexShrink:0,
                            display:"-webkit-box",
                            WebkitLineClamp:FILENAME_LINES,
                            WebkitBoxOrient:"vertical",
                            overflow:"hidden",
                            wordBreak:"break-all",
                            minHeight:`calc(0.83rem * 1.35 * ${FILENAME_LINES})`,
                          }}
                        >
                          {item.fileName||item.filename||"-"}
                        </Typography>

                        {(item.createdBy || item.username || item.user) && (
                          <Typography sx={{ ...F, color:"#475569", fontSize:"0.70rem", fontWeight:600, mb:"8px" }}>
                            Created by {item.createdBy || item.username || item.user}
                          </Typography>
                        )}

                        <Box sx={{ flexShrink:0, mb:"8px", minHeight:`calc(0.73rem * 1.5 * ${PROMPT_LINES})` }}>
                          {displayPrompt ? (
                            <Typography
                              sx={{
                                ...F, color:"#64748b", fontSize:"0.73rem", lineHeight:1.5,
                                display:"-webkit-box",
                                WebkitLineClamp:PROMPT_LINES,
                                WebkitBoxOrient:"vertical",
                                overflow:"hidden",
                              }}
                            >
                              {displayPrompt}
                            </Typography>
                          ) : (
                            <Typography sx={{ ...F, color:"#cbd5e1", fontSize:"0.72rem", fontStyle:"italic" }}>
                              Tidak ada prompt tersedia.
                            </Typography>
                          )}
                        </Box>

                        <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap sx={{ flexShrink:0, mb:"8px" }}>
                          <Chip
                            size="small"
                            label={normalizeDateOnly(item.createdAt)||"No Date"}
                            sx={{ ...F, fontSize:"0.60rem", fontWeight:700, color:"#233971", background:"rgba(35,57,113,0.08)", border:"1px solid rgba(35,57,113,0.15)" }}
                          />
                          <Chip
                            size="small"
                            label="History"
                            sx={{ ...F, fontSize:"0.60rem", fontWeight:700, color:"#2a4a9e", background:"rgba(42,74,158,0.08)", border:"1px solid rgba(42,74,158,0.15)" }}
                          />
                        </Stack>

                        <Box sx={{ flex:1 }}/>

                        <Box sx={{ flexShrink:0 }}>
                          {!selectMode ? (
                            <Stack spacing={0.8}>
                              {/* Edit — baris utama, full width */}
                              <Button
                                size="small"
                                variant="contained"
                                fullWidth
                                startIcon={<EditRoundedIcon sx={{ fontSize:"15px !important" }}/>}
                                onClick={()=>handleEditInEditor(item)}
                                sx={{
                                  ...pill({ fontSize:"12px", py:0.85, boxShadow:"none" }),
                                  background:"linear-gradient(135deg,#1a2d5a,#233971,#2e4fa3)",
                                  "&:hover":{ background:"linear-gradient(135deg,#0f1e3d,#1a2d5a,#233971)", boxShadow:"0 8px 20px rgba(35,57,113,0.28)" },
                                }}
                              >
                                Edit &amp; Generate Ulang
                              </Button>

                              {/* Preview · Download · Delete — baris kedua */}
                              <Stack direction="row" spacing={0.7} alignItems="center">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<VisibilityRoundedIcon sx={{ fontSize:"13px !important" }}/>}
                                  onClick={()=>openPreview(item)}
                                  sx={{
                                    ...pill({ fontSize:"11px", py:0.55, flex:1, minWidth:0 }),
                                    borderColor:"rgba(35,57,113,0.25)",
                                    color:"#233971",
                                    "&:hover":{ borderColor:"rgba(35,57,113,0.5)", background:"rgba(35,57,113,0.05)" },
                                  }}
                                >
                                  Preview
                                </Button>

                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<DownloadRoundedIcon sx={{ fontSize:"13px !important" }}/>}
                                  onClick={()=>handleDownload(item.imageUrl, item.fileName||`generated-${item.id}.png`)}
                                  sx={{
                                    ...pill({ fontSize:"11px", py:0.55, flex:1, minWidth:0 }),
                                    borderColor:"rgba(35,57,113,0.25)",
                                    color:"#233971",
                                    "&:hover":{ borderColor:"rgba(35,57,113,0.5)", background:"rgba(35,57,113,0.05)" },
                                  }}
                                >
                                  Download
                                </Button>

                                <IconButton
                                  onClick={()=>openConfirm("single", item.id)}
                                  size="small"
                                  color="error"
                                  sx={{
                                    borderRadius:"10px",
                                    border:"1px solid #fecaca",
                                    width:30, height:30, flexShrink:0, p:0,
                                    "&:hover":{ background:"#fff1f2" },
                                  }}
                                >
                                  <DeleteOutlineRoundedIcon sx={{ fontSize:14 }}/>
                                </IconButton>
                              </Stack>
                            </Stack>
                          ) : (
                            <Typography
                              sx={{
                                ...F, fontSize:"0.72rem", fontWeight:600,
                                color:isSelected ? "#233971" : "#94a3b8",
                                textAlign:"center", py:0.5,
                              }}
                            >
                              {isSelected ? "✓ Dipilih" : "Tap untuk pilih"}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>

              {/* ══ PAGINATION ══ */}
              <Paper
                elevation={0}
                sx={{
                  mt:1,
                  p:{ xs:"14px 16px",sm:"14px 24px" },
                  borderRadius:"18px",
                  background:"linear-gradient(145deg,#e8edf8 0%,#f0f4fb 60%,#eaf0fb 100%)",
                  border:"1px solid rgba(35,57,113,0.18)",
                  boxShadow:"0 2px 12px rgba(35,57,113,0.07)",
                  position:"relative", overflow:"hidden",
                }}
              >
                <GridViewRoundedIcon aria-hidden sx={{ position:"absolute", right:-8, top:-10, fontSize:88, color:"rgba(35,57,113,0.07)", pointerEvents:"none" }}/>

                <Stack
                  direction={{ xs:"column",sm:"row" }}
                  alignItems={{ xs:"flex-start",sm:"center" }}
                  justifyContent="space-between"
                  spacing={{ xs:2,sm:0 }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box sx={{ width:32, height:32, borderRadius:"10px", background:"linear-gradient(135deg,#233971,#2e4fa3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <GridViewRoundedIcon sx={{ color:"#fff", fontSize:16 }}/>
                    </Box>
                    <Box>
                      <Typography sx={{ ...F, fontWeight:700, fontSize:"0.82rem", color:"#0f172a" }}>
                        Halaman {safePage} dari {totalPages}
                      </Typography>
                      <Typography sx={{ ...F, fontSize:"0.70rem", color:"#94a3b8" }}>
                        {filteredGallery.length} gambar · tampil {Math.min((safePage-1)*perPage+1,filteredGallery.length)}–{Math.min(safePage*perPage,filteredGallery.length)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton
                      onClick={()=>setPage(p=>Math.max(1,p-1))}
                      disabled={safePage===1}
                      size="small"
                      sx={{
                        width:34, height:34, borderRadius:"10px",
                        border:"1px solid rgba(35,57,113,0.22)", background:"rgba(255,255,255,0.85)",
                        "&:hover":{ background:"rgba(35,57,113,0.07)", borderColor:"rgba(35,57,113,0.3)" },
                        "&.Mui-disabled":{ opacity:0.35 },
                      }}
                    >
                      <ChevronLeftRoundedIcon sx={{ fontSize:20, color:"#233971" }}/>
                    </IconButton>

                    {Array.from({ length:totalPages },(_,i)=>i+1)
                      .filter(n=>n===1||n===totalPages||Math.abs(n-safePage)<=1)
                      .reduce((acc,n,i,arr)=>{
                        if(i>0&&n-arr[i-1]>1) acc.push("…");
                        acc.push(n);
                        return acc;
                      },[])
                      .map((n,i)=> n==="…" ? (
                        <Typography key={`e${i}`} sx={{ ...F, fontSize:"0.78rem", color:"#94a3b8", px:0.5 }}>…</Typography>
                      ) : (
                        <Box
                          key={n}
                          onClick={()=>setPage(n)}
                          sx={{
                            width:34, height:34, borderRadius:"10px",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            cursor:"pointer",
                            background: safePage===n ? "linear-gradient(135deg,#233971,#2e4fa3)" : "rgba(255,255,255,0.85)",
                            border: safePage===n ? "1.5px solid #233971" : "1px solid rgba(35,57,113,0.22)",
                            color: safePage===n ? "#fff" : "#64748b",
                            fontSize:"13px", fontWeight:safePage===n ? 800 : 600, ...F,
                            boxShadow: safePage===n ? "0 4px 12px rgba(35,57,113,0.25)" : "none",
                            transition:"all 0.15s",
                            "&:hover": safePage!==n ? { background:"rgba(35,57,113,0.07)", borderColor:"rgba(35,57,113,0.3)", color:"#233971" } : {},
                          }}
                        >
                          {n}
                        </Box>
                      ))}

                    <IconButton
                      onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
                      disabled={safePage===totalPages}
                      size="small"
                      sx={{
                        width:34, height:34, borderRadius:"10px",
                        border:"1px solid rgba(35,57,113,0.22)", background:"rgba(255,255,255,0.85)",
                        "&:hover":{ background:"rgba(35,57,113,0.07)", borderColor:"rgba(35,57,113,0.3)" },
                        "&.Mui-disabled":{ opacity:0.35 },
                      }}
                    >
                      <ChevronRightRoundedIcon sx={{ fontSize:20, color:"#233971" }}/>
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            </>
          )}

          {/* ══ PREVIEW DIALOG ══ */}
          <Dialog
            open={Boolean(previewItem)}
            onClose={()=>setPreviewItem(null)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx:{
                borderRadius:"28px",
                background:"rgba(255,255,255,0.97)",
                backdropFilter:"blur(24px)",
                border:"1px solid rgba(35,57,113,0.22)",
                boxShadow:"0 32px 80px rgba(35,57,113,0.18)",
              }
            }}
          >
            <DialogTitle sx={{ ...F, fontWeight:800, color:"#0f172a", pb:1, borderBottom:"1px solid rgba(226,232,240,0.6)" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ width:36, height:36, borderRadius:"11px", background:"linear-gradient(135deg,#233971,#2e4fa3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <VisibilityRoundedIcon sx={{ color:"#fff", fontSize:18 }}/>
                </Box>
                Preview Hasil Generate
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ pt:2.5, maxHeight:"80vh", overflowY:"auto", overscrollBehavior:"contain" }}>
              {previewItem && (
                <Stack spacing={2.4}>
                  {/* Zoom controls */}
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Typography sx={{ ...F, fontSize:"0.72rem", color:"#94a3b8", fontWeight:600 }}>
                        🖱️ Scroll = zoom · Drag = geser · Pinch = zoom mobile
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Typography sx={{ ...F, fontSize:"0.75rem", color:"#233971", fontWeight:700 }}>
                        {Math.round(previewZoom * 100)}%
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={()=>setPreviewZoom((v) => Math.max(0.25, parseFloat((v - 0.25).toFixed(2))))}
                        sx={{
                          ...F, textTransform:"none", fontWeight:700, fontSize:"0.78rem",
                          borderRadius:"10px", minWidth:40, px:1,
                          borderColor:"rgba(35,57,113,0.25)", color:"#233971",
                          "&:hover":{ background:"rgba(35,57,113,0.07)", borderColor:"rgba(35,57,113,0.4)" },
                        }}
                      >
                        −
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={resetZoom}
                        sx={{
                          ...F, textTransform:"none", fontWeight:700, fontSize:"0.72rem",
                          borderRadius:"10px", minWidth:48, px:1,
                          borderColor:"rgba(35,57,113,0.25)", color:"#64748b",
                          "&:hover":{ background:"rgba(35,57,113,0.06)" },
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={()=>setPreviewZoom((v) => Math.min(5, parseFloat((v + 0.25).toFixed(2))))}
                        sx={{
                          ...F, textTransform:"none", fontWeight:700, fontSize:"0.78rem",
                          borderRadius:"10px", minWidth:40, px:1,
                          borderColor:"rgba(35,57,113,0.25)", color:"#233971",
                          "&:hover":{ background:"rgba(35,57,113,0.07)", borderColor:"rgba(35,57,113,0.4)" },
                        }}
                      >
                        +
                      </Button>
                    </Stack>
                  </Stack>

                    {/* Image container — scroll zoom + drag pan + pinch zoom */}
                    <Box
                    onWheel={handlePreviewWheel}
                    onWheelCapture={handlePreviewWheel}
                      onMouseDown={onMouseDown}
                      onMouseMove={onMouseMove}
                      onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    sx={{
                      width:"100%",
                      height:"62vh",
                      minHeight:260,
                      overflow:"hidden",
                      borderRadius:"20px",
                      background:"linear-gradient(135deg,rgba(232,237,248,0.9),rgba(234,240,251,0.9))",
                      border:"1px solid rgba(35,57,113,0.18)",
                      animation:"fadeR 0.4s ease",
                      display:"flex",
                      justifyContent:"center",
                      alignItems:"center",
                      cursor: isDragging ? "grabbing" : previewZoom > 1 ? "grab" : "zoom-in",
                      userSelect:"none",
                      touchAction:"none",
                      overscrollBehavior:"none",
                    }}
                  >
                    <Box
                      component="img"
                      src={previewItem.imageUrl}
                      alt={previewItem.prompt||"Preview"}
                      sx={{
                        display:"block",
                        maxWidth:"100%",
                        maxHeight:"100%",
                        objectFit:"contain",
                        transform:`translate(${previewPan.x}px,${previewPan.y}px) scale(${previewZoom})`,
                        transformOrigin:"center center",
                        transition: isDragging ? "none" : "transform 0.15s ease",
                        borderRadius:"8px",
                        pointerEvents:"none",
                        userSelect:"none",
                        WebkitUserDrag:"none",
                        draggable:false,
                      }}
                    />
                  </Box>

                  <Paper
                    variant="outlined"
                    sx={{
                      p:2, borderRadius:"16px",
                      background:"rgba(232,237,248,0.6)",
                      border:"1px solid rgba(35,57,113,0.18)",
                    }}
                  >
                    <Typography sx={{ ...F, fontWeight:800, color:"#0f172a", lineHeight:1.5, fontSize:"0.95rem", mb:0.8, wordBreak:"break-word" }}>
                      {previewItem.fileName||previewItem.filename||"-"}
                    </Typography>
                    {(previewItem.createdBy || previewItem.username || previewItem.user) && (
                      <Typography sx={{ ...F, color:"#475569", fontSize:"0.82rem", fontWeight:600, mb:1.2 }}>
                        Created by {previewItem.createdBy || previewItem.username || previewItem.user}
                      </Typography>
                    )}
                    {previewItem.prompt ? (
                      <Box
                        sx={{
                          mb:1.5,
                          p:"10px 14px",
                          borderRadius:"12px",
                          background:"linear-gradient(135deg,rgba(35,57,113,0.06),rgba(46,79,163,0.05))",
                          border:"1px solid rgba(35,57,113,0.15)",
                        }}
                      >
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb:0.6 }}>
                          <AutoFixHighRoundedIcon sx={{ fontSize:14, color:"#233971" }}/>
                          <Typography sx={{ ...F, color:"#233971", fontWeight:800, fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                            Prompt
                          </Typography>
                        </Stack>
                        <Typography sx={{ ...F, color:"#1e293b", lineHeight:1.75, fontSize:"0.87rem", fontWeight:500 }}>
                          {previewItem.prompt}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          mb:1.5,
                          p:"10px 14px",
                          borderRadius:"12px",
                          background:"rgba(248,250,252,0.8)",
                          border:"1px dashed rgba(35,57,113,0.15)",
                        }}
                      >
                        <Typography sx={{ ...F, color:"#94a3b8", fontSize:"0.82rem", fontStyle:"italic" }}>
                          Tidak ada prompt tersedia.
                        </Typography>
                      </Box>
                    )}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthRoundedIcon sx={{ fontSize:13, color:"#94a3b8" }}/>
                      <Typography sx={{ ...F, color:"#94a3b8", fontSize:"0.75rem" }}>
                        {previewItem.createdAt||"-"}
                      </Typography>
                    </Stack>
                  </Paper>

                  <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    <Button
                      variant="contained"
                      startIcon={<EditRoundedIcon/>}
                      onClick={()=>{ setPreviewItem(null); handleEditInEditor(previewItem); }}
                      sx={{
                        borderRadius:"999px", textTransform:"none", fontWeight:700, ...F,
                        background:"linear-gradient(135deg,#233971,#2e4fa3)", boxShadow:"none",
                        "&:hover":{ background:"linear-gradient(135deg,#1a2d5a,#233971)", boxShadow:"0 8px 20px rgba(35,57,113,0.28)" },
                      }}
                    >
                      Edit di Editor
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DownloadRoundedIcon/>}
                      onClick={()=>handleDownload(previewItem.imageUrl, previewItem.fileName||`generated-${previewItem.id}.png`)}
                      sx={{
                        borderRadius:"999px", textTransform:"none", fontWeight:700, ...F,
                        background:"linear-gradient(135deg,#10b981,#34d399)", boxShadow:"none",
                        "&:hover":{ background:"linear-gradient(135deg,#059669,#10b981)", boxShadow:"0 8px 20px rgba(16,185,129,0.28)" },
                      }}
                    >
                      Download Gambar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={()=>setPreviewItem(null)}
                      sx={{
                        borderRadius:"999px", textTransform:"none", fontWeight:700, ...F,
                        borderColor:"rgba(35,57,113,0.25)", color:"#64748b",
                        "&:hover":{ background:"rgba(232,237,248,0.8)" },
                      }}
                    >
                      Tutup
                    </Button>
                  </Stack>
                </Stack>
              )}
            </DialogContent>
          </Dialog>
        </Stack>

        {/* ══ CONFIRM DELETE DIALOG ══ */}
        <Dialog
          open={confirmDialog.open}
          onClose={closeConfirm}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx:{
              borderRadius:"24px",
              background:"rgba(255,255,255,0.97)",
              backdropFilter:"blur(24px)",
              border:"1px solid rgba(254,202,202,0.6)",
              boxShadow:"0 24px 60px rgba(239,68,68,0.14)",
              m:{ xs:2, sm:"auto" },
            }
          }}
        >
          <DialogContent sx={{ p:{ xs:"28px 20px 24px", sm:"32px 32px 28px" } }}>
            <Stack spacing={2.5} alignItems="center" textAlign="center">
              <Box sx={{ position:"relative", width:72, height:72 }}>
                <Box
                  sx={{
                    position:"absolute", inset:0,
                    borderRadius:"50%",
                    border:"2px dashed rgba(239,68,68,0.25)",
                    animation:"spinSlow 8s linear infinite",
                  }}
                />
                <Box
                  sx={{
                    width:"100%", height:"100%",
                    borderRadius:"22px",
                    background:"linear-gradient(135deg,rgba(239,68,68,0.10),rgba(248,113,113,0.08))",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}
                >
                  <DeleteSweepRoundedIcon sx={{ fontSize:36, color:"#ef4444" }}/>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ ...F, fontWeight:800, fontSize:"1.05rem", color:"#0f172a", mb:0.8 }}>
                  {confirmDialog.type === "all"
                    ? "Hapus Semua Gambar?"
                    : confirmDialog.type === "selected"
                    ? `Hapus ${confirmDialog.count} Gambar Terpilih?`
                    : "Hapus Gambar Ini?"}
                </Typography>
                <Typography sx={{ ...F, fontSize:"0.82rem", color:"#64748b", lineHeight:1.7 }}>
                  {confirmDialog.type === "all"
                    ? "Semua item di gallery akan dihapus permanen dan tidak bisa dikembalikan."
                    : confirmDialog.type === "selected"
                    ? `${confirmDialog.count} gambar yang dipilih akan dihapus permanen.`
                    : "Gambar ini akan dihapus permanen dan tidak bisa dikembalikan."}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.2} width="100%">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={closeConfirm}
                  sx={{
                    ...pill({ py:1.1 }),
                    borderColor:"rgba(35,57,113,0.25)",
                    color:"#64748b",
                    background:"rgba(255,255,255,0.8)",
                    "&:hover":{ background:"rgba(232,237,248,0.8)", borderColor:"rgba(35,57,113,0.3)" },
                  }}
                >
                  Batal
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConfirmAction}
                  startIcon={<DeleteSweepRoundedIcon/>}
                  sx={{
                    ...pill({ py:1.1 }),
                    background:"linear-gradient(135deg,#ef4444,#f87171)",
                    boxShadow:"0 6px 18px rgba(239,68,68,0.28)",
                    "&:hover":{ background:"linear-gradient(135deg,#dc2626,#ef4444)", boxShadow:"0 10px 24px rgba(239,68,68,0.35)" },
                  }}
                >
                  Ya, Hapus
                </Button>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>

        {/* ══ SCROLL TO TOP ══ */}
        <Zoom in={showScrollTop}>
          <Box sx={{ position:"fixed", right:{ xs:16,md:26 }, bottom:{ xs:18,md:28 }, zIndex:1400 }}>
            <Tooltip title="Scroll ke atas" placement="left">
              <IconButton
                onClick={handleScrollTop}
                sx={{
                  width:54, height:54, borderRadius:"18px",
                  background:"linear-gradient(135deg,#1a2d5a,#233971,#2e4fa3)",
                  color:"#fff",
                  boxShadow:"0 16px 34px rgba(35,57,113,0.32)",
                  border:"1px solid rgba(255,255,255,0.22)",
                  backdropFilter:"blur(14px)",
                  "&:hover":{
                    background:"linear-gradient(135deg,#0f1e3d,#1a2d5a,#233971)",
                    transform:"translateY(-3px)",
                    boxShadow:"0 20px 40px rgba(35,57,113,0.40)",
                  },
                  transition:"all 0.2s ease",
                }}
              >
                <KeyboardArrowUpRoundedIcon sx={{ fontSize:30 }}/>
              </IconButton>
            </Tooltip>
          </Box>
        </Zoom>
      </Box>
    );
  }
