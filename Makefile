.PHONY: verify status
verify:
	python tools/verify.py
	python -m unittest discover -s tools/tests
	git diff --check

status:
	python tools/status/render.py
