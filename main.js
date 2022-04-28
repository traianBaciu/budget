"use strict";
// variables
//1. inputs
const budgetAmountInput = document.querySelector(".budget-amount");
const expenseItemInput = document.querySelector(".expense-item");
const expenseAmountInput = document.querySelector(".expense-amount");
//2. buttons
const addBudgetBtn = document.querySelector(".add-budget");
const addExpenseBtn = document.querySelector(".add-expense");
const doneBtn = document.querySelector(".finish-edit");
//3. totals
const budgetTotal = document.querySelector(".budget-total");
const expensesTotal = document.querySelector(".expenses-total");
const balanceTotal = document.querySelector(".balance-total");
//4. detailed expenses
const expensesContainer = document.querySelector(".list-of-expenses");
//5. general
let expItem, expValue;
//6. overlay
const overlay = document.querySelector(".overlay");
const editExpenseItemInput = document.querySelector(".edit-expense-item");
const editExpenseAmountInput = document.querySelector(".edit-expense-amount");
//functions
//0. update expenses
const updateExpensesTotal = function () {
  let expTot;
  const expensesArray = [];
  if (expensesContainer.querySelectorAll(".exp-value").length > 0) {
    expensesContainer
      .querySelectorAll(".exp-value")
      .forEach((node) => expensesArray.push(Number(node.innerText)));
    expTot = expensesArray.reduce((val, tot) => val + tot, 0);
  } else {
    expTot = 0;
  }
  expensesTotal.innerText = `$ ${expTot}`;
  balanceTotal.innerText = `$ ${
    budgetTotal.innerText
      ? Number(budgetTotal.innerText.split(" ")[1]) - expTot
      : 0 - expTot
  }`;
  updateTotalsLS();
};
//1. add budget
const addBudgetFunction = function (e) {
  e.preventDefault();
  if (budgetAmountInput.value === "" || Number(budgetAmountInput.value) < 0) {
    alert("Please insert a valid amount!");
  } else {
    let budget = Number(budgetAmountInput.value);
    budgetTotal.innerText = budgetTotal.innerText
      ? `$ ${Number(budgetTotal.innerText.split(" ")[1]) + budget}`
      : `$ ${budget}`;
    balanceTotal.innerText = balanceTotal.innerText
      ? `$ ${Number(balanceTotal.innerText.split(" ")[1]) + budget}`
      : `$ ${budget}`;
    budgetAmountInput.value = "";
    budgetAmountInput.blur();
    updateTotalsLS();
  }
};
//2. add expense
const addExpenseFunction = function (e) {
  e.preventDefault();
  if (expenseItemInput.value === "") alert("Please insert a valid item!");
  else if (expenseAmountInput.value === "" || expenseAmountInput.value < 0)
    alert("Please insert a valid amount!");
  else {
    let html = `
    <div class="item-list">
    <div class="exp-item">${expenseItemInput.value}</div>
            <div class="exp-value">${expenseAmountInput.value}</div>
            <div class="edit-btn">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <div class="delete-btn"><i class="fa-solid fa-trash"></i></div>
            </div>
    `;
    expensesContainer.insertAdjacentHTML("afterbegin", html);
    updateExpensesTotal();
    saveExpensesToLS(expenseItemInput.value, expenseAmountInput.value);
    expenseItemInput.value = "";
    expenseAmountInput.value = "";
    expenseAmountInput.blur();
  }
};
//3.a. edit and delete
const deleteItem = function (fromWhere, what) {
  fromWhere.removeChild(what);
  updateExpensesTotal();
};
const checkClass = function (e) {
  e.preventDefault();
  if (e.target.parentNode.classList.contains("edit-btn")) {
    expItem = e.target.parentNode.parentNode.querySelector(".exp-item");
    expValue = e.target.parentNode.parentNode.querySelector(".exp-value");
    overlay.classList.remove("hidden");
    editExpenseItemInput.value = expItem.textContent;
    editExpenseAmountInput.value = expValue.textContent;
  } else if (e.target.parentNode.classList.contains("delete-btn")) {
    let x = e.target.parentNode.parentNode;
    if (confirm("Are you sure?")) {
      deleteItem(expensesContainer, x);
      deleteFromLS(x.querySelector(".exp-item").innerText);
    }
  }
};
//4. finish editing
const finishEditing = function (e) {
  e.preventDefault();
  updateEditedExpensesLS(expItem.textContent, expValue.textContent);
  expItem.textContent = editExpenseItemInput.value;
  expValue.textContent = editExpenseAmountInput.value;
  overlay.classList.add("hidden");
  editExpenseItemInput.value = "";
  editExpenseAmountInput.value = "";
  updateExpensesTotal();
};
//events
//1. add budget
addBudgetBtn.addEventListener("click", addBudgetFunction);
//2. add expense
addExpenseBtn.addEventListener("click", addExpenseFunction);
//3. edit + delete (checking what icon was clicked)
expensesContainer.addEventListener("click", checkClass);
//4. finish editing
doneBtn.addEventListener("click", finishEditing);

//local storage
//1. a. totals
const updateTotalsLS = function () {
  let budTotal = budgetTotal.innerText
    ? Number(budgetTotal.innerText.split(" ")[1])
    : 0;
  let expTotal = expensesTotal.innerText
    ? Number(expensesTotal.innerText.split(" ")[1])
    : 0;
  let totals = {
    budget: `${budTotal}`,
    expenses: `${expTotal}`,
    balance: `${budTotal - expTotal}`,
  };
  localStorage.setItem("totals", JSON.stringify(totals));
};
//1. b. get totals from ls
const getTotalsFromLS = function () {
  let totals;
  if (localStorage.getItem("totals") === null) {
    totals = {};
  } else {
    totals = JSON.parse(localStorage.getItem("totals"));
    budgetTotal.textContent = `$ ${totals.budget}`;
    expensesTotal.textContent = `$ ${totals.expenses}`;
    balanceTotal.textContent = `$ ${totals.balance}`;
  }
};
getTotalsFromLS();
//2. a. save expenses to local storage
const saveExpensesToLS = function (item, value) {
  let expenses;
  if (localStorage.getItem("expenses") === null) {
    expenses = [];
  } else {
    expenses = JSON.parse(localStorage.getItem("expenses"));
  }
  expenses.push({ item: `${item}`, value: `${value}` });
  localStorage.setItem("expenses", JSON.stringify(expenses));
};
//2. b. get expenses from local storage
const getExpensesFromLS = function () {
  let expenses;
  if (localStorage.getItem("expenses") === null) {
    expenses = [];
  } else {
    expenses = JSON.parse(localStorage.getItem("expenses"));
  }
  expenses.forEach((item) => {
    let html = `
    <div class="item-list">
    <div class="exp-item">${item.item}</div>
            <div class="exp-value">${item.value}</div>
            <div class="edit-btn">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <div class="delete-btn"><i class="fa-solid fa-trash"></i></div>
            </div>
    `;
    expensesContainer.insertAdjacentHTML("afterbegin", html);
  });
};
getExpensesFromLS();
//3. delete from local storage
const deleteFromLS = function (itemToDelete) {
  let expenses;
  if (localStorage.getItem("expenses") === null) {
    expenses = [];
  } else {
    expenses = JSON.parse(localStorage.getItem("expenses"));
  }
  expenses.forEach((exp, i) => {
    if (exp.item === itemToDelete) {
      expenses.splice(i, 1);
    }
  });
  localStorage.setItem("expenses", JSON.stringify(expenses));
};
const updateEditedExpensesLS = function (itemToUpdate, valueToUpdate) {
  let expenses;
  if (localStorage.getItem("expenses") === null) {
    expenses = [];
  } else {
    expenses = JSON.parse(localStorage.getItem("expenses"));
  }
  expenses.forEach((exp) => {
    if (exp.item === itemToUpdate && exp.value === valueToUpdate) {
      exp.item = editExpenseItemInput.value;
      exp.value = editExpenseAmountInput.value;
    }
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
};
