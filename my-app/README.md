# CareFlow: Smart Emergency Department System

**CareFlow** is a comprehensive, three-tier healthcare management platform designed to optimize emergency department workflows. By replacing manual processes with an intelligent, triage-based prioritization system, CareFlow ensures that critical patients receive immediate care while maintaining efficient resource allocation across the medical facility.

---

# Features

* **Intelligent Triage & Queue Management:** Classifies patients based on severity (Critical, Urgent, Non-Urgent) and dynamically updates priority queues in real-time.
* **Role-Based Access Control (RBAC):** Customized dashboards and permissions for Admins, Doctors, Nurses, and Patients.
* **Real-Time Alerts:** Utilizing WebSockets for instant notifications regarding doctor assignments, patient status updates, and lab results.
* **Comprehensive Patient Portal:** Allows patients to view medical records, track case status, and receive notifications securely.
* **Clinical Management:** Dedicated modules for doctors to manage diagnoses and treatments, and for nurses to track vital signs and medication administration.
* **Integrated Billing:** Handles emergency case billing and insurance information storage.

---

# Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Next.js, Tailwind CSS |
| **Backend** | Node.js, Nest.js, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Real-time** | Socket.io |
| **Security** | JWT, Argon2 |
| **Storage** | AWS S3 |

---

# System Architecture

The project follows a modular **three-tier architecture** to ensure scalability and maintainability:

1.  **Presentation Layer (Frontend):** A responsive UI built with React for user interactions and staff dashboards.
2.  **Application Layer (Backend):** Core business logic, triage algorithms, and API management handled by Nest.js.
3.  **Data Access & Data Layer:** Persistent storage using PostgreSQL, managed through the Prisma ORM to ensure data integrity.

---

# Team Memders

* **Frontend Engineers:** Manal Hady, Maryam Mohamed, Menna Hesham
***Backend Engineers:** Farah Ahmed Kamal, Salma Mohamed Saad

---
*Developed as part of the SBES171 HealthCare Information System course at Cairo University, Faculty of Engineering (Spring 2026)*