export const validResponse = json => {
    return { data: json };
};

export const errorResponse = json => {
    return { error: json };
};
