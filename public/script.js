let domain = "https://" + window.location.hostname
// console.log(domain)
if(domain === "https://localhost" || domain === "http://localhost") {
    domain = "http://localhost:8000";
}

const btn = document.getElementById("btn");
const nbr_lines_elem = document.getElementById("nbr_lines")
const error_message = document.getElementById("error_message");
const type_elem = document.getElementById("type");
const limit_elem = document.getElementById("limit");
const page_elem = document.getElementById("page");
const order_elem = document.getElementById("order");
const results_container = document.getElementById("results");
const left_arrows = document.querySelectorAll(".left");
const right_arrows = document.querySelectorAll(".right");
const columns = document.querySelectorAll(".col");

const query = ()=> {
    error_message.textContent = "";

    const params = {
        type:type_elem.value,
        page:page_elem.value - 1,
        order:order_elem.value,
        limit:limit_elem.value
    }

    const request = buildQuery(params);
    console.log(query)

    fetch(request, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        },
    })
    .then(response => response.json())
    .then((res) => {
        console.log(res);
        displayResults(res, results_container);
        // window.open(request, '_blank');
    })
    .catch((error) => {
        console.log(error);
        // window.open(request, '_blank');
    })
}

btn.addEventListener("click", query)

function displayResults(results, container) {
    container.innerHTML = "";
    results.map((movie)=>{
        container.innerHTML += `
        <div class="row">
            <li class="cell">${movie.nom}</p>
            <li class="cell">${movie.cout_emprunt}</p>
            <li class="cell">${movie.classification}</p>
            <li class="cell">${movie.genre}</p>
            <li class="cell">${movie.nombre_emprunts}</p>
        </div>
        `
    })
}

function buildQuery({type , order, limit, page}) {
    let query = domain + "/api" + `?order=${order}&type=${type}`
    if(limit !== "") {
        query += `&limit=${limit}`;
    }
    if(page !== "") {
        query += `&page=${page}`;
    }
    return query;
}

left_arrows.forEach((left) => {
    left.addEventListener("click", ()=> {
        const input = left.nextElementSibling;
        const value = Number(input.value);
        if(value > 1) input.value = value - 1;
        query();
    })
})

right_arrows.forEach((right) => {
    right.addEventListener("click", ()=> {
        const input = right.previousElementSibling;
        const value = Number(input.value);
        input.value = value + 1;
        query();
    })
}) 

columns.forEach((col) => {
    col.addEventListener("click", ()=> {
        if (col.dataset.order === "desc") {
            col.dataset.order = "asc";
        } else {
            col.dataset.order = "desc";
        }
        type_elem.value = col.dataset.value;
        order_elem.value = col.dataset.order;
        query();
        // col.classList.toggle("col_clicked");;
    })
})

//functions called on init 

const nbr_lines = (async ()=> {
    fetch(`${domain}/api?nbr_lines=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        },
    })
    .then(response => response.json())
    .then((res) => {
        nbr_lines_elem.textContent = res[0].nombre_resultats_trouves;
    })
    .catch((error) => {
        console.log(error)
        console.log("error nbr results");
    })
})()

btn.click()

