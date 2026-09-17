frontend-app-extension
######################

Purpose
*******

This is the custom Extension micro-frontend for the Webuddhist Academy Open edX site.

Installing in Tutor
===================

The following Tutor plugin code can be used to install and configure this MFE in a Tutor environment.

.. code-block:: python3
  from tutormfe.hooks import MFE_APPS

  @MFE_APPS.add()
  def _add_extension_mfe(mfes):
      mfes["extension"] = {
          "repository": "https://github.com/Webuddhist-tech/frontend-app-extension.git",
          "port": 2003,
          "version": "wbc-ulmo1-stage",
      }
      return mfes

Getting Started
***************

Prerequisites
=============

The Tutor_ platform is a prerequisite for developing an MFE.
Utilize `relevant tutor-mfe documentation`_ to guide you through
the process of MFE development within the Tutor environment.

.. _Tutor: https://github.com/overhangio/tutor

.. _relevant tutor-mfe documentation: https://github.com/overhangio/tutor-mfe#mfe-development

Cloning and Startup
===================

1. Clone the repo:

  ``git clone https://github.com/Webuddhist-tech/frontend-app-extension.git``

2. Use the version of node in the `.nvmrc` file.

  The current version of the micro-frontend build scripts supports the node version in `.nvmrc`.
  Using other major versions of node *may* work, but this is unsupported.  For
  convenience, this repository includes an .nvmrc file to help in setting the
  correct node version via `nvm <https://github.com/nvm-sh/nvm>`_.

3. Install npm dependencies:

  ``cd frontend-app-extension && npm ci``

4. Mount the frontend-app-extension MFE in Tutor:

  ``tutor mounts add <your-tutor-project-dir>/frontend-app-extension``

5. Build the Docker image:

  ``tutor images build extension-dev``

6. Launch the development server with Tutor:

  ``tutor dev start extension``

The dev server is running at `http://apps.local.openedx.io:2003/extension/ <http://apps.local.openedx.io:2003/extension/>`_.

If you start Tutor with ``tutor dev start extension``
that should give you everything you need as a companion to this frontend.

Internationalization
====================

Please see refer to the `frontend-platform i18n howto`_ for documentation on
internationalization.

.. _frontend-platform i18n howto: https://github.com/openedx/frontend-platform/blob/master/docs/how_tos/i18n.rst

License
*******

The code in this repository is licensed under the AGPLv3. See ``LICENSE``.
