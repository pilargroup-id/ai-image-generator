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
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded"

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

function SectionHeader({ label, chip, sectionKey, isHidden, onToggle, children }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isHidden ? 0 : 1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={sectionLabel}>{label}</Typography>
        {chip && !isHidden && chip}
      </Stack>
      <Stack direction="row" spacing={0.8} alignItems="center">
        {children}
        <Tooltip title={isHidden ? `Add back ${label}` : `Remove ${label} from prompt`}>
          <IconButton
            size="small"
            onClick={() => onToggle(sectionKey)}
            sx={{
              width: 24, height: 24,
              borderRadius: "8px",
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

const VIEW_ANGLES    = ["Front View", "Side View", "Back View", "Three Quarter Front View", "3/4 View", "Top View", "Isometric"]
const ASPECT_RATIOS  = ["1:1", "4:3", "16:9", "9:16", "3:4", "2:3"]
const LIGHTING_TYPES = ["Soft Natural Daylight", "Premium Dramatic Lighting", "Soft Natural Lighting", "Studio Lighting", "Golden Hour", "High-Key Lighting", "Low-Key Lighting"]
const DESIGN_TYPES   = ["Marketplace Main Image", "Marketplace Lifestyle Image", "Product Detail Shot", "Infographic Banner", "Social Media Post"]

const DEFAULT_DATA = {
  design_analysis: {
    design_type: "Marketplace Main Image",
    aspect_ratio: "1:1",
    visual_style: "Clean Home Product Advertising",
    objective: [
      "Stop scrolling within 1-3 seconds",
      "Instantly highlight effortless cleaning benefit",
      "Showcase mop bucket and spin mop clearly",
      "Communicate practical household cleaning features",
      "Drive clicks and marketplace conversions",
    ],
  },
  product: {
    name: "Spin Mop Ultra 2 in 1",
    category: "Spin Mop Set",
    view_angle: "Three Quarter Front View",
    main_color: "Purple and White",
    preservation: {
      shape: "Preserve Exact", proportion: "Preserve Exact", material: "Preserve Exact",
      texture: "Preserve Exact", logo: "Preserve Exact", color: "Preserve Exact", details: "Preserve Exact",
    },
  },
  target_market: ["Homeowners", "Housewives", "Apartment Residents", "Cleaning Enthusiasts", "Marketplace Shoppers"],
  layout: {
    structure: "Right Heavy Marketplace Layout",
    canvas: { ratio: "1:1", safe_margin: "5%", composition: "Product on left, text and features on right" },
    sections: {
      top_right:    { content: "Feature Icons",                       width: "35%",    alignment: "Horizontal Row" },
      center_left:  { content: "Hero Product",                        width: "55-60%", position: "Lower Left" },
      center_right: { content: "Main Headline and Product Subtitle",  width: "45%",    position: "Upper Right" },
      right_side:   { content: "USP Feature Pills",                   width: "38-42%", position: "Middle Right" },
    },
  },
  background: {
    style: "Modern Bright Kitchen Interior",
    theme: "Clean Home Cleaning Product",
    lighting: "Soft Natural Daylight",
    tone: "Bright, Clean, Minimal, Premium",
    blur_level: "Strong Depth of Field",
    elements: ["Modern Kitchen Counter", "Wooden Cabinet", "White Floor Tiles", "Soft Window Light", "Minimal Home Interior"],
    purpose: "Show product usage in a clean household environment without distracting from the product",
  },
  product_display: {
    position: "Lower Left to Center",
    size: "55-65% of canvas",
    angle: "Three Quarter Front View",
    floating_effect: false,
    shadow: { type: "Soft Realistic Ground Shadow", opacity: "25-35%" },
    lighting: { type: "Commercial Product Photography", reflection: "Soft Controlled Highlights" },
    details: {
      bucket: "White rectangular bucket with purple rim and handle",
      basket: "Visible stainless steel spin basket",
      mop_handle: "Diagonal stainless steel handle with purple grip",
      mop_head: "White microfiber mop head on floor",
      floor_effect: "Small water droplets near mop for cleaning effect",
    },
  },
  top_icon_section: {
    position: "Top Right",
    layout: "Horizontal Icon Row",
    icon_count: 4,
    icon_style: {
      shape: "Circle", outline: "#000000", background: "#F4F4F4",
      icon_color: "#000000", uniform_size: true, style: "Simple Black Line Icon",
    },
    items: [
      { icon: "360 Spin",       title: "360°"       },
      { icon: "Microfiber Cloth", title: "Microfiber" },
      { icon: "Easy Cleaning",  title: "Easy Clean" },
      { icon: "Quality Shield", title: "Quality"    },
    ],
  },
  headline_section: {
    position: "Upper Right",
    alignment: "Right",
    hierarchy: {
      main_headline: {
        text: "BERSIH TANPA EFFORT",
        font_style: "Bold Sans Serif", font_weight: "Extra Bold", case: "Uppercase",
        color: "#000000",
        stroke: { enabled: true, color: "#FFFFFF", width: "3-5px" },
        shadow: { enabled: true, type: "Soft Drop Shadow", opacity: "25%" },
        size: "Very Large", line_height: "Tight",
      },
      subtitle: {
        text: "Spin Mop Ultra 2 in 1",
        font_style: "Italic Modern Sans Serif", font_weight: "Regular",
        color: "#111111", size: "Medium", placement: "Below Main Headline",
      },
    },
  },
  usp_section: {
    position: "Right Side",
    layout: "Vertical Rounded Pill List",
    spacing: "Consistent",
    pill_style: {
      shape: "Rounded Rectangle", background: "#000000", text_color: "#FFFFFF",
      corner_radius: "Large", padding: "Medium",
      shadow: { enabled: true, opacity: "15%" },
    },
    thumbnail_style: {
      shape: "Circle", background: "#FFFFFF", border: "#000000",
      placement: "Left side overlapping each pill", image_style: "Small product feature photo",
    },
    items: [
      { thumbnail: "Spin mop washing and drying inside bucket", title: "Membersihkan\nMengeringkan" },
      { thumbnail: "Close up stainless steel basket",           title: "Stainless\nSteel"          },
      { thumbnail: "Close up white microfiber mop head",        title: "Kain\nMicrofiber"          },
    ],
  },
  color_palette: {
    primary:         "#B66AD8",
    secondary:       "#FFFFFF",
    accent:          "#000000",
    background_soft: "#F4F1EC",
    text_dark:       "#000000",
    text_light:      "#FFFFFF",
  },
  typography: {
    font_family: "Modern Sans-Serif (e.g. Poppins, Nunito, or similar)",
    headline: { style: "Extra Bold Sans Serif", weight: "900", letter_spacing: "Tight", case: "Uppercase" },
    subtitle:  { style: "Italic Sans Serif",     weight: "400" },
    usp:       { style: "Bold Rounded Sans Serif", weight: "800" },
  },
  visual_effects: {
    depth: true, layering: true, realistic_shadow: true, realistic_lighting: true,
    high_detail: true, premium_finish: true, background_blur: true,
    white_text_stroke: true, rounded_black_feature_pills: true,
  },
  visual_priority: [
    "Spin Mop Product", "BERSIH TANPA EFFORT Headline", "Feature Pills",
    "Product Subtitle", "Top Icons", "Kitchen Background",
  ],
  design_formula: {
    product_focus: "55%", headline: "20%", usp: "15%",
    icons: "5%", background_support: "2%",
  },
  rendering_style: {
    quality: "Highest Possible", photorealistic: true, commercial_grade: true,
    mobile_friendly: true, realistic_lighting: true, realistic_shadows: true,
    high_detail: true, scroll_stopping: true, marketplace_ready: true,
  },
  output_spec: {
    aspect_ratio: "1:1", max_longest_side: "1920px",
    preserve_original_image_proportions: true,
    do_not_change_aspect_ratio: true, recommended_resolution: "1920x1920",
  },
  negative_prompt: [
    "Do not create industrial safety background",
    "Do not use construction site",
    "Do not use scaffolding",
    "Do not use safety vest",
    "Do not change the product shape",
    "Do not remove the mop bucket",
    "Do not crop the main product",
    "Do not make the text small",
    "Do not use cluttered background",
    "Do not use dark kitchen background",
    "Do not distort logo",
    "Do not add extra products",
  ],
}

const DEFAULT_INSTRUCTIONS =
  "Use aspect ratio 1:1. Output at the highest quality possible, with the longest side at most 1920px. Do NOT change the aspect ratio — keep the original image proportions exactly."

export default function PromptBuilderGTPage() {
  const [data, setData]           = useState(DEFAULT_DATA)
  const [instructions, setInst]   = useState(DEFAULT_INSTRUCTIONS)
  const [copied, setCopied]       = useState(false)
  const [newTarget, setNewTarget] = useState("")
  const [newElement, setNewEl]    = useState("")
  const [newUsp, setNewUsp]       = useState("")
  const [newNeg, setNewNeg]       = useState("")
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

  const generateOutput = () => {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([k]) => !hidden.has(k))
    )
    const extras = instructions.trim() ? "\n\n" + instructions : ""
    return JSON.stringify(filtered, null, 2) + extras
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOutput())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const addTarget  = () => { if (!newTarget.trim()) return; set("target_market", [...data.target_market, newTarget.trim()]); setNewTarget("") }
  const rmTarget   = i  => set("target_market", data.target_market.filter((_, j) => j !== i))
  const addElement = () => { if (!newElement.trim()) return; set("background.elements", [...data.background.elements, newElement.trim()]); setNewEl("") }
  const rmElement  = i  => set("background.elements", data.background.elements.filter((_, j) => j !== i))
  const addUsp     = () => { if (!newUsp.trim()) return; set("usp_section.items", [...data.usp_section.items, { thumbnail: "", title: newUsp.trim() }]); setNewUsp("") }
  const rmUsp      = i  => set("usp_section.items", data.usp_section.items.filter((_, j) => j !== i))
  const editUsp    = (i, v) => { const items = structuredClone(data.usp_section.items); items[i].title = v; set("usp_section.items", items) }
  const addNeg     = () => { if (!newNeg.trim()) return; set("negative_prompt", [...data.negative_prompt, newNeg.trim()]); setNewNeg("") }
  const rmNeg      = i  => set("negative_prompt", data.negative_prompt.filter((_, j) => j !== i))

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
            <CardBadgeIcon icon={<ShoppingBagRoundedIcon />} gradient="linear-gradient(135deg,#233971 0%,#2e4fa3 60%,#5b7ec7 100%)" glow="rgba(35,57,113,0.45)" />

            <CardContent sx={{ p: { xs: 3, md: "36px 36px" }, position: "relative", zIndex: 2 }}>
              <Stack spacing={3}>

                {/* Header */}
                <Box>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Typography variant="h6" sx={{ ...F, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                      Prompt Builder GT
                    </Typography>
                  </Stack>
                  <Typography sx={{ ...F, fontSize: "0.82rem", color: "#64748b", mt: "2px" }}>
                    Template marketplace home product — JSON prompt auto-generated
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Design Info ── */}
                <Box>
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

                {/* ── Product Info ── */}
                <Box>
                  <SectionHeader label="Product Info" sectionKey="product" isHidden={isHidden("product")} onToggle={toggleHide}
                  />
                  <Collapse in={!isHidden("product")}>
                    <Stack spacing={1.5}>
                      <TextField fullWidth label="Product Name" size="small" value={data.product.name} onChange={e => set("product.name", e.target.value)} helperText="Product name. Example: Spin Mop Ultra 2 in 1" sx={inputSx} />
                      <Stack direction="row" spacing={1.5}>
                        <TextField fullWidth label="Product Category" size="small" value={data.product.category} onChange={e => set("product.category", e.target.value)} sx={inputSx} />
                        <TextField select fullWidth label="View Angle" size="small" value={data.product.view_angle} onChange={e => set("product.view_angle", e.target.value)} sx={inputSx}>
                          {VIEW_ANGLES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                        </TextField>
                      </Stack>
                      <TextField fullWidth label="Main Color" size="small" value={data.product.main_color} onChange={e => set("product.main_color", e.target.value)} helperText="Main product color. Example: Purple and White" sx={inputSx} />
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Headline & Text ── */}
                <Box>
                  <SectionHeader label="Headline & Text" sectionKey="headline_section" isHidden={isHidden("headline_section")} onToggle={toggleHide}
                    chip={<Chip size="small" label="Text" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />}
                  />
                  <Collapse in={!isHidden("headline_section")}>
                    <Stack spacing={1.5}>
                      <TextField fullWidth label="Font Family" size="small" value={data.typography.font_family} onChange={e => set("typography.font_family", e.target.value)} helperText="Font used across the design. Example: Poppins, Nunito, Montserrat" sx={inputSx} />
                      <Box>
                        <Typography sx={{ ...sectionSub, mb: 0.8 }}>Main Headline</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <TextField fullWidth size="small" placeholder="Contoh: BERSIH TANPA EFFORT" value={data.headline_section.hierarchy.main_headline.text} onChange={e => set("headline_section.hierarchy.main_headline.text", e.target.value)} sx={inputSx} />
                          <Box sx={{ flexShrink: 0 }}>
                            <Typography sx={{ ...sectionSub, mb: 0.5, fontSize: "0.72rem" }}>Color</Typography>
                            <Box sx={{ position: "relative", width: 46, height: 34, borderRadius: "10px", border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 6px rgba(35,57,113,0.12)", "&:hover": { borderColor: "rgba(35,57,113,0.45)" } }}>
                              <input type="color" value={data.headline_section.hierarchy.main_headline.color} onChange={e => set("headline_section.hierarchy.main_headline.color", e.target.value)}
                                style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography sx={{ ...sectionSub, mb: 0.8 }}>Subtitle / Product Name</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <TextField fullWidth size="small" placeholder="Contoh: Spin Mop Ultra 2 in 1" value={data.headline_section.hierarchy.subtitle.text} onChange={e => set("headline_section.hierarchy.subtitle.text", e.target.value)} sx={inputSx} />
                          <Box sx={{ flexShrink: 0 }}>
                            <Typography sx={{ ...sectionSub, mb: 0.5, fontSize: "0.72rem" }}>Color</Typography>
                            <Box sx={{ position: "relative", width: 46, height: 34, borderRadius: "10px", border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 6px rgba(35,57,113,0.12)", "&:hover": { borderColor: "rgba(35,57,113,0.45)" } }}>
                              <input type="color" value={data.headline_section.hierarchy.subtitle.color} onChange={e => set("headline_section.hierarchy.subtitle.color", e.target.value)}
                                style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Target Market ── */}
                <Box>
                  <SectionHeader label="Target Market" sectionKey="target_market" isHidden={isHidden("target_market")} onToggle={toggleHide}>
                    {!isHidden("target_market") && <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.target_market.length} active</Typography>}
                  </SectionHeader>
                  <Collapse in={!isHidden("target_market")}>
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
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Background ── */}
                <Box>
                  <SectionHeader label="Background" sectionKey="background" isHidden={isHidden("background")} onToggle={toggleHide}
                    chip={<Chip size="small" label="Background" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />}
                  />
                  <Collapse in={!isHidden("background")}>
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
                            <input value={newElement} onChange={e => setNewEl(e.target.value)} onKeyDown={e => e.key === "Enter" && addElement()} placeholder="Example: Wooden Cabinet, White Tiles..." style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
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

                {/* ── Key Features (USP) ── */}
                <Box>
                  <SectionHeader label="Key Features (USP)" sectionKey="usp_section" isHidden={isHidden("usp_section")} onToggle={toggleHide}>
                    {!isHidden("usp_section") && <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.usp_section.items.length} features</Typography>}
                  </SectionHeader>
                  <Collapse in={!isHidden("usp_section")}>
                    <Typography sx={{ ...sectionSub, mb: 1.5 }}>Displayed as pill list on the right side of the design</Typography>
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
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Negative Prompt ── */}
                <Box>
                  <SectionHeader label="Negative Prompt" sectionKey="negative_prompt" isHidden={isHidden("negative_prompt")} onToggle={toggleHide}>
                    {!isHidden("negative_prompt") && <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.negative_prompt.length} rules</Typography>}
                  </SectionHeader>
                  <Collapse in={!isHidden("negative_prompt")}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mb: 1.5 }}>
                      {data.negative_prompt.map((t, i) => (
                        <Chip key={i} label={t} onDelete={() => rmNeg(i)} size="small"
                          sx={{ borderRadius: "999px", ...F, fontWeight: 600, fontSize: "0.71rem", background: "rgba(239,68,68,0.06)", color: "#b91c1c", border: "1px solid rgba(239,68,68,0.22)", "& .MuiChip-deleteIcon": { color: "rgba(239,68,68,0.45)", "&:hover": { color: "#ef4444" } } }} />
                      ))}
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(239,68,68,0.25)", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.08)" }, overflow: "hidden" }}>
                        <input value={newNeg} onChange={e => setNewNeg(e.target.value)} onKeyDown={e => e.key === "Enter" && addNeg()} placeholder="Add restriction... Example: Do not crop the product" style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                      </Box>
                      <Button variant="contained" onClick={addNeg} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#dc2626,#ef4444)", boxShadow: "0 4px 12px rgba(239,68,68,0.28)", "&:hover": { background: "linear-gradient(135deg,#b91c1c,#dc2626)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                        <AddRoundedIcon />
                      </Button>
                    </Stack>
                  </Collapse>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Additional Instructions ── */}
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
                    Set colors & effects, then copy the full prompt
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Color Palette ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Color Palette</Typography>
                    <Chip size="small" label="Colors" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
                  <Stack spacing={1.5}>
                    {[
                      { key: "primary",         label: "Primary Color (Purple)" },
                      { key: "secondary",        label: "Secondary Color (White)" },
                      { key: "accent",           label: "Accent Color (Black)" },
                      { key: "background_soft",  label: "Background Soft" },
                      { key: "text_dark",        label: "Dark Text" },
                      { key: "text_light",       label: "Light Text" },
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

                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Visual Effects ── */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography sx={sectionLabel}>Visual Effects</Typography>
                    <Chip size="small" label="Effects" sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", borderRadius: "999px", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.22)" }} />
                  </Stack>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    {[
                      { key: "depth",                        label: "Depth Effect" },
                      { key: "layering",                     label: "Layering" },
                      { key: "realistic_shadow",             label: "Realistic Shadow" },
                      { key: "realistic_lighting",           label: "Realistic Lighting" },
                      { key: "high_detail",                  label: "High Detail" },
                      { key: "premium_finish",               label: "Premium Finish" },
                      { key: "background_blur",              label: "Background Blur" },
                      { key: "white_text_stroke",            label: "White Text Stroke" },
                      { key: "rounded_black_feature_pills",  label: "Feature Pills" },
                    ].map(({ key, label }) => (
                      <FormControlLabel key={key}
                        control={<Switch size="small" checked={!!data.visual_effects[key]} onChange={e => set(`visual_effects.${key}`, e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { bgcolor: data.visual_effects[key] ? "#233971" : undefined }, "& .MuiSwitch-track": { bgcolor: data.visual_effects[key] ? "rgba(35,57,113,0.4) !important" : undefined } }} />}
                        label={<Typography sx={{ ...F, fontSize: "0.8rem", color: "#334155" }}>{label}</Typography>}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Render Quality ── */}
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
                      { key: "marketplace_ready",  label: "Marketplace Ready" },
                    ].map(({ key, label }) => (
                      <FormControlLabel key={key}
                        control={<Switch size="small" checked={!!data.rendering_style[key]} onChange={e => set(`rendering_style.${key}`, e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { bgcolor: data.rendering_style[key] ? "#233971" : undefined }, "& .MuiSwitch-track": { bgcolor: data.rendering_style[key] ? "rgba(35,57,113,0.4) !important" : undefined } }} />}
                        label={<Typography sx={{ ...F, fontSize: "0.8rem", color: "#334155" }}>{label}</Typography>}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Prompt Output ── */}
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
                      Prompt copied — paste directly into AI image generator!
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
                        prompt-gt.json
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
