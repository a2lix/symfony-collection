'use strict'

const a2lix_lib = {}

a2lix_lib.sfCollection = (() => {
  const CONFIG_DEFAULT = {
    collectionsSelector: 'div[data-prototype]',
    entry: {
      add: {
        enabled: true, // Or by DOM attribute: data-entry-add-enabled
        prototype:
          '<button class="__class__" data-entry-action="add">__label__</button>', // Or by DOM attribute: data-entry-add-prototype
        class: 'btn btn-primary btn-sm mt-2', // Or by DOM attribute: data-entry-add-class
        label: 'Add', // Or by DOM attribute: data-entry-add-label
        customFn: null,
        onBeforeFn: null,
        onAfterFn: null
      },
      remove: {
        enabled: true, // Or by DOM attribute: data-entry-remove-enabled
        prototype:
          '<button class="__class__" data-entry-action="remove">__label__</button>', // Or by DOM attribute: data-entry-remove-prototype
        class: 'btn btn-danger btn-sm', // Or by DOM attribute: data-entry-remove-class
        label: 'Remove', // Or by DOM attribute: data-entry-remove-label
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

    proceedCollectionElts(
      document.querySelectorAll(
        `${cfg.collectionsSelector}:not(${cfg.collectionsSelector} ${cfg.collectionsSelector})`
      ),
      cfg
    )
  }

  const proceedCollectionElts = (collectionElts, cfg) => {
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

    collectionElt.addEventListener('click', evt => triggerEntryAction(evt, cfg))
  }

  const appendEntryAddElt = (collectionElt, entryAddCfg) => {
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

  const triggerEntryAction = (evt, cfg) => {
<<<<<<< HEAD
=======
    evt.preventDefault()
    evt.stopPropagation()

>>>>>>> edd0891 (0.6.0)
    if (!evt.target.hasAttribute('data-entry-action')) {
      return
    }

<<<<<<< HEAD
    evt.preventDefault()
=======
    const collectionElt = evt.currentTarget.closest(cfg.collectionsSelector)
>>>>>>> edd0891 (0.6.0)

    switch (evt.target.getAttribute('data-entry-action')) {
      case 'add':
        const templateContentEntry = getTemplateContentEntry(collectionElt, cfg)

        if (cfg.entry.add.customFn) {
          cfg.entry.add.customFn(
            collectionElt,
            evt.target,
            templateContentEntry,
            cfg
          )
        } else {
          addEntry(collectionElt, evt.target, templateContentEntry, cfg)
        }
        break
      case 'remove':
        if (cfg.entry.remove.customFn) {
          cfg.entry.remove.customFn(collectionElt, evt.target, cfg)
        } else {
          removeEntry(collectionElt, evt.target, cfg)
        }
        break
    }
  }

  const getTemplateContentEntry = (collectionElt, cfg) => {
    const entryIndex = collectionElt.getAttribute('data-entry-index') ?? 0
    collectionElt.setAttribute('data-entry-index', +entryIndex + 1)

    const entryHtml = collectionElt
      .getAttribute('data-prototype')
      .replace(/__name__label__/g, `!New! ${entryIndex}`)
      .replace(/__name__/g, entryIndex)

    const templateContentEntry = createTemplateContent(entryHtml)

    if (
      collectionElt.getAttribute('data-entry-remove-enabled') ??
      cfg.entry.remove.enabled
    ) {
      templateContentEntry.firstChild.appendChild(
        getTemplateContentEntryRemove(collectionElt, cfg.entry.remove)
      )
    }

    return templateContentEntry
  }

  const addEntry = (collectionElt, entryAddElt, templateContentEntry, cfg) => {
    cfg.entry.add.onBeforeFn?.(collectionElt, entryAddElt, templateContentEntry)

    entryAddElt.parentElement.insertBefore(templateContentEntry, entryAddElt)
    // proceedCollectionElts(entryAddElt.previousSibling.querySelectorAll(cfg.collectionsSelector), cfg)

    cfg.entry.add.onAfterFn?.(collectionElt, entryAddElt)
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
