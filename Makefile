.PHONY: setup

setup:
	chmod +x hooks/pre-commit
	ln -sf ../../hooks/pre-commit .git/hooks/pre-commit
	@echo "Git hooks installed."
