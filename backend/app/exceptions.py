from fastapi import HTTPException

class Exceptions(HTTPException):
    status_code = 500
    detail = ""
    def __init__(self):
        super().__init__(status_code=self.status_code, detail=self.detail)

class UserAlreadyRegisteredException(Exceptions):
    status_code = 400
    detail = "Email or username is already registered"

class UncorrectedEmailException(Exceptions):
    status_code = 400
    detail = "Uncorrected email"

class UserIsNotRegisteredException(Exceptions):
    status_code = 401
    detail = "Incorrect credentials"

class InvalidPasswordException(Exceptions):
    status_code = 401
    detail = "Incorrect credentials"

class UserIsAbsentException(Exceptions):
    status_code = 401
    detail = "User is absent"

class UserIsNotAuthorizedException(Exceptions):
    status_code = 401
    detail = "Not authorized"

class TokenExpiredException(Exceptions):
    status_code = 401
    detail = "Token has expired"

class IncorrectTokenFormatException(Exceptions):
    status_code = 401
    detail = "Incorrect token format"

class DatabaseException(Exceptions):
    status_code = 500
    detail = "Database error"

class NoAccessException(Exceptions):
    status_code = 403
    detail = "No access"