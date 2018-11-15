export const toUpperCase = (lower) => {
    let upper = lower.replace(/^\w/, c => c.toUpperCase());
    return upper;
}
export const differenceOf2StringArrays = (array1, array2) => {
    var temp = [];
    array1 = array1.toString().split(',').map(String);
    array2 = array2.toString().split(',').map(String);
    for (var i in array1) {
        if (array2.indexOf(array1[i]) === -1) temp.push(array1[i]);
    }
    for (i in array2) {
        if (array1.indexOf(array2[i]) === -1) temp.push(array2[i]);
    }
    return temp;
}
export const arrayChunk = (list,chunksize) => {
    var chunkedlist = [];
    for (var i = 0; i < list.length; i += chunksize) {
        chunkedlist.push(list.slice(i, i + chunksize));
    }
    return chunkedlist;
}