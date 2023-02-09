
let request = new XMLHttpRequest();
request.open("GET", `http://127.0.0.1:3000/reservations/getAll`, true);
request.send()
request.onload = function () {

    if (request.status < 200 && request.status >= 400) {
        console.log(`Error ${request.status}: ${request.statusText}`);
        return;
    }

    let response = JSON.parse(this.response)
    let reservations = response.message

    if(response.error){
        console.log(response.error)
        return
    }


    let table = document.querySelector('#availabilityTable')
    table.innerHTML = table.rows[0].innerHTML;

    reservations.sort((a, b) => {
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

    reservations.forEach((reservation) => {
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

        table.appendChild(newTr);
    })
}