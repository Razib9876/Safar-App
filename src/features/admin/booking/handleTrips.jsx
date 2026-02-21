import React, { useState } from "react";

import {
  MagnifyingGlassIcon,
  PencilIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const TABS = [
  { label: "All", value: "all" },
  { label: "Monitored", value: "monitored" },
  { label: "Unmonitored", value: "unmonitored" },
];

const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];

const TABLE_ROWS = [
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    email: "john@creative-tim.com",
    job: "Manager",
    org: "Organization",
    online: true,
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    job: "Programator",
    org: "Developer",
    online: false,
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    job: "Executive",
    org: "Projects",
    online: false,
    date: "19/09/17",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    job: "Programator",
    org: "Developer",
    online: true,
    date: "24/12/08",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    job: "Manager",
    org: "Executive",
    online: false,
    date: "04/10/21",
  },
];

/* ===================================================== */

const HandleTrips = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- Filter Logic ---------------- */

  const filteredRows = TABLE_ROWS.filter((row) => {
    const matchesSearch =
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "monitored" && row.online) ||
      (activeTab === "unmonitored" && !row.online);

    return matchesSearch && matchesTab;
  });

  /* ===================================================== */

  return (
    <div className="h-full w-full border rounded-lg shadow-lg bg-white">
      {/* ================= HEADER ================= */}

      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Members List
            </h2>

            <p className="text-gray-500 mt-1">
              See information about all members
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
              View All
            </button>

            <button className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-1 text-sm hover:bg-blue-700">
              <UserPlusIcon className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* ================= TABS + SEARCH ================= */}

        <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Tabs */}

          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === tab.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}

          <div className="relative w-full md:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Head */}

          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRows.map((row) => (
              <tr key={row.email}>
                {/* Member */}

                <td className="px-4 py-2 flex items-center gap-3">
                  <img
                    src={row.img}
                    alt={row.name}
                    className="h-8 w-8 rounded-full"
                  />

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-800">{row.name}</span>

                    <span className="text-xs text-gray-500">{row.email}</span>
                  </div>
                </td>

                {/* Function */}

                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-800">{row.job}</span>

                    <span className="text-xs text-gray-500">{row.org}</span>
                  </div>
                </td>

                {/* Status */}

                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.online
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {row.online ? "Online" : "Offline"}
                  </span>
                </td>

                {/* Date */}

                <td className="px-4 py-2 text-sm text-gray-800">{row.date}</td>

                {/* Edit */}

                <td className="px-4 py-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty */}

            {filteredRows.length === 0 && (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= FOOTER ================= */}

      <div className="flex justify-between items-center p-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">Page 1 of 10</span>

        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
            Previous
          </button>

          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandleTrips;
