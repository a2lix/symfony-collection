'use strict'

interface ISfCollectionConfig {
  collectionsSelector: string // Default: 'div[data-prototype]',
  entry: {
    add: {
      enabled: boolean // Default: true | Possible override by DOM attribute: data-entry-add-enabled
      prototype: string // Default: '<button class="__class__" data-entry-action="add">__label__</button>' | Possible override by DOM attribute: data-entry-add-prototype
      class: string // Default: 'btn btn-primary btn-sm mt-2' | Possible override by DOM attribute: data-entry-add-class
      label: string // Default: 'Add' | Possible override by DOM attribute: data-entry-add-label
      customFn:
        | ((
            collectionElt: Element,
            entryAddElt: Element,
            templateContentEntry: DocumentFragment,
            cfg: ISfCollectionConfig
          ) => void)
        | null
      onBeforeFn:
        | ((
            collectionElt: Element,
            entryAddElt: Element,
            templateContentEntry: DocumentFragment
          ) => void)
        | null
      onAfterFn: ((collectionElt: Element, entryAddElt: Element) => void) | null
    }
    remove: {
      enabled: boolean // Default: true | Possible override by DOM attribute: data-entry-remove-enabled
      prototype: string // Default: '<button class="__class__" data-entry-action="remove">__label__</button>' | Possible override by DOM attribute: data-entry-remove-prototype
      class: string // Default: 'btn btn-danger btn-sm mt-2' | Possible override by DOM attribute: data-entry-remove-class
      label: string // Default: 'Remove' | Possible override by DOM attribute: data-entry-remove-label
      customFn:
        | ((
            collectionElt: Element,
            entryRemoveElt: Element,
            cfg: ISfCollectionConfig
          ) => void)
        | null
      onAfterFn:
        | ((collectionElt: Element, entryRemoveElt: Element) => void)
        | null
    }
  }
}

const a2lix_lib: Record<string, unknown> = {}

a2lix_lib.sfCollection = (() => {
  enum ENTRY_ACTION {
    ADD = 'add',
    REMOVE = 'remove',
  }

  const CONFIG_DEFAULT: ISfCollectionConfig = {
    collectionsSelector: 'div[data-prototype]',
    entry: {
      add: {
        enabled: true,
        prototype: `<button class="__class__" data-entry-action="${ENTRY_ACTION.ADD}">__label__</button>`,
        class: 'btn btn-primary btn-sm mt-2',
        label: 'Add',
        customFn: null,
        onBeforeFn: null,
        onAfterFn: null,
      },
      remove: {
        enabled: true,
        prototype: `<button class="__class__" data-entry-action="${ENTRY_ACTION.REMOVE}">__label__</button>`,
        class: 'btn btn-danger btn-sm mt-2',
        label: 'Remove',
        customFn: null,
        onAfterFn: null,
      },
    },
  }

  const init = (config = CONFIG_DEFAULT) => {
    if (!('content' in document.createElement('template'))) {
      console.error('HTML template will not working...')
      return
    }

    const cfg: ISfCollectionConfig = {
      ...CONFIG_DEFAULT,
      ...config,
      entry: {
        add: { ...CONFIG_DEFAULT.entry.add, ...(config.entry?.add || {}) },
        remove: {
          ...CONFIG_DEFAULT.entry.remove,
          ...(config.entry?.remove || {}),
        },
      },
    }

    proceedCollectionElts(
      document.querySelectorAll(cfg.collectionsSelector),
      cfg
    )
  }

  const proceedCollectionElts = (
    collectionElts: NodeListOf<Element>,
    cfg: ISfCollectionConfig
  ) => {
    if (!collectionElts.length) {
      return
    }

    collectionElts.forEach((collectionElt) => {
      proceedCollectionElt(collectionElt, cfg)
    })
  }

  const proceedCollectionElt = (
    collectionElt: Element,
    cfg: ISfCollectionConfig
  ) => {
    collectionElt.setAttribute(
      'data-entry-index',
      collectionElt.children.length + ''
    )

    if (
      collectionElt.getAttribute('data-entry-add-enabled') ??
      cfg.entry.add.enabled
    ) {
      appendEntryAddElt(collectionElt, cfg.entry.add)
    }

    if (
      collectionElt.getAttribute('data-entry-remove-enabled') ??
      cfg.entry.remove.enabled
    ) {
      appendEntryRemoveElts(collectionElt, cfg.entry.remove)
    }

    collectionElt.addEventListener('click', (evt) =>
      handleEntryActionClick(evt, cfg)
    )
  }

  const appendEntryAddElt = (
    collectionElt: Element,
    entryAddCfg: ISfCollectionConfig['entry']['add']
  ) => {
    const entryAddHtml = (
      collectionElt.getAttribute('data-entry-add-prototype') ??
      entryAddCfg.prototype
    )
      .replace(
        /__class__/g,
        collectionElt.getAttribute('data-entry-add-class') ?? entryAddCfg.class
      )
      .replace(
        /__label__/g,
        collectionElt.getAttribute('data-entry-add-label') ?? entryAddCfg.label
      )

    collectionElt.appendChild(createTemplateContent(entryAddHtml))
  }

  const appendEntryRemoveElts = (
    collectionElt: Element,
    entryRemoveCfg: ISfCollectionConfig['entry']['remove']
  ) => {
    const templateContentEntryRemove = getTemplateContentEntryRemove(
      collectionElt,
      entryRemoveCfg
    )

    Array.from(collectionElt.children)
      .filter((entryElt) => !entryElt.hasAttribute('data-entry-action'))
      .forEach((entryElt) => {
        entryElt.appendChild(templateContentEntryRemove.cloneNode(true))
      })
  }

  const getTemplateContentEntryRemove = (
    collectionElt: Element,
    entryRemoveCfg: ISfCollectionConfig['entry']['remove']
  ) => {
    const entryRemoveHtml = (
      collectionElt.getAttribute('data-entry-remove-prototype') ??
      entryRemoveCfg.prototype
    )
      .replace(
        /__class__/g,
        collectionElt.getAttribute('data-entry-remove-class') ??
          entryRemoveCfg.class
      )
      .replace(
        /__label__/g,
        collectionElt.getAttribute('data-entry-remove-label') ??
          entryRemoveCfg.label
      )

    return createTemplateContent(entryRemoveHtml)
  }

  const handleEntryActionClick = (evt: Event, cfg: ISfCollectionConfig) => {
    if (!(evt.target as Element).hasAttribute('data-entry-action')) {
      return
    }

    evt.preventDefault()
    evt.stopPropagation()

    const collectionElt = (evt.currentTarget as Element).closest(
      cfg.collectionsSelector
    )!

    switch ((evt.target as Element).getAttribute('data-entry-action')) {
      case ENTRY_ACTION.ADD:
        handleEntryActionAddClick(collectionElt, evt.target as Element, cfg)
        break
      case ENTRY_ACTION.REMOVE:
        handleEntryActionRemoveClick(collectionElt, evt.target as Element, cfg)
        break
    }
  }

  const handleEntryActionAddClick = (
    collectionElt: Element,
    entryAddElt: Element,
    cfg: ISfCollectionConfig
  ) => {
    const templateContentEntry = getTemplateContentEntry(collectionElt, cfg)

    if (cfg.entry.add.customFn) {
      cfg.entry.add.customFn(
        collectionElt,
        entryAddElt,
        templateContentEntry,
        cfg
      )
      return
    }

    addEntry(collectionElt, entryAddElt, templateContentEntry, cfg)
  }

  const handleEntryActionRemoveClick = (
    collectionElt: Element,
    entryRemoveElt: Element,
    cfg: ISfCollectionConfig
  ) => {
    if (cfg.entry.remove.customFn) {
      cfg.entry.remove.customFn(collectionElt, entryRemoveElt, cfg)
      return
    }

    removeEntry(collectionElt, entryRemoveElt, cfg)
  }

  const getTemplateContentEntry = (
    collectionElt: Element,
    cfg: ISfCollectionConfig
  ) => {
    const entryIndex = collectionElt.getAttribute('data-entry-index') ?? 0
    collectionElt.setAttribute('data-entry-index', +entryIndex + 1 + '')

    const prototypeName =
      collectionElt.getAttribute('data-prototype-name') ?? '__name__'

    const entryHtml = collectionElt
      .getAttribute('data-prototype')!
      .replace(
        new RegExp(`${prototypeName}label__`, 'g'),
        `!New! ${entryIndex}`
      )
      .replace(new RegExp(prototypeName, 'g'), entryIndex + '')

    const templateContentEntry = createTemplateContent(entryHtml)

    if (
      collectionElt.getAttribute('data-entry-remove-enabled') ??
      cfg.entry.remove.enabled
    ) {
      templateContentEntry.firstChild!.appendChild(
        getTemplateContentEntryRemove(collectionElt, cfg.entry.remove)
      )
    }

    return templateContentEntry
  }

  const addEntry = (
    collectionElt: Element,
    entryAddElt: Element,
    templateContentEntry: DocumentFragment,
    cfg: ISfCollectionConfig
  ) => {
    cfg.entry.add.onBeforeFn?.(collectionElt, entryAddElt, templateContentEntry)

    entryAddElt.parentElement!.insertBefore(templateContentEntry, entryAddElt)
    proceedCollectionElts(
      entryAddElt.previousElementSibling!.querySelectorAll(
        cfg.collectionsSelector
      ),
      cfg
    )

    cfg.entry.add.onAfterFn?.(collectionElt, entryAddElt)
  }

  const removeEntry = (
    collectionElt: Element,
    entryRemoveElt: Element,
    cfg: ISfCollectionConfig
  ) => {
    entryRemoveElt.parentElement!.remove()

    cfg.entry.remove.onAfterFn?.(collectionElt, entryRemoveElt)
  }

  /**
   * HELPERS
   */

  const createTemplateContent = (html: string) => {
    const template = document.createElement('template')
    template.innerHTML = html.trim()

    return template.content
  }

  return {
    init,
  }
})()

export default a2lix_lib
