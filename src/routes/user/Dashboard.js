import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClickedIcon from "../../icons/check-circle-icon";
import PendingIcon from "../../icons/clock-icon";
import Builder from "../../components/Builder";
import Row from "../../components/Row";
import UpDownIcon from "../../icons/chevron-up-down-icon";
import { BACKEND_ADDRESS, USER_DASHBOARD_URL } from "../config";
import { performAuthenticatedGetActionAsync } from "../utils";
import EditIcon from "../../icons/edit-icon";
import LoadingIcon from "../../icons/LoadingIcon";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: "index",
    direction: "ascending",
  });

  useEffect(() => {
    const url = BACKEND_ADDRESS + USER_DASHBOARD_URL;

    const fetchProblems = async () => {
      const result = await performAuthenticatedGetActionAsync(url);

      console.log(result.data);

      if (result.error) {
        console.log(result.message);
        if (result.tokenExpired) navigate("/login");
      } else {
        setData(result.data);
      }

      setLoading(false);
    };

    fetchProblems();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/problem/${id}`);
  };

  const difficultyOrder = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  const getDifficultyColor = (difficulty) => {
    var style = "py-3 px-4 md:!px-6 ";
    switch (difficulty) {
      case "EASY":
        return style + "text-[#4bC77D]";
      case "MEDIUM":
        return style + "text-[#C7A748]";
      case "HARD":
        return style + "text-[#C75248]";
      default:
        return style;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <ClickedIcon className="size-6 stroke-[#01B328]" />;
      case "ATTEMPTING":
        return <PendingIcon className="size-6 stroke-gray-300" />;
      case "OPEN":
        return <EditIcon className="size-6 stroke-gray-300" />;
      case "NOT_STARTED":
      default:
        return "";
    }
  };

  const sortedData = [...data].sort((m, n) => {
    let a, b;

    if (sortConfig.key === "index") {
      a = data.indexOf(m);
      b = data.indexOf(n);
    } else if (sortConfig.key === "difficulty") {
      a = difficultyOrder[m[sortConfig.key]];
      b = difficultyOrder[n[sortConfig.key]];
    } else {
      a = m[sortConfig.key];
      b = n[sortConfig.key];
    }

    if (a < b) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a > b) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const thStyle = "py-3 px-4 md:!px-6 text-left font-medium cursor-pointer ";

  return (
    <Builder className="py-6">
      {loading && <LoadingIcon className="size-6" />}
      <Row className="space-y-4">
        <h1 className="text-xl">Hi, User</h1>
        <div className="flex items-center">
          <h2 className="text-[#242533] text-2xl font-semibold px-6">
            Problem Set
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-gray-200 ">
            <thead>
              <tr className=" text-gray-600 border-b-gray-200 leading-normal">
                <th
                  className={`${thStyle} !px-1 w-1/12 text-center`}
                  onClick={() => requestSort("status")}
                >
                  Status
                </th>
                <th
                  className={`${thStyle} w-2/3 border-x border-x-gray-200`}
                  onClick={() => requestSort("index")}
                >
                  Title
                  <UpDownIcon className="size-6 float-end -mr-4" />
                </th>
                <th
                  className={`${thStyle} w-1/6 min-w-32`}
                  onClick={() => requestSort("difficulty")}
                >
                  Difficulty
                  <UpDownIcon className="size-6 float-end -mr-4" />
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 font-light border border-gray-200">
              {currentItems.map((item, index) => (
                <tr
                  key={index}
                  data-attr={item.productId}
                  className={`border-b border-gray-200 hover:bg-gray-100 cursor-pointer`}
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="py-3 px-4 md:!px-6 flex justify-center">
                    {getStatusIcon(item.progress)}
                  </td>
                  <td className="py-3 px-4 md:!px-6 border-x border-x-gray-200 space-x-1">
                    <span>{item.id}.</span>
                    <span>{item.title}</span>
                  </td>
                  <td className={getDifficultyColor(item.level)}>
                    {item.level}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className={`${
              totalPages > 1 ? "flex justify-between mt-4" : "hidden"
            } `}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </Row>
    </Builder>
  );
}
