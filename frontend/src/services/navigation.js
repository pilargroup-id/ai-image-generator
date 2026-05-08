import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'
import ZoomOutMapRoundedIcon from '@mui/icons-material/ZoomOutMapRounded'

export const defaultNavigationPath = '/'

export const implementedNavigationPaths = ['/', '/image-editor', '/upscale']

export const primaryNavigationItems = [
  {
    id: 'gallery',
    label: 'Gallery',
    href: '/',
    icon: PhotoLibraryRoundedIcon,
  },
  {
    id: 'image-generator',
    label: 'Image Generator',
    href: '/image-editor',
    icon: AutoAwesomeRoundedIcon,
  },
  {
    id: 'upscale',
    label: 'Upscale Image',
    href: '/upscale',
    icon: ZoomOutMapRoundedIcon,
  },
]

export const secondaryNavigationItems = []
