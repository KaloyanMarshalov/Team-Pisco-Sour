$(document.body).on('click', '#addToCart', function () {
    var itemId = $('#addToCart').next().attr('id'),
        storageItemIds = localStorage.getItem('cartItems') || '[]',
        items = JSON.parse(storageItemIds);

    items.push(itemId);
    localStorage.setItem('cartItems', JSON.stringify(items));
});

$(document.body).on('click', '#clear-cart', function () {
    localStorage.removeItem('cartItems');
})