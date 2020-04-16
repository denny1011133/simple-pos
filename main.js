// 3.變數宣告
const menu = document.getElementById("menu");
const cart = document.getElementById("cart");
const totalAmount = document.getElementById("total-amount");
const button = document.getElementById("submit-button");

let cartItems = {};
let total = 0;
let productData; //[{...},{...},{...},{...}]

// 4.GET API 菜單產品資料
axios
  .get("https://ac-w3-dom-pos.firebaseio.com/products.json")
  .then((res) => {
    productData = res.data;
    displayProduct(res.data);
  })
  .catch((err) => {
    console.log(err);
  });

// 5.將產品資料加入菜單區塊
function displayProduct(products) {
  products.forEach((product) => {
    menu.innerHTML += `
      <div class="col-3">
        <div class="card" id=${product.id}>
          <img src=${product.imgUrl} class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price}</p>
            <a href="#" class="btn btn-primary shopping">加入購物車</a>
          </div>
        </div>
      </div>
    `;
  });
}
// 6.加入購物車
function addToCart(event) {
  // 找到觸發event的node元素，並得到其產品id
  const menuItem = event.target.parentNode.parentNode;
  console.log(menuItem);
  const id = menuItem.id;
  // 在productData的資料裡，找到點擊的產品資訊 name, price
  const addedProduct = productData.find((product) => product.id === id);
  const name = addedProduct.name;
  const price = addedProduct.price;

  // 加入購物車變數cartItems 分：有按過、沒按過
  // 有按過 換數量的值
  if (cartItems[id]) {
    cartItems[id].quantity += 1;
  } else {
    // 沒按過 加入新資料
    cartItems[id] = {
      name: name,
      price: price,
      quantity: 1
    };
  }
  console.log(cartItems);
  // 畫面顯示購物車清單
  cart.innerHTML = Object.values(cartItems).map(item => `
    <li class="list-group-item">${item.name} X ${item.quantity} 小計：${
    item.price * item.quantity
    }元</li>`
  )
    .join("");

  // 計算總金額
  calculateTotal(price);
}

// 7.計算總金額
function calculateTotal(amount) {
  total += amount;
  totalAmount.innerHTML = `${total}元`;
}

// 8.送出訂單
function submit() {
  alert(`${cart.innerText}
---------------------------
總共 : ${total}元`);
  reset();
}

// 9.重置資料
function reset() {
  cart.innerHTML = "";
  totalAmount.textContent = "--";
  total = 0;
  cartItems = {};
}

// 10. 加入事件監聽
menu.addEventListener("click", addToCart);
button.addEventListener("click", submit);
