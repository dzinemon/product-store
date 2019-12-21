const prodInput = document.getElementById("product-input");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".modal .delete");
const closeTagBtn = document.querySelector(".tag .delete");
const columns = document.querySelector("#columns");
const prodSelect = document.getElementById("product-select");
const inputTermWrap = document.getElementById('searchWrap');

const url = '/product-store/products.json';

let selectTerm = "";
let inputTerm = "";
let products;

// Close modal
closeModalBtn.addEventListener("click", function() {
  this.closest(".modal").classList.remove("is-active");
});

// Close tag
let closeSearchTag = function(){
  this.parentNode.remove();
  inputTerm = '';
  loadProducts();
  clearInputTerm();
}

let showModal = () => modal.classList.add("is-active");

let loadProducts = () => {
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      products = json;

      clearWrapperDiv();
      initialize(products);
    })
    .catch(function(err) {
      showModal();
    });
};

// clear Wrapper
let clearWrapperDiv = () => (columns.innerHTML = "");

// Update error message
let noProductsToShow = () => (columns.innerHTML = "No products available");

// reset/clear inputTerm
let clearInputTerm = () => prodInput.value = '';

// Handle Select event
// Product select
prodSelect.addEventListener("change", function() {
  let selected = this.value;

  selectTerm = selected;
  clearWrapperDiv();
  loadProducts();
});

// Handle Search event
prodInput.addEventListener("keyup", function(e) {
  if (e.key === "Enter") {
    let inputValue = e.target.value;
    inputTermWrap.innerHTML = '';
    renderInputTerm(inputValue);

    inputTerm = inputValue.toLowerCase();
    clearWrapperDiv();
    loadProducts();
  }
});
let renderInputTerm = term => {
  let inputTermTag = document.createElement('span');
  inputTermTag.classList.add('tag', 'is-info');

  inputTermTag.innerHTML = `${term}`;
  let closeTagBtn = document.createElement('button');
  closeTagBtn.classList.add('delete', 'is-small');
  closeTagBtn.addEventListener('click', closeSearchTag);

  inputTermTag.appendChild(closeTagBtn);
  inputTermWrap.appendChild(inputTermTag);
}

let initialize = items => {
  let currentItems = items;
  let itemsAfterSelect = [];
  let itemsAfterInput = [];
  let finalItems = [];

  currentItems.map(item => {
    if (selectTerm == "" || selectTerm == "all") {
      itemsAfterSelect.push(item);
    } else {
      if (item.type == selectTerm) {
        itemsAfterSelect.push(item);
      }
    }
  });


  if (inputTerm != "") {
    itemsAfterSelect.map(item => {
      let itemTitle = item.title.toLowerCase();
      if (itemTitle.indexOf(inputTerm) != -1) {
        itemsAfterInput.push(item);
      }
    });
    finalItems = itemsAfterInput;
  } else {
    finalItems = itemsAfterSelect;
  }

  if (finalItems.length == 0) {
    showModal();
    noProductsToShow();
  }

  finalItems.map(item => renderItem(item));
};

// Create a card for product and append it to div wrapper
let renderItem = item => {
  let divWrap = document.createElement("div");
  divWrap.classList.add("column", "is-6-tablet", "is-4-widescreen");
  divWrap.innerHTML = `
        <div class="card box is-paddingless is-clipped">
          <div class="card-image is-relative">
              <figure class="image is-3by1">
                  <img src="/product-store/${item.type}.jpeg"
                      alt="Placeholder image">
              </figure>
          </div>
          <div class="card-content">
              <div class="content">
                  <div class="tags has-addons is-marginless is-pulled-right">
                      <span class="tag is-${item.id}"><i class="fas fa-${item.type}"></i></span>
                      <span class="tag is-${item.id}">${item.type}</span>
                  </div>
                  <p class="has-text-weight-bold">
                      ${item.title}
                  </p>
                  
                  <div class="tags has-addons">
                      <span class="tag is-large is-primary">$</span>
                      <span class="tag is-${item.id} is-light is-large">${item.price}</span>
                  </div>
              </div>
          </div>
      </div>
    `;
  columns.appendChild(divWrap);
};

// Load products on page load
window.onload = () => {
  loadProducts();

};
