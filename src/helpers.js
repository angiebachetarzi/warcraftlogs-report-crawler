//filter a list of objects to find a field value using another field value
//example: finding the boss id in a list of fights using the boss name
const filterTab = (objectList, givenField, fieldToFind, givenFieldValue) => {
    // Iterate through the list of objects
    for (const obj of objectList) {
        // Check if the object's given field matches the provided value
        if (obj[givenField] === givenFieldValue) {
        // If match is found, return the value of the specified field to find
        return obj[fieldToFind];
        }
    }
    // If no match is found, return null or undefined
    return null;
}

module.exports = filterTab