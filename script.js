const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-id");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");



// Local Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// To Add functionality to Add Transaction btn
transactionFormEl.addEventListener("submit", addTransaction);

// to add transaction in  Add transaction part (Form part) 
function addTransaction(e) {
  e.preventDefault();

  // get form values 
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({
  id: Date.now(),
  description,
  amount
});

localStorage.setItem("transactions", JSON.stringify(transactions));


  updateTransactionList();
  updateSummary();

  transactionFormEl.reset();

}

// Will update transaction list in Transaction part 

function updateTransactionList() {
  transactionListEl.innerHTML = "";


  // This part will update list and latest transaction will shown on top 
  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction)
    transactionListEl.appendChild(transactionEl); // to update list of UI
  })
}

//This part will add transaction in list and list will be displayed
function createTransactionElement(transaction) {
   
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");

  li.innerHTML = `
  <span>${transaction.description}</span>
  <span>  

  ${formatCurrency(transaction.amount)}
  <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  
  </span>
  `;

  return li;
}

//This part will update summary part will show income and expense 
function updateSummary(){

  const balance = transactions.reduce((acc,transaction) => acc + transaction.amount,0);

  const income = transactions.filter((transaction) => transaction.amount > 0).reduce((acc,transaction) => acc + transaction.amount,0);
  
  const expenses = transactions.filter((transaction) => transaction.amount < 0).reduce((acc,transaction) => acc + transaction.amount,0);

  //update UI 
  balanceEl.textContent = formatCurrency(balance)
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency (expenses);
}

//This part will format according to proper amount with currency
function formatCurrency(number){
  return new Intl.NumberFormat("en-US",{
    style: "currency",
    currency: "INR",
  }).format(number);
} 

//This part willn delete the transaction 
function removeTransaction(id){
  //filter out the one we want to delete
  transactions = transactions.filter(transaction => transaction.id !== id)

localStorage.setItem("transactions",JSON.stringify(transactions));

updateTransactionList();
updateSummary();
}

//initial render 
updateTransactionList();
updateSummary();