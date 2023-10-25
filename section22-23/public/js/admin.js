const deleteProduct = (btn) => {
  //console.log(btn.parentNode.querySelector("[name=productId]"));
  const productId = document.querySelector("[name=productId]").value;
  const csrfToken = document.querySelector("[name=csrfToken]").value;
  const productElement = btn.closest("article");

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: { "x-csrf-token": csrfToken },
  })
    .then((result) => {
      return result.json;
    })
    .then((data) => {
      console.log(data);
      productElement.remove();
    })
    .catch((err) => console.log(err));
};
