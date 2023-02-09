let currentUser
let currentResId

function login(){
    let username = document.querySelector('#userNameBox').value

    let request = new XMLHttpRequest();
    request.open("GET", `http://127.0.0.1:3000/getUser/${username}`, true);
    request.send()
    request.onload = function () {

        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`);
            return;
        }

        let response = JSON.parse(this.response)
        currentUser = response.message

        if(response.error){
            let putRequest = new XMLHttpRequest();
            putRequest.open("PUT", `http://127.0.0.1:3000/addUser/${username}`, false);
            putRequest.send()

            if (putRequest.status < 200 && putRequest.status >= 400) {
                console.log(`Error ${putRequest.status}: ${putRequest.statusText}`);
                return;
            }

            currentUser = JSON.parse(putRequest.response).message
        }

        document.querySelector('#loginDiv').classList.add('loginBoxHidden')
        document.querySelector('#tableDiv').classList.remove('reservationTableHidden')

        let table = document.querySelector('#loginTable')
        table.innerHTML = table.rows[0].innerHTML;



        currentUser.reservations.sort((a, b) => {
            let dateA = Date.parse(a.startDate)
            let dateB = Date.parse(b.startDate)

            if(dateA === dateB){
                if(a.startTime < b.startTime){
                    return -1
                }
                if(a.startTime > b.startTime){
                    return 1
                }
            }

            return Date.parse(a.startDate) - Date.parse(b.startDate)
        })

        currentUser.reservations.forEach((reservation) => {
            let newTr = document.createElement("tr");

            let newTd = document.createElement("td");
            newTd.innerHTML = (new Date(reservation.startDate)).toLocaleDateString()
            newTr.appendChild(newTd)
            newTd = document.createElement("td");
            newTd.innerHTML = reservation.startTime
            newTr.appendChild(newTd)
            newTd = document.createElement("td");
            newTd.innerHTML = reservation.hours
            newTr.appendChild(newTd)

            let buttonDiv = document.createElement("div")
            let newUpdateButton = document.createElement("button")
            newUpdateButton.innerHTML = "Update"
            newUpdateButton.onclick = showUpdateForm
            newUpdateButton.value = reservation.id
            newUpdateButton.classList.add("buttonGreen")
            buttonDiv.appendChild(newUpdateButton)
            let newDeleteButton = document.createElement("button")
            newDeleteButton.innerHTML = "Delete"
            newDeleteButton.onclick = deleteReservation
            newDeleteButton.value = reservation.id
            newDeleteButton.classList.add("buttonRed")
            buttonDiv.appendChild(newDeleteButton)

            newTr.appendChild(buttonDiv)

            table.appendChild(newTr);
        })
    }
}

function showUpdateForm(){
    let id = this.value
    currentResId = id
    document.querySelector('#tableDiv').classList.add('reservationTableHidden')
    document.querySelector('#updateReservation').classList.remove('updateBoxHidden')

    let res = currentUser.reservations.find((reservation) => {
        return reservation.id === parseInt(id)
    })
    document.querySelector('#newDate').value = res.startDate.substring(0, res.startDate.length - 1);
    document.querySelector('#newHours').value = res.hours
}

function updateReservation(){
    let date = new Date(document.querySelector('#newDate').value)
    let hours = document.querySelector('#newHours').value
    let time =  ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)

    let request = new XMLHttpRequest();
    request.open("PUT", `http://127.0.0.1:3000/reservations/update/${currentUser.user}/id/${currentResId}/newDate/${date.toISOString()}/newTime/${time}/newHours/${hours}`, true);
    request.send()
    request.onload = function () {
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`);
            return;
        }

        let response = JSON.parse(this.response)
        if(response.error){
            alert(response.message)
            return;
        }
        currentUser = response.message
        document.querySelector('#tableDiv').classList.remove('reservationTableHidden')
        document.querySelector('#updateReservation').classList.add('updateBoxHidden')
        login()

    }
}

function deleteReservation(){
    let id = this.value
    let request = new XMLHttpRequest();
    request.open("DELETE", `http://localhost:3000/reservations/delete/${currentUser.user}/id/${id}`, true);
    request.send()
    request.onload = function () {
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`);
            return;
        }

        let response = JSON.parse(this.response)
        if(response.error){
            alert(response.message)
            return;
        }
        currentUser = response.message
        login()
    }
}

function showAddForm(){
    document.querySelector('#tableDiv').classList.add('reservationTableHidden')
    document.querySelector('#addReservation').classList.remove('addBoxHidden')
}

function addReservation(){
    let date = new Date(document.querySelector('#addDate').value)
    let hours = document.querySelector('#addHours').value
    let time =  ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)

    let request = new XMLHttpRequest();
    request.open("PUT", `http://localhost:3000/reservations/add/${currentUser.user}/date/${date.toISOString()}/time/${time}/hours/${hours}`, true);
    request.send()
    request.onload = function () {
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`);
            return;
        }

        let response = JSON.parse(this.response)
        if(response.error){
            alert(response.message)
            return;
        }
        currentUser = response.message
        document.querySelector('#tableDiv').classList.remove('reservationTableHidden')
        document.querySelector('#addReservation').classList.add('addBoxHidden')
        login()
    }
}