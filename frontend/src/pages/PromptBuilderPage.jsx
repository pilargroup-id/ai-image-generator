import { useState } from "react"
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
} from "@mui/material"
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded"
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded"
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded"
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded"
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded"
import TuneRoundedIcon from "@mui/icons-material/TuneRounded"
import BrushRoundedIcon from "@mui/icons-material/BrushRounded"

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

/* ─── Card background — matches ImageEditorPage exactly ─── */
function CardBg({ variant = "left" }) {
  const isLeft = variant === "left"
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "inherit" }}>
      <Box sx={{
        position: "absolute", inset: 0,
        background: isLeft
          ? "linear-gradient(145deg, #e8edf8 0%, #f0f4fb 30%, #e6edf9 60%, #eaf0fb 100%)"
          : "linear-gradient(145deg, #eaf0fb 0%, #e6edf9 30%, #f0f4fb 60%, #e8edf8 100%)",
      }} />
      <Box sx={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(35,57,113,0.18) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        animation: "gridPulse 6s ease-in-out infinite",
      }} />
      <Box sx={{ position: "absolute", top: isLeft ? "-20%" : "60%", left: isLeft ? "-10%" : "55%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(35,57,113,0.13) 0%, transparent 70%)", animation: "orbDrift0 14s ease-in-out infinite" }} />
      <Box sx={{ position: "absolute", top: isLeft ? "50%" : "-15%", right: isLeft ? "-8%" : "-10%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(55,80,145,0.10) 0%, transparent 70%)", animation: "orbDrift1 18s ease-in-out infinite 2s" }} />
      <Box sx={{ position: "absolute", bottom: isLeft ? "-10%" : "10%", left: isLeft ? "40%" : "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(35,57,113,0.09) 0%, transparent 70%)", animation: "orbDrift2 22s ease-in-out infinite 4s" }} />
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(35,57,113,0.35), transparent)" }} />
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(35,57,113,0.22), transparent)" }} />
    </Box>
  )
}

/* ─── Badge icon — matches ImageEditorPage exactly ─── */
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

/* ─── Shared styles ─── */
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

const VIEW_ANGLES    = ["Front View", "Side View", "Back View", "3/4 View", "Top View", "Isometric"]
const ASPECT_RATIOS  = ["1:1", "4:3", "16:9", "9:16", "3:4", "2:3"]
const LIGHTING_TYPES = ["Premium Dramatic Lighting", "Soft Natural Lighting", "Studio Lighting", "Golden Hour", "High-Key Lighting", "Low-Key Lighting"]
const DESIGN_TYPES   = ["Marketplace Main Image", "Marketplace Lifestyle Image", "Product Detail Shot", "Infographic Banner", "Social Media Post"]

const DEFAULT_DATA = {
  design_analysis: {
    design_type: "Marketplace Main Image",
    aspect_ratio: "1:1",
    visual_style: "Industrial Safety Product Advertising",
    objective: [
      "Stop scrolling within 1-3 seconds",
      "Instantly highlight the safety vest function",
      "Showcase visibility and workplace safety benefits",
      "Elevate product quality and professional perception",
      "Drive clicks and marketplace conversions",
    ],
  },
  product: {
    name: "VIZOR SAFETY VEST",
    category: "Safety Vest",
    view_angle: "Front View",
    preservation: {
      shape: "Preserve Exact", proportion: "Preserve Exact", material: "Preserve Exact",
      texture: "Preserve Exact", logo: "Preserve Exact", color: "Preserve Exact", details: "Preserve Exact",
    },
  },
  target_market: ["Project Workers", "Field Technicians", "Construction Workers", "HSE Team", "Safety Officer"],
  layout: {
    structure: "Z Pattern",
    sections: {
      top_left: { content: "Brand Header", width: "35%" },
      top_right: { content: "Product Name + Headline", width: "35%" },
      center_left: { content: "Hero Product", width: "70-80%" },
      right_side: { content: "USP Features", width: "20-25%" },
    },
  },
  background: {
    style: "Construction & Industrial Work Environment",
    theme: "High Visibility Safety Area",
    lighting: "Premium Dramatic Lighting",
    tone: "Midtone, Premium, High Contrast",
    blur_level: "Moderate Depth of Field",
    elements: ["Construction Site", "Scaffolding", "Industrial Factory", "Safety Barriers", "Heavy Equipment", "Work Zone"],
    purpose: "Show safety vest usage in high-risk work environments",
  },
  product_display: {
    position: "Center Left", size: "60-70% of canvas", angle: "Front View", floating_effect: false,
    shadow: { type: "Realistic Ground Shadow", opacity: "35-45%" },
    lighting: { type: "Commercial Product Photography", reflection: "Controlled" },
  },
  headline_section: {
    position: "Top Right", alignment: "Right",
    hierarchy: {
      product_name: { text: "VIZOR SAFETY VEST", font_weight: "Extra Bold", color: "#FFFFFF" },
      headline: { text: "High Visibility, Safety Assured", font_weight: "Medium", color: "#FFEE00" },
    },
  },
  usp_section: {
    position: "Right Side", layout: "Vertical Icon List", spacing: "Consistent",
    icon_style: { shape: "Circle", background: "#1E3A8A", icon_color: "#FFFFFF", uniform_size: true },
    items: [
      { icon: "Mesh", title: "Premium Mesh Material" },
      { icon: "Pocket", title: "Functional Pocket" },
      { icon: "Reflective", title: "Strong Reflective" },
    ],
  },
  branding: {
    border: { type: "Brand Border", aspect_ratio: "1:1", preserve_layout: true, header_position: "Top Left" },
  },
  color_palette: { primary: "#1E3A8A", secondary: "#FFD500", accent: "#FFFFFF", text_dark: "#000000" },
  visual_effects: { depth: true, layering: true, realistic_shadow: true, realistic_lighting: true, high_detail: true, premium_finish: true },
  visual_priority: ["Safety Vest Product", "Product Name", "Headline", "USP Features", "Industrial Environment", "Branding"],
  design_formula: { product_focus: "75%", headline: "10%", usp: "10%", branding: "3%", background_support: "2%" },
  rendering_style: {
    quality: "Highest Possible", photorealistic: true, commercial_grade: true, mobile_friendly: true,
    realistic_lighting: true, realistic_shadows: true, high_detail: true, scroll_stopping: true,
  },
}

const DEFAULT_INSTRUCTIONS =
  "Use aspect ratio 1:1. Output at the highest quality possible, with the longest side at most 1920px. Do NOT change the aspect ratio — keep the original image proportions exactly."

