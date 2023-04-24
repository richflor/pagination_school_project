const domain = "https://" + window.location.hostname
console.log(domain)

const btn = document.getElementById("btn");
const nbr_lines_elem = document.getElementById("nbr_lines")
const error_message = document.getElementById("error_message");
const type_elem = document.getElementById("type");
const limit_elem = document.getElementById("limit");
const page_elem = document.getElementById("page");
const order_elem = document.getElementById("order");

btn.addEventListener("click", ()=> {
    error_message.textContent = "";

    const params = {
        type: type_elem.value,
        page:page_elem.value,
        order:order_elem.value,
        limit:limit_elem.value
    }

    const query = buildQuery(params);
    console.log(query)

    fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        },
    })
    .then(response => response.json())
    .then((res) => {
        console.log(res);
        window.open(query, '_blank');
    })
    .catch((error) => {
        console.log(error);
        window.open(query, '_blank');
    })
})

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
        console.log("error nbr results");
    })
})()

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