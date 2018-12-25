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

export const formatAddress = (address)=> {
    var address_array = address.split(" ");
    if (address.length > 15) {
        address_array = address_array.filter(function (e) {
            return e.trim() !== "Kenya";
        });
        address_array = address_array.filter(function (e) {
            return e.trim() !== "KE";
        });

        if (address_array.join(" ").leghth > 15) {
            address_array = address_array.slice(0, 3);
            if (address_array.join(" ").lenth > 15) {
                var empty_addr_arr = [];
                formatAddress(address_array.join(" "));
            }
        }
        address = address_array.join(" ");
        if(address.length>15){
            var address_array=address.split(",");
            address_array = address_array.filter(function (e) {
                return e.trim() !==  "KE";
            });
            address_array = address_array.filter(function (e) {
                return e.trim() !== "Kenya";
            });
            if (address_array.join(" ").leghth > 15) {
                address_array = address_array.slice(0, 3);
                if (address_array.join(" ").lenth > 15) {
                    var empty_addr_arr = [];
                    formatAddress(address_array.join(" "));
                }
            }
            address = address_array.join(" ");

        }
    } else {
        address = address.length == null ? "Not stated" : address;
    }
    if(address.length>15){
        address=address.split(" ").slice(0,8).join(" ");
    }
    return address.substring(0,30);
}