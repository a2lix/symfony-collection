'use strict'

const a2lix_lib = {}

a2lix_lib.sfCollection = (() => {
  const CONFIG_DEFAULT = {
    collectionsSelector: 'form div[data-prototype]',
    manageRemoveEntry: true,
    entry: {
      add: {
        prototype:
          '<button class="__class__" data-entry-action="add">__label__</button>',
        class: 'btn btn-primary btn-sm mt-2',
        label: 'Add',
        customFn: null,
        onBeforeFn: null,
        onAfterFn: null
      },
      remove: {
        prototype:
          '<button class="__class__" data-entry-action="remove">__label__</button>',
        class: 'btn btn-danger btn-sm',
        label: 'Remove',
        customFn: null,
        onAfterFn: null
      }
    }
  }

  const init = (config = CONFIG_DEFAULT) => {
    if (!('content' in document.createElement('template'))) {
      console.error('HTML template will not working...')
      return
    }

    const cfg = {
      ...CONFIG_DEFAULT,
      ...config,
      entry: {
        add: { ...CONFIG_DEFAULT.entry.add, ...(config.entry.add || {}) },
        remove: {
          ...CONFIG_DEFAULT.entry.remove,
          ...(config.entry.remove || {})
        }
      }
    }

    const collectionElts = document.querySelectorAll(cfg.collectionsSelector)
    if (!collectionElts.length) {
      return
    }

    collectionElts.forEach(collectionElt => {
      proceedCollectionElt(collectionElt, cfg)
    })
  }

  const proceedCollectionElt = (collectionElt, cfg) => {
    collectionElt.setAttribute(
      'data-entry-index',
      collectionElt.children.length
    )

    appendEntryAddElt(collectionElt, cfg.entry.add)

    if (cfg.manageRemoveEntry) {
      appendEntryRemoveElts(collectionElt, cfg.entry.remove)
    }

    collectionElt.addEventListener('click', evt => triggerEntryAction(evt, cfg))
  }

  const appendEntryAddElt = (collectionElt, entryAddCfg) => {
    const entryAddClass =
      collectionElt.getAttribute('data-entry-add-class') || entryAddCfg.class
    const entryAddLabel =
      collectionElt.getAttribute('data-entry-add-label') || entryAddCfg.label

    const entryAddHtml = entryAddCfg.prototype
      .replace(/__class__/g, entryAddClass)
      .replace(/__label__/g, entryAddLabel)

    collectionElt.appendChild(createTemplateContent(entryAddHtml))
  }

  const appendEntryRemoveElts = (collectionElt, entryRemoveCfg) => {
    const templateContentEntryRemove = getTemplateContentEntryRemove(
      collectionElt,
      entryRemoveCfg
    )

    Array.from(collectionElt.children)
      .filter(entryElt => !entryElt.hasAttribute('data-entry-action'))
      .forEach(entryElt => {
        entryElt.appendChild(templateContentEntryRemove.cloneNode(true))
      })
  }

  const getTemplateContentEntryRemove = (collectionElt, entryRemoveCfg) => {
    const entryRemoveClass =
      collectionElt.getAttribute('data-entry-remove-class') ||
      entryRemoveCfg.class
    const entryRemoveLabel =
      collectionElt.getAttribute('data-entry-remove-label') ||
      entryRemoveCfg.label

    const entryRemoveHtml = entryRemoveCfg.prototype
      .replace(/__class__/g, entryRemoveClass)
      .replace(/__label__/g, entryRemoveLabel)

    return createTemplateContent(entryRemoveHtml)
  }

  const triggerEntryAction = (evt, cfg) => {
    if (!evt.target.hasAttribute('data-entry-action')) {
      return
    }

    evt.preventDefault()

    switch (evt.target.getAttribute('data-entry-action')) {
      case 'add':
        const templateContentEntry = getTemplateContentEntry(
          evt.currentTarget,
          cfg
        )
        if (cfg.entry.add.customFn) {
          cfg.entry.add.customFn(
            evt.currentTarget,
            evt.target,
            templateContentEntry,
            cfg
          )
        } else {
          addEntry(evt.currentTarget, evt.target, templateContentEntry, cfg)
        }
        break
      case 'remove':
        if (cfg.entry.remove.customFn) {
          cfg.entry.remove.customFn(evt.currentTarget, evt.target, cfg)
        } else {
          removeEntry(evt.currentTarget, evt.target, cfg)
        }
        break
    }
  }

  const getTemplateContentEntry = (collectionElt, cfg) => {
    const entryIndex = collectionElt.getAttribute('data-entry-index')
    collectionElt.setAttribute('data-entry-index', +entryIndex + 1)

    const entryHtml = collectionElt
      .getAttribute('data-prototype')
      .replace(/__name__label__/g, `!New! ${entryIndex}`)
      .replace(/__name__/g, entryIndex)

    const templateContentEntry = createTemplateContent(entryHtml)

    if (cfg.manageRemoveEntry) {
      templateContentEntry.firstChild.appendChild(
        getTemplateContentEntryRemove(collectionElt, cfg.entry.remove)
      )
    }

    return templateContentEntry
  }

  const addEntry = (collectionElt, entryAddElt, templateContentEntry, cfg) => {
    cfg.entry.add.onBeforeFn?.(collectionElt, entryAddElt, templateContentEntry)

    entryAddElt.parentElement.insertBefore(templateContentEntry, entryAddElt)

    cfg.entry.add.onAfterFn?.(collectionElt, entryAddElt, templateContentEntry)
  }

  const removeEntry = (collectionElt, entryRemoveElt, cfg) => {
    entryRemoveElt.parentElement.remove()

    cfg.entry.remove.onAfterFn?.(collectionElt, entryRemoveElt)
  }

  /**
   * HELPERS
   */

  const createTemplateContent = html => {
    const template = document.createElement('template')
    template.innerHTML = html.trim()

    return template.content
  }

  return {
    init
  }
})()

export default a2lix_lib
