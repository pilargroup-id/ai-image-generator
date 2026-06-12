import { useState, useEffect } from "react"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Tooltip,
  Collapse,
} from "@mui/material"
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded"
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded"
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded"
import BrushRoundedIcon from "@mui/icons-material/BrushRounded"
import LayersRoundedIcon from "@mui/icons-material/LayersRounded"
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"

/* ─── Fonts & Animations ─── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    @keyframes orbDrift0 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-18px) scale(1.04)} }
    @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.03)} }
    @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(16px,18px) scale(1.05)} }
    @keyframes gridPulse { 0%,100%{opacity:0.45} 50%{opacity:0.7} }
  `}</style>
)

function CardBadgeIcon({ icon, gradient, glow }) {
  return (
    <Box sx={{
      position: "absolute", top: -22, right: 28,
      width: 54, height: 54, borderRadius: "17px",
      background: gradient,
      boxShadow: `0 10px 28px ${glow}, 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.35)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "2.5px solid rgba(255,255,255,0.55)", zIndex: 10,
      "& svg": { fontSize: 24, color: "#fff", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" },
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": { transform: "translateY(-5px) rotate(8deg)", boxShadow: `0 18px 36px ${glow}, 0 4px 12px rgba(0,0,0,0.2)` },
    }}>
      {icon}
    </Box>
  )
}

const F = { fontFamily: "'Sora',sans-serif" }

const cardShell = {
  borderRadius: "24px",
  border: "1px solid rgba(35,57,113,0.18)",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05), 0 16px 40px -8px rgba(35,57,113,0.13), inset 0 1px 0 rgba(255,255,255,0.9)",
  overflow: "hidden",
  position: "relative",
  transition: "box-shadow 0.3s ease, border-color 0.3s ease",
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0,0,0,0.07), 0 24px 52px -8px rgba(35,57,113,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
    borderColor: "rgba(35,57,113,0.35)",
  },
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(8px)",
    ...F,
    "& fieldset": { borderColor: "rgba(35,57,113,0.25)" },
    "&:hover fieldset": { borderColor: "rgba(35,57,113,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#233971", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { ...F, "&.Mui-focused": { color: "#233971" } },
  "& .MuiFormHelperText-root": { ...F },
}

const sectionLabel = { ...F, fontWeight: 700, fontSize: "0.83rem", color: "#1e293b" }
const sectionSub   = { ...F, fontSize: "0.78rem", color: "#64748b" }

const nativeInputSx = {
  display: "block", width: "100%", boxSizing: "border-box",
  padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px",
  color: "#1e293b", background: "transparent", border: "none", outline: "none",
}

const nativeWrapSx = {
  flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)",
  background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", overflow: "hidden",
  "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" },
}

const darkEditorSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    background: "rgba(15,23,42,0.98)",
    backdropFilter: "blur(8px)",
    color: "#e2e8f0",
    fontFamily: "monospace",
    "& fieldset": { borderColor: "rgba(148,163,184,0.24)" },
    "&:hover fieldset": { borderColor: "rgba(148,163,184,0.42)" },
    "&.Mui-focused fieldset": { borderColor: "#94a3b8", borderWidth: "1.5px" },
    "& textarea": {
      color: "#e2e8f0",
      fontFamily: "monospace",
      fontSize: "0.78rem",
      lineHeight: 1.65,
    },
  },
  "& .MuiInputLabel-root": { ...F, color: "#cbd5e1", "&.Mui-focused": { color: "#e2e8f0" } },
  "& .MuiFormHelperText-root": { ...F, color: "#94a3b8" },
}

const colorSwatchBorder = "1px solid rgba(15,23,42,0.12)"

const getColorPreview = (value) => {
  const color = typeof value === "string" && value.trim() ? value.trim() : "#cbd5e1"
  return {
    background: color,
    border: colorSwatchBorder,
  }
}

function SectionHeader({ label, chip, sectionKey, isHidden, onToggle, children }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isHidden ? 0 : 1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={sectionLabel}>{label}</Typography>
        {chip && !isHidden && chip}
      </Stack>
      <Stack direction="row" spacing={0.8} alignItems="center">
        {children}
        <Tooltip title={isHidden ? `Tambahkan kembali ${label}` : `Hapus ${label} dari prompt`}>
          <IconButton
            size="small"
            onClick={() => onToggle(sectionKey)}
            sx={{
              width: 24, height: 24, borderRadius: "8px",
              border: isHidden ? "1.5px solid rgba(35,57,113,0.35)" : "1.5px solid rgba(239,68,68,0.3)",
              color: isHidden ? "#233971" : "#ef4444",
              background: isHidden ? "rgba(35,57,113,0.06)" : "rgba(239,68,68,0.05)",
              "&:hover": {
                background: isHidden ? "rgba(35,57,113,0.12)" : "rgba(239,68,68,0.1)",
                borderColor: isHidden ? "#233971" : "#ef4444",
              },
              "& svg": { fontSize: "14px !important" },
            }}
          >
            {isHidden ? <AddRoundedIcon /> : <CloseRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}

const VIEW_ANGLES   = ["Front View", "Side View", "Back View", "3/4 View", "Top View", "Isometric"]
const ASPECT_RATIOS = ["1:1", "4:3", "16:9", "9:16", "3:4", "2:3"]
const DESIGN_TYPES  = ["Marketplace Main Image", "Marketplace Lifestyle Image", "Product Detail Shot", "Infographic Banner", "Social Media Post"]

const ADVANCED_SECTIONS = [
  { key: "rule_number_one_most_important", label: "Rule #1" },
  { key: "layout_instructions_do_not_render_as_text", label: "Layout Instructions" },
  { key: "product_display", label: "Product Display" },
  { key: "headline_styling", label: "Headline Styling" },
  { key: "usp_styling", label: "USP Styling" },
]

const DEFAULT_DATA = {
  rule_number_one_most_important:
    "Use the provided 1 reference image as the visual and style reference. Use aspect ratio 1:1. Output at the highest quality possible, with the longest side at most 1920px. Do NOT change the aspect ratio - keep the original image proportions exactly.",

  design_analysis: {
    design_type: "Marketplace Main Image",
    aspect_ratio: "1:1",
    visual_style: "Industrial Safety Eyewear Product Advertising",
    objective: [
      "Menghentikan scrolling dalam 1-3 detik",
      "Menonjolkan fungsi perlindungan mata secara instan",
      "Menunjukkan kombinasi tampilan fashion dan keamanan kerja",
      "Meningkatkan persepsi produk yang modern, nyaman, dan profesional",
      "Mendorong klik dan konversi marketplace",
    ],
  },

  visible_text_whitelist: {
    instruction: "ONLY the texts listed below may appear as visible text in the image. Nothing else.",
    product_name: "ECO BRAVA FASHION SAFETY GLASSES",
    tagline: "Gaya Dalam Safety",
    usp_labels: ["Anti UV", "Waterproof", "Anti-Dust"],
  },

  product: {
    name: "ECO BRAVA FASHION SAFETY GLASSES",
    category: "Safety Glasses",
    view_angle: "Front 3/4 View",
    preservation:
      "Preserve exact shape, proportion, material, texture, logo, color, and all details. Do not redesign or alter the product.",
  },

  target_market_context:
    "Pekerja proyek, teknisi lapangan, operator mesin, pekerja industri, tim K3, Safety Officer",

  layout_instructions_do_not_render_as_text: {
    note: "Everything in this section describes WHERE to place elements. These are layout directions only - never draw, print, or display any of these words inside the image.",
    structure: "Z Pattern",
    badge_reserved_area:
      "The top-left area shows the GOSAVE Border Header. Keep a safe margin of at least 5 percent from the canvas edges.",
    headline_zone:
      "Place the product name and headline in the top-right area, right-aligned.",
    hero_zone:
      "Place the hero product in the center-left area, sized around 70-80 percent of the canvas.",
    usp_zone:
      "Place the USP feature list vertically on the right side.",
    frame_clearance:
      "Keep all text and icons at least 5 percent away from every edge.",
  },

  background: {
    style: "Industrial Work Environment",
    theme: "Modern Safety Workplace",
    lighting: "Premium Dramatic Product Lighting",
    depth_of_field: "Moderate Depth of Field",
    elements: ["Construction Site", "Workshop Area", "Industrial Factory", "Safety Equipment Area", "Machinery Background", "Work Zone"],
    purpose: "Menunjukkan penggunaan safety glasses pada lingkungan kerja dengan perlindungan maksimal",
  },

  product_display: {
    position: "Center Left",
    size: "70-80% of canvas",
    angle: "Front 3/4 View",
    shadow: "Realistic Soft Ground Shadow",
    lighting: "Commercial Product Photography with controlled lens reflection and rim light",
  },

  headline_styling: {
    placement: "Top Right",
    alignment: "Right",
    product_name_style:
      "Extra bold, clean white sans-serif, large, with a thin soft drop shadow",
    tagline_style:
      "Medium weight, safety-yellow, smaller than the product name",
  },

  usp_styling: {
    placement: "Right Side",
    layout: "Vertical Icon List",
    icon_style:
      "Three uniform circular icons, deep navy blue with white pictograms. These three small circles are the only graphic shapes allowed in the entire image.",
    label_style:
      "Short white text label below each icon, typed directly on the photo with a thin soft drop shadow",
    icons: [
      "UV Protection",
      "Water Drop",
      "Dust Shield",
    ],
  },

  color_palette: {
    note: "Use these as color directions only - never display color codes as text in the image.",
    primary: "#1E3A8A",
    secondary: "#FFD500",
    accent: "#FFFFFF",
    text_dark: "#000000",
    background_dark: "#1A1A1A",
    lens_accent: "#C0C0C0",
  },

  visual_effects: {
    depth: true,
    layering: true,
    realistic_shadow: true,
    realistic_lighting: true,
    high_detail: true,
    premium_finish: true,
    lens_reflection_effect: true,
  },

  visual_priority: [
    "Safety Glasses Product",
    "Product Name",
    "Protection Features",
    "USP Features",
    "Industrial Environment",
    "Branding",
  ],

  design_formula: {
    product_focus: "75%",
    headline: "10%",
    usp: "10%",
    branding: "3%",
    background_support: "2%",
  },

  rendering_style: {
    quality: "Highest Possible",
    photorealistic: true,
    commercial_grade: true,
    mobile_friendly: true,
    realistic_lighting: true,
    realistic_shadows: true,
    high_detail: true,
    scroll_stopping: true,
  },

  final_instructions:
    "Use a 1:1 aspect ratio, longest side at most 1920px. Do NOT change the aspect ratio - keep the original image proportions exactly. Use the provided 1 reference image as visual and style reference. Do not invent new product styling, background concepts, or extra creative elements beyond the supplied prompt data.",
}

export default function PromptBuilderPage() {
  const [data, setData]           = useState(DEFAULT_DATA)
  const [copied, setCopied]       = useState(false)
  const [manualPromptMode, setManualPromptMode] = useState(false)
  const [manualPromptText, setManualPromptText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [matchIndex, setMatchIndex] = useState(0)
  const [newElement, setNewEl]    = useState("")
  const [newUspLabel, setNewUspLabel] = useState("")
  const [newUspIcon, setNewUspIcon]   = useState("")
  const [hidden, setHidden]       = useState(new Set())

  const toggleHide = (key) => setHidden(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })
  const isHidden = (key) => hidden.has(key)

  const set = (path, value) => {
    setData(prev => {
      const next = structuredClone(prev)
      const keys = path.split(".")
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const setProductName = (val) => {
    setData(prev => {
      const next = structuredClone(prev)
      next.visible_text_whitelist.product_name = val
      next.product.name = val
      return next
    })
  }

  const generateOutput = () => {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([k]) => !hidden.has(k))
    )
    return JSON.stringify(filtered, null, 2)
  }

  const outputText = manualPromptMode ? manualPromptText : generateOutput()

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchActive = normalizedSearch.length > 0

  const getMatchCount = (text, query) => {
    if (!query) return 0
    let count = 0
    let idx = 0
    const lower = text.toLowerCase()
    while ((idx = lower.indexOf(query, idx)) !== -1) { count++; idx++ }
    return count
  }

  const matchCount = searchActive ? getMatchCount(outputText, normalizedSearch) : 0

  useEffect(() => { setMatchIndex(0) }, [normalizedSearch])

  useEffect(() => {
    if (!searchActive || matchCount === 0) return
    const el = document.getElementById(`json-match-${matchIndex}`)
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [matchIndex, normalizedSearch, searchActive, matchCount])

  const goPrev = () => setMatchIndex(i => (i - 1 + matchCount) % matchCount)
  const goNext = () => setMatchIndex(i => (i + 1) % matchCount)

  const highlightText = (text, query, activeIdx) => {
    if (!query) return [<span key="all">{text}</span>]
    const parts = []
    const lower = text.toLowerCase()
    let last = 0
    let idx = 0
    let spanKey = 0
    let matchNum = 0
    while ((idx = lower.indexOf(query, last)) !== -1) {
      if (idx > last) parts.push(<span key={spanKey++}>{text.slice(last, idx)}</span>)
      const isActive = matchNum === activeIdx
      parts.push(
        <mark
          key={spanKey++}
          id={`json-match-${matchNum}`}
          style={{
            background: isActive ? "#f97316" : "#facc15",
            color: "#0f172a",
            borderRadius: "3px",
            padding: "0 2px",
            outline: isActive ? "2px solid #fb923c" : "none",
            outlineOffset: "1px",
          }}
        >
          {text.slice(idx, idx + query.length)}
        </mark>
      )
      last = idx + query.length
      matchNum++
    }
    if (last < text.length) parts.push(<span key={spanKey++}>{text.slice(last)}</span>)
    return parts
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const toggleManualPromptMode = () => {
    setManualPromptMode(prev => {
      const next = !prev
      if (next && !manualPromptText.trim()) {
        setManualPromptText(generateOutput())
      }
      return next
    })
  }

  const addElement = () => {
    if (!newElement.trim()) return
    set("background.elements", [...data.background.elements, newElement.trim()])
    setNewEl("")
  }
  const rmElement = (i) => set("background.elements", data.background.elements.filter((_, j) => j !== i))

  const addUsp = () => {
    if (!newUspLabel.trim()) return
    setData(prev => {
      const next = structuredClone(prev)
      next.visible_text_whitelist.usp_labels.push(newUspLabel.trim())
      next.usp_styling.icons.push(newUspIcon.trim() || `Custom icon for '${newUspLabel.trim()}'`)
      return next
    })
    setNewUspLabel("")
    setNewUspIcon("")
  }
  const rmUsp = (i) => {
    setData(prev => {
      const next = structuredClone(prev)
      next.visible_text_whitelist.usp_labels = next.visible_text_whitelist.usp_labels.filter((_, j) => j !== i)
      next.usp_styling.icons = next.usp_styling.icons.filter((_, j) => j !== i)
      return next
    })
  }
  const editUspLabel = (i, v) => {
    setData(prev => {
      const next = structuredClone(prev)
      next.visible_text_whitelist.usp_labels[i] = v
      return next
    })
  }
  const editUspIcon = (i, v) => {
    setData(prev => {
      const next = structuredClone(prev)
      next.usp_styling.icons[i] = v
      return next
    })
  }

  return (
    <Box sx={{ position: "relative", ...F }}>
      <FontStyle />

      <Stack spacing={3}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="stretch">

          {/* ══════════════════════════
              LEFT CARD — Form Input
          ══════════════════════════ */}
          <Card elevation={0} sx={{ ...cardShell, flex: 1.1 }}>
            <Box sx={{ position: "absolute", bottom: 0, left: 0, width: 130, height: 130, borderRadius: "0 28px 0 24px", background: "linear-gradient(135deg,rgba(35,57,113,0.10) 0%,rgba(46,79,163,0.14) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <EditNoteRoundedIcon sx={{ fontSize: 52, color: "#233971", opacity: 0.35, transform: "rotate(-8deg)" }} />
            </Box>
            <Box sx={{ position: "absolute", top: 0, right: 0, width: 160, height: 160, borderRadius: "0 24px 0 40px", background: "linear-gradient(135deg,rgba(35,57,113,0.08) 0%,rgba(46,79,163,0.12) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <ArticleRoundedIcon sx={{ fontSize: 76, color: "#233971", opacity: 0.14, transform: "rotate(-10deg)" }} />
            </Box>
            <CardBadgeIcon icon={<AutoFixHighRoundedIcon />} gradient="linear-gradient(135deg,#233971 0%,#2e4fa3 60%,#5b7ec7 100%)" glow="rgba(35,57,113,0.45)" />

            <CardContent sx={{ p: { xs: 3, md: "36px 36px" }, position: "relative", zIndex: 2 }}>
              <Stack spacing={3}>

                {/* Header */}
                <Box>
                  <Typography variant="h6" sx={{ ...F, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    Prompt Builder Form
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.82rem", color: "#64748b", mt: "2px" }}>
                    Fill in the form below — JSON prompt is auto-generated
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Design Info ── */}
                <Box data-section-key="design_analysis">
                  <SectionHeader label="Design Info" sectionKey="design_analysis" isHidden={isHidden("design_analysis")} onToggle={toggleHide}
                    chip={<Chip size="small" label="Design" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />}
                  />
                  <Collapse in={!isHidden("design_analysis")}>
                    <Stack spacing={1.5}>
                      <TextField select fullWidth label="Design Type" size="small" value={data.design_analysis.design_type} onChange={e => set("design_analysis.design_type", e.target.value)} sx={inputSx}>
                        {DESIGN_TYPES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                      </TextField>
                      <Stack direction="row" spacing={1.5}>
                        <TextField select fullWidth label="Aspect Ratio" size="small" value={data.design_analysis.aspect_ratio} onChange={e => set("design_analysis.aspect_ratio", e.target.value)} sx={inputSx}>
                          {ASPECT_RATIOS.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                        </TextField>
                        <TextField fullWidth label="Visual Style" size="small" value={data.design_analysis.visual_style} onChange={e => set("design_analysis.visual_style", e.target.value)} sx={inputSx} />
                      </Stack>
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Visible Text Whitelist ── */}
                <Box data-section-key="visible_text_whitelist">
                  <SectionHeader label="Visible Text" sectionKey="visible_text_whitelist" isHidden={isHidden("visible_text_whitelist")} onToggle={toggleHide}
                    chip={<Chip size="small" label="Text" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />}
                  />
                  <Collapse in={!isHidden("visible_text_whitelist")}>
                    <Stack spacing={1.5}>
                      <TextField
                        fullWidth label="Product Name" size="small"
                        value={data.visible_text_whitelist.product_name}
                        onChange={e => setProductName(e.target.value)}
                        helperText="Auto-synced with product.name — write in capitals"
                        sx={inputSx}
                      />
                      <TextField
                        fullWidth label="Tagline / Headline" size="small"
                        value={data.visible_text_whitelist.tagline}
                        onChange={e => set("visible_text_whitelist.tagline", e.target.value)}
                        sx={inputSx}
                      />
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Key Features (USP) ── */}
                <Box data-section-key="visible_text_whitelist-usp">
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={sectionLabel}>Key Features (USP)</Typography>
                      <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.visible_text_whitelist.usp_labels.length} features</Typography>
                    </Stack>
                    <Typography sx={{ ...sectionSub, fontSize: "0.72rem", fontStyle: "italic" }}>edits both whitelist & styling</Typography>
                  </Stack>
                  <Typography sx={{ ...sectionSub, mb: 1.5 }}>Each item updates the text whitelist and the icon description for USP styling</Typography>
                  <Stack spacing={1.5}>
                    {data.visible_text_whitelist.usp_labels.map((label, i) => (
                      <Box key={i} sx={{ border: "1.5px solid rgba(35,57,113,0.15)", borderRadius: "16px", p: 1.5, background: "rgba(35,57,113,0.025)" }}>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <Box sx={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#233971,#2e4fa3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: "2px", boxShadow: "0 4px 10px rgba(35,57,113,0.28)" }}>
                            <Typography sx={{ ...F, color: "#fff", fontSize: "0.7rem", fontWeight: 800 }}>{i + 1}</Typography>
                          </Box>
                          <Stack sx={{ flex: 1 }} spacing={1}>
                            <Box sx={{ ...nativeWrapSx }}>
                              <input
                                value={label}
                                onChange={e => editUspLabel(i, e.target.value)}
                                placeholder={`Label text (e.g. Premium Mesh Material)`}
                                style={nativeInputSx}
                              />
                            </Box>
                            <Box sx={{ ...nativeWrapSx, borderStyle: "dashed" }}>
                              <input
                                value={data.usp_styling.icons[i] || ""}
                                onChange={e => editUspIcon(i, e.target.value)}
                                placeholder={`Icon description (e.g. Mesh fabric pictogram for '...')`}
                                style={{ ...nativeInputSx, fontSize: "13px", color: "#475569" }}
                              />
                            </Box>
                          </Stack>
                          <IconButton
                            onClick={() => rmUsp(i)}
                            disabled={data.visible_text_whitelist.usp_labels.length <= 1}
                            size="small"
                            sx={{ width: 34, height: 34, borderRadius: "10px", border: "1.5px solid rgba(239,68,68,0.25)", color: "#ef4444", background: "rgba(254,242,242,0.6)", "&:hover": { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.45)" }, "&.Mui-disabled": { color: "rgba(148,163,184,0.4)", borderColor: "rgba(148,163,184,0.2)", background: "transparent" } }}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                      </Stack>
                    </Box>
                  ))}

                    {/* Add new USP */}
                    <Box sx={{ border: "1.5px dashed rgba(35,57,113,0.25)", borderRadius: "16px", p: 1.5, background: "rgba(255,255,255,0.5)" }}>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ ...nativeWrapSx, borderStyle: "dashed" }}>
                            <input
                              value={newUspLabel}
                              onChange={e => setNewUspLabel(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && addUsp()}
                              placeholder="Label text..."
                              style={nativeInputSx}
                            />
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ ...nativeWrapSx, borderStyle: "dashed" }}>
                            <input
                              value={newUspIcon}
                              onChange={e => setNewUspIcon(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && addUsp()}
                              placeholder="Icon description (optional)..."
                              style={{ ...nativeInputSx, fontSize: "13px", color: "#475569" }}
                            />
                          </Box>
                          <Button variant="contained" onClick={addUsp} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#233971,#2e4fa3)", boxShadow: "0 4px 12px rgba(35,57,113,0.32)", "&:hover": { background: "linear-gradient(135deg,#1a2d5a,#233971)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                            <AddRoundedIcon />
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Product Info ── */}
                <Box data-section-key="product">
                  <SectionHeader label="Product Info" sectionKey="product" isHidden={isHidden("product")} onToggle={toggleHide}
                    chip={<Chip size="small" label="Product" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />}
                  />
                  <Collapse in={!isHidden("product")}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5}>
                        <TextField fullWidth label="Product Category" size="small" value={data.product.category} onChange={e => set("product.category", e.target.value)} sx={inputSx} />
                        <TextField select fullWidth label="View Angle" size="small" value={data.product.view_angle} onChange={e => set("product.view_angle", e.target.value)} sx={inputSx}>
                          {VIEW_ANGLES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                        </TextField>
                      </Stack>
                      <TextField fullWidth multiline rows={2} label="Preservation Instruction" size="small" value={data.product.preservation} onChange={e => set("product.preservation", e.target.value)} sx={inputSx} />
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Target Market ── */}
                <Box data-section-key="target_market_context">
                  <SectionHeader label="Target Market" sectionKey="target_market_context" isHidden={isHidden("target_market_context")} onToggle={toggleHide} />
                  <Collapse in={!isHidden("target_market_context")}>
                    <TextField
                      fullWidth multiline rows={2} size="small"
                      label="Target Market Context"
                      value={data.target_market_context}
                      onChange={e => set("target_market_context", e.target.value)}
                      helperText="Single description of who this product is for"
                      sx={inputSx}
                    />
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Background ── */}
                <Box data-section-key="background">
                  <SectionHeader label="Background" sectionKey="background" isHidden={isHidden("background")} onToggle={toggleHide}
                    chip={<Chip size="small" label="Background" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />}
                  />
                  <Collapse in={!isHidden("background")}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5}>
                        <TextField fullWidth label="Background Style" size="small" value={data.background.style} onChange={e => set("background.style", e.target.value)} sx={inputSx} />
                        <TextField fullWidth label="Theme" size="small" value={data.background.theme} onChange={e => set("background.theme", e.target.value)} sx={inputSx} />
                      </Stack>
                      <TextField fullWidth label="Lighting" size="small" value={data.background.lighting} onChange={e => set("background.lighting", e.target.value)} sx={inputSx} />
                      <TextField fullWidth label="Depth of Field" size="small" value={data.background.depth_of_field} onChange={e => set("background.depth_of_field", e.target.value)} sx={inputSx} />
                      <Box>
                        <Typography sx={{ ...sectionSub, mb: 1 }}>Background Elements</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mb: 1.2 }}>
                          {data.background.elements.map((el, i) => (
                            <Chip key={i} label={el} onDelete={() => rmElement(i)} size="small"
                              sx={{ borderRadius: "999px", ...F, fontWeight: 600, fontSize: "0.73rem", background: "rgba(22,101,52,0.08)", color: "#166534", border: "1px solid rgba(22,101,52,0.22)", "& .MuiChip-deleteIcon": { color: "rgba(22,101,52,0.45)", "&:hover": { color: "#166534" } } }} />
                          ))}
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Box sx={{ ...nativeWrapSx }}>
                            <input value={newElement} onChange={e => setNewEl(e.target.value)} onKeyDown={e => e.key === "Enter" && addElement()} placeholder="Example: Scaffolding, Heavy Equipment..." style={nativeInputSx} />
                          </Box>
                          <Button variant="contained" onClick={addElement} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#166534,#16a34a)", boxShadow: "0 4px 12px rgba(22,101,52,0.28)", "&:hover": { background: "linear-gradient(135deg,#14532d,#166534)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                            <AddRoundedIcon />
                          </Button>
                        </Stack>
                      </Box>
                      <TextField fullWidth multiline rows={2} label="Background Purpose" size="small" value={data.background.purpose} onChange={e => set("background.purpose", e.target.value)} sx={inputSx} />
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Final Instructions ── */}
                <Box data-section-key="final_instructions">
                  <SectionHeader label="Final Instructions" sectionKey="final_instructions" isHidden={isHidden("final_instructions")} onToggle={toggleHide}>
                    {!isHidden("final_instructions") && <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>End of prompt</Typography>}
                  </SectionHeader>
                  <Collapse in={!isHidden("final_instructions")}>
                    <Box sx={{ borderRadius: "16px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", transition: "border-color 0.2s, box-shadow 0.2s", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, "&:hover": { borderColor: "rgba(35,57,113,0.35)" }, overflow: "hidden" }}>
                      <textarea value={data.final_instructions} onChange={e => set("final_instructions", e.target.value)} rows={5}
                        style={{ display: "block", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 100, padding: "14px 16px", fontFamily: "Sora, sans-serif", fontSize: "14px", lineHeight: 1.65, color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                    </Box>
                  </Collapse>
                </Box>

              </Stack>
            </CardContent>
          </Card>

          {/* ══════════════════════════
              RIGHT CARD — Config & Output
          ══════════════════════════ */}
          <Card elevation={0} sx={{ ...cardShell, flex: 1 }}>
            <Box sx={{ position: "absolute", bottom: 0, left: 0, width: 130, height: 130, borderRadius: "0 28px 0 24px", background: "linear-gradient(135deg,rgba(35,57,113,0.10) 0%,rgba(26,82,118,0.14) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <BrushRoundedIcon sx={{ fontSize: 52, color: "#233971", opacity: 0.35, transform: "rotate(12deg)" }} />
            </Box>
            <Box sx={{ position: "absolute", top: 0, right: 0, width: 160, height: 160, borderRadius: "0 24px 0 40px", background: "linear-gradient(135deg,rgba(35,57,113,0.08) 0%,rgba(46,79,163,0.12) 100%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
              <ColorLensRoundedIcon sx={{ fontSize: 76, color: "#233971", opacity: 0.14, transform: "rotate(-8deg)" }} />
            </Box>
            <CardBadgeIcon icon={<PaletteRoundedIcon />} gradient="linear-gradient(135deg,#233971 0%,#2e4fa3 60%,#5b7ec7 100%)" glow="rgba(35,57,113,0.45)" />

            <CardContent sx={{ p: { xs: 3, md: "36px 36px" }, position: "relative", zIndex: 2 }}>
              <Stack spacing={3}>

                {/* Header */}
                <Box>
                  <Typography variant="h6" sx={{ ...F, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    Configuration & Output
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.82rem", color: "#64748b", mt: "2px" }}>
                    Toggle structural sections, colors, then copy the prompt
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Advanced Sections Toggle ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography sx={sectionLabel}>Structural Sections</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <LayersRoundedIcon sx={{ fontSize: 14, color: "#64748b" }} />
                      <Typography sx={{ ...sectionSub, fontSize: "0.72rem" }}>click to toggle</Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ ...sectionSub, mb: 1.5 }}>Include or exclude these sections from the generated JSON</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {ADVANCED_SECTIONS.map(({ key, label }) => {
                      const included = !isHidden(key)
                      return (
                        <Chip
                          key={key}
                          label={label}
                          onClick={() => toggleHide(key)}
                          sx={{
                            cursor: "pointer", ...F, fontWeight: 600, fontSize: "0.75rem",
                            borderRadius: "999px",
                            background: included ? "linear-gradient(135deg,#233971,#2e4fa3)" : "rgba(35,57,113,0.06)",
                            color: included ? "#fff" : "#94a3b8",
                            border: included ? "none" : "1px solid rgba(35,57,113,0.18)",
                            transition: "all 0.2s",
                            "& .MuiChip-label": { px: 1.5 },
                            "&:hover": {
                              background: included ? "linear-gradient(135deg,#1a2d5a,#233971)" : "rgba(35,57,113,0.12)",
                              color: included ? "#fff" : "#233971",
                            },
                          }}
                        />
                      )
                    })}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Color Palette ── */}
                <Box data-section-key="color_palette">
                  <SectionHeader label="Color Palette" sectionKey="color_palette" isHidden={isHidden("color_palette")} onToggle={toggleHide}
                    chip={<Chip size="small" label="Colors" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />}
                  />
                  <Collapse in={!isHidden("color_palette")}>
                    <Stack spacing={1.2}>
                      <Typography sx={{ ...sectionSub, mb: 0.5 }}>
                        You can keep using hex values, but the swatch preview shows the color visually.
                      </Typography>
                      {[
                        { key: "primary",   label: "Primary Color",   placeholder: "e.g. deep navy blue" },
                        { key: "secondary", label: "Secondary Color", placeholder: "e.g. safety yellow" },
                        { key: "accent",    label: "Accent Color",    placeholder: "e.g. white" },
                        { key: "text_dark", label: "Dark Text Color", placeholder: "e.g. black" },
                      ].map(({ key, label, placeholder }) => (
                        <Stack key={key} direction="row" spacing={1.2} alignItems="center">
                          <Box
                            aria-hidden
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: "14px",
                              flexShrink: 0,
                              ...getColorPreview(data.color_palette[key]),
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 12px rgba(15,23,42,0.08)",
                            }}
                          />
                          <TextField
                            fullWidth size="small" label={label}
                            placeholder={placeholder}
                            value={data.color_palette[key]}
                            onChange={e => set(`color_palette.${key}`, e.target.value)}
                            sx={inputSx}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Rendering Style ── */}
                <Box data-section-key="rendering_style">
                  <SectionHeader label="Rendering Style" sectionKey="rendering_style" isHidden={isHidden("rendering_style")} onToggle={toggleHide}
                    chip={<Chip size="small" label="Rendering" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />}
                  />
                  <Collapse in={!isHidden("rendering_style")}>
                    <Stack spacing={1.5}>
                      <TextField fullWidth label="Quality" size="small" value={data.rendering_style.quality} onChange={e => set("rendering_style.quality", e.target.value)} sx={inputSx} />
                      <TextField fullWidth multiline rows={2} label="Effects" size="small" value={data.rendering_style.effects} onChange={e => set("rendering_style.effects", e.target.value)} sx={inputSx} />
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", mt: 0.5 }}>
                        {[
                          { key: "mobile_friendly", label: "Mobile Friendly" },
                          { key: "scroll_stopping", label: "Scroll Stopping" },
                        ].map(({ key, label }) => (
                          <FormControlLabel key={key}
                            control={<Switch size="small" checked={data.rendering_style[key]} onChange={e => set(`rendering_style.${key}`, e.target.checked)}
                              sx={{ "& .MuiSwitch-thumb": { bgcolor: data.rendering_style[key] ? "#233971" : undefined }, "& .MuiSwitch-track": { bgcolor: data.rendering_style[key] ? "rgba(35,57,113,0.4) !important" : undefined } }} />}
                            label={<Typography sx={{ ...F, fontSize: "0.8rem", color: "#334155" }}>{label}</Typography>}
                          />
                        ))}
                      </Box>
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Prompt Output ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                    <Box>
                      <Typography sx={sectionLabel}>Prompt Output</Typography>
                      <Typography sx={{ ...sectionSub, fontSize: "0.75rem", mt: "2px" }}>Click copy → ready to use</Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FormControlLabel
                        control={<Switch checked={manualPromptMode} onChange={toggleManualPromptMode} size="small" />}
                        label={<Typography sx={{ ...F, fontSize: "0.75rem", color: "#334155" }}>Manual edit</Typography>}
                        sx={{ mr: 0, "& .MuiFormControlLabel-label": { ml: 0.5 } }}
                      />
                      <Tooltip title={copied ? "Copied!" : "Copy full prompt"}>
                        <Button
                          variant="contained"
                          size="medium"
                          startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyIcon />}
                          onClick={handleCopy}
                          sx={{
                            borderRadius: "999px", px: 2.5, py: 1,
                            textTransform: "none", ...F, fontWeight: 700, fontSize: "0.85rem",
                            background: copied ? "linear-gradient(135deg,#166534,#16a34a)" : "linear-gradient(135deg,#233971,#2e4fa3)",
                            boxShadow: copied ? "0 6px 18px rgba(22,101,52,0.32)" : "0 6px 18px rgba(35,57,113,0.32)",
                            "&:hover": { background: copied ? "linear-gradient(135deg,#14532d,#166534)" : "linear-gradient(135deg,#1a2d5a,#233971)", transform: "translateY(-1px)", boxShadow: copied ? "0 10px 26px rgba(22,101,52,0.38)" : "0 10px 26px rgba(35,57,113,0.42)" },
                            transition: "all 0.25s ease",
                          }}
                        >
                          {copied ? "Copied!" : "Copy Prompt"}
                        </Button>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {copied && (
                    <Alert severity="success" sx={{ borderRadius: "12px", ...F, fontSize: "0.8rem", mb: 1.5, border: "1px solid rgba(35,57,113,0.18)", background: "rgba(232,237,248,0.9)", "& .MuiAlert-icon": { color: "#233971" }, color: "#233971" }}>
                      Prompt copied — paste directly into your AI image generator!
                    </Alert>
                  )}

                  <Box sx={{
                    borderRadius: "16px",
                    border: "1.5px solid rgba(35,57,113,0.2)",
                    background: "rgba(15,23,42,0.96)",
                    backdropFilter: "blur(8px)",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}>
                    <Stack direction="row" alignItems="center" sx={{ px: 1.5, py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.04)", gap: 1.5 }}>
                      {/* dots */}
                      <Stack direction="row" spacing={0.6} flexShrink={0}>
                        {["#ef4444", "#f59e0b", "#22c55e"].map(c => <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c, opacity: 0.8 }} />)}
                      </Stack>

                      {/* filename */}
                      <Typography sx={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                        prompt.json
                      </Typography>

                      {/* spacer */}
                      <Box sx={{ flex: 1 }} />

                      {/* search input */}
                      <TextField
                        size="small"
                        placeholder="Search JSON..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") goNext() }}
                        sx={{
                          width: 150,
                          "& .MuiOutlinedInput-root": {
                            height: 26,
                            borderRadius: "999px",
                            background: "rgba(15,23,42,0.85)",
                            color: "#e2e8f0",
                            fontSize: "0.72rem",
                            "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.24)" },
                            "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.32)" },
                          },
                          "& input": {
                            color: "#e2e8f0",
                            padding: "4px 12px",
                            fontSize: "0.72rem",
                            "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus": {
                              WebkitBoxShadow: "0 0 0 100px rgba(15,23,42,0.98) inset",
                              WebkitTextFillColor: "#e2e8f0",
                              transition: "background-color 5000s ease-in-out 0s",
                            },
                          },
                          "& input::placeholder": { color: "rgba(226,232,240,0.45)", opacity: 1 },
                        }}
                      />

                      {/* match counter + prev/next */}
                      {searchActive && (
                        <Stack direction="row" spacing={0.4} alignItems="center" flexShrink={0}>
                          <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: matchCount > 0 ? "#facc15" : "rgba(226,232,240,0.45)", minWidth: 42, textAlign: "center" }}>
                            {matchCount > 0 ? `${matchIndex + 1}/${matchCount}` : "0 hasil"}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={goPrev}
                            disabled={matchCount === 0}
                            sx={{ width: 22, height: 22, borderRadius: "6px", color: "#e2e8f0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", "&:hover": { background: "rgba(255,255,255,0.12)" }, "&.Mui-disabled": { opacity: 0.3 }, "& svg": { fontSize: "16px !important" } }}
                          >
                            <KeyboardArrowUpRoundedIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={goNext}
                            disabled={matchCount === 0}
                            sx={{ width: 22, height: 22, borderRadius: "6px", color: "#e2e8f0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", "&:hover": { background: "rgba(255,255,255,0.12)" }, "&.Mui-disabled": { opacity: 0.3 }, "& svg": { fontSize: "16px !important" } }}
                          >
                            <KeyboardArrowDownRoundedIcon />
                          </IconButton>
                        </Stack>
                      )}

                      {/* clear */}
                      {searchActive && (
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery("")}
                          sx={{ width: 22, height: 22, borderRadius: "6px", color: "rgba(226,232,240,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", "&:hover": { background: "rgba(255,255,255,0.1)", color: "#e2e8f0" }, "& svg": { fontSize: "13px !important" } }}
                        >
                          <CloseRoundedIcon />
                        </IconButton>
                      )}
                    </Stack>
                    {manualPromptMode ? (
                      <Box
                        component="textarea"
                        value={manualPromptText}
                        onChange={e => setManualPromptText(e.target.value)}
                        spellCheck={false}
                        sx={{
                          display: "block", width: "100%", m: 0, p: 2,
                          fontSize: "0.68rem", fontFamily: "monospace",
                          color: "#e2e8f0", background: "transparent",
                          border: "none", outline: "none", resize: "vertical",
                          minHeight: 420, lineHeight: 1.65,
                          whiteSpace: "pre-wrap", wordBreak: "break-word",
                          boxSizing: "border-box",
                          "&::selection": { background: "rgba(148,163,184,0.3)" },
                        }}
                      />
                    ) : (
                      <Box component="pre" sx={{
                        m: 0, p: 2,
                        fontSize: "0.68rem", fontFamily: "monospace",
                        color: "#e2e8f0", overflowX: "auto",
                        maxHeight: 420, overflowY: "auto",
                        whiteSpace: "pre-wrap", wordBreak: "break-word",
                        lineHeight: 1.65,
                      }}>
                        {searchActive ? highlightText(outputText, normalizedSearch, matchIndex) : outputText}
                      </Box>
                    )}
                  </Box>
                </Box>

              </Stack>
            </CardContent>
          </Card>

        </Stack>
      </Stack>
    </Box>
  )
}















