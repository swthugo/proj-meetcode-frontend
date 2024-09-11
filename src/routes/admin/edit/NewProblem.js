import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Builder from "../../../components/Builder";
import AceEditorComponent from "../../../components/AceEditorComponent";

import MarkdownProvider from "../../../components/MarkDownEditor/providers/markdownProvider";
import Editor from "../../../components/MarkDownEditor/editor";
import Preview from "../../../components/MarkDownEditor/preview";

import { jwtDecode } from "jwt-decode";
import { ADMIN_SUBMIT_PROBLEM, BACKEND_ADDRESS } from "../../config";
import { performPostActionAsync } from "../../utils";
import TabBar, {
  TabButton,
  TabDivier,
  TabSection,
} from "../../../components/TabComponent";

import { Level } from "./../../../constants/constants";
import SaveIcon from "../../../icons/bookmark-square-icon";
import LoadingIcon from "../../../icons/LoadingIcon";
import MenuIcon from "../../../icons/menu-icon";
import PlayIcon from "../../../icons/play-icon";
import ClipboardIcon from "../../../icons/clipboard-document-icon";
import InfoIcon from "../../../icons/infomation-icon";
import DocumentIcon from "../../../icons/document-icon";
import EditIcon from "../../../icons/edit-icon";
import CodeIcon from "../../../icons/code-bracket-icon";
import TestCaseIcon from "../../../icons/command-line-icon";

export default function NewProblem() {
  const [leftActiveTab, setLeftActiveTab] = useState("problemInfo");
  const [rightActiveTab, setRightActiveTab] = useState("placeholder");

  const DEFAULT_WIDTH = (window.innerWidth - 32) / 2 - 5;
  const [leftWidth, setLeftWidth] = useState(DEFAULT_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_WIDTH);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleGoback = () => {
    navigate("/admin/dashboard");
  };

  const handleMouseDown = (e) => {
    const startX = e.clientX;

    const onMouseMove = (moveEvent) => {
      const newWidth = leftWidth + (moveEvent.clientX - startX);
      setLeftWidth(newWidth);
      setRightWidth(window.innerWidth - 32 - newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "",
    visibility: false,
    placeholder: "",
    solution: "",
    testScript: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleMarkdownChange = (markdown) => {
    setFormData({
      ...formData,
      description: markdown,
    });
  };

  const handleSubmitEvent = async (event) => {
    event.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.placeholder ||
      !formData.solution ||
      !formData.testScript
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const requestData = {
      title: formData.title,
      description: formData.description,
      level: formData.level,
      visibility: formData.visibility,
      placeholder: formData.placeholder,
      solution: formData.solution,
      testScript: formData.testScript,
    };

    const response = await performPostActionAsync(
      BACKEND_ADDRESS + ADMIN_SUBMIT_PROBLEM,
      requestData,
    );

    console.log(response);

    if (response.error) {
      alert(`Error: ${response.error.message}`);
    } else {
      const token = response.idToken;
      localStorage.setItem("jwt", token);

      const decodedToken = jwtDecode(token);
      const custom_claims = decodedToken.custom_claims;
      console.log(decodedToken);

      if (custom_claims && custom_claims.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/problem");
      }
    }

    setLoading(false);
  };

  return (
    <Builder className="flex flex-col justify-center h-full !pt-8">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="cursor-pointer" onClick={() => handleGoback()}>
            <MenuIcon className="size-6" />
          </div>

          <h1 className="text-[#242533] text-2xl font-medium">
            Add New Question
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 justify-center items-center py-2 pl-2 pr-3 rounded-md bg-indigo-200/60  cursor-pointer ">
            <PlayIcon className="size-5 fill-indigo-500" />
            <span className="font-medium  text-indigo-500">Run</span>
          </div>
          <div
            className="flex gap-2 justify-center items-center py-2 pl-2 pr-3 rounded-md text-indigo-100 bg-indigo-500 cursor-pointer "
            type="submit"
            onClick={handleSubmitEvent}
          >
            {loading ? (
              <>
                <LoadingIcon className="size-6" />
                <span className="font-medium">Saving</span>
              </>
            ) : (
              <>
                <SaveIcon className="size-5" />
                <span className="font-medium">Save</span>
              </>
            )}
          </div>
        </div>
      </div>

      <MarkdownProvider className="flex gap-[1px] h-screen">
        <div
          className={`
            ${
              leftWidth > 36 ? "overflow-auto" : "overflow-hidden"
            } bg-white rounded-md flex flex-col h-full relative min-w-[36px]`}
          style={{ width: `${leftWidth}px` }}
        >
          <div
            className="w-full min-w-60"
            style={
              leftWidth < 36
                ? {
                    transform: "rotate(90deg)",
                    transformOrigin: "top left",
                    position: "absolute",
                    top: "0",
                    left: "36px",
                    width: "100vh",
                  }
                : { display: "" }
            }
          >
            <TabBar>
              <TabButton
                label="Problem Info"
                icon={<InfoIcon className="size-5 stroke-[#007BFF]" />}
                isActive={leftActiveTab === "problemInfo"}
                onClick={() => setLeftActiveTab("problemInfo")}
              />
              <TabDivier />
              <TabButton
                label="Description"
                icon={<DocumentIcon className="size-5 stroke-[#28A745]" />}
                isActive={leftActiveTab === "description"}
                onClick={() => {
                  setLeftActiveTab("description");
                  setRightActiveTab("preview");
                }}
              />
            </TabBar>
            <hr />
          </div>
          <div className="flex-1">
            <TabSection
              isActive={leftActiveTab === "problemInfo"}
              className="space-y-4"
            >
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="font-normal mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="level">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="font-normal mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a level</option>
                  <option value={Level.EASY}>Easy</option>
                  <option value={Level.MEDIUM}>Medium</option>
                  <option value={Level.HARD}>Hard</option>
                </select>
              </div>
              <div className="mb-4 flex gap-6">
                <label className="flex items-center">Visibility</label>
                <label>
                  <input
                    type="checkbox"
                    name="visibility"
                    checked={formData.visibility}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Enable
                </label>
              </div>
            </TabSection>
            <TabSection isActive={leftActiveTab === "description"}>
              <Editor
                title={formData.title}
                markdown={formData.description}
                onMarkdownChange={handleMarkdownChange}
              />
            </TabSection>
          </div>
        </div>
        <div
          className="cursor-ew-resize flex justify-center items-center group/resize1"
          onMouseDown={handleMouseDown}
          onDoubleClick={() => setLeftWidth((window.innerWidth - 32) / 2 - 5)}
          style={{ width: "10px" }}
        >
          <div className="w-[2px] h-6 bg-indigo-200 rounded-lg group-hover/resize1:h-full group-hover/resize1:bg-indigo-500"></div>
        </div>
        <div
          id="right_section"
          className={`${
            rightWidth > 36 ? "overflow-auto" : "overflow-hidden"
          } flex-1 flex flex-col h-full bg-white rounded-md overflow-auto min-w-[36px] relative`}
        >
          <div
            className="w-full min-w-60 z-50"
            style={
              rightWidth < 36
                ? {
                    transform: "rotate(90deg)",
                    transformOrigin: "top left",
                    position: "absolute",
                    top: "0",
                    left: "36px",
                    width: "100vh",
                  }
                : { display: "block" }
            }
          >
            <TabBar>
              <TabButton
                label="Preview"
                icon={<ClipboardIcon className="size-5 stroke-[#FFC107]" />}
                isActive={rightActiveTab === "preview"}
                onClick={() => setRightActiveTab("preview")}
              />
              <TabDivier />
              <TabButton
                label="Placeholder"
                icon={<EditIcon className="size-5 stroke-[#17A2B8]" />}
                isActive={rightActiveTab === "placeholder"}
                onClick={() => setRightActiveTab("placeholder")}
              />
              <TabDivier />
              <TabButton
                label="Solution"
                icon={<CodeIcon className="size-5 stroke-[#DC3545]" />}
                isActive={rightActiveTab === "solution"}
                onClick={() => setRightActiveTab("solution")}
              />
              <TabDivier />
              <TabButton
                label="TestCase"
                icon={<TestCaseIcon className="size-5 stroke-[#6F42C1]" />}
                isActive={rightActiveTab === "testcase"}
                onClick={() => setRightActiveTab("testcase")}
              />
            </TabBar>
            <hr />
          </div>
          <div className="flex-1">
            <TabSection
              isActive={rightActiveTab === "placeholder"}
              className="!p-0"
            >
              <AceEditorComponent
                name="placeholder"
                value={formData.placeholder}
                onChange={(value) =>
                  setFormData({ ...formData, placeholder: value })
                }
              />
            </TabSection>
            <TabSection
              isActive={rightActiveTab === "solution"}
              className="!p-0"
            >
              <AceEditorComponent
                name="solution"
                value={formData.solution}
                onChange={(value) =>
                  setFormData({ ...formData, solution: value })
                }
              />
            </TabSection>
            <TabSection
              isActive={rightActiveTab === "testcase"}
              className="!p-0"
            >
              <AceEditorComponent
                name="testcase"
                value={formData.testScript}
                onChange={(value) =>
                  setFormData({ ...formData, testScript: value })
                }
              />
            </TabSection>
            <TabSection isActive={rightActiveTab === "preview"}>
              <Preview
                markdown={formData.description}
                onMarkdownChange={handleMarkdownChange}
              />
            </TabSection>
          </div>
        </div>
      </MarkdownProvider>
    </Builder>
  );
}
