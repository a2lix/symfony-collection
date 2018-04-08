# A2LiX JS - symfony-collection

Manage your Symfony Form collection simply with vanilla JS


## How to

After loading a2lix_sf_collection.js file

```
a2lix_lib.formCollection.init(SELECTOR = "form div[data-prototype]", manageRemoveEntry = true)
```


## Example

```
<script src="__PATH_TO__a2lix_sf_collection.js"></script>

<script>
// A global initialization on all Symfony Form collection with manageRemoveEntry feature enable
a2lix_lib.formCollection.init()


// OR a custom initialization with restricted scope of Symfony Form collection with manageRemoveEntry feature disable
a2lix_lib.formCollection.init('form div[data-a2lix-collection]', false)
</script>
```


# Demo

See [Demo project](https://github.com/a2lix/Demo).
