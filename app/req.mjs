export const QUERY = (() => {

    const BASE = ({type = "nombre_emprunts", order = "DESC", limit = 10, page = 0}) => {
        console.log({type, order, limit, page});
        return `
        SELECT f.title AS nom , f.rental_rate AS cout_emprunt, f.rating AS classification, 
        c.name AS genre, count(r.rental_id) AS nombre_emprunts
        FROM film f
        INNER JOIN film_category fc
        ON f.film_id=fc.film_id
        INNER JOIN category c
        ON c.category_id=fc.category_id
        INNER JOIN inventory i
        ON f.film_id=i.film_id
        INNER JOIN rental r
        ON r.inventory_id=i.inventory_id
        GROUP BY f.title
        ORDER BY ${type} ${order}
        LIMIT ${limit}
        OFFSET ${page*limit}
    `};
    const NBR_LINES = `
        WITH nbr_lines AS 
        (SELECT f.title AS nom , f.rental_rate AS cout_emprunt, f.rating AS classification, 
        c.name AS genre, count(r.rental_id) AS nombre_emprunts
        FROM film f
        INNER JOIN film_category fc
        ON f.film_id=fc.film_id
        INNER JOIN category c
        ON c.category_id=fc.category_id
        INNER JOIN inventory i
        ON f.film_id=i.film_id
        INNER JOIN rental r
        ON r.inventory_id=i.inventory_id
        GROUP BY f.title)
        SELECT count(*) as nombre_resultats_trouves
        FROM nbr_lines
    `;

    const checkParams = (obj) => {
        const query = Object.keys(obj);
        if(query.length > 0) {
            for (const param of query) {
                if (param !== "type" && param !== "page" && param !== "limit" && param !== "order") {
                    return false;
                }
            }
        }
    
        return true;
    }
    
    const checkValues = (obj) => {
        const query = Object.keys(obj);
        if(query.length > 0) {
            if(obj.type) {
                if(typeof obj.type !== "string") {
                    return false;
                }
                if (obj.type.toLowerCase() !== "nombre_emprunts" && obj.type.toLowerCase() !== "genre" && obj.type.toLowerCase() !== "nom") {
                    return false;
                }
            }
            if(obj.page) {
                if(isNaN(obj.page)) {
                    return false;
                }
                if(obj.page < 0) {
                    return false;
                }
            }
            if(obj.limit) {
                if(isNaN(obj.limit)) {
                    return false;
                }
                if(obj.limit < 1) {
                    return false;
                }
            }
            if(obj.order) {
                if(typeof obj.order !== "string") {
                    return false;
                }
                if (obj.order.toLowerCase() !== "asc" && obj.order.toLowerCase() !== "desc") {
                    return false;
                }
            }
        }
        return true;
    }

    return {
        BASE, 
        NBR_LINES,
        checkParams,
        checkValues
    }
})()

