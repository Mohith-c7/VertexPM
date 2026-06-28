# Low-Level Design (LLD)

## Table of Contents

1. Introduction
2. Design Principles
3. Project Structure
4. Backend Module Design
5. Frontend Module Design
6. Database Design
7. Entity Relationship Diagram (ERD)
8. Prisma Schema Design
9. API Design *(Separate Chapter)*
10. WebSocket Event Design *(Separate Chapter)*
11. AI Engine Design *(Separate Chapter)*
12. Scheduler Design *(Separate Chapter)*
13. GitHub Integration Design *(Separate Chapter)*
14. Chrome Extension Design *(Separate Chapter)*
15. Authentication & Authorization Design
16. Validation, Error Handling & Logging
17. Configuration Management
18. Coding Standards
19. Future Extensibility

---

# 1. Introduction

The Low-Level Design (LLD) document translates the High-Level Design (HLD) into implementation-ready specifications. It defines the internal organization of the application, software modules, database schema, relationships, APIs, communication contracts, and implementation guidelines.

This document serves as the primary reference for developers during implementation and ensures consistency, maintainability, scalability, and traceability throughout the software development lifecycle.

---

# 2. Design Principles

The implementation shall follow:

* Layered Architecture
* SOLID Principles
* Separation of Concerns
* Clean Architecture
* Repository Pattern
* Service Layer Pattern
* Dependency Injection
* Event-Driven Design
* DRY (Don't Repeat Yourself)
* KISS (Keep It Simple)

---

# 3. Project Structure

## 3.1 Repository Structure

```text
project-root/
│
├── apps/
│   ├── web/
│   ├── extension/
│   └── server/
│
├── packages/
│   ├── shared/
│   ├── ui/
│   ├── types/
│   └── config/
│
├── prisma/
├── docs/
├── scripts/
└── tests/
```

---

## 3.2 Backend Structure

```text
server/
│
├── src/
│   ├── modules/
│   ├── common/
│   ├── config/
│   ├── middleware/
│   ├── sockets/
│   ├── scheduler/
│   ├── ai/
│   ├── integrations/
│   ├── utils/
│   └── main.ts
```

---

## 3.3 Frontend Structure

```text
web/
│
├── app/
├── components/
├── hooks/
├── services/
├── stores/
├── lib/
├── types/
├── providers/
└── utils/
```

---

# 4. Backend Module Design

## 4.1 Backend Modules

| Module         | Responsibility          |
| -------------- | ----------------------- |
| Authentication | Login, JWT, Session     |
| User           | User profile management |
| Workspace      | Workspace lifecycle     |
| Board          | Board operations        |
| Column         | Workflow columns        |
| Card           | Task management         |
| Label          | Label management        |
| Comment        | Discussion threads      |
| Activity       | Audit logs              |
| AI             | AI Project Manager      |
| GitHub         | GitHub Import           |
| Report         | Weekly Digest           |
| Scheduler      | Background jobs         |
| Socket         | Real-time communication |
| Notification   | User notifications      |

---

## 4.2 Standard Module Structure

Every module follows:

```text
module/
├── controller/
├── service/
├── repository/
├── dto/
├── validator/
├── interfaces/
├── constants/
├── types/
└── tests/
```

---

## 4.3 Layer Responsibilities

### Controller

* Route handling
* Validation
* Authentication
* Response formatting

### Service

* Business logic
* Transactions
* AI orchestration
* Socket event publishing

### Repository

* Prisma queries
* Data persistence
* Transactions

---

# 5. Frontend Module Design

## 5.1 Pages

* Login
* Dashboard
* Workspace
* Board
* Card Details
* AI Insights
* Team Dashboard
* Reports
* GitHub Import
* Settings

---

## 5.2 Shared Components

* Navbar
* Sidebar
* Header
* Dialog
* Drawer
* Card Component
* Kanban Column
* AI Insight Card
* User Avatar
* Loader
* Toast

---

## 5.3 State Management

Global State (Zustand)

* Current User
* Current Workspace
* Active Board
* Socket Status
* Theme

Server State (TanStack Query)

* Boards
* Cards
* Reports
* AI Insights
* GitHub Imports

---

## 5.4 Custom Hooks

* useAuth()
* useBoard()
* useCards()
* useSocket()
* useAI()
* useGitHubImport()

---

# 6. Database Design

## 6.1 Database Objectives

The database shall provide:

* ACID compliance
* Referential integrity
* High consistency
* Efficient querying
* Persistent storage
* Auditability

---

## 6.2 Database Design Principles

* UUID Primary Keys
* Normalized schema (3NF)
* Soft deletes where applicable
* Audit timestamps
* Foreign key constraints
* Indexed search columns

---

## 6.3 Core Entities

* User
* Workspace
* WorkspaceMember
* Board
* BoardMember
* Column
* Card
* Label
* CardLabel
* Comment
* Activity
* Sprint
* AIAnalysis
* WeeklyReport
* GitHubImport

---

## 6.4 Audit Fields

Every major table shall contain:

* id
* createdAt
* updatedAt
* createdBy (where applicable)

---

# 7. Entity Relationship Diagram (ERD)

## Core Relationships

```text
User
 │
 ├──< WorkspaceMember >── Workspace
 │                          │
 │                          └──< Board
 │                                 │
 │                                 ├──< Column
 │                                 │      │
 │                                 │      └──< Card
 │                                 │               │
 │                                 │               ├──< Comment
 │                                 │               ├──< Activity
 │                                 │               ├──< CardLabel >── Label
 │                                 │               └──< AIAnalysis
 │                                 │
 │                                 ├──< Sprint
 │                                 └──< WeeklyReport
 │
 └──< BoardMember
```

---

## Relationship Summary

| Parent    | Child        | Cardinality |
| --------- | ------------ | ----------- |
| Workspace | Board        | 1:N         |
| Board     | Column       | 1:N         |
| Column    | Card         | 1:N         |
| Card      | Comment      | 1:N         |
| Card      | Activity     | 1:N         |
| Card      | CardLabel    | 1:N         |
| Label     | CardLabel    | 1:N         |
| User      | Comment      | 1:N         |
| User      | Activity     | 1:N         |
| Board     | WeeklyReport | 1:N         |
| Board     | Sprint       | 1:N         |

---

# 8. Prisma Schema Design

## Enums

* UserRole
* BoardRole
* CardPriority
* CardStatus
* ActivityType
* NotificationType

---

## Models

```text
User

Workspace

WorkspaceMember

Board

BoardMember

Column

Card

Label

CardLabel

Comment

Activity

Sprint

AIAnalysis

WeeklyReport

GitHubImport

Notification
```

---

## Common Model Fields

```text
id           String @id @default(uuid())

createdAt    DateTime @default(now())

updatedAt    DateTime @updatedAt
```

---

## Relationship Strategy

* One-to-Many
* Many-to-Many (Join Tables)
* Cascading deletes where appropriate
* Composite unique constraints
* Indexed foreign keys

---

## Indexing Strategy

Indexes shall be created for:

* Email
* Workspace ID
* Board ID
* Column ID
* Card ID
* Assignee ID
* Sprint ID
* GitHub Repository
* GitHub Issue Number

---

## Soft Delete Strategy

Critical business entities shall support logical deletion using:

```text
deletedAt DateTime?
```

where appropriate to preserve audit history.

---

## Migration Strategy

Database changes shall be managed exclusively through Prisma Migrations.

Direct schema modifications in production databases are prohibited.

---

# 9. Remaining LLD Chapters

The following implementation specifications are maintained as independent chapters due to their size and complexity:

* API Design
* WebSocket Event Design
* AI Engine Design
* Scheduler Design
* GitHub Integration Design
* Chrome Extension Design
* Authentication & Authorization Design
* Validation Strategy
* Error Handling Strategy
* Logging Strategy
* Configuration Management
* Class Design
* Sequence Diagrams
* State Diagrams
* Coding Standards
* Future Extensibility

---

# Conclusion

This Low-Level Design establishes the implementation blueprint for the Real-Time Collaborative Kanban with Autonomous AI Project Manager. It defines the project structure, software modules, database architecture, entity relationships, and Prisma data model that will guide all subsequent implementation activities. Detailed subsystem specifications will further refine these designs in the remaining LLD chapters while maintaining complete traceability to the SRS and High-Level Design.
