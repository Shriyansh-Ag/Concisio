from setuptools import setup, find_packages

setup(
    name="concisio",
    version="1.0.0",
    author="Shriyansh",
    description="AI-powered text summarization using Google PEGASUS",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
)
