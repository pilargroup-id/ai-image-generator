export const GALLERY_SEARCH_PARAM_KEY     = 'q'
export const GALLERY_DATE_FROM_PARAM_KEY  = 'from'
export const GALLERY_DATE_TO_PARAM_KEY    = 'to'
export const GALLERY_CREATED_BY_PARAM_KEY = 'by'

function readOptionalSearchParam(searchParams, key) {
  return searchParams.get(key)?.trim() ?? ''
}

export function readGalleryFilterState(searchParams) {
  return {
    search:    readOptionalSearchParam(searchParams, GALLERY_SEARCH_PARAM_KEY),
    dateFrom:  readOptionalSearchParam(searchParams, GALLERY_DATE_FROM_PARAM_KEY),
    dateTo:    readOptionalSearchParam(searchParams, GALLERY_DATE_TO_PARAM_KEY),
    createdBy: readOptionalSearchParam(searchParams, GALLERY_CREATED_BY_PARAM_KEY),
  }
}

export function buildGalleryFilterSearchParams(searchParams, nextValues) {
  const nextSearchParams = new URLSearchParams(searchParams)

  Object.entries(nextValues).forEach(([key, value]) => {
    const normalizedValue = String(value ?? '').trim()

    if (normalizedValue) {
      nextSearchParams.set(key, normalizedValue)
      return
    }

    nextSearchParams.delete(key)
  })

  return nextSearchParams
}

export function resetGalleryFilterSearchParams(searchParams) {
  return buildGalleryFilterSearchParams(searchParams, {
    [GALLERY_SEARCH_PARAM_KEY]:     '',
    [GALLERY_DATE_FROM_PARAM_KEY]:  '',
    [GALLERY_DATE_TO_PARAM_KEY]:    '',
    [GALLERY_CREATED_BY_PARAM_KEY]: '',
  })
}

export function hasActiveGalleryFilters({ search = '', dateFrom = '', dateTo = '', createdBy = '' }) {
  return Boolean(search || dateFrom || dateTo || createdBy)
}
