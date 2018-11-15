/* eslint no-unused-vars: 0 */
const compare = {
    type: (ob1, ob2) => {
        // returns the type of the objects if both are same type, false otherwise
        // returns array if both are arrays
        // returns null if both are null
        // (because typeof null and typeof [] both return object)
        if (typeof ob1 === typeof ob2) {
            // objects are the same type
            if (Array.isArray(ob1) && Array.isArray(ob2)) {
                // both are arrays
                return "array";
            } else if (ob1 === null && ob2 === null) {
                // both are null
                return "null";
            } else if (!Array.isArray(ob1) && !Array.isArray(ob2)) {
                // both are not arrays
                return typeof ob1;
            } else {
                return false;
            }
        } else {
            // not same type
            return false;
        }
    },

    array: (ob1, ob2) =>
        // returns true if both arrays are same length and have same contents
        // if same length
        ob1.length === ob2.length
            ? ob1.every((item, index) => compare.compare(item, ob2[index]))
            : false,

    object: (ob1, ob2) => {
        // returns true if keys and values are same
        // get array of keys
        let keys1 = Object.keys(ob1).sort();
        let keys2 = Object.keys(ob2).sort();
        if (compare.array(keys1, keys2)) {
            // get array of values
            let values1 = keys1.map(key => ob1[key]);
            let values2 = keys2.map(key => ob2[key]);
            // if keys and values are the same
            return compare.array(values1, values2);
        } else {
            return false;
        }
    },

    other: (ob1, ob2) => ob1 === ob2 || (Number.isNaN(ob1) && Number.isNaN(ob2)),

    compare: (ob1, ob2) => {
        // compare ob1 and ob2 using type, object, and array compares
        // same type (accounting for arrays)
        let type = compare.type(ob1, ob2);
        if (type) {
            if (type === "array") {
                // if both are arrays
                return compare.array(ob1, ob2);
            } else if (type === "object") {
                // if both are objects and not arrays
                return compare.object(ob1, ob2);
            } else {
                // neither arrays or objects
                return compare.other(ob1, ob2);
            }
        } else {
            return false;
        }
    }
};
