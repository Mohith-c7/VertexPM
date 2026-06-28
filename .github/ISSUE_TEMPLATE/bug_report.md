---
name: Bug report
description: Report a reproducible issue
title: "[BUG] "
labels: bug
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: Describe the issue.
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: Provide clear reproduction steps.
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
  - type: textarea
    id: actual
    attributes:
      label: Actual behavior
