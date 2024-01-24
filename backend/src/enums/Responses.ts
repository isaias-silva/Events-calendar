export enum Responses {

    USER_ALREADY_EXISTS = 'user exists',
    USER_SUBSCRIBED = "USER_SUBSCRIBED",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    USER_UPDATED = "USER_UPDATED",
    USER_DELETED = "USER_DELETED",
    USER_INCORRECT_PASSWORD = "USER_INCORRECT_PASSWORD",
    USER_LOGIN = "USER_LOGIN",
    ACCESS_DENIED = "ACCESS_DENIED",
    USER_NAME_IS_REQUIRED = "USER_NAME_IS_REQUIRED",
    USER_MAIL_IS_REQUIRED = "USER_MAIL_IS_REQUIRED",
    USER_PASSWORD_IS_REQUIRED = "USER_PASSWORD_IS_REQUIRED",
    USER_ALREADY_VALIDATED = "USER_ALREADY_VALIDATED",
    INVALID_CODE_MAIL = "INVALID_CODE_MAIL",
    USER_MAIL_VALIDATE = "USER_MAIL_VALIDATE",
    USER_MAIL_NOT_VALIDATED = "USER_MAIL_NOT_VALIDATED",
    EVENT_ALREADY_EXISTS = "EVENT_ALREADY_EXISTS",
    EVENT_CREATED = "EVENT_CREATED",
    EVENT_NOT_FOUND = "EVENT_NOT_FOUND",
    EVENT_UPDATED = "EVENT_UPDATED",
    EVENT_UPDATED_BUT_EVENT_NAME_EXISTS = "EVENT_UPDATED_BUT_EVENT_NAME_EXISTS",
    EVENT_CREATED_BUT_EVENT_NAME_EXISTS = "EVENT_CREATED_BUT_EVENT_NAME_EXISTS",
    EVENT_BACKGROUND_ADDED = "EVENT_BACKGROUND_ADDED",
    EVENT_INTERNAL_ERROR = "EVENT_INTERNAL_ERROR",
    EVENT_DELETED = "EVENT_DELETED",
    USER_ALREADY_IN_PARTICIPANTS_GROUP = "USER_ALREADY_IN_PARTICIPANTS_GROUP",
    USER_ALREADY_IN_APPLICANTS_GROUP = "USER_ALREADY_IN_APPLICANTS_GROUP",
    YOU_SUBSCRIBE_IN_EVENT = "YOU_SUBSCRIBE_IN_EVENT",
    YOU_ARE_OWNER_OF_EVENT = "YOU_ARE_OWNER_OF_EVENT",
    USER_NOT_FOUND_IN_APPLICANTS_GROUP = "USER_NOT_FOUND_IN_APPLICANTS_GROUP",
    EVENT_IS_PUBLIC = "EVENT_IS_PUBLIC",
    YOU_APPROVE_THE_USER_IN_EVENT = "YOU_APPROVE_THE_USER_IN_EVENT"
}