/* Converts from the LDAP search json form to more idiomatic objects */
function objectiseOne(json) {
    if (json.search.return.count > 0) {
        const arrayOfAttributes = json.search.entry[0].attribute;

         // A bit of magic which reduces type safety (we don't know if values will be arrays or not) but increases convenience (since almost all values are *not* arrays)
        const stripArrays = value => (value.length === 1 ? value[0] : value);
        const reducer = (acc, val) => {
            acc[val.name] = stripArrays(val.value);
            return acc;
        };

        const object = arrayOfAttributes.reduce(reducer, {});
        
        return object;

    } else {
        return null; // not found 
    }
}

/* Converts from the LDAP search json form to more idiomatic objects */
function objectiseMany(json) {
    const arrayOfAttributes = json.search.entry.map(entry => entry.attribute);

    // A bit of magic which reduces type safety (we don't know if values will be arrays or not) but increases convenience (since almost all values are *not* arrays)
    const stripArrays = value => (value.length === 1 ? value[0] : value);
    const reducer = (acc, val) => {
        acc[val.name] = stripArrays(val.value);
        return acc;
    };

    const objects = arrayOfAttributes.map(array => array.reduce(reducer, {}));
    
    return objects;
}

function flatten(items) {
    const flat = [];

    items.forEach(item => {
        if (Array.isArray(item)) {
            flat.push(...flatten(item));
        } else {
            flat.push(item);
        }
    });

    return flat;
}

module.exports = { objectiseOne, objectiseMany, flatten };