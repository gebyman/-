// 請代入自己的網址路徑
const api_path = "den1"; 
const token = "IkTOKkkwA6OKAsGpc0fezq7XskP2";

//產品 DOM
const productList = document.querySelector('.productWrap')
let productData =[];
let cartData=[];
let str=` <li class="productCard">
<h4 class="productType">新品</h4>
<img src="https://hexschool-api.s3.us-west-2.amazonaws.com/custom/dp6gW6u5hkUxxCuNi8RjbfgufygamNzdVHWb15lHZTxqZQs0gdDunQBS7F6M3MdegcQmKfLLoxHGgV3kYunUF37DNn6coPH6NqzZwRfhbsmEblpJQLqXLg4yCqUwP3IE.png" alt="">
<a href="#" class="addCardBtn">加入購物車</a>
<h3>Antony 雙人床架／雙人加大</h3>
<del class="originPrice">NT$18,000</del>
<p class="nowPrice">NT$12,000</p>
</li>`
productList.innerHTML = str;

function init(){
  getProductList()
  getCartList()
}
init();

// 取得產品列表

function getProductList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
      then(function (response) {
        productData= response.data.products
       renderProductList();
       
      })
  }

const productSelect = document.querySelector('.productSelect')

//重構 因為組字串有重複 結合成一個function
function conbineProductHTML(item){
  return `<li class="productCard">
  <h4 class="productType">新品</h4>
  <img src="${item.images}" alt="">
  <a href="#" class="addCardBtn" id='js-addCart' data-id=${item.id}>加入購物車</a>
  <h3>${item.title}</h3>
  <del class="originPrice">${item.origin_price}</del>
  <p class="nowPrice">${item.price}</p>
  </li>`
}

function renderProductList(){
  let str = '';
  productData.forEach(function(item){
    str+=conbineProductHTML(item)
  })
  productList.innerHTML=str;
}

//選單顯示
productSelect.addEventListener('change',function(e){
 const category = e.target.value;
 if(category=='全部'){
  renderProductList()
  return;
 }
 let str = '';
 productData.forEach(function(item){
  if(item.category == category){
    str+=conbineProductHTML(item)
  }
 })
 productList.innerHTML=str
})
// 取得購物車列表
productList.addEventListener('click',function(e){
  e.preventDefault()//點選#不會往上彈
  let addCardClass = e.target.getAttribute('id');
  if (addCardClass!='js-addCart'){
    return;
  }

  let productId=e.target.getAttribute('data-id')
//將物品加入購物車
  let numCheck=1;
  cartData.forEach(function(item){
    //若商品id===選取到的id 自動+1
    if(item.product.id===productId){
      numCheck = item.quantity+=1
    }
  })
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
    //要與格式相符
    "data": {
      "productId": productId,
      "quantity": numCheck
    }
  }).then(function(response){
    alert('加入購物車')
    getCartList()
  })
})

const shoppingCart = document.querySelector('.shoppingCart-tableList')
function getCartList(){
axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
.then(function(response){
 //總金額
document.querySelector('.js-total').textContent=response.data.finalTotal
  cartData= response.data.carts
  let str = ''
  cartData.forEach(function(item){
    str+=` <tr>
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td>${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>${item.product.price*item.quantity}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" data-id='${item.id}'>
            clear
        </a>
    </td>
</tr>`
  })
  
  shoppingCart.innerHTML=str;
})
}


// 刪除購物車內特定產品
shoppingCart.addEventListener('click',function(e){
  e.preventDefault()
  const cartId = e.target.getAttribute('data-id')
  if(cartId === null){
    alert('你點錯嘞')
    return;
  }
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).then(function(response){
    alert('刪除該筆購物車');
    getCartList()
  })
})

// 清除購物車內全部產品
const discardAllBtn= document.querySelector('.discardAllBtn')

discardAllBtn.addEventListener('click',function(e){
  e.preventDefault()
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).then(function(e){
    getCartList()
  })
  .catch(function(response){
    alert('購物車已清空')
    
  })
})
// 送出購買訂單
const sentOrder = document.querySelector('.orderInfo-btn');
sentOrder.addEventListener('click',function(e){
  if(cartData==0){
  e.preventDefault()
  alert('請輸入至少一個品項')
  return;
}


})

//送出訂單
const orderInfoBtn= document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click',function(e){
  e.preventDefault();
 if (cartData.length==0){
  alert('請加入購物車')
  return;
 }
 const customerName = document.querySelector('#customerPhone').value;
 const customerPhone = document.querySelector('#customerEmail').value;
 const customerEmail= document.querySelector('#customerAddress').value;
 const customerAddress= document.querySelector('#tradeWay').value
 const customertradeWay= document.querySelector('#tradeWay').value
  if(customerName==''|| customerPhone==''|| customerEmail==''|| customerAddress==''|| customertradeWay==''){
    alert('請輸入訂單資訊')
    return;
  }
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": customertradeWay
      }
    }
  }).then(function(response){
    alert('訂單建立成功');
   document.querySelector('#customerName').value='';
   document.querySelector('#customerPhone').value='';
   document.querySelector('#customerEmail').value='';
   document.querySelector('#customerAddress').value='';
   document.querySelector('#tradeWay').value='ATM'
    getCartList();
  })
})