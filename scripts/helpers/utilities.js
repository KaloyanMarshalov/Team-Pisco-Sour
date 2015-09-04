var utilities = (function () {
    function addToCart(item) {
        var promise = new Promise(function (resolve, reject) {
            var currentStorage,
                storageID,
                currentItemIds,
                storageToBeUpdated,
                currentItemId = item.id,
                currentUser = getCurrentUser();
            if (currentUser) {
                storageID = currentUser.id;
            } else {
                storageID = DEFAULT_STORAGE_ID;
            }
            if (localStorage.getItem(storageID)) {
                currentStorage = localStorage.getItem(storageID);
                localStorage.removeItem(storageID);
                currentStorage = JSON.parse(currentStorage);
                currentItemIds = currentStorage.itemIds;
            } else {
                currentItemIds = [];
            }
            currentItemIds.push(currentItemId);
            storageToBeUpdated = {itemIds: currentItemIds};
            storageToBeUpdated = JSON.stringify(storageToBeUpdated);
            localStorage.setItem(storageID, storageToBeUpdated);
            resolve();
        });
        return promise;
    }

    function getCart() {
        var promise = new Promise(function (resolve, reject) {
            var storageID,
                currentStorage,
                currentItemIds,
                currentUser = getCurrentUser();
            if (currentUser) {
                storageID = currentUser.id;
            } else {
                storageID = DEFAULT_STORAGE_ID;
            }
            if (localStorage.getItem(storageID)) {
                currentStorage = localStorage.getItem(storageID);
                currentStorage = JSON.parse(currentStorage);
                currentItemIds = currentStorage.itemIds;
                resolve(currentItemIds);
            }
            resolve([]);
        });
        return promise;
    }

    function clearCart() {
        var promise = new Promise(function (resolve, reject) {
            var storageID,
                currentUser = getCurrentUser();
            if (currentUser) {
                storageID = currentUser.id;
            } else {
                storageID = DEFAULT_STORAGE_ID;
            }
            if (localStorage.getItem(storageID)) {
                localStorage.removeItem(storageID);
            }
            resolve()
        });
        return promise;
    }

    function getCurrentUser() {
        if (localStorage.getItem('USER_ID')) {
            return {
                id: localStorage.getItem('USER_ID')
            };
        } else {
            return null;
        }
    }

    return {
        getCurrent: getCurrentUser,
        getCart: getCart,
        addToCart: addToCart,
        clearCart: clearCart
    }
}());