export const generateErrorsArray = (errorObject) => {
    let errorsArray = []
    for (let key in errorObject) {
        errorsArray.push({msg: errorObject[key].message})
    }
    return errorsArray
}

export const convertStringArrayToIntArray = function (stringArray) {
    let mselectedArray = [];
    stringArray.forEach(value => {
        let parsed = parseInt(value, 10);
        mselectedArray.push(parsed);
    });
    return mselectedArray;
}