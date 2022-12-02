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
            newTd.innerHTML = reservation.startDate
            newTr.appendChild(newTd)
            newTd = document.createElement("td");
            newTd.innerHTML = reservation.startTime
            newTr.appendChild(newTd)
            newTd = document.createElement("td");
            newTd.innerHTML = reservation.hours
            newTr.appendChild(newTd)

            let newUpdateButton = document.createElement("button")
            newUpdateButton.innerHTML = "Update"
            newUpdateButton.onclick = showUpdateForm
            newUpdateButton.value = reservation.id
            newTr.appendChild(newUpdateButton)

            table.appendChild(newTr);
        })
    }
}

function showUpdateForm(){
    let id = this.value
    currentResId = id
    document.querySelector('#tableDiv').classList.add('reservationTableHidden')
    // document.querySelector('#updateReservation').classList.remove('updateBoxHidden')

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
    request.open("PUT", `http://127.0.0.1:3000/reservations/update/${currentUser.user}/id/${currentResId}/newDate/${date}/newTime/${time}/newHours/${hours}`, true);
    request.send()
    request.onload = function () {
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`);
            return;
        }

        let response = JSON.parse(this.response)
        if(response.error){
            alert(response.message)
        }else{
            document.querySelector('#tableDiv').classList.remove('reservationTableHidden')
            document.querySelector('#updateReservation').classList.add('updateBoxHidden')
            login()
        }
    }
}