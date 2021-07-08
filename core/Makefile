.ONESHELL:

.PHONY: clean install tests run all

clean:
	find . -type f -name '*.pyc' -delete
	find . -type f -name '*.log' -delete

install:
	virtualenv venv; \
	. venv/bin/activate; \
	pip install pipenv; \
	pipenv install;

freeze:
	. venv/bin/activate; \
	pipenv install; \
	pip freeze > requirements.txt

tests:
	. venv/bin/activate; \
	python main.py test

run:
	. venv/bin/activate; \
	gunicorn -b :8080 -w 4 -k uvicorn.workers.UvicornWorker main:app

dev: 
	. venv/bin/activate; \
	uvicorn main:app --port 8080 --reload

all: clean install tests run

use-dev: 
	. venv/bin/activate
	python script/set_dev.py

use-prod: 
	. venv/bin/activate
	python script/set_prod.py

deploy-dev:
	make use-dev
	make freeze
	gcloud auth activate-service-account --key-file=${BD_DEV_KEYFILE}
	gcloud config set project blind-date-dev-304521
	gcloud app deploy 

deploy-prod:
	make use-prod
	make freeze
	gcloud auth activate-service-account --key-file=${BD_PROD_KEYFILE} 
	gcloud config set project //
	gcloud app deploy
