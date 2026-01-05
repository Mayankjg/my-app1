"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserX, CheckCircle, XCircle } from "lucide-react";

export default function RequestForInactive() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    try {
      const storedRequests = localStorage.getItem("inactiveRequests");
      if (storedRequests) {
        setRequests(JSON.parse(storedRequests));
      } else {
        // Sample data for demonstration
        const sampleRequests = [
          {
            id: 1,
            username: "john_doe",
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@example.com",
            designation: "Sales Executive",
            contact: "+91 9876543210",
            requestDate: "2024-12-20",
            reason: "Extended medical leave",
            status: "pending"
          },
          {
            id: 2,
            username: "jane_smith",
            firstname: "Jane",
            lastname: "Smith",
            email: "jane.smith@example.com",
            designation: "Senior Sales Manager",
            contact: "+91 8765432109",
            requestDate: "2024-12-18",
            reason: "Personal reasons",
            status: "pending"
          }
        ];
        localStorage.setItem("inactiveRequests", JSON.stringify(sampleRequests));
        setRequests(sampleRequests);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      setRequests([]);
    }
  };

  const handleApprove = (id) => {
    if (!confirm("Are you sure you want to approve this request?")) return;

    try {
      const updatedRequests = requests.map(req =>
        req.id === id ? { ...req, status: "approved" } : req
      );
      setRequests(updatedRequests);
      localStorage.setItem("inactiveRequests", JSON.stringify(updatedRequests));
      
      // Move to inactive salespersons list
      const salespersons = JSON.parse(localStorage.getItem("salespersons") || "[]");
      const inactiveSalespersons = JSON.parse(localStorage.getItem("inactiveSalespersons") || "[]");
      
      const requestToApprove = requests.find(req => req.id === id);
      const salesperson = salespersons.find(sp => sp.email === requestToApprove.email);
      
      if (salesperson) {
        inactiveSalespersons.push({ ...salesperson, inactiveDate: new Date().toISOString() });
        const updatedSalespersons = salespersons.filter(sp => sp.email !== requestToApprove.email);
        
        localStorage.setItem("inactiveSalespersons", JSON.stringify(inactiveSalespersons));
        localStorage.setItem("salespersons", JSON.stringify(updatedSalespersons));
      }
      
      alert("Request approved successfully!");
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request");
    }
  };

  const handleReject = (id) => {
    if (!confirm("Are you sure you want to reject this request?")) return;

    try {
      const updatedRequests = requests.map(req =>
        req.id === id ? { ...req, status: "rejected" } : req
      );
      setRequests(updatedRequests);
      localStorage.setItem("inactiveRequests", JSON.stringify(updatedRequests));
      alert("Request rejected successfully!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    }
  };

  const filteredRequests = requests.filter(req =>
    req.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.lastname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(req => req.status === "pending");

  return (
    <div className="bg-[#f9fafb] p-0 sm:p-5 h-screen overflow-hidden flex justify-center items-start font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <div className="bg-white w-full border border-[black] max-w-[1400px] h-full overflow-y-auto">
        
        <div className="bg-white w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-normal text-gray-700">
              Request for <strong>Inactive</strong>
            </h2>

            <button
              onClick={() => router.push("/managesalesperson")}
              className="w-full sm:w-auto bg-[#374151] hover:bg-[#1f2937] text-white text-base px-5 py-2.5 rounded transition-colors"
            >
              Back to List
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

        {pendingRequests.length > 0 ? (
          <div className="w-full px-2 sm:px-6 mt-[20px] grid grid-cols-1 gap-4 pb-6">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserX className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex-1">
                    
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                        {request.username}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {request.firstname} {request.lastname}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-700">{request.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Designation</p>
                        <p className="text-sm text-gray-700">{request.designation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Contact</p>
                        <p className="text-sm text-gray-700">{request.contact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Request Date</p>
                        <p className="text-sm text-gray-700">{new Date(request.requestDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Reason</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                        {request.reason}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded transition-colors flex-1 sm:flex-none"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded transition-colors flex-1 sm:flex-none"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-base sm:text-lg font-medium mt-10 pb-6">
            <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No Pending Inactive Requests</p>
          </div>
        )}
      </div>
    </div>
  );
}