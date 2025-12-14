from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

load_dotenv()

_driver = None


def get_driver():
    global _driver

    if _driver is None:
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USERNAME")
        password = os.getenv("NEO4J_PASSWORD")

        _driver = GraphDatabase.driver(uri, auth=(user, password))

        _driver.verify_connectivity()

    return _driver
