import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { validateAddress, validateEducation } from "../validations/validations";

const useUserData = (userId) => {
    const [educations, setEducations] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [educationsRes, addressesRes] = await Promise.all([
                axios.get(`http://localhost:3001/educations?userId=${userId}`),
                axios.get(`http://localhost:3001/addresses?userId=${userId}`),
            ]);

            setEducations(educationsRes.data);
            setAddresses(addressesRes.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            Swal.fire("Error", "No se pudieron cargar los datos del usuario", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEducation = async (educationInput, editIndex) => {
        const error = validateEducation(educationInput);
        if (error) {
            Swal.fire("Error de validación", error, "warning");
            return false;
        }

        try {
            if (editIndex !== null) {
                const educationToUpdate = educations[editIndex];
                const updatedEducation = {
                    ...educationToUpdate,
                    title: educationInput,
                };

                await axios.put(
                    `http://localhost:3001/educations/${educationToUpdate.id}`,
                    updatedEducation
                );

                const updated = [...educations];
                updated[editIndex] = updatedEducation;
                setEducations(updated);

                Swal.fire("Editado", "El estudio fue editado exitosamente.", "success");
                return { action: "edit", index: editIndex };
            } else {
                const newEducation = {
                    id: Date.now().toString(),
                    userId,
                    title: educationInput,
                };

                await axios.post("http://localhost:3001/educations", newEducation);
                setEducations([...educations, newEducation]);

                Swal.fire("Agregado", "El estudio fue agregado exitosamente.", "success");
                return { action: "add" };
            }
        } catch (error) {
            console.error("Error saving education:", error);
            Swal.fire("Error", "No se pudo guardar el estudio", "error");
            return false;
        }
    };

    const handleAddress = async (addressInput, editIndex) => {
        const error = validateAddress(addressInput);
        if (error) {
            Swal.fire("Error de validación", error, "warning");
            return false;
        }

        try {
            if (editIndex !== null) {
                const addressToUpdate = addresses[editIndex];
                const updatedAddress = {
                    ...addressToUpdate,
                    address: addressInput,
                };

                await axios.put(
                    `http://localhost:3001/addresses/${addressToUpdate.id}`,
                    updatedAddress
                );

                const updated = [...addresses];
                updated[editIndex] = updatedAddress;
                setAddresses(updated);

                Swal.fire("Editado", "La dirección fue editada exitosamente.", "success");
                return { action: "edit", index: editIndex };
            } else {
                const newAddress = {
                    id: Date.now().toString(),
                    userId,
                    address: addressInput,
                };

                await axios.post("http://localhost:3001/addresses", newAddress);
                setAddresses([...addresses, newAddress]);

                Swal.fire("Agregada", "La dirección fue agregada exitosamente.", "success");
                return { action: "add" };
            }
        } catch (error) {
            console.error("Error saving address:", error);
            Swal.fire("Error", "No se pudo guardar la dirección", "error");
            return false;
        }
    };

    const deleteItem = async (index, type) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return false;

        try {
            if (type === "education") {
                const educationId = educations[index].id;
                await axios.delete(`http://localhost:3001/educations/${educationId}`);
                setEducations(educations.filter((_, i) => i !== index));
                Swal.fire("Eliminado", "El estudio ha sido eliminado.", "success");
            } else {
                const addressId = addresses[index].id;
                await axios.delete(`http://localhost:3001/addresses/${addressId}`);
                setAddresses(addresses.filter((_, i) => i !== index));
                Swal.fire("Eliminado", "La dirección ha sido eliminada.", "success");
            }
            return true;
        } catch (error) {
            console.error("Error deleting item:", error);
            Swal.fire("Error", "No se pudo eliminar el elemento", "error");
            return false;
        }
    };

    useEffect(() => {
        if (userId) fetchData();
    }, [userId]);

    return {
        educations,
        addresses,
        loading,
        refreshData: fetchData,
        handleEducation,
        handleAddress,
        deleteItem,
    };
};

export default useUserData;