from backend.db import get_driver


def execute_read(query, params=None):
    with get_driver().session() as session:
        return session.run(query, params or {}).data()


def execute_write(query, params=None):
    with get_driver().session() as session:
        session.run(query, params or {})


def create_user(username: str, diet: str, allergens: list[str]):
    query = """
    MERGE (u:User {username: $username})
    WITH u
    OPTIONAL MATCH (u)-[r:FOLLOWS]->()
    DELETE r
    WITH u
    MATCH (d:Diet {name: $diet})
    MERGE (u)-[:FOLLOWS]->(d)
    WITH u
    UNWIND $allergens AS allergenName
        MATCH (a:Allergen {name: allergenName})
        MERGE (u)-[:AVOIDS]->(a)
    """
    execute_write(query, {"username": username, "diet": diet, "allergens": allergens})


def get_users():
    query = """
    MATCH (u:User)
    OPTIONAL MATCH (u)-[:FOLLOWS]->(d:Diet)
    OPTIONAL MATCH (u)-[:AVOIDS]->(a:Allergen)
    RETURN u.username AS username,
           d.name AS diet,
           collect(DISTINCT a.name) AS allergens
    """
    return execute_read(query)


def update_user(username: str, diet: str | None, allergens: list[str] | None):
    if diet:
        execute_write(
            """
        MATCH (u:User {username: $username})
        OPTIONAL MATCH (u)-[r:FOLLOWS]->()
        DELETE r
        WITH u
        MATCH (d:Diet {name: $diet})
        MERGE (u)-[:FOLLOWS]->(d)
        """,
            {"username": username, "diet": diet},
        )

    if allergens is not None:
        execute_write(
            """
        MATCH (u:User {username: $username})
        OPTIONAL MATCH (u)-[r:AVOIDS]->()
        DELETE r
        WITH u
        UNWIND $allergens AS allergenName
            MATCH (a:Allergen {name: allergenName})
            MERGE (u)-[:AVOIDS]->(a)
        """,
            {"username": username, "allergens": allergens},
        )


def delete_user(username: str):
    execute_write(
        """
    MATCH (u:User {username: $username})
    DETACH DELETE u
    """,
        {"username": username},
    )
