import api from '../utils/axiosConfig';

export const fetchClubInfo = async (clubId: string = '158176') => {
    const response = await api.get(`/club/${clubId}`);
    console.log("response.data = ", response.data)
    return response.data;
};
