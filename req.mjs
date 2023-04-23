export const QUERY = (() => {

    const BASE = (type = "nombre_emprunts", order = "DESC", limit = 10, offset = 0) => `
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
        OFFSET ${offset*limit}
    `;
    const NBR_LINES = `
        WITH nbr_lines AS 
        (${BASE})
        SELECT count(*) as nbr_results
        FROM nbr_lines
    `;

    return {
        BASE, 
        NBR_LINES
    }
})()

