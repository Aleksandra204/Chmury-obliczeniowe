from db import get_driver


def get_products_analysis(username: str):
    query = """
    MATCH (u:User {username: $username})
    MATCH (p:Product)

    OPTIONAL MATCH
        (p)-[:CONTAINS]->(i1:Ingredient)-[:BELONGS_TO]->(c:IngredientCategory)
        -[:IS_A*0..]->(forbidden:IngredientCategory)
        <-[:FORBIDS]-(d:Diet)
        <-[:FOLLOWS]-(u)

    OPTIONAL MATCH
        (p)-[:CONTAINS]->(i2:Ingredient)-[:CAUSES]->(a:Allergen)
        <-[:AVOIDS]-(u)

    WITH p,
         collect(DISTINCT
            CASE
                WHEN d IS NOT NULL THEN {
                    type: "DIET",
                    diet: d.name,
                    ingredient: i1.name,
                    category: c.name
                }
            END
         ) AS dietConflicts,
         collect(DISTINCT
            CASE
                WHEN a IS NOT NULL THEN {
                    type: "ALLERGEN",
                    allergen: a.name,
                    ingredient: i2.name
                }
            END
         ) AS allergenConflicts

    RETURN p.name AS product,
           p.price AS price,
           [x IN dietConflicts WHERE x IS NOT NULL] +
           [x IN allergenConflicts WHERE x IS NOT NULL]
           AS reasons
    """

    with get_driver().session() as session:
        results = session.run(query, {"username": username}).data()

    for r in results:
        r["safe"] = len(r["reasons"]) == 0

    return results


def get_products_overview(diet: str | None = None, exclude_allergen: str | None = None):
    query = """
    MATCH (p:Product)

    OPTIONAL MATCH
        (p)-[:CONTAINS]->(i:Ingredient)

    WITH p, collect(DISTINCT i.name) AS ingredients

    OPTIONAL MATCH
        (p)-[:CONTAINS]->(:Ingredient)-[:BELONGS_TO]->(c:IngredientCategory)
        -[:IS_A*0..]->(forbidden:IngredientCategory)
        <-[:FORBIDS]-(d:Diet)

    WITH p, ingredients, collect(DISTINCT d.name) AS notOkDiets

    OPTIONAL MATCH
        (p)-[:CONTAINS]->(:Ingredient)-[:CAUSES]->(a:Allergen)

    WITH p, ingredients, notOkDiets, collect(DISTINCT a.name) AS allergens

    MATCH (allDiets:Diet)

    WITH
        p,
        ingredients,
        allergens,
        notOkDiets,
        collect(allDiets.name) AS allDiets

    WITH
        p,
        ingredients,
        allergens,
        notOkDiets,
        [d IN allDiets WHERE NOT d IN notOkDiets] AS okForDiets
    """

    filters = []
    params = {}

    if diet:
        filters.append("$diet IN okForDiets")
        params["diet"] = diet

    if exclude_allergen:
        filters.append("NOT $excludeAllergen IN allergens")
        params["excludeAllergen"] = exclude_allergen

    if filters:
        query += "\nWHERE " + " AND ".join(filters)

    query += """
    RETURN
    p.name AS product,
    p.price AS price,
    ingredients,
    okForDiets,
    notOkDiets AS notOkForDiets,
    allergens
    """

    with get_driver().session() as session:
        return session.run(query, params).data()
