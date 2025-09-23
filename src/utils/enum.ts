export const backend_path={
    // authentication
    REGISTER:'auth/register/',
    LOGIN:'auth/login/',
    VERIFY_EMAIL:'auth/verify-email/',
    VERIFY_OTP:'auth/verify-otp/',
    
    RESEND_OTP:'auth/resend-otp/',
    FORGOT_PASSWORD:'auth/forgot-password/',
    RESET_PASSWORD:'auth/reset-password/',
    CHANGE_PASSWORD:'auth/change-password/',
    LOGOUT:'auth/logout/',
    REFRESH_TOKEN:'auth/token/refresh/',

    // ROLES
    ASSIGN_ROLE: 'auth/assign-role/',
    REMOVE_ROLE: 'auth/remove-role/',
    ROLE_LIST:'auth/roles/',
    CREATE_ROLE:'auth/roles/',
    GET_ROLE_ID:'auth/roles/',
    UPDATE_ROLE:'auth/roles/',
    DELETE_ROLE:'auth/roles/',

    // PROFILE
    GET_USER_PROFILE:'auth/profiles/',
    ADD_USER_PROFILE:'auth/profiles/',
    GET_USER_BY_ID:'auth/profiles/',
    UPDATE_PROFILE:'auth/profiles/',
    DELETE_PROFILE:'auth/profiles/',

    //STUDENT
    GET_STUDENTS:'auth/students/',
    ADD_STUDENT:'auth/students/',
    GET_STUDENT_ID:'auth/students/',
    UPDATE_STUDENT:'auth/students/',
    DELETE_STUDENT:'auth/students/',

    //USERS
    GETUSERS:'auth/users/',
    GET_USER_ID:'auth/users/',
    UPDATE_USER:'auth/users/',
    DELETE_USER:'auth/users/',

    // AGENTS
    AGENT_LIST:'auth/agents/',
    ADD_AGENT:'auth/agents/',
    GET_AGENT_ID:'auth/agents/',
    UPDATE_AGENT:'auth/agents/',
    DELETE_AGENT:'auth/agents/',

    //CAMPUS
    GET_CAMPUS:'catalog/campuses/',
    ADD_CAMPUS:'catalog/campuses/',
    UPDATE_CAMPUS:'catalog/campuses/',
    GET_CAMPUS_ID:'catalog/campuses/',
    DELETE_CAMPUS:'catalog/campuses/',

    //PROGRAM FEATURE
    GET_FEATURE:'catalog/features/',
    ADD_FEATURE:'catalog/features/',
    UPDATE_FEATURE:'catalog/features/',
    GET_FEATURE_ID:'catalog/features/',
    DELETE_FEATURE:'catalog/features/',

    //PROGRAM FEE
    GET_PROGRAM_FEE:'catalog/fees/',
    ADD_PROGRAM_FEE:'catalog/fees/',
    UPDATE_PROGRAM_FEE:'catalog/fees/',
    GET_PROGRAM_FEE_ID:'catalog/fees/',
    DELETE_PROGRAM_FEE:'catalog/fees/',

    //PROGRAM REQUIREMENT
    GET_PROGRAM_REQUIREMENT:'catalog/program_requirements/',
    ADD_PROGRAM_REQUIREMENT:'catalog/program_requirements/',
    UPDATE_PROGRAM_REQUIREMENT:'catalog/program_requirements/',
    GET_PROGRAM_REQUIREMENT_ID:'catalog/program_requirements/',
    DELETE_PROGRAM_REQUIREMENT:'catalog/program_requirements/',

    //PROGRAM
    GET_PROGRAM:'catalog/programs/',
    ADD_PROGRAM:'catalog/programs/',
    UPDATE_PROGRAM:'catalog/programs/',
    GET_PROGRAM_ID:'catalog/programs/',
    DELETE_PROGRAM:'catalog/programs/',

    //INSTITUTION
    GET_INSTITUTION:'catalog/institutions/',
    ADD_INSTITUTION:'catalog/institutions/',
    UPDATE_INSTITUTION:'catalog/institutions/',
    GET_INSTITUTION_ID:'catalog/institutions/',
    DELETE_INSTITUTION:'catalog/institutions/',

    //PROGRAM INTAKE
    GET_PROGRAM_INTAKE:'catalog/intakes/',
    ADD_PROGRAM_INTAKE:'catalog/intakes/',
    UPDATE_PROGRAM_INTAKE:'catalog/intakes/',
    GET_PROGRAM_INTAKE_ID:'catalog/intakes/',
    DELETE_PROGRAM_INTAKE:'catalog/intakes/',

    //ADMISSION REQUIREMENT
    GET_ADMISSION_REQUIREMENT:'catalog/requirements/',
    ADD_ADMISSION_REQUIREMENT:'catalog/requirements/',
    UPDATE_ADMISSION_REQUIREMENT:'catalog/requirements/',
    GET_ADMISSION_REQUIREMENT_ID:'catalog/requirements/',
    DELETE_ADMISSION_REQUIREMENT:'catalog/requirements/',

    //INSTITUTION STAFF
    GET_INSTITUTION_STAFF:'catalog/staff/',
    ADD_INSTITUTION_STAFF:'catalog/staff/',
    UPDATE_INSTITUTION_STAFF:'catalog/staff/',
    GET_INSTITUTION_STAFF_ID:'catalog/staff/',
    DELETE_INSTITUTION_STAFF:'catalog/staff/',


// AI INTEGRATION

    CREATE_CHAT:'chatbot/message/',
    LIST_CHAT:'chatbot/sessions/',
    ADD_SESSION:'chatbot/sessions/',
    GET_SESSION:'chatbot/sessions/',
    UPDATE_SESSION:'chatbot/sessions/',
    PATCH_SESSION:'chatbot/sessions/',
    DELETE_SESSION:'chatbot/sessions/',
    SESSION_END:'chatbot/sessions/', //add /id/end
    SESSION_HISTORY:'chatbot/sessions/' // add id/history



}