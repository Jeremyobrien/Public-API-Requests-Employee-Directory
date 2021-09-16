
const directoryPage =  document.querySelector('#gallery');
const employeeList = document.createElement('ul');
directoryPage.appendChild(employeeList);

//Fetch functions
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log('Looks like there was a problem', error))
}

fetchData('https://randomuser.me/api/?results=12&inc=name,location,email,picture,cell')
    .then(res => console.log(res))
    .then(res => {
        const employeeInfo = res.results;
       return generateCards(employeeInfo);
    })

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
    <li>
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
</li>
`)
employeeList.insertAdjacentHTML('beforeend', cards); 
return employeeList.insertAdjacentHTML('afterend', '</ul>');
};

//Event listeners
document.addEventListener('load', async ()=>{
    const data =  await fetchData();
    const cards = await generateCards(data)
    return cards;
 })