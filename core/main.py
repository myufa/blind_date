import os
import logging
import unittest
import uvicorn
from fastapi import FastAPI
from typing import Optional
import typer
from fastapi_utils.timing import add_timing_middleware

from src.api import app

manager = typer.Typer()
# logger = logging.getLogger(__name__)

@manager.command()
def run(stage: Optional[str] = typer.Argument(None)):
    dev = True if stage else False
    uvicorn.run(app, host="127.0.0.1", port=8080, loop='uvloop')

@manager.command()
def test():
    """Runs the unit tests."""
    # TODO
    # add_timing_middleware(app, record=logger.info, prefix="app", exclude="untimed")
    tests = unittest.TestLoader().discover("src/test", pattern="test*.py")
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


if __name__ == "__main__":
    manager()
