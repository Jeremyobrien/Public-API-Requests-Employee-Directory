
const directoryPage =  document.querySelector('#gallery');
const employeeDataUrl = 'https://randomuser.me/api/?results=12';
let employeeInfo = '';



//Fetch functions
async function fetchData(url) {
   employeeInfo = await fetch(url)
                                .then(checkStatus)
                                .then(res => res.json())
                                .catch(error => console.log(Error(error)))
    employeeInfo = employeeInfo.results;
    return employeeInfo;
}
    

//Helper Functions
function checkStatus(response){
    if (response.ok){
        return Promise.resolve(response);
    } else {
        return Promise.reject(response.statusText);
    }
}

function generateCards (arr) {
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

function generateModal(employee) {
    let day = new Date(employee.dob.date).getDay();
    let month = new Date(employee.dob.date).getMonth();
    let year = new Date(employee.dob.date).getFullYear();
    const modal =`<div class="modal-container">
                    <div class="modal">
                        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                        <div class="modal-info-container">
                            <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                            <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                            <p class="modal-text">${employee.email}</p>
                            <p class="modal-text cap">${employee.location.city}</p>
                            <hr>
                            <p class="modal-text">${employee.cell}</p>
                            <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.street.city}, ${employee.location.state} ${employee.location.postcode}</p>
                            <p class="modal-text">Birthday: ${month}/${day}/${year}</p>
                        </div>
                    </div>

                    // IMPORTANT: Below is only for exceeds tasks 
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                </div>`;
            
     directoryPage.insertAdjacentHTML('afterend', modal) 
    }

fetchData(employeeDataUrl)                        
    .then(generateCards)
    .catch(error => console.log(Error(error)))

//listens for clicks to generate modal
 const collectionOfCards = directoryPage.children;
    directoryPage.addEventListener('click', (e) => {       
        if(e.target !== directoryPage){
            const employeeCard = e.target.closest('.card');
            for(let i = 0; i < collectionOfCards.length; i++){
                if (collectionOfCards[i] === employeeCard){
                    const employeeName = collectionOfCards[i].children[1].firstElementChild.textContent;
                    employeeInfo.filter(employee => {
                        if (employeeName.toLowerCase() === `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`){
                            return generateModal(employee);
                        }
                    })
                    
                }
            }    
        }

   })
                  
const searchBar =  document.querySelector('#search-input');
const searchButton = document.querySelector('#search-submit');
//Shows filtered search results from student dataset or error message according to search input
const searchFunction = (searchInput, list) => {
   let filteredList = [];
   //loops through dataset and pushes potential search matches to 'filteredList'
   for (let i = 0; i < list.length; i++) {
     let employee = list[i];
      searchInput = searchBar.value.toLowerCase();
     let employeeName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
         if (searchInput.length !== 0 && employeeName.includes(searchInput)) {
         filteredList.push(employee);
       }
      }
      directoryPage.innerHTML = '';
      generateCards(filteredList);
  
   //returns error message if there are no matches
   if (filteredList.length === 0) {
         directoryPage.innerHTML = '';
         const errorMessage = '<p class="no-results">Sorry, there are no employees with that name.</p>';
         directoryPage.insertAdjacentHTML('beforeend', errorMessage);
       } 
}


//Event listeners that handle search input
searchBar.addEventListener('keyup', (e)=> {
   e.preventDefault();
   searchFunction(e.target.value, employeeInfo);
});

//handles 'search button' clicks tied to search input field
searchButton.addEventListener('click', (e)=> {
   e.preventDefault();
   searchFunction(searchBar.value, employeeInfo);
});

