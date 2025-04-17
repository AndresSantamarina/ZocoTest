import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
    createUser,
    updateUser,
    createEducation,
    updateEducation,
    deleteEducation,
    createAddress,
    updateAddress,
    deleteAddress,
} from "../helpers/apiHelpers";
import {
    validateAddress,
    validateEducation,
} from "../validations/validations";

const useUserModal = ({ initialData, onSubmit, onClose }) => {
    const {
        register,
        handleSubmit: hookFormSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "user",
            educations: [],
            addresses: [],
        },
        mode: "onBlur",
    });

    const [newEducation, setNewEducation] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const formData = watch();

    useEffect(() => {
        const fetchRelatedData = async () => {
            if (!initialData?.id) return;
            setLoading(true);

            try {
                const [educationsRes, addressesRes] = await Promise.all([
                    axios.get(`http://localhost:3001/educations?userId=${initialData.id}`),
                    axios.get(`http://localhost:3001/addresses?userId=${initialData.id}`),
                ]);
                reset({
                    ...initialData,
                    educations: educationsRes.data,
                    addresses: addressesRes.data,
                });
            } catch (error) {
                console.error("Error fetching related data:", error);
                Swal.fire("Error", "No se pudieron cargar los datos relacionados", "error");
            } finally {
                setLoading(false);
            }
        };

        if (initialData?.id) {
            fetchRelatedData();
        } else {
            reset({
                name: "",
                email: "",
                password: "",
                role: "user",
                educations: [],
                addresses: [],
            });
        }
    }, [initialData, reset]);

    const handleAddEducation = () => {
        if (newEducation.trim()) {
            const error = validateEducation(newEducation);
            if (error) {
                Swal.fire("Error", error, "error");
                return;
            }

            setValue("educations", [
                ...formData.educations,
                {
                    title: newEducation,
                    id: Date.now().toString(),
                    userId: formData.id || null,
                },
            ]);
            setNewEducation("");
        }
    };

    const handleRemoveEducation = async (index) => {
        const educationToRemove = formData.educations[index];

        try {
            if (educationToRemove.id && typeof educationToRemove.id === "number") {
                await deleteEducation(educationToRemove.id);
            }
            setValue(
                "educations",
                formData.educations.filter((_, i) => i !== index)
            );
        } catch (error) {
            console.error("Error deleting education:", error);
            Swal.fire("Error", "No se pudo eliminar el estudio", "error");
        }
    };

    const handleAddAddress = () => {
        if (newAddress.trim()) {
            const error = validateAddress(newAddress);
            if (error) {
                Swal.fire("Error", error, "error");
                return;
            }

            setValue("addresses", [
                ...formData.addresses,
                {
                    address: newAddress,
                    id: Date.now().toString(),
                    userId: formData.id || null,
                },
            ]);
            setNewAddress("");
        }
    };

    const handleRemoveAddress = async (index) => {
        const addressToRemove = formData.addresses[index];

        try {
            if (addressToRemove.id && typeof addressToRemove.id === "number") {
                await deleteAddress(addressToRemove.id);
            }

            setValue(
                "addresses",
                formData.addresses.filter((_, i) => i !== index)
            );
        } catch (error) {
            console.error("Error deleting address:", error);
            Swal.fire("Error", "No se pudo eliminar la dirección", "error");
        }
    };

    const handleEducationChange = (index, value) => {
        const updated = [...formData.educations];
        updated[index].title = value;
        setValue("educations", updated);
    };

    const handleAddressChange = (index, value) => {
        const updated = [...formData.addresses];
        updated[index].address = value;
        setValue("addresses", updated);
    };

    const validateFormData = (data) => {
        for (const edu of data.educations) {
            const error = validateEducation(edu.title);
            if (error) {
                Swal.fire("Error", `Estudio no válido: ${error}`, "error");
                return false;
            }
        }

        for (const addr of data.addresses) {
            const error = validateAddress(addr.address);
            if (error) {
                Swal.fire("Error", `Dirección no válida: ${error}`, "error");
                return false;
            }
        }

        return true;
    };

    const onFormSubmit = async (data) => {
        if (!validateFormData(data)) {
            return;
        }
        setLoading(true);

        try {
            let result;

            if (data.id) {
                await updateUser(data.id, {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                });

                const [existingEducations, existingAddresses] = await Promise.all([
                    axios.get(`http://localhost:3001/educations?userId=${data.id}`),
                    axios.get(`http://localhost:3001/addresses?userId=${data.id}`),
                ]);

                await Promise.all(
                    data.educations.map(async (edu) => {
                        const educationData = {
                            title: edu.title,
                            userId: data.id,
                        };
                        if (!edu.id || !existingEducations.data.some((e) => e.id === edu.id)) {
                            return await createEducation(educationData);
                        } else {
                            return await updateEducation(edu.id, educationData);
                        }
                    })
                );

                const educationsToKeep = data.educations
                    .map((edu) => edu.id)
                    .filter(Boolean);
                await Promise.all(
                    existingEducations.data
                        .filter((existing) => !educationsToKeep.includes(existing.id))
                        .map((edu) => deleteEducation(edu.id))
                );

                await Promise.all(
                    data.addresses.map(async (addr) => {
                        const addressData = {
                            address: addr.address,
                            userId: data.id,
                        };

                        if (!addr.id || !existingAddresses.data.some((a) => a.id === addr.id)) {
                            return await createAddress(addressData);
                        } else {
                            return await updateAddress(addr.id, addressData);
                        }
                    })
                );

                const addressesToKeep = data.addresses
                    .map((addr) => addr.id)
                    .filter(Boolean);
                await Promise.all(
                    existingAddresses.data
                        .filter((existing) => !addressesToKeep.includes(existing.id))
                        .map((addr) => deleteAddress(addr.id))
                );

                result = { action: "updated", user: data };
            } else {
                const userRes = await createUser({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                });

                const newUserId = userRes.data.id;

                if (data.educations && data.educations.length > 0) {
                    await Promise.all(
                        data.educations.map((edu) =>
                            createEducation({
                                title: edu.title,
                                userId: newUserId,
                            })
                        )
                    );
                }
                if (data.addresses && data.addresses.length > 0) {
                    await Promise.all(
                        data.addresses.map((addr) =>
                            createAddress({
                                address: addr.address,
                                userId: newUserId,
                            })
                        )
                    );
                }

                result = { action: "created", userId: newUserId };

                reset({
                    name: "",
                    email: "",
                    password: "",
                    role: "user",
                    educations: [],
                    addresses: [],
                });
                setNewEducation("");
                setNewAddress("");
            }

            Swal.fire("Éxito", "Usuario guardado correctamente", "success");
            onSubmit(result);
            onClose();
        } catch (error) {
            console.error("Error saving user:", error);
            Swal.fire("Error", "No se pudo guardar el usuario", "error");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        loading,
        newEducation,
        newAddress,
        register,
        hookFormSubmit,
        handleAddEducation,
        handleRemoveEducation,
        handleAddAddress,
        handleRemoveAddress,
        handleEducationChange,
        handleAddressChange,
        onFormSubmit,
        setNewEducation,
        setNewAddress,
    };
};

export default useUserModal;