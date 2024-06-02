## **JobBoard Backend**

A powerful backend for a job board platform, similar to popular websites like Naukri and Indeed.

## **Description**

JobBoard Backend is a comprehensive solution for managing job listings, user accounts, and various other functionalities required for a job board platform. Built with scalability and performance in mind, it provides a robust foundation for developing a full-fledged job portal.

## **Features**

Job Listings: Employers can create, update, and delete job listings with ease.
Applicant Tracking: Employers can track applications received for their job listings.
User Authentication: Secure user authentication and authorization system.
Search and Filters: Efficient search and filter options for job listings.
User Profiles: User profiles with personalized settings and preferences.
Employee Applications: Employees can apply to job listings and track their application status.

## Roles

### Employers

- **Create Listings**: Employers can create new job listings.
- **Manage Listings**: Employers can update and delete their job listings.
- **Track Applications**: Employers can track applications received for their job listings.

### JobSeekers

- **Apply to Listings**: Employees can apply to job listings.
- **Track Applications**: Employees can track the status of their job applications.

## Usage

### Mannual Setup

```
git clone https://github.com/Vidit-Jain2206/jobboard-backend.git
cd jobboard-backend
```

#### Create .env file 
ADD these fields 
```
JWT_SECRET_ACCESS_TOKEN
JWT_SECRET_ACCESS_TOKEN_EXPIRY 
PORT 
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY 
AWS_BUCKET_NAME
```
Now run the command

```
docker compose up
```

### Docker setup

Run the following command to pull the Docker image from Docker Hub:
```
docker pull viditjain2206/jobboard-backend

docker run -p 8080:8080 \
-e JWT_SECRET_ACCESS_TOKEN=<your_JWT_secret_access_token> \
-e JWT_SECRET_ACCESS_TOKEN_EXPIRY=<your_JWT_secret_access_token_expiry> \
-e PORT=<your_port_number> \
-e AWS_ACCESS_KEY_ID=<your_AWS_access_key_id> \
-e AWS_SECRET_ACCESS_KEY=<your_AWS_secret_access_key> \
-e AWS_BUCKET_NAME=<your_AWS_bucket_name> \
viditjain2206/jobboard-backend
```

## Access

Access the API at `http://localhost:8080`

And documentation at `http://localhost:8080/documentation`
