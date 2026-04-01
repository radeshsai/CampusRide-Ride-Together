# CampusRide – Windows Setup Guide

## Prerequisites

Install these first:

| Tool | Download | Check |
|------|----------|-------|
| Java 17+ (JDK) | https://adoptium.net | `java -version` |
| Maven 3.9+ | https://maven.apache.org/download.cgi | `mvn -version` |
| Node.js 18+ | https://nodejs.org | `node -v` |
| MySQL 8 | https://dev.mysql.com/downloads/installer | `mysql -version` |

> **Maven PATH setup:** After downloading Maven, add `C:\apache-maven-3.x.x\bin` to your
> System Environment Variables → PATH.

---

## Step 1 – Database Setup

Open MySQL Command Line Client or MySQL Workbench and run:

```sql
CREATE DATABASE campusride_db;
```

Then import the schema:

```cmd
mysql -u root -p campusride_db < database\schema.sql
```

---

## Step 2 – Backend Configuration

Edit `backend\src\main\resources\application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campusride_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

## Step 3 – Run the Backend

Open **Command Prompt** or **PowerShell** in the project folder:

```cmd
cd backend
mvn spring-boot:run
```

Wait for: `Started CampusRideApplication in X seconds`
Backend is live at: http://localhost:8080

---

## Step 4 – Run the Frontend

Open a **second** Command Prompt window:

```cmd
cd frontend
npm install
npm run dev
```

Frontend is live at: http://localhost:5173

---

## Batch File Shortcuts

You can also double-click these from the project root:

- `start-backend.bat` – starts Spring Boot
- `start-frontend.bat` – installs deps and starts Vite

---

## Common Windows Errors

### `'mvn' is not recognized`
Maven not in PATH. Fix:
1. Download Maven from https://maven.apache.org/download.cgi
2. Extract to `C:\apache-maven-3.9.x`
3. Add `C:\apache-maven-3.9.x\bin` to System PATH
4. Restart Command Prompt

### `'node' is not recognized`
Node.js not installed. Download from https://nodejs.org (LTS version).

### MySQL connection refused
- Make sure MySQL service is running: Win+R → `services.msc` → MySQL → Start
- Check your password in `application.properties`

### Port 8080 already in use
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

### Port 5173 already in use
```cmd
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

---

## Using IntelliJ IDEA (Recommended for Backend)

1. Open IntelliJ → File → Open → select the `backend` folder
2. Wait for Maven to download dependencies
3. Run `CampusRideApplication.java` (green play button)

## Using VS Code (Recommended for Frontend)

1. Open VS Code → File → Open Folder → select `frontend`
2. Open terminal (Ctrl+`) and run `npm install` then `npm run dev`
