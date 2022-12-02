let currentUser

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
        console.log(currentUser)

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

        currentUser.reservations.forEach((reservation) => {
            console.log(reservation)
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

            table.appendChild(newTr);
        })
    }


}