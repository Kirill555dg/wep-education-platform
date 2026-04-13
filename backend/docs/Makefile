# Minimal makefile for Sphinx documentation

# You can set these variables from the command line.
SPHINXOPTS    =
SPHINXBUILD   = sphinx-build
SOURCEDIR     = .
BUILDDIR      = _build
APPDIR        = ../app

.PHONY: help clean apidoc html view all archive

help:
	@echo "Please use 'make <target>' where <target> is one of"
	@echo "  apidoc     to auto-generate .rst files from Python code"
	@echo "  html       to build HTML documentation"
	@echo "  view       to open documentation in browser"
	@echo "  all        to run apidoc + html (full rebuild)"
	@echo "  archive    to create documentation.zip"
	@echo "  clean      to remove generated files"

clean:
	rm -rf $(BUILDDIR)
	rm -f app*.rst modules.rst

apidoc:
	sphinx-apidoc -o . $(APPDIR) -f -e -M --tocfile modules

html:
	$(SPHINXBUILD) -b html $(SOURCEDIR) $(BUILDDIR)/html
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/html."

view:
	@echo "Opening documentation in browser..."
	@open $(BUILDDIR)/html/index.html 2>/dev/null || xdg-open $(BUILDDIR)/html/index.html 2>/dev/null || start $(BUILDDIR)/html/index.html

all: clean apidoc html
	@echo
	@echo "Full rebuild complete!"

archive:
	@echo "Creating documentation archive..."
	@cd $(BUILDDIR) && zip -r documentation.zip html/
	@echo
	@echo "Archive created: $(BUILDDIR)/documentation.zip"
	@echo "Size: $$(du -h $(BUILDDIR)/documentation.zip | cut -f1)"