export default function PromptBuilderPage() {
  const [data, setData]             = useState(DEFAULT_DATA)
  const [instructions, setInst]     = useState(DEFAULT_INSTRUCTIONS)
  const [copied, setCopied]         = useState(false)
  const [newTarget, setNewTarget]   = useState("")
  const [newElement, setNewEl]      = useState("")
  const [newUsp, setNewUsp]         = useState("")

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

  const generateOutput = () => JSON.stringify(data, null, 2) + "\n\n" + instructions

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOutput())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const addTarget  = () => { if (!newTarget.trim()) return; set("target_market", [...data.target_market, newTarget.trim()]); setNewTarget("") }
  const rmTarget   = i  => set("target_market", data.target_market.filter((_, j) => j !== i))
  const addElement = () => { if (!newElement.trim()) return; set("background.elements", [...data.background.elements, newElement.trim()]); setNewEl("") }
  const rmElement  = i  => set("background.elements", data.background.elements.filter((_, j) => j !== i))
  const addUsp     = () => { if (!newUsp.trim()) return; set("usp_section.items", [...data.usp_section.items, { icon: "Custom", title: newUsp.trim() }]); setNewUsp("") }
  const rmUsp      = i  => set("usp_section.items", data.usp_section.items.filter((_, j) => j !== i))
  const editUsp    = (i, v) => { const items = structuredClone(data.usp_section.items); items[i].title = v; set("usp_section.items", items) }

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

                {/* ── Informasi Desain ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Design Info</Typography>
                    <Chip size="small" label="Design" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
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
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Informasi Produk ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Product Info</Typography>
                    <Chip size="small" label="Product" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
                  <Stack spacing={1.5}>
                    <TextField fullWidth label="Product Name" size="small" value={data.product.name} onChange={e => set("product.name", e.target.value)} helperText="Write in capitals. Example: VIZOR SAFETY VEST" sx={inputSx} />
                    <Stack direction="row" spacing={1.5}>
                      <TextField fullWidth label="Product Category" size="small" value={data.product.category} onChange={e => set("product.category", e.target.value)} sx={inputSx} />
                      <TextField select fullWidth label="View Angle" size="small" value={data.product.view_angle} onChange={e => set("product.view_angle", e.target.value)} sx={inputSx}>
                        {VIEW_ANGLES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                      </TextField>
                    </Stack>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Headline & Teks ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Headline & Text</Typography>
                    <Chip size="small" label="Text" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography sx={{ ...sectionSub, mb: 0.8 }}>Main Title Text</Typography>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <TextField fullWidth size="small" placeholder="Example: VIZOR SAFETY VEST" value={data.headline_section.hierarchy.product_name.text} onChange={e => set("headline_section.hierarchy.product_name.text", e.target.value)} sx={inputSx} />
                        <Box sx={{ flexShrink: 0 }}>
                          <Typography sx={{ ...sectionSub, mb: 0.5, fontSize: "0.72rem" }}>Color</Typography>
                          <Box sx={{ position: "relative", width: 46, height: 34, borderRadius: "10px", border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 6px rgba(35,57,113,0.12)", "&:hover": { borderColor: "rgba(35,57,113,0.45)" } }}>
                            <input type="color" value={data.headline_section.hierarchy.product_name.color} onChange={e => set("headline_section.hierarchy.product_name.color", e.target.value)}
                              style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                    <Box>
                      <Typography sx={{ ...sectionSub, mb: 0.8 }}>Tagline / Headline</Typography>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <TextField fullWidth size="small" placeholder="Example: High Visibility, Safety Assured" value={data.headline_section.hierarchy.headline.text} onChange={e => set("headline_section.hierarchy.headline.text", e.target.value)} sx={inputSx} />
                        <Box sx={{ flexShrink: 0 }}>
                          <Typography sx={{ ...sectionSub, mb: 0.5, fontSize: "0.72rem" }}>Color</Typography>
                          <Box sx={{ position: "relative", width: 46, height: 34, borderRadius: "10px", border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 6px rgba(35,57,113,0.12)", "&:hover": { borderColor: "rgba(35,57,113,0.45)" } }}>
                            <input type="color" value={data.headline_section.hierarchy.headline.color} onChange={e => set("headline_section.hierarchy.headline.color", e.target.value)}
                              style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Target Pasar ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Target Market</Typography>
                    <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.target_market.length} active targets</Typography>
                  </Stack>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mb: 1.5 }}>
                    {data.target_market.map((t, i) => (
                      <Chip key={i} label={t} onDelete={() => rmTarget(i)} size="small"
                        sx={{ borderRadius: "999px", ...F, fontWeight: 600, fontSize: "0.73rem", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)", "& .MuiChip-deleteIcon": { color: "rgba(35,57,113,0.45)", "&:hover": { color: "#233971" } } }} />
                    ))}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                      <input value={newTarget} onChange={e => setNewTarget(e.target.value)} onKeyDown={e => e.key === "Enter" && addTarget()} placeholder="Add target market..." style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                    </Box>
                    <Button variant="contained" onClick={addTarget} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#233971,#2e4fa3)", boxShadow: "0 4px 12px rgba(35,57,113,0.32)", "&:hover": { background: "linear-gradient(135deg,#1a2d5a,#233971)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                      <AddRoundedIcon />
                    </Button>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Latar Belakang ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Background</Typography>
                    <Chip size="small" label="Background" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5}>
                      <TextField fullWidth label="Background Style" size="small" value={data.background.style} onChange={e => set("background.style", e.target.value)} sx={inputSx} />
                      <TextField fullWidth label="Theme" size="small" value={data.background.theme} onChange={e => set("background.theme", e.target.value)} sx={inputSx} />
                    </Stack>
                    <TextField select fullWidth label="Lighting" size="small" value={data.background.lighting} onChange={e => set("background.lighting", e.target.value)} sx={inputSx}>
                      {LIGHTING_TYPES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                    </TextField>
                    <Box>
                      <Typography sx={{ ...sectionSub, mb: 1 }}>Background Elements</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mb: 1.2 }}>
                        {data.background.elements.map((el, i) => (
                          <Chip key={i} label={el} onDelete={() => rmElement(i)} size="small"
                            sx={{ borderRadius: "999px", ...F, fontWeight: 600, fontSize: "0.73rem", background: "rgba(22,101,52,0.08)", color: "#166534", border: "1px solid rgba(22,101,52,0.22)", "& .MuiChip-deleteIcon": { color: "rgba(22,101,52,0.45)", "&:hover": { color: "#166534" } } }} />
                        ))}
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                          <input value={newElement} onChange={e => setNewEl(e.target.value)} onKeyDown={e => e.key === "Enter" && addElement()} placeholder="Example: Scaffolding, Heavy Equipment..." style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                        </Box>
                        <Button variant="contained" onClick={addElement} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#166534,#16a34a)", boxShadow: "0 4px 12px rgba(22,101,52,0.28)", "&:hover": { background: "linear-gradient(135deg,#14532d,#166534)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                          <AddRoundedIcon />
                        </Button>
                      </Stack>
                    </Box>
                    <TextField fullWidth multiline rows={2} label="Background Purpose" size="small" value={data.background.purpose} onChange={e => set("background.purpose", e.target.value)} sx={inputSx} />
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Fitur USP ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography sx={sectionLabel}>Key Features (USP)</Typography>
                    <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.usp_section.items.length} features</Typography>
                  </Stack>
                  <Typography sx={{ ...sectionSub, mb: 1.5 }}>Displayed on the right side of the design as an icon list</Typography>
                  <Stack spacing={1.2}>
                    {data.usp_section.items.map((item, i) => (
                      <Stack key={i} direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#233971,#2e4fa3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(35,57,113,0.28)" }}>
                          <Typography sx={{ ...F, color: "#fff", fontSize: "0.72rem", fontWeight: 800 }}>{i + 1}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                          <input value={item.title} onChange={e => editUsp(i, e.target.value)} placeholder={`Feature ${i + 1}`} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                        </Box>
                        <IconButton onClick={() => rmUsp(i)} disabled={data.usp_section.items.length <= 1} size="small"
                          sx={{ width: 34, height: 34, borderRadius: "10px", border: "1.5px solid rgba(239,68,68,0.25)", color: "#ef4444", background: "rgba(254,242,242,0.6)", "&:hover": { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.45)" }, "&.Mui-disabled": { color: "rgba(148,163,184,0.4)", borderColor: "rgba(148,163,184,0.2)", background: "transparent" } }}>
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px dashed rgba(35,57,113,0.28)", background: "rgba(255,255,255,0.55)", "&:focus-within": { borderColor: "#233971", borderStyle: "solid", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                        <input value={newUsp} onChange={e => setNewUsp(e.target.value)} onKeyDown={e => e.key === "Enter" && addUsp()} placeholder="Add new feature..." style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                      </Box>
                      <Button variant="contained" onClick={addUsp} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#233971,#2e4fa3)", boxShadow: "0 4px 12px rgba(35,57,113,0.32)", "&:hover": { background: "linear-gradient(135deg,#1a2d5a,#233971)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                        <AddRoundedIcon />
                      </Button>
                    </Stack>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Instruksi Tambahan ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography sx={sectionLabel}>Additional Instructions</Typography>
                    <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>Appended after JSON</Typography>
                  </Stack>
                  <Box sx={{ borderRadius: "16px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", transition: "border-color 0.2s, box-shadow 0.2s", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, "&:hover": { borderColor: "rgba(35,57,113,0.35)" }, overflow: "hidden" }}>
                    <textarea value={instructions} onChange={e => setInst(e.target.value)} rows={4}
                      style={{ display: "block", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 90, padding: "14px 16px", fontFamily: "Sora, sans-serif", fontSize: "14px", lineHeight: 1.65, color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                  </Box>
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
                    Configure colors, effects, then copy the full prompt
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Palet Warna ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Color Palette</Typography>
                    <Chip size="small" label="Colors" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
                  <Stack spacing={1.5}>
                    {[
                      { key: "primary",    label: "Primary Color" },
                      { key: "secondary",  label: "Secondary Color" },
                      { key: "accent",     label: "Accent Color" },
                      { key: "text_dark",  label: "Dark Text" },
                    ].map(({ key, label }) => (
                      <Stack key={key} direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ position: "relative", width: 38, height: 38, borderRadius: "10px", border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 8px rgba(35,57,113,0.12)", cursor: "pointer", "&:hover": { borderColor: "rgba(35,57,113,0.5)" }, transition: "border-color 0.2s" }}>
                          <input type="color" value={data.color_palette[key]} onChange={e => set(`color_palette.${key}`, e.target.value)}
                            style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                        </Box>
                        <TextField value={data.color_palette[key]} onChange={e => set(`color_palette.${key}`, e.target.value)}
                          fullWidth size="small" label={label} sx={{ ...inputSx, "& .MuiInputBase-input": { fontFamily: "monospace", fontSize: "0.85rem", letterSpacing: "0.04em" } }} />
                      </Stack>
                    ))}

                    <Divider sx={{ borderColor: "rgba(35,57,113,0.10)", my: 0.5 }} />
                    <Typography sx={{ ...sectionSub, fontWeight: 600 }}>USP Icon Colors</Typography>
                    {[
                      { key: "usp_section.icon_style.background", label: "Icon Background" },
                      { key: "usp_section.icon_style.icon_color", label: "Icon Color" },
                    ].map(({ key, label }) => {
                      const val = key.split(".").reduce((o, k) => o?.[k], data) || "#000000"
                      return (
                        <Stack key={key} direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ position: "relative", width: 38, height: 38, borderRadius: "10px", border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 8px rgba(35,57,113,0.12)", cursor: "pointer", "&:hover": { borderColor: "rgba(35,57,113,0.5)" }, transition: "border-color 0.2s" }}>
                            <input type="color" value={val} onChange={e => set(key, e.target.value)}
                              style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                          </Box>
                          <TextField value={val} onChange={e => set(key, e.target.value)}
                            fullWidth size="small" label={label} sx={{ ...inputSx, "& .MuiInputBase-input": { fontFamily: "monospace", fontSize: "0.85rem" } }} />
                        </Stack>
                      )
                    })}
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Efek Visual ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Visual Effects</Typography>
                    <Chip size="small" label="Effects" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    {[
                      { key: "depth",              label: "Depth Effect" },
                      { key: "layering",            label: "Layering" },
                      { key: "realistic_shadow",    label: "Realistic Shadow" },
                      { key: "realistic_lighting",  label: "Realistic Lighting" },
                      { key: "high_detail",         label: "High Detail" },
                      { key: "premium_finish",      label: "Premium Finish" },
                    ].map(({ key, label }) => (
                      <FormControlLabel key={key}
                        control={<Switch size="small" checked={data.visual_effects[key]} onChange={e => set(`visual_effects.${key}`, e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { bgcolor: data.visual_effects[key] ? "#233971" : undefined }, "& .MuiSwitch-track": { bgcolor: data.visual_effects[key] ? "rgba(35,57,113,0.4) !important" : undefined } }} />}
                        label={<Typography sx={{ ...F, fontSize: "0.8rem", color: "#334155" }}>{label}</Typography>}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Kualitas Render ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Render Quality</Typography>
                    <Chip size="small" label="Rendering" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    {[
                      { key: "photorealistic",     label: "Photorealistic" },
                      { key: "commercial_grade",   label: "Commercial Grade" },
                      { key: "mobile_friendly",    label: "Mobile Friendly" },
                      { key: "realistic_lighting", label: "Realistic Lighting" },
                      { key: "realistic_shadows",  label: "Realistic Shadows" },
                      { key: "high_detail",        label: "High Detail" },
                      { key: "scroll_stopping",    label: "Scroll Stopping" },
                    ].map(({ key, label }) => (
                      <FormControlLabel key={key}
                        control={<Switch size="small" checked={data.rendering_style[key]} onChange={e => set(`rendering_style.${key}`, e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { bgcolor: data.rendering_style[key] ? "#233971" : undefined }, "& .MuiSwitch-track": { bgcolor: data.rendering_style[key] ? "rgba(35,57,113,0.4) !important" : undefined } }} />}
                        label={<Typography sx={{ ...F, fontSize: "0.8rem", color: "#334155" }}>{label}</Typography>}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Hasil Prompt ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                    <Box>
                      <Typography sx={sectionLabel}>Prompt Output</Typography>
                      <Typography sx={{ ...sectionSub, fontSize: "0.75rem", mt: "2px" }}>Click copy → ready to use</Typography>
                    </Box>
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
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.04)" }}>
                      <Stack direction="row" spacing={0.6}>
                        {["#ef4444", "#f59e0b", "#22c55e"].map(c => <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c, opacity: 0.8 }} />)}
                      </Stack>
                      <Typography sx={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>
                        prompt.json
                      </Typography>
                      <Box sx={{ width: 48 }} />
                    </Stack>
                    <Box component="pre" sx={{
                      m: 0, p: 2,
                      fontSize: "0.68rem",
                      fontFamily: "monospace",
                      color: "#e2e8f0",
                      overflowX: "auto",
                      maxHeight: 380,
                      overflowY: "auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      lineHeight: 1.65,
                    }}>
                      {generateOutput()}
                    </Box>
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

