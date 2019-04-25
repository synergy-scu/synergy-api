export const validResponse = json => {
    return { data: json };
};

export const errorResponse = ({ type, message, error, ...params }) => {
    return {
        error: {
            type,
            message,
            error,
            ...params,
        },
    };
};
