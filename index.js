import menuArray from "./data.js"
const orderBillArray = []

document.addEventListener("DOMContentLoaded", renderFoodList)

document.addEventListener("click", (e) => {
  if (e.target.dataset.action) {
    const element = e.target;
    const action = element.dataset.action
    const identifier = Number(element.dataset.identifier)

    if (action === 'add-food') addFood(identifier)
    else if (action === 'remove-food') removeFood(identifier)
    else if (action === 'complete-order') completeOrder()
    else if (action === 'close-payment') closePayment(e)
  }
})

document.addEventListener("submit", handlePayment)

/* food list render */

function renderFoodList() {
  const foodListEl = document.getElementById('food-list')
  foodListEl.innerHTML = createFoodListHTML(menuArray)
}

function createFoodListHTML(elementsArray) {
  return elementsArray.map((element) => {
    const { name, ingredients, id, price, emoji } = element
    return `
    <li class="food-item">
      <i class="big-icon" aria-label="image" aria-placeholder="drawn ${name}">${emoji}</i>
      <div class="food-description">
          <h3>${name}</h3>
          <p class="description">${ingredients}</p>
          <p class="price">${price}</p>
      </div>
      <button class="add-food-button" data-identifier="${id}" data-action="add-food"> + </button>
    </li>`
  }).join('')
}

/* add food */

function addFood(identifier) {
  const orderBillItem = orderBillArray.find(billItem => billItem.id === identifier)
  if (orderBillItem)
    orderBillItem.increaseCount()
  else {
    const foodItem = menuArray.find(menuItem => menuItem.id === identifier)
    orderBillArray.push(new billItem(foodItem))
  }
  if (orderBillArray.length === 1) document.getElementById('order-bill-section').classList.remove('hidden')
  renderOrderBill()
}

function billItem(foodItem) {
  this.id = foodItem.id
  this.name = foodItem.name
  this.count = 1
  this.price = foodItem.price
  this.totalPrice = foodItem.price
  this.increaseCount = function () {
    this.count++
    this.totalPrice = this.price * this.count
  }
}

function renderOrderBill() {
  const billListEl = document.getElementById('bill-list')
  const billTotalEl = document.getElementById('bill-total')
  billListEl.innerHTML = orderBillArray.map((billItem) => {
    const { id, name, count, totalPrice } = billItem
    return `
    <li class="bill-item">
      <p class="big-font"> ${name} x ${count}<p>
      <button class="bill-remove-button" data-identifier=${id} data-action="remove-food">remove</button>
      <p class="to-right price">${totalPrice}</p>
    </li>`
  }).join('')
  billTotalEl.textContent = `$${orderBillArray.reduce((total, billItem) => total + billItem.totalPrice, 0)}`
}

/* remove food */

function removeFood(identifier) {
  const foodItem = menuArray.find(item => item.id === identifier)
  orderBillArray.splice(orderBillArray.indexOf(foodItem), 1)
  if (orderBillArray.length === 0) document.getElementById('order-bill-section').classList.add('hidden')
  renderOrderBill()
}

/* complete order */

function completeOrder() {
  document.getElementById('payment-window').classList.remove('hidden')
}

/* close payment */

function closePayment(){
  document.getElementById('payment-window').classList.add('hidden')
}

/* handle payment */

function handlePayment(e) {
  e.preventDefault()
  const paymentFormData = new FormData(e.target)
  console.log(`
    name: ${paymentFormData.get('name')}
    card-number: ${paymentFormData.get('card-number')}
    cvv: ${paymentFormData.get('cvv')}`)
  clearInputs( e.target.querySelectorAll('input') ) 
}

/* clear inputs */

function clearInputs( [...inputs] ){
  inputs.forEach( input => input.value = '')
}
