import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  KeyboardArrowDownRounded as KeyboardArrowDownRoundedIcon,
  MenuRounded as MenuRoundedIcon,
  NotificationsRounded as NotificationsRoundedIcon,
  RefreshRounded as RefreshRoundedIcon,
  SearchRounded as SearchRoundedIcon,
  CloseRounded as CloseRoundedIcon,
} from '@mui/icons-material'

import logoPiagam from '../../assets/logo-piagam (1).svg'
import logoPiagamTransparent from '../../assets/logo-piagam2.svg'
import '../../style/templateComponents.css'
import {
  ALL_DEPARTMENTS_FILTER_ID,
  ALL_DEPARTMENTS_FILTER_LABEL,
  getDepartmentFilterOptions,
  getSelectedDepartmentFilterLabel,
} from '../../services/departmentFilter.js'

function getBreadcrumbKey(item, index) {
  return item.id ?? item.href ?? item.label ?? index
}

function getToolbarActionKey(action, index) {
  return action.id ?? action.title ?? action.ariaLabel ?? action.label ?? index
}

function renderBreadcrumbItem(item, index) {
  const isActive = Boolean(item.active)
  const hasClickableHandler = typeof item.onClick === 'function'
  const isLink = Boolean(item.href) && !hasClickableHandler
  const sharedClassName = `breadcrumb-link${isActive ? ' active' : ''}`
  const separator = index > 0 ? <span className="breadcrumb-separator">/</span> : null

  if (isLink) {
    return (
      <div className="breadcrumb-item" key={getBreadcrumbKey(item, index)}>
        {separator}
        <a
          href={item.href}
          className={sharedClassName}
          onClick={(event) => {
            if (item.href === '#') {
              event.preventDefault()
            }
          }}
        >
          {item.label}
        </a>
      </div>
    )
  }

  return (
    <div className="breadcrumb-item" key={getBreadcrumbKey(item, index)}>
      {separator}
      <button
        type="button"
        className={`${sharedClassName} breadcrumb-link--button`}
        onClick={(event) => {
          item.onClick?.(event)
        }}
      >
        {item.label}
      </button>
    </div>
  )
}

function Header({
  title = 'Framelens',
  subtitle = '',
  breadcrumb = [],
  breadcrumbContent = null,
  onMenuToggle,
  notificationProps,
  onRefresh,
  searchProps,
  showMenuButton = false,
  toolbarActions = [],
  departmentFilterProps,
}) {
  const hasSearch = Boolean(searchProps)
  const hasNotification = Boolean(notificationProps)
  const hasBreadcrumbItems = Array.isArray(breadcrumb) && breadcrumb.length > 0
  const hasBreadcrumbContent = Boolean(breadcrumbContent)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false)
  const [departmentDropdownStyle, setDepartmentDropdownStyle] = useState(null)
  const departmentDropdownTriggerRef = useRef(null)
  const departmentDropdownRef = useRef(null)

  const departmentFilterOptions = useMemo(() => {
    if (!departmentFilterProps) {
      return []
    }

    return getDepartmentFilterOptions(departmentFilterProps.departments)
  }, [departmentFilterProps])

  const selectedDepartmentLabel = useMemo(() => {
    if (!departmentFilterProps) {
      return ALL_DEPARTMENTS_FILTER_LABEL
    }

    return getSelectedDepartmentFilterLabel(
      departmentFilterProps.departments,
      departmentFilterProps.selectedDepartmentId,
    )
  }, [departmentFilterProps])

  const resolvedToolbarActions = [
    ...(hasNotification
      ? [
          {
            id: 'header-notifications',
            ariaLabel: notificationProps.ariaLabel ?? 'Open notifications',
            title: notificationProps.ariaLabel ?? 'Open notifications',
            icon: <NotificationsRoundedIcon fontSize="small" />,
            onClick: () => setIsNotificationModalOpen(true),
          },
        ]
      : []),
    ...(typeof onRefresh === 'function'
      ? [
          {
            id: 'header-refresh',
            ariaLabel: 'Refresh dashboard',
            title: 'Refresh dashboard',
            icon: <RefreshRoundedIcon fontSize="small" />,
            onClick: onRefresh,
          },
        ]
      : []),
    ...(Array.isArray(toolbarActions) ? toolbarActions : []),
  ]

  useEffect(() => {
    if (!isNotificationModalOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsNotificationModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isNotificationModalOpen])

  useEffect(() => {
    if (!isDepartmentDropdownOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (departmentDropdownTriggerRef.current?.contains(event.target)) {
        return
      }

      if (departmentDropdownRef.current?.contains(event.target)) {
        return
      }

      setIsDepartmentDropdownOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDepartmentDropdownOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDepartmentDropdownOpen])

  useLayoutEffect(() => {
    if (!isDepartmentDropdownOpen) {
      return undefined
    }

    const updateDropdownPosition = () => {
      const triggerElement = departmentDropdownTriggerRef.current

      if (!triggerElement) {
        return
      }

      const triggerBounds = triggerElement.getBoundingClientRect()
      const minimumWidth = 220
      const preferredWidth = Math.max(triggerBounds.width, minimumWidth)
      const viewportWidth = window.innerWidth
      const nextLeft = Math.min(
        triggerBounds.left,
        Math.max(12, viewportWidth - preferredWidth - 12),
      )

      setDepartmentDropdownStyle({
        top: triggerBounds.bottom + 8,
        left: Math.max(12, nextLeft),
        minWidth: preferredWidth,
      })
    }

    updateDropdownPosition()

    window.addEventListener('resize', updateDropdownPosition)
    window.addEventListener('scroll', updateDropdownPosition, true)

    return () => {
      window.removeEventListener('resize', updateDropdownPosition)
      window.removeEventListener('scroll', updateDropdownPosition, true)
    }
  }, [isDepartmentDropdownOpen])

  const departmentDropdownPortal =
    isDepartmentDropdownOpen && typeof document !== 'undefined' && departmentDropdownStyle
      ? createPortal(
          <div
            className="breadcrumb-dropdown breadcrumb-dropdown--floating"
            id="breadcrumb-departments-dropdown"
            role="menu"
            ref={departmentDropdownRef}
            style={departmentDropdownStyle}
          >
            {departmentFilterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`breadcrumb-dropdown__option${
                  option.id ===
                  (departmentFilterProps.selectedDepartmentId ?? ALL_DEPARTMENTS_FILTER_ID)
                    ? ' active'
                    : ''
                }`}
                onClick={() => {
                  departmentFilterProps.onSelect?.(option.id)
                  setIsDepartmentDropdownOpen(false)
                }}
              >
                <span className="breadcrumb-dropdown__label">{option.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )
      : null

  const breadcrumbNodes = (() => {
    if (departmentFilterProps) {
      const nodes = [
        <div className="breadcrumb-item breadcrumb-item--group" key="department-filter">
          <div className="breadcrumb-group">
            <button
              ref={departmentDropdownTriggerRef}
              type="button"
              className="breadcrumb-link breadcrumb-link--button active"
              onClick={() => setIsDepartmentDropdownOpen((currentValue) => !currentValue)}
              aria-expanded={isDepartmentDropdownOpen}
              aria-controls="breadcrumb-departments-dropdown"
            >
              <span>{selectedDepartmentLabel}</span>
              <KeyboardArrowDownRoundedIcon
                fontSize="inherit"
                aria-hidden="true"
                className={`breadcrumb-dropdown-icon${isDepartmentDropdownOpen ? ' open' : ''}`}
              />
            </button>
          </div>
        </div>,
      ]

      if (departmentFilterProps.isLoading) {
        nodes.push(
          <span className="breadcrumb-status" key="department-loading">
            Memuat divisi...
          </span>,
        )
      }

      if (departmentFilterProps.error) {
        nodes.push(
          <span className="breadcrumb-status breadcrumb-status--error" key="department-error">
            {departmentFilterProps.error}
          </span>,
        )
      }

      if (hasBreadcrumbContent) {
        nodes.push(
          <div className="breadcrumb-item breadcrumb-item--content" key="breadcrumb-content">
            {breadcrumbContent}
          </div>,
        )
      }

      return nodes
    }

    const items = Array.isArray(breadcrumb) ? breadcrumb : []
    const nodes = []

    items.forEach((item, index) => {
      nodes.push(renderBreadcrumbItem(item, index))
    })

    if (hasBreadcrumbContent) {
      nodes.push(
        <div className="breadcrumb-item breadcrumb-item--content" key="breadcrumb-content">
          {breadcrumbContent}
        </div>,
      )
    }

    return nodes
  })()

  const hasSecondaryRow =
    hasBreadcrumbItems ||
    hasBreadcrumbContent ||
    Boolean(departmentFilterProps) ||
    hasSearch ||
    resolvedToolbarActions.length > 0

  const toolbarNodes = [
    ...(hasSearch
      ? [
          <label
            key="header-search"
            className="header-search header-search--compact"
            aria-label={searchProps.ariaLabel ?? 'Search'}
          >
            <SearchRoundedIcon
              fontSize="small"
              className="header-search__icon header-search__icon--compact"
            />
            <input
              type="search"
              className="header-search__input header-search__input--compact"
              value={searchProps.value ?? ''}
              placeholder={searchProps.placeholder ?? 'Search...'}
              onChange={searchProps.onChange}
              aria-label={searchProps.ariaLabel ?? 'Search'}
              autoComplete="off"
              readOnly={typeof searchProps.onChange !== 'function' || searchProps.readOnly}
              disabled={searchProps.disabled}
            />
          </label>,
        ]
      : []),
    ...resolvedToolbarActions.map((action, index) => {
      const actionKey = getToolbarActionKey(action, index)
      const actionLabel = action.ariaLabel ?? action.title ?? action.label ?? 'Toolbar action'
      const actionClassName = [
        'header-icon-button',
        'header-icon-button--compact',
        action.variant === 'danger' || action.tone === 'danger'
          ? 'header-icon-button--danger'
          : '',
        action.className ?? '',
      ]
        .filter(Boolean)
        .join(' ')
      const actionContent = action.icon ?? action.children ?? action.label ?? null
      const sharedProps = {
        className: actionClassName,
        title: action.title ?? actionLabel,
        'aria-label': actionLabel,
      }

      if (action.href && !action.disabled) {
        return (
          <a
            key={actionKey}
            href={action.href}
            target={action.target}
            rel={action.target === '_blank' ? 'noreferrer' : action.rel}
            {...sharedProps}
          >
            {actionContent}
          </a>
        )
      }

      return (
        <button
          key={actionKey}
          type="button"
          disabled={action.disabled}
          onClick={action.onClick}
          {...sharedProps}
        >
          {actionContent}
        </button>
      )
    }),
  ]

  return (
    <header className="header-main">
      <img src={logoPiagamTransparent} alt="" aria-hidden="true" className="header-accent-logo" />

      <div className="header-content">
        <div className="header-left">
          {showMenuButton ? (
            <button
              type="button"
              className="header-menu-button"
              aria-label="Open sidebar"
              onClick={onMenuToggle}
            >
              <MenuRoundedIcon fontSize="small" />
            </button>
          ) : null}

          <div className="header-brand">
            <img src={logoPiagam} alt="Logo Piagam" className="header-brand-logo" />
          </div>
        </div>

        <div className="header-right">
          <div className="header-title-block">
            <span className="header-brand-title">{title}</span>
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </div>
        </div>
      </div>

      {hasSecondaryRow ? (
        <div className="header-breadcrumb">
          <div className="header-breadcrumb-content">
            <nav
              className="breadcrumb-nav"
              aria-label={departmentFilterProps ? 'Filter divisi' : 'Breadcrumb'}
            >
              {breadcrumbNodes}
            </nav>

            {toolbarNodes.length > 0 ? <div className="header-toolbar">{toolbarNodes}</div> : null}
          </div>
        </div>
      ) : null}

      {hasNotification && isNotificationModalOpen ? (
        <div
          className="header-modal-overlay"
          role="presentation"
          onClick={() => setIsNotificationModalOpen(false)}
        >
          <div
            className="header-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="header-notification-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="header-modal__header">
              <h2 className="header-modal__title" id="header-notification-title">
                {notificationProps.modalTitle ?? 'Notifications'}
              </h2>

              <button
                type="button"
                className="header-modal__close"
                aria-label="Close notification modal"
                onClick={() => setIsNotificationModalOpen(false)}
              >
                <CloseRoundedIcon fontSize="small" />
              </button>
            </div>

            <div className="header-modal__body">
              <div className="header-modal__empty" />
            </div>
          </div>
        </div>
      ) : null}

      {departmentDropdownPortal}
    </header>
  )
}

export default Header
