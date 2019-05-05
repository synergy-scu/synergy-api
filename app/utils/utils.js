import moment from 'moment';

export const formatStringAsDate = (key, value) => {
    if (typeof value === 'string') {
        const date = moment(value);
        if (date.isValid()) {
            return date;
        }
    }
    return value;
};
