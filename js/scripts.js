//Variables
const directoryPage =  document.querySelector('#gallery');
const employeeDataUrl = 'https://randomuser.me/api/?nat=us&results=12';
let employeeInfo = '';
const modalContainer = document.querySelector('.modal-container');
const collectionOfCards = directoryPage.children;
const searchBar =  document.querySelector('#search-input');
const searchButton = document.querySelector('#search-submit');
let featuredResults = '';


//Fetch functions
async function fetchData(url) {
   employeeInfo = await fetch(url)
                         .then(res => res.json())
    employeeInfo = employeeInfo.results;
    featuredResults = employeeInfo;
    return employeeInfo;
}

//Function call to get 'employeeInfo'
fetchData(employeeDataUrl) 
    .then(modalContainer.style.display = 'none')                       
    .then(generateHTML)


//Helper Functions

//Generates employee cards for directory
function generateHTML (arr) {
    const cards = arr.map(card => ` 
        <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${card.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${card.name.first} ${card.name.last}</h3>
            <p class="card-text">${card.email}</p>
            <p class="card-text cap">${card.location.city}, ${card.location.state}</p>
        </div>
        </div>
        </div>
    `).join('');
    return directoryPage.insertAdjacentHTML('beforeend', cards); 
};

//Generates modal window
function generateModal(employee) {
    let day = new Date(employee.dob.date).getDay();
    let month = new Date(employee.dob.date).getMonth();
    let year = new Date(employee.dob.date).getFullYear();
    let modal = `
                 <div class="modal">
                        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                        <div class="modal-info-container">
                            <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                            <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                            <p class="modal-text">${employee.email}</p>
                            <p class="modal-text cap">${employee.location.city}</p>
                            <hr>
                            <p class="modal-text">${employee.cell}</p>
                            <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                            <p class="modal-text">Birthday: ${month}/${day}/${year}</p>
                        </div>
                    </div>

                    // IMPORTANT: Below is only for exceeds tasks 
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                </div>`;
            
     modalContainer.insertAdjacentHTML('beforeend', modal) 
     modalContainer.style.display = 'block';
    }



//listens for clicks on filtered search results to generate modal
 const getModal = (employee)=> { 
     for(let i = 0; i < collectionOfCards.length; i++){
        if (collectionOfCards[i] === employee){
            const employeeName = collectionOfCards[i].children[1].firstElementChild.textContent;
            if (featuredResults.length === 0){
                employeeInfo.filter(employee => {
                    if (employeeName.toLowerCase() === `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`) { 
                            generateModal(employee);
                        }                                 
                    })         
          }
          else {
            featuredResults.filter(employee => {
                if (employeeName.toLowerCase() === `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`) {  
                    if (featuredResults.length === 1){
                        generateModal(employee);
                        const modalButtons = document.querySelector('.modal-btn-container');
                        modalButtons.style.display = 'none';
                    } else {
                        generateModal(employee);
                    }                                 
                }
            })           
         }
     } 
  }
}                   

//Shows filtered search results from employee directory or error message according to search input
const searchFunction = (searchInput, list) => {
    featuredResults = [];
   //loops through dataset and pushes potential search matches to 'featuredResults'
    for (let i = 0; i < list.length; i++) {
        let employee = list[i];
        searchInput = searchBar.value.toLowerCase();
        let employeeName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
            if (searchInput.length !== 0 && employeeName.includes(searchInput)) {
            featuredResults.push(employee);
            }
        }
        directoryPage.innerHTML = '';
        generateHTML(featuredResults);
    
    //returns error message if there are no matches
    if (searchInput.length > 0 && featuredResults.length === 0) {
            directoryPage.innerHTML = '';
            const errorMessage = '<h2>Sorry, there are no employees with that name.</h2>';
            directoryPage.insertAdjacentHTML('beforeend', errorMessage);
        } 
        else if (searchInput.length === 0 && featuredResults.length === 0){
            generateHTML(list);
        }
}

//Handles 'PREV' button clicks
const prevButtonAction = (arr) => {
    const currentModal = document.querySelector('.modal-name').textContent.toLowerCase();
    arr.forEach( employee => {
    if(`${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}` === currentModal) {
        const currentEmployee = arr.indexOf(employee);
        if (currentEmployee > 1){
            modalContainer.innerHTML ='';
            generateModal(arr[(currentEmployee - 1)])
            }              
         else if (currentEmployee === 1) {
            modalContainer.innerHTML ='';
            generateModal(arr[(currentEmployee - 1)])
            prevButton =  document.querySelector('#modal-prev');
            prevButton.style.display = 'none';
            }
        }   
    })
}

//Handles 'NEXT' button clicks
const nextButtonAction = (arr) => {
    const currentModal = document.querySelector('.modal-name').textContent.toLowerCase();
    arr.forEach( employee => {
        if(`${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}` === currentModal){
            const currentEmployee = arr.indexOf(employee);
            if (currentEmployee < arr.length - 2){
                modalContainer.innerHTML ='';
                generateModal(arr[(currentEmployee + 1)])
            }   
            else if (currentEmployee === arr.length - 2) {
                modalContainer.innerHTML ='';
                generateModal(arr[(currentEmployee + 1)])
                nextButton =  document.querySelector('#modal-next');
                nextButton.style.display = 'none';
            }
        }
    })
}

//Handles card clicks
const handleCardClicks = (arr, e) => {
    modalContainer.innerHTML = '';
    const employeeCard = e.target.closest('.card');
    const employeeName = employeeCard.children[1].firstElementChild.textContent.toLowerCase();
    const firstResult = `${arr[0].name.first.toLowerCase()} ${arr[0].name.last.toLowerCase()}`;
    const lastResult = `${arr[arr.length -1].name.first.toLowerCase()} ${arr[arr.length - 1].name.last.toLowerCase()}`;
    if( employeeName === firstResult){
        getModal(employeeCard);
        const prevButton = document.querySelector('#modal-prev');
        prevButton.style.display = 'none'
    } 
    else if( employeeName === lastResult){
        getModal(employeeCard);
        const nextButton = document.querySelector('#modal-next');
        nextButton.style.display = 'none'
    } 
    else {
        getModal(employeeCard);
    }     
}  

//Event listeners 

//Handles search input
searchBar.addEventListener('keyup', (e)=> {
   e.preventDefault();
   searchFunction(e.target.value, employeeInfo);
});

//handles 'search button' clicks tied to search input field
searchButton.addEventListener('click', (e)=> {
   e.preventDefault();
   searchFunction(searchBar.value, employeeInfo);
});

//listens for card clicks to display modal
directoryPage.addEventListener('click', (e) => {    
    if(e.target !== directoryPage){
        if (featuredResults.length === 0){
            handleCardClicks(employeeInfo, e);       
        } else {
            handleCardClicks(featuredResults, e);
        }      
    }
})

//listens for modal button clicks
modalContainer.addEventListener('click', (e)=>{
    const closeButton = document.querySelector('#modal-close-btn');
    const prevButton =  document.querySelector('#modal-prev');
    const nextButton = document.querySelector('#modal-next');
    const selection = e.target;
    if(selection.tagName === "STRONG" || selection === closeButton){
        modalContainer.style.display = 'none';
    } 
    else if (selection === prevButton) {    
        if (featuredResults.length === 0) {
            prevButtonAction(employeeInfo);
        } else {
            prevButtonAction(featuredResults);
        }
    }
    else if (selection === nextButton) {  
        if (featuredResults.length === 0){
            nextButtonAction(employeeInfo);
        } else {
            nextButtonAction(featuredResults);
        }
    }
})
  