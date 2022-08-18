# A2LiX JS - symfony-collection

Manage your Symfony Form collection simply with vanilla JS

[![npm version](https://badge.fury.io/js/%40a2lix%2Fsymfony-collection.svg)](https://badge.fury.io/js/%40a2lix%2Fsymfony-collection)


## Install

As first thing you need to pull the package using yarn or npm

```
yarn add @a2lix/symfony-collection
```
or
```
npm install @a2lix/symfony-collection
```

Then you can either import it in your files using ES6
```
import a2lix_lib from '@a2lix/symfony-collection/src/a2lix_sf_collection';
```

or symlink/copy/move it in a folder and reference it directly in a `script` tag

## How to

After you loaded the dist version of **a2lix_sf_collection.min.js** file or imported through ES6 method, init a2lix_lib.sfCollection, optionnaly with custom configuration.

Default configuration:

```
a2lix_lib.sfCollection.init({
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
})
```


## Example


```
////// WITH Symfony Encore: see https://github.com/a2lix/Demo/blob/master/assets/app.js#L14-L16

////// WITHOUT:

<script src="__PATH_TO__a2lix_sf_collection.min.js"></script>

<script>
// A global initialization on all Symfony Form collection with manageRemoveEntry feature enabled (default)
a2lix_lib.sfCollection.init()


// OR a custom initialization
a2lix_lib.sfCollection.init({
    collectionsSelector: 'form div[data-a2lix-collection]',
    manageRemoveEntry: false,
    entry: {
        add: {
            label: 'Ajouter',
            // customFn: (...args) => console.log('add', args),
            // onBeforeFn: (...args) => console.log('add', args),
            // onAfterFn: (...args) => console.log('add', args),
        },
        remove: {
            label: 'Supprimer',
            // customFn: (...args) => console.log('remove', args),
            // onAfterFn: (...args) => console.log('remove', args),
        }
    }
})
</script>
```


## Contribute help

```
docker run -it --rm --user $(id -u):$(id -g) --name a2lix_nodejs -v "$PWD":/usr/src/app -w /usr/src/app node:alpine npm install
docker run -it --rm --user $(id -u):$(id -g) --name a2lix_nodejs -v "$PWD":/usr/src/app -w /usr/src/app node:alpine npm run build

```


# Demo

See [Demo project](https://github.com/a2lix/Demo).
