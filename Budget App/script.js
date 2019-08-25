

class CalculateBudget {
    constructor(budgetAmount) { 
        this.budgetAmount = budgetAmount;
    }
}

class Budget {
    constructor(expense, expenseAmount, itemID) {
        this.expense = expense;
        this.expenseAmount = expenseAmount;
        this.itemID = itemID;
    }
}


//UI class: to handle whats rendered on the UI
class UI {
    static addBudgetToList(budget) {
        const expenseList = document.querySelector('.expense-list');

        
        const list = document.createElement('ul');
        list.innerHTML += `<li>${budget.expense}<span>${budget.expenseAmount}</span> <button data-id = "${budget.itemID}"class="edit">Edit</button><button data-id = "${budget.itemID}" class="delete">Delete</button></li>`;
        expenseList.insertBefore(list, expenseList.childNodes[0]);
        


        //reset field
        document.querySelector('.expenses').reset();

        
    }




    static budgetFeedback(budget) {
        
        const budgetFeedback = document.querySelector('.budget-count');
       

        //update budget amount in UI
        budgetFeedback.textContent = budget.budgetAmount;

        UI.balanceFeedback();

        
        //reset form field
        document.querySelector('.budget').reset();
        //UI.balanceFeedback(budget.budgetAmount);

    }

    static expenseFeedback(budgetList) {
        const expenseFeedback = document.querySelector('.expense-count');
        let total = 0;
        budgetList.forEach((item) => {
            total += parseInt(item.expenseAmount);
            return total;
        })
        //update expenses amount in UI 
        expenseFeedback.textContent = total;

        
        
       

        UI.balanceFeedback();
        
    }

   

    static balanceFeedback() {

        const budgetValue = parseInt(document.querySelector('.budget-count').textContent);
        const expenseValue = parseInt(document.querySelector('.expense-count').textContent);
        const balance = budgetValue - expenseValue;

        document.querySelector('.balance-count').textContent = balance;



    }

    static deleteItem(element) {
        if(element.classList.contains('delete')) {
            let parent = element.parentElement;
            let value = parent.querySelector('span');
            const expenseFeedback = document.querySelector('.expense-count');
            let currentExpense = parseInt(expenseFeedback.textContent) - parseInt(value.textContent);
            expenseFeedback.textContent = currentExpense;
            Store.deleteBudget(element);
            parent.remove();
            UI.balanceFeedback();
            
        }
    }

    static editItem(element) {
        if(element.classList.contains('edit')) {
            let parent = element.parentElement;
            let value = parent.querySelector('span');
            const expenseFeedback = document.querySelector('.expense-count');

           if(document.querySelector('#expenses').value === '' || document.querySelector('#expenses-amount').value === '') {
            document.querySelector('#expenses').value = parent.childNodes[0].textContent;
            document.querySelector('#expenses-amount').value = value.textContent;

            let currentExpense = parseInt(expenseFeedback.textContent) - parseInt(value.textContent);
            expenseFeedback.textContent = currentExpense;
            Store.deleteBudget(element);
            parent.remove();
            UI.balanceFeedback();
           } else {
               alert("Finish the current edit")
               return false;
           }
           

           

    }

}

   
}

//Store class: save to localStorage 

class Store {
    static getBudget() {
        let budgetList;
        if(localStorage.getItem('budgetList') === null) {
            budgetList = [];
        }else{
            budgetList = JSON.parse(localStorage.getItem('budgetList'));
         
        }
        return budgetList;
    }

    static saveBudget(budget) {
      let budgetList =  Store.getBudget();
      budgetList.push(budget);
      UI.expenseFeedback(budgetList);
      localStorage.setItem('budgetList', JSON.stringify(budgetList));
    }

    static deleteBudget (element) {
        const budgetList = Store.getBudget();
        console.log(element)
        budgetList.forEach((item, index) => {
            if(item.itemID === parseInt(element.getAttribute('data-id'))) {
                budgetList.splice(index, 1);
                localStorage.setItem('budgetList', JSON.stringify(budgetList));
            }
        })
    }


    static getInputBudget() {
        let budget;
        if(localStorage.getItem('InputBudget') === null) {
            budget = [];
        } else {
            budget = JSON.parse(localStorage.getItem('InputBudget'));
        }
        UI.budgetFeedback(budget);
    }

    static saveInputBudget(budget) {
        let InputBudget = [];
        InputBudget = budget;
        localStorage.setItem('InputBudget', JSON.stringify(InputBudget));
    }
}


//UpdateBudget class: to handle when budget is added, expenses added and calculate balance



//Budget Event: When a buget is added/submitted
document.querySelector('.budget').addEventListener('submit', (e) => {
    //prevent default form submission 
    e.preventDefault();

    //get the value of the buget
    const budget = document.querySelector('#budget-input').value;
    const budgetAmount = new CalculateBudget(budget)
    UI.budgetFeedback(budgetAmount);
    Store.saveInputBudget(budgetAmount);

})


//Expense Event: When an expense(and amount) is added/submitted
document.querySelector('.expenses').addEventListener('submit', (e) => {
    e.preventDefault();
    const expense = document.querySelector('#expenses').value;
    const expenseAmount = document.querySelector('#expenses-amount').value;
    const itemID = Math.floor(Math.random()* 20000) + Math.floor(Math.random()* 20000);
    if(expense === '' || expenseAmount === '' || expenseAmount < 0) {
        alert('Value cannot be empty or negative');
        return false;
    } else {
       
        const budget = new Budget(expense, expenseAmount, itemID);
        //add to UI
        UI.addBudgetToList(budget);
        //Add to local Storage
        Store.saveBudget(budget);
    }

    
})


//delete event and  edit event

document.querySelector('.expense-list').addEventListener('click', (e) => {
    UI.deleteItem(e.target);
    UI.editItem(e.target);
});



//DOMLoaded event

document.addEventListener('DOMContentLoaded', () => {
    let budgetList = Store.getBudget();
    Store.getInputBudget();
    UI.expenseFeedback(budgetList)
    budgetList.forEach(element => {
        UI.addBudgetToList(element);
    });
})

