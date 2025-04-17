import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useAdminData = () => {
    const [users, setUsers] = useState([]);
    const [educations, setEducations] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, educationsRes, addressesRes] = await Promise.all([
                axios.get("http://localhost:3001/users"),
                axios.get("http://localhost:3001/educations"),
                axios.get("http://localhost:3001/addresses"),
            ]);

            const filteredUsers = usersRes.data.filter((user) => user.role === "user");
            const enrichedUsers = filteredUsers.map((user) => ({
                ...user,
                educations: educationsRes.data.filter((edu) => edu.userId === user.id),
                addresses: addressesRes.data.filter((addr) => addr.userId === user.id),
            }));

            setUsers(enrichedUsers);
            setEducations(educationsRes.data);
            setAddresses(addressesRes.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            Swal.fire("Error", "No se pudieron cargar los datos", "error");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará al usuario y todos sus datos relacionados.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return false;

        try {
            await Promise.all([
                ...educations
                    .filter((edu) => edu.userId === id)
                    .map((edu) => axios.delete(`http://localhost:3001/educations/${edu.id}`)),
                ...addresses
                    .filter((addr) => addr.userId === id)
                    .map((addr) => axios.delete(`http://localhost:3001/addresses/${addr.id}`)),
                axios.delete(`http://localhost:3001/users/${id}`),
            ]);

            await fetchData();

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "El usuario y sus datos han sido eliminados.",
                timer: 1500,
                showConfirmButton: false,
            });

            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
            return false;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { users, educations, addresses, loading, refreshData: fetchData, deleteUser };
};

export default useAdminData;