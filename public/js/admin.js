const internals = {};
const deleteButton = Array.from(document.querySelectorAll('.delete-button'));

internals.deleteProduct = function() {
    const prodId = this.parentNode.querySelector('[name=productId]').value;
    const csrf = this.parentNode.querySelector('[name=_csrf]').value;
    const productElement = this.closest('article');

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
        console.log(err);
    });
};

deleteButton.forEach(el => {
    el.addEventListener('click', internals.deleteProduct );
});
