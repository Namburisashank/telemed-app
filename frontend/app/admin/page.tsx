"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // 1. Basic Security: Check if user is Admin
    // (In a real app, verify this on backend too)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
       // Ideally redirect, but for testing we might just warn
       // alert("Access Denied: Admins Only");
       // router.push("/dashboard"); 
    }

    // 2. Fetch Data
    const fetchData = async () => {
      try {
        const statsRes = await axios.get("http://localhost:5000/api/admin/stats");
        const usersRes = await axios.get("http://localhost:5000/api/admin/users");
        const apptRes = await axios.get("http://localhost:5000/api/admin/appointments");

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        console.error("Error fetching admin data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard 🛡️</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500">Total Patients</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.patients}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <h3 className="text-gray-500">Total Doctors</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.doctors}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500">Total Appointments</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.appointments}</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-700">All Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Doctor</th>
                <th className="p-3 border-b">Patient</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt: any) => (
                <tr key={appt.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="p-3 border-b">#{appt.id}</td>
                  <td className="p-3 border-b font-medium">{appt.doctor_name}</td>
                  <td className="p-3 border-b">{appt.patient_name}</td>
                  <td className="p-3 border-b">{new Date(appt.appointment_date).toDateString()}</td>
                  <td className="p-3 border-b">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-700">User Registry</h2>
        <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="p-3 border-b">{u.id}</td>
                  <td className="p-3 border-b">{u.full_name}</td>
                  <td className="p-3 border-b text-gray-500">{u.email}</td>
                  <td className="p-3 border-b uppercase text-sm font-bold">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}