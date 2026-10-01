# ScanOS Intake Queue

A full-stack patient intake queue management application built as part of the ScanOS Engineering Take-Home Assignment.

The application allows users to view patient submissions, filter them by status, view submission details, and move submissions through a controlled review workflow.

## Project Overview

The Intake Queue manages incoming patient submissions through the following workflow:

```text
New → In Review → Approved
                 ↓
               Rejected
