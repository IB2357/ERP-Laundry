from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in laundry/__init__.py
from laundry import __version__ as version

setup(
	name="laundry",
	version=version,
	description="Laundry Management System",
	author="Ibrahim Sultan Al-Wajih",
	author_email="aswh.abrahem@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
