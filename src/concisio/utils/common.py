import os
from box.exceptions import BoxValueError
import yaml
from src.concisio.logging import logger
from box import ConfigBox
from pathlib import Path
from typing import Any
import functools
import inspect


def ensure_annotations(func):
    """Lightweight replacement for ensure.ensure_annotations (broken on Python 3.12+).
    Validates that arguments match their type annotations at call time."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        hints = func.__annotations__
        sig = inspect.signature(func)
        bound = sig.bind(*args, **kwargs)
        bound.apply_defaults()
        for param_name, value in bound.arguments.items():
            if param_name in hints and param_name != "return":
                expected = hints[param_name]
                if not isinstance(value, expected):
                    raise TypeError(
                        f"Argument '{param_name}' must be {expected}, got {type(value)}"
                    )
        return func(*args, **kwargs)
    return wrapper


@ensure_annotations
def read_yaml(path_to_yaml: Path) -> ConfigBox:
    """reads yaml file and returns

    Args:
        path_to_yaml (str): path like input

    Raises:
        ValueError: if yaml file is empty
        e: empty file

    Returns:
        ConfigBox: ConfigBox type
    """
    try:
        with open(path_to_yaml) as yaml_file:
            content = yaml.safe_load(yaml_file)
            logger.info(f"yaml file: {path_to_yaml} loaded successfully")
            return ConfigBox(content)
    except BoxValueError:
        raise ValueError("yaml file is empty")
    except Exception as e:
        raise e
    
@ensure_annotations
def create_directories(path_to_directories: list, verbose=True):
    """create list of directories

    Args:
        path_to_directories (list): list of path of directories
        ignore_log (bool, optional): ignore if multiple dirs is to be created. Defaults to False.
    """
    for path in path_to_directories:
        os.makedirs(path, exist_ok=True)
        if verbose:
            logger.info(f"created directory at: {path}")

