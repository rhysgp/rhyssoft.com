import moment from "moment/moment";

export const formatDate = (s: string) => {
    return moment(s).format('LL');
}

