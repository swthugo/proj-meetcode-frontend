import React, { useEffect, useState } from "react";
import Builder from "../../components/Builder";
import Row from "../../components/Row";
import UpDownIcon from "../../icons/chevron-up-down-icon";
import { useNavigate } from "react-router-dom";
import PlusIcon from "../../icons/plus-icon";
import { performAuthenticatedGetActionAsync } from "../utils";
import { ADMIN_DASHBOARD_URL, BACKEND_ADDRESS } from "../config";
import ClickedIcon from "../../icons/check-circle-icon";

export default function AdminDashboard() {
  const ADMIN_OPEN_NEW = "/admin/edit/new";
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: "index",
    direction: "ascending",
  });

  useEffect(() => {
    const url = BACKEND_ADDRESS + ADMIN_DASHBOARD_URL;
    const fetchProblems = async () => {
      const result = await performAuthenticatedGetActionAsync(url);

      console.log(result);

      if (result.error) {
        console.log(result.message);
        if (result.tokenExpired) navigate("/login");
      } else {
        console.log(result.data);
        setData(result.data);
      }
    };

    fetchProblems();
  }, []);

  const difficultyOrder = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
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

    if (typeof a === "boolean" && typeof b === "boolean") {
      return sortConfig.direction === "ascending"
        ? a === b
          ? 0
          : a
          ? -1
          : 1
        : a === b
        ? 0
        : a
        ? 1
        : -1;
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

  const handleRowClick = (id) => {
    if (id === undefined) {
      return;
    }
    navigate(`/admin/edit/${id}`);
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
      <Row className="space-y-4">
        <h1 className="text-xl">Hi, Admin</h1>
        <div className="flex items-center">
          <h2 className="text-[#242533] text-2xl font-semibold px-6">
            Problem Set
          </h2>
          <div
            onClick={() => navigate(ADMIN_OPEN_NEW)}
            className="cursor-pointer rounded-md bg-gray-200 p-1"
          >
            <PlusIcon className="size-5 " />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-gray-200 ">
            <thead>
              <tr className=" text-gray-600 border-b-gray-200 leading-normal">
                <th
                  className={`${thStyle} w-2/3 `}
                  onClick={() => requestSort("index")}
                >
                  Title
                  <UpDownIcon className="size-6 float-end -mr-4" />
                </th>
                <th
                  className={`${thStyle} w-1/6 min-w-32 border-x border-x-gray-200 `}
                  onClick={() => requestSort("difficulty")}
                >
                  Difficulty
                  <UpDownIcon className="size-6 float-end -mr-4" />
                </th>
                <th
                  className={`${thStyle} w-1/6 min-w-32 mx-auto `}
                  onClick={() => requestSort("boolean")}
                >
                  Visibility
                  <UpDownIcon className="size-6 float-end -mr-4" />
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 font-light border border-gray-200">
              {currentItems.map((item, index) => (
                <tr
                  key={index}
                  data-attr={item.problemId}
                  className={`border-b border-gray-200 hover:bg-gray-100 cursor-pointer`}
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="py-3 px-4 md:!px-6 space-x-1">
                    <span>{item.id}.</span>
                    <span>{item.title}</span>
                  </td>
                  <td
                    className={`border-x border-x-gray-200 ${getDifficultyColor(
                      item.level,
                    )}`}
                  >
                    {item.level}
                  </td>
                  <td>
                    {item.visibility ? (
                      <ClickedIcon className="size-6 mx-auto stroke-[#4bC77D]" />
                    ) : (
                      ""
                    )}
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
