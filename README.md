# EyeRoute Backend

This document provides an overview of the backend technologies and AWS services used in EyeRoute, including setup instructions and environment configuration.

---

## 💻Backend Framework

**Node.js with Express.js** – Backend server handling API requests, business logic, and integration with AWS services.

### Setup Instructions
1. Clone the repository:
```
git clone <repository-url>
cd eyeroute-backend
```
2. Install dependencies:
```
npm install
```
3. Create a `.env` file in the root directory with required environment variables (See Port, Cognito, RDS, S3 variables below)
4. Run the backend server:
```
npm run dev
```

### Environment Variable
```
PORT=3000
```

---

## ☁️AWS Services

### 🔐AWS Cognito

AWS Cognito is used as the authentication and user identity provider for the EyeRoute backend.  It manages user sign-up, sign-in, email verification, forgot password flows, and JWT token issuance.

The backend does not store or manage user passwords directly and relies on Cognito as the source of truth for user identity.


#### Usage in EyeRoute
- The mobile application authenticates users using AWS Cognito
- The backend API validates Cognito-issued JWT tokens
- The Cognito `sub` claim is used as the unique user identifier in backend


#### Setup and Configuration
1. Create an AWS Cognito User Pool
2. Configure username as the primary sign-in method
3. Add email in sign-up requirements
4. Enable email verification and password recovery
5. Create an App Client
6. Store the User Pool and App Client ID in backend environment variables


#### AWS Region Used
ap-southeast-1 (Singapore)


#### Environment Variables
```
COGNITO_USER_POOL_ID=ap-southeast-1_xxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
```

---

### 🗄️AWS RDS (MySQL)

AWS RDS (MySQL) is used as the primary relational database for the EyeRoute backend.

It stores application-level data such as user records, IoT device metadata, persons with visual impairment (PVI) records, family-pvi relationships, PVI location. Authentication data is not stored in the database.


#### Usage in EyeRoute
- Backend APIs perform all CRUD operations on RDS
- User records are associated using Cognito `sub` values
- Transactional data is stored in structured relational tables


#### Setup and Configuration
1. Create an AWS RDS instance with the MySQL engine
2. Choose an appropriate instance class (Free Tier)
3. Set database name, master username, and password
4. Configure security groups by setting Public Access to 'Yes'
5. Configure network access by adding inbound rule:
```
Type: MYSQL/Aurora
Protocol: TCP
Port range: 3306
Source: Custom (0.0.0.0/0)
```
6. Connect RDS instance in MySQL Workbench
7. Connect the backend using Sequelize ORM


#### AWS Region Used
ap-southeast-1 (Singapore)


#### Environment Variables
```
MYSQL_HOST=your-rds-endpoint.amazonaws.com
MYSQL_PORT=3306
MYSQL_DATABASE=eyeroute_db
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
```

---

### 📁AWS S3

AWS S3 is used for object storage in the EyeRoute backend.

It stores user-uploaded images required by the system.


#### Usage in EyeRoute
- Backend services manage image uploads
- File keys are stored in the database
- Assets are accessed using AWS-generated signed URLs


#### Setup and Configuration
1. Create an S3 bucket
2. Configure bucket permissions and access policies
3. Set CORS rules if frontend uploads are enabled
4. Assign IAM permissions for backend access
5. Configure the AWS SDK in the backend


#### AWS Region Used
ap-southeast-1 (Singapore)


#### Environment Variables
```
AWS_ACCESS_KEY_ID=xxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx
S3_BUCKET_REGION=ap-southeast-1
S3_BUCKET_NAME=pentacore-capstone-bucket
```