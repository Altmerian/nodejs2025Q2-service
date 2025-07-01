# REST service: Logging & Error Handling and Authentication and Authorization

## Basic Scope

# 1) Logging & Error Handling:

- Custom `LoggingService` is implemented and used for logging
- Custom `Exception Filter` is implemented and used for handling exceptions during request processing
- Logging for request (of at least `url`, `query parameters`, `body`) and response with `status code` is implemented.
- Error handling is implemented including sending response with an appropriate `http status code` and errors logging.
- Error handling  and logging is implemented for `uncaughtException` event.
- Error handling  and logging is implemented for `unhandledRejection` event.


# 2) Authentication and Authorization:

- Route `/auth/signup` implemented correctly, related logic is divided between controller and corresponding service
- Route `/auth/login` has been implemented, related logic is divided between controller and corresponding service
- `User` `password` saved into database as hash
- Access Token is implemented,`JWT` payload contains `userId` and `login`, secret key is saved in `.env`.
- Authentication is required for the access to all routes except `/auth/signup`, `/auth/login`, `/doc` and `/`.
- Separate module is implemented **within application scope** to check that all requests to all routes except mentioned above contain required JWT token

## Advanced Scope

# 1) Logging & Error Handling:

- Logs are written to a file.
- Logs files are rotated with size.
- Add environment variable to specify max file size.
- Error logs are written to a separate file (either only to a separate file or in addition to logging into a common file).
- Add environment variable to specify logging level and corresponding functionality.
Logs with configured level to be registered as well as other higher priority levels. For example if you set level 2, all messages with levels 0, 1 and 2 should be logged. You should use Nest.js logging levels.


# 2) Authentication and Authorization:
- Route `/auth/refresh` implemented correctly, related logic is divided between controller and corresponding service
