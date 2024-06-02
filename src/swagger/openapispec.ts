import { OpenAPIV3 } from "openapi-types";

const openapiSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "JobBoard API",
    version: "1.0.0",
    description: "API for JobBoard application to manage job seekers",
  },

  paths: {
    "/api/v1/job_seeker/login": {
      post: {
        summary: "Login a job seeker",
        tags: ["Job Seeker"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/JobSeekerLoginRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully logged in",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobSeekerLoginResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid credentials",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/job_seeker/register": {
      post: {
        summary: "Register a new job seeker",
        tags: ["Job Seeker"],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/JobSeekerRegisterRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobSeekerRegisterResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid input or user already exists",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/job_seeker/logout": {
      post: {
        summary: "Logout a job seeker",
        tags: ["Job Seeker"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Successfully logged out",
          },
          "401": {
            description: "Unauthorized",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/job_seeker/current_job_seeker": {
      get: {
        summary: "Get the current logged in job seeker",
        tags: ["Job Seeker"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Successfully retrieved job seeker",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CurrentJobSeekerResponse",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/job_seeker/update_job_seeker_details/{id}": {
      patch: {
        summary: "Update job seeker account details",
        tags: ["Job Seeker"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/JobSeekerUpdateRequest",
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Successfully updated job seeker details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobSeekerUpdateResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid input or unauthorized",
          },
          "401": {
            description: "Unauthorized",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/v1/company/login": {
      post: {
        summary: "Login as a company",
        tags: ["Company"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CompanyLoginRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully logged in as a company",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompanyLoginResponse",
                },
              },
            },
          },
          // Add other response codes as needed
        },
      },
    },
    "/api/v1/company/register": {
      post: {
        summary: "Register a new company",
        tags: ["Company"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CompanyRegisterRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully registered a new company",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompanyRegisterResponse",
                },
              },
            },
          },
          // Add other response codes as needed
        },
      },
    },
    "/api/v1/company/logout": {
      post: {
        summary: "Logout as a company",
        tags: ["Company"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Successfully logged out as a company",
          },
          // Add other response codes as needed
        },
      },
    },
    "/api/v1/company/current": {
      get: {
        summary: "Get current company details",
        tags: ["Company"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Successfully retrieved current company details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
              },
            },
          },
          // Add other response codes as needed
        },
      },
    },
    "/api/v1/company/update": {
      patch: {
        summary: "Update company details",
        tags: ["Company"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CompanyUpdateRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully updated company details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompanyUpdateResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/job_listing/my_listings": {
      get: {
        summary: "Get all job listings for the current company",
        tags: ["Job Listing"],

        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "A list of job listings for the current company",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/JobListing",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/job_listing": {
      get: {
        summary: "Get all job listings",
        tags: ["Job Listing"],
        responses: {
          "200": {
            description: "A list of all job listings",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/JobListing",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/job_listing/create": {
      post: {
        summary: "Create a new job listing",
        tags: ["Job Listing"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/JobListingCreateRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Job listing created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobListing",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/job_listing/{id}": {
      get: {
        summary: "Get a job listing by ID",
        tags: ["Job Listing"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Job listing fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobListing",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/job_listing/update/{id}": {
      patch: {
        summary: "Update a job listing by ID",
        tags: ["Job Listing"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/JobListingUpdateRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Job listing updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobListing",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/job_listing/delete/{id}": {
      delete: {
        summary: "Delete a job listing by ID",
        tags: ["Job Listing"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Job listing deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobListing",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/job_application/my_applications/my_applications": {
      get: {
        summary: "Get all job applications of the authenticated job seeker",
        tags: ["Job Applications"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "A list of job applications fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/JobApplication",
                  },
                },
              },
            },
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
        },
      },
    },
    "/api/v1/job_application/create/{id}": {
      post: {
        summary: "Create a new job application for a specific job listing",
        tags: ["Job Applications"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "The ID of the job listing to apply for",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Job application created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobApplication",
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
        },
      },
    },
    "/api/v1/job_application/{id}": {
      get: {
        summary: "Get details of a specific job application",
        tags: ["Job Applications"],

        parameters: [
          {
            in: "path",
            name: "id",
            description: "The ID of the job application to retrieve",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Job application fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobApplication",
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          role_id: { type: "integer" },
          jobSeeker: { $ref: "#/components/schemas/JobSeeker" },
          company: { $ref: "#/components/schemas/Company" },
        },
      },
      Role: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { $ref: "#/components/schemas/RoleName" },
          users: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
      },
      JobSeeker: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          resume: { type: "string" },
          education: { type: "string" },
          experience: { type: "string" },
          skills: {
            type: "array",
            items: { type: "string" },
          },
          jobApplication: {
            type: "array",
            items: { $ref: "#/components/schemas/JobApplication" },
          },
        },
      },
      Company: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          company_name: { type: "string" },
          description: { type: "string" },
          website: { type: "string" },
          location: { type: "string" },
          jobListing: {
            type: "array",
            items: { $ref: "#/components/schemas/JobListing" },
          },
        },
      },
      JobListing: {
        type: "object",
        properties: {
          id: { type: "integer" },
          company_id: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
          skills_required: {
            type: "array",
            items: { type: "string" },
          },
          salary: { type: "integer" },
          experience: { type: "string" },
          startDate: {
            type: "string",
            format: "date-time",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          location: { type: "string" },
          jobApplication: {
            type: "array",
            items: { $ref: "#/components/schemas/JobApplication" },
          },
        },
      },

      JobApplication: {
        type: "object",
        properties: {
          id: { type: "integer" },
          jobSeeker_id: { type: "integer" },
          jobListing_id: { type: "integer" },
        },
      },
      RoleName: {
        type: "string",
        enum: ["jobseeker", "company"],
      },
      JobSeekerLoginRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: { type: "string" },
        },
        required: ["email", "password"],
      },
      JobSeekerLoginResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          accessToken: { type: "string" },
        },
      },
      JobSeekerRegisterRequest: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: {
            type: "string",
            format: "email",
          },
          password: { type: "string" },
          resume: {
            type: "string",
            format: "binary",
          },
          education: { type: "string" },
          experience: { type: "string" },
          skills: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "username",
          "email",
          "password",
          "resume",
          "education",
          "experience",
          "skills",
        ],
      },
      JobSeekerRegisterResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          accessToken: { type: "string" },
        },
      },
      CurrentJobSeekerResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      JobSeekerUpdateRequest: {
        type: "object",
        properties: {
          education: { type: "string" },
          experience: { type: "string" },
          skills: { type: "string" },
          resume: {
            type: "string",
            format: "binary",
          },
        },
      },
      JobSeekerUpdateResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      CompanyLoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
        required: ["email", "password"],
      },
      CompanyLoginResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          accessToken: { type: "string" },
        },
      },
      CompanyRegisterRequest: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          company_name: { type: "string" },
          description: { type: "string" },
          website: { type: "string" },
          location: { type: "string" },
        },
        required: [
          "username",
          "email",
          "password",
          "company_name",
          "description",
          "website",
          "location",
        ],
      },
      CompanyRegisterResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          accessToken: { type: "string" },
        },
      },
      CompanyUpdateRequest: {
        type: "object",
        properties: {
          company_name: { type: "string" },
          description: { type: "string" },
          website: { type: "string" },
          location: { type: "string" },
        },
      },
      CompanyUpdateResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },

      JobListingCreateRequest: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the job listing",
          },
          description: {
            type: "string",
            description: "A brief description of the job listing",
          },
          skills_required: {
            type: "string",
            description: "The required skills for the job",
          },
          salary: {
            type: "string",
            description: "The salary offered for the job",
          },
          experience: {
            type: "string",
            description: "The required experience for the job",
          },
          startDate: {
            type: "string",
            format: "date-time",
            description: "The start date of the job",
          },
          location: {
            type: "string",
            description: "The location of the job",
          },
        },
        required: [
          "title",
          "description",
          "skills_required",
          "salary",
          "experience",
          "startDate",
          "location",
        ],
      },
      JobListingUpdateRequest: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The updated title of the job listing",
          },
          description: {
            type: "string",
            description: "The updated description of the job listing",
          },
          skills_required: {
            type: "string",
            description: "The updated required skills for the job",
          },
          salary: {
            type: "string",
            description: "The updated salary offered for the job",
          },
          experience: {
            type: "string",
            description: "The updated required experience for the job",
          },
          startDate: {
            type: "string",
            format: "date-time",
            description: "The updated start date of the job",
          },
          location: {
            type: "string",
            description: "The updated location of the job",
          },
        },
      },
    },
  },
};

export default openapiSpec;
