import axios from "axios";

const API = "http://localhost:3001";

export const createUser = (data) => axios.post(`${API}/users`, data);
export const updateUser = (id, data) => axios.put(`${API}/users/${id}`, data);
export const createEducation = (data) => axios.post(`${API}/educations`, data);
export const updateEducation = (id, data) => axios.put(`${API}/educations/${id}`, data);
export const deleteEducation = (id) => axios.delete(`${API}/educations/${id}`);
export const createAddress = (data) => axios.post(`${API}/addresses`, data);
export const updateAddress = (id, data) => axios.put(`${API}/addresses/${id}`, data);
export const deleteAddress = (id) => axios.delete(`${API}/addresses/${id}`);

export const fetchUsers = async () => {
    try {
        const response = await axios.get("http://localhost:3001/users");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};