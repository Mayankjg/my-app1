"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Mail, Phone, Briefcase, Trash2, Key } from "lucide-react";

const NewPasswordModal = ({ salespersonId, onClose, onPasswordChange }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        onPasswordChange(salespersonId, newPassword);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-[1000] p-5 bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-[white] p-4 border border-[black] rounded-lg w-full max-w-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold bg-[#e5e9ec] mb-4 text-gray-900">Change Password</h3>
                <div>
                    {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
                    <hr className="-mx-4 border-t mb-5 border-gray-300 mt-4 mb-0" />
                    <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2.5 mb-4 text-[black] border border-gray-300 rounded-md pl-5"
                        placeholder="Enter new password"
                        required
                        minLength="6"
                    />

                    <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2.5 mb-4 text-[black] border border-gray-300 rounded-md pl-5"
                        placeholder="Confirm password"
                        required
                    />

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-md font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit(e);
                            }}
                            className="w-full sm:w-auto bg-[#00a7cf] hover:bg-[#0094b8] text-white px-4 py-2.5 rounded-md font-bold transition-colors"
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChangeEmailModal = ({ salespersonId, onClose, onEmailChange }) => {
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!validateEmail(newEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        onEmailChange(salespersonId, newEmail);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-[1000] p-5 bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-8 border border-[black] rounded-lg w-full max-w-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold bg-[#e5e9ec] mb-4 text-gray-900">Change Email ID</h3>
                <div>
                    {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
                     <hr className="-mx-8 border-t mb-5 border-gray-300 mt-4 mb-0" />
                    <label className="block mb-2 text-sm font-medium text-gray-700">New Email ID</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full p-2.5 mb-4 text-[black] border border-gray-300 rounded-md pl-5"
                        placeholder="Enter new email address"
                        required
                    />

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-md font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit(e);
                            }}
                            className="w-full sm:w-auto bg-[#133b74] hover:bg-[#0f2f5a] text-white px-4 py-2.5 rounded-md font-bold transition-colors"
                        >
                            Update Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SalespersonList() {
    const router = useRouter();
    const [salespersons, setSalespersons] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [salespersonToChange, setSalespersonToChange] = useState(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [salespersonToChangeEmail, setSalespersonToChangeEmail] = useState(null);

    useEffect(() => {
        loadSalespersons();
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadSalespersons();
            }
        };

        const handleFocus = () => {
            loadSalespersons();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);


        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const loadSalespersons = () => {
        try {
            const storedData = localStorage.getItem("salespersons");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setSalespersons(parsedData);
            } else {
                setSalespersons([]);
            }
        } catch (error) {
            console.error("Error loading salespersons:", error);
            setSalespersons([]);
        }
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this salesperson?")) return;

        try {
            const updatedList = salespersons.filter((sp) => sp.id !== id);
            setSalespersons(updatedList);
            localStorage.setItem("salespersons", JSON.stringify(updatedList));
            alert("Salesperson deleted successfully!");
        } catch (error) {
            console.error("Error during delete:", error);
            alert("Deletion failed.");
        }
    };

    const handleOpenChangePassword = (id) => {
        setSalespersonToChange(id);
        setIsModalOpen(true);
        document.body.classList.add('modal-open');
    };

    const handleCloseChangePassword = () => {
        setIsModalOpen(false);
        setSalespersonToChange(null);
        document.body.classList.remove('modal-open');
    };

    const handleChangePassword = async (id, newPassword) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const updatedList = salespersons.map(sp =>
                sp.id === id ? { ...sp, password: newPassword } : sp
            );
            setSalespersons(updatedList);
            localStorage.setItem("salespersons", JSON.stringify(updatedList));
            alert("Password updated successfully!");
        } catch (error) {
            console.error("Error during password update:", error);
            alert("Something went wrong");
        }
    };

    const handleOpenChangeEmail = (id) => {
        setSalespersonToChangeEmail(id);
        setIsEmailModalOpen(true);
        document.body.classList.add('modal-open');
    };

    const handleCloseChangeEmail = () => {
        setIsEmailModalOpen(false);
        setSalespersonToChangeEmail(null);
        document.body.classList.remove('modal-open');
    };

    const handleChangeEmail = async (id, newEmail) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const updatedList = salespersons.map(sp =>
                sp.id === id ? { ...sp, email: newEmail } : sp
            );
            setSalespersons(updatedList);
            localStorage.setItem("salespersons", JSON.stringify(updatedList));
            alert("Email ID updated successfully!");
        } catch (error) {
            console.error("Error during email update:", error);
            alert("Email ID update failed.");
        }
    };

    const filteredSalespersons = salespersons.filter(
        (sp) =>
            sp.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayList = searchQuery ? filteredSalespersons : salespersons;

    return (
        <div className="bg-[#f9fafb] p-0 sm:p-5 h-screen overflow-hidden flex justify-center items-start font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
            {isModalOpen && (
                <NewPasswordModal
                    salespersonId={salespersonToChange}
                    onClose={handleCloseChangePassword}
                    onPasswordChange={handleChangePassword}
                />
            )}

            {isEmailModalOpen && (
                <ChangeEmailModal
                    salespersonId={salespersonToChangeEmail}
                    onClose={handleCloseChangeEmail}
                    onEmailChange={handleChangeEmail}
                />
            )}

            <div className="bg-white w-full border border-[black] max-w-[1400px] h-full overflow-y-auto">
                <div className="bg-white w-full px-4 sm:px-6 py-4">
                    <div className="flex sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl sm:text-2xl font-normal text-gray-700">
                            Salesperson <strong>List</strong>
                        </h2>

                        <button
                            onClick={() => router.push("/managesalesperson/add")}
                            className="w-full sm:w-auto bg-[#374151] hover:bg-[#1f2937] text-white text-base px-5 py-2.5 rounded transition-colors"
                        >
                            Add Sales Person
                        </button>
                        
                    </div>
                    <hr className="-mx-4 sm:-mx-6 border-t border-gray-300 mt-4 mb-0" />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center px-4 sm:px-6 gap-2 mb-6 sm:justify-end">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-[200px] text-[black] h-10 sm:h-9 border border-gray-300 rounded-[5px] px-3 py-2 text-base sm:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#00a7cf] pl-5"
                    />
                    <button className="bg-[#0baad1] w-full sm:w-[70px] h-10 text-white px-2 py-1 text-base sm:text-[18px] font-medium rounded-[5px] hover:bg-[#0094b8] transition-colors">
                        Search
                    </button>
                </div>

                {displayList.length > 0 ? (
                    <div className="w-full px-2 sm:px-6 mt-[20px] grid grid-cols-1 gap-2.5 pb-6">
                        {displayList.map((sp, index) => (
                            <div
                                key={sp.id || index}
                                className="flex flex-col lg:flex-row items-start min-h-[200px] bg-[#ffffff] hover:bg-[#f6f6f6] mb-2 border border-gray-200 rounded-[10px] p-4 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 flex-1 w-full">
                                    <img
                                        src={sp.profileImage || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-[70px] h-[100px] rounded-[10px] border border-gray-300 object-cover lg:mt-5"
                                    />
                                    <div className="flex-1 w-full">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight mt-0 lg:mt-5 text-center lg:text-left">
                                            {sp.username}
                                        </h3>

                                        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between mt-2.5 gap-3">
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-10 w-full lg:w-auto">
                                                <p className="text-gray-600 text-sm sm:text-base capitalize">
                                                    {sp.firstname} {sp.lastname}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <Briefcase className="w-[18px] h-[18px] text-gray-500" />
                                                    <span className="text-sm sm:text-base text-gray-700">
                                                        Designation: <span className="font-semibold">{sp.designation}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full lg:w-auto justify-center">
                                                <div
                                                    className="relative group flex items-center cursor-pointer"
                                                    onClick={() => handleDelete(sp.id)}
                                                >
                                                    <Trash2
                                                        className="w-5 h-5 mr-[30px] text-gray-600 hover:text-red-600 transition"
                                                        title="Delete"
                                                    />
                                                    <span className="absolute bottom-6 left-[10px] -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                                                        Delete
                                                    </span>
                                                </div>

                                                <button className="bg-[#dc3545] flex-1 lg:flex-none h-9 lg:w-[140px] rounded-md text-white hover:bg-[#c82333] text-sm font-medium transition-colors">
                                                    View Leads
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between mt-4 mb-5 gap-3">
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-10 w-full lg:w-auto">
                                                <div className="flex items-center gap-2.5">
                                                    <Mail className="w-[18px] h-[18px] text-gray-500" />
                                                    <a
                                                        href={`mailto:${sp.email}`}
                                                        className="text-[#007bff] text-sm sm:text-base hover:underline break-all"
                                                    >
                                                        {sp.email}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Phone className="w-[18px] h-[18px] text-gray-500" />
                                                    <span className="text-sm sm:text-base text-gray-700">
                                                        Contact Number:{" "}
                                                        <span className="font-semibold">
                                                            {sp.contact}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full lg:w-auto justify-center">
                                                <div
                                                    className="relative group flex items-center cursor-pointer"
                                                    onClick={() => handleOpenChangePassword(sp.id)}
                                                >
                                                    <Key
                                                        className="w-5 h-5 mr-[30px] text-gray-600 hover:text-[#133b74] transition"
                                                        title="Change Password"
                                                    />
                                                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                                                        Change Password
                                                    </span>
                                                </div>

                                                <button
                                                    className="bg-[#2b3342] flex-1 lg:flex-none h-9 lg:w-[140px] rounded-md text-white hover:bg-[#0f2f5a] text-sm font-medium transition-colors"
                                                    onClick={() => handleOpenChangeEmail(sp.id)}
                                                >
                                                    Change Email ID
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-base sm:text-lg font-medium mt-10 pb-6">
                        No Salespersons Found
                    </div>
                )}
            </div>
        </div>
    );
}