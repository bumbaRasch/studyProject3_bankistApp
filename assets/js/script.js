"use strict";

console.group('Banking APP');



// Data
const account1 = {
    owner: 'Max Muster',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    password: 2000,
    movementsDates: [
      '2021-11-18T21:31:17.178Z',
      '2021-12-23T07:42:02.383Z',
      '2022-01-28T09:15:04.904Z',
      '2022-04-01T10:17:24.185Z',
      '2022-05-08T14:11:59.604Z',
      '2022-05-27T17:01:17.194Z',
      '2022-11-17T23:36:17.929Z',
      '2022-11-19T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'de-DE', // de-DE
  };
  
  const account2 = {
    owner: 'Sarah Martha Smith',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    password: 1985,
    movementsDates: [
      '2022-11-01T13:15:33.035Z',
      '2022-11-30T09:48:16.867Z',
      '2022-12-25T06:04:23.907Z',
      '2022-01-25T14:18:46.235Z',
      '2022-02-05T16:33:06.386Z',
      '2022-04-10T14:43:26.374Z',
      '2022-06-25T18:49:59.371Z',
      '2022-11-22T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  

  
  
const accounts = [account1, account2,];
// welcome label
const welcomeMessage = document.querySelector('.header__title');
// container app main
const containerApp = document.querySelector('.app');

// ELEMENTS 

// add input Password and Login
const userPass = document.querySelector('.login__input--pass');
const userLogin = document.querySelector('.login__input--user');
// add Date element
const labelDate = document.querySelector('.date');
// add Balance element
const labelBalance = document.querySelector('.balance__value');
//add Summary elements
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
// Movements Element
const containerMovements = document.querySelector('.movements');
//add buttons 
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn__sort');
// inputs
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePassword = document.querySelector('.form__input--pass');



//Format Movements
const formatMovementDate = function(date, locale) {

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // Create date
  const daysPassed = calcDaysPassed(new Date(), date)
    if(daysPassed === 0) return "Today";
    if(daysPassed === 1) return "Yesterday";
    if(daysPassed <= 7) return `${daysPassed} days ago`;
    else {
      return new Intl.DateTimeFormat(locale).format(date)
  }
};

const formatCurrency = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
};

// Display movements
const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';
  
    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  
    movs.forEach(function (mov, i) {

      const type = mov > 0 ? 'deposit' : 'withdrawal';

      // Movements date
      const date = new Date(acc.movementsDates[i]);
      const displayDate = formatMovementDate(date, acc.locale);

      // Formatted currency locale
      const formattedMovements = formatCurrency(mov, acc.locale, acc.currency);

      // add Movements html
      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
           <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMovements}</div>
        </div>
      `;
  
      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
  
  // Display balance
const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
};
  
// Dasplay summary
const calcDisplaySummary = function (acc) {
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);
  
    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent =  formatCurrency(Math.abs(out), acc.locale, acc.currency);
  
const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).filter((int, i, arr) => {
        // console.log(arr);
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency);
  };
  
const createUsernames = function (accs) {
    accs.forEach(function (acc) {
      acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
  };
createUsernames(accounts);


const updateUI = function(acc){
    // Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
};


// Logout function (Timer)
const startLogOutTimer = function(){

  const tick = function(){

    // timer
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
  
    // In each call print the remaining time to UI
    labelTimer.textContent = `${min}:${seconds}`;
  
    
  
    //After timer stop 0, log out user
    if(time === 0){
      setInterval(appTimer);
      // Display UI and message
      welcomeMessage.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    // Decrese 1 second
    time--
  };
  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick()
  const appTimer = setInterval(tick, 1000);
  return appTimer;
};


// Event handlers
let currentAccount, appTimer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  
  // find account 
  currentAccount = accounts.find(acc => acc.username === userLogin.value);

  if (currentAccount?.password === +(userPass.value)) {
    // Display UI and message
    welcomeMessage.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;


  // Create current date and time
    const dateOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      // weekday: 'long',
    };
      
    const currentDate = () => {
      labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, dateOptions).format()
      setTimeout(currentDate, 1000);
    };
    currentDate();
  
    // Clear input fields
    userLogin.value = userPass.value = '';
    userPass.blur();
    
    // Log out timer and check timer
    if(appTimer){
      clearInterval(appTimer)
    };
    
    appTimer = startLogOutTimer()

     //update UI
    updateUI(currentAccount);
  }
});




  



// Function Transfer

btnTransfer.addEventListener('click', function(event){
  event.preventDefault();
  
  const amount = +(inputTransferAmount.value)

  const receiverAccount = accounts.find (acc => acc.username === inputTransferTo.value);
  
  // Clear
  inputTransferAmount.value = inputTransferTo.value = '';

  //check and doing the transfer
  if(amount > 0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username){
   currentAccount.movements.push(-amount);
   receiverAccount.movements.push(amount);
  };

  // Add tranfer date 
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAccount.movementsDates.push(new Date().toISOString());

  // update UI
    updateUI(currentAccount);


    // Reset timer
    clearInterval(appTimer);
    appTimer = startLogOutTimer();
});



btnLoan.addEventListener('click', function(event){
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  // 10% of amount
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    setTimeout(function() {
    //add movement
    currentAccount.movements.push(amount);

   // Add loan date 
   currentAccount.movementsDates.push(new Date().toISOString());
  
    // Update UI
    updateUI(currentAccount)}, 3000);

    // Reset timer
    clearInterval(appTimer);
    appTimer = startLogOutTimer();
  };
    //clear Input field
    inputLoanAmount.value = '';
});



// Close 
btnClose.addEventListener('click', function(event){
  event.preventDefault();
  if(inputCloseUsername.value === currentAccount.username && +(inputClosePassword.value) === currentAccount.password){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

    // Delete account
    accounts.splice(index, 1)
    // Hide UI 
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePassword.value = '';
});


// Sort
let sorted = false 
btnSort.addEventListener('click', function(event){
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted
});



console.groupEnd();