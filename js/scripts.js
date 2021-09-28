
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


 const collectionOfCards = directoryPage.children;
    directoryPage.addEventListener('click', (e) => {       
        if(e.target !== directoryPage){
            const employee = e.target.closest('.card');
            for(let i = 0; i < collectionOfCards.length; i++){
                if (collectionOfCards[i] === employee){
                    return generateModal(employeeInfo[i]);
                }
            }    
        }

   })
                  
            
