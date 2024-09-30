import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarkdownProvider from "../../../components/MarkDownEditor/providers/markdownProvider";
import Editor from "../../../components/MarkDownEditor/editor";
import Preview from "../../../components/MarkDownEditor/preview";
import Builder from "../../../components/Builder";
import { ADMIN_EDIT_PROBLEM_URL, BACKEND_ADDRESS } from "../../config";
import {
  performAuthenticatedGetActionAsync,
  performAuthenticatedPutActionAsync,
} from "../../utils";

import AceEditorComponent from "../../../components/AceEditorComponent";

import TabBar, {
  TabButton,
  TabDivier,
  TabSection,
} from "../../../components/TabComponent";

import { Level } from "./../../../constants/constants";
import SaveIcon from "../../../icons/bookmark-square-icon";
import MenuIcon from "../../../icons/menu-icon";
import PlayIcon from "../../../icons/play-icon";
import ClipboardIcon from "../../../icons/clipboard-document-icon";
import InfoIcon from "../../../icons/infomation-icon";
import DocumentIcon from "../../../icons/document-icon";
import EditIcon from "../../../icons/edit-icon";
import CodeIcon from "../../../icons/code-bracket-icon";
import TestCaseIcon from "../../../icons/command-line-icon";
import LoadingIcon from "../../../icons/LoadingIcon";
import BugIcon from "../../../icons/bug-ant-icon";

export default function QuestionEditPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    level: "",
    visibility: false,
    placeholder: "",
    solution: "",
    testScript: "",
  });
  const [result, setResult] = useState();
  const [message, setMessage] = useState();

  const [leftActiveTab, setLeftActiveTab] = useState("problemInfo");
  const [rightActiveTab, setRightActiveTab] = useState("preview");

  const DEFAULT_WIDTH = (window.innerWidth - 32) / 2 - 5;
  const [leftWidth, setLeftWidth] = useState(DEFAULT_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_WIDTH);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleGoback = () => {
    navigate("/admin/dashboard");
  };

  const handleResize = () => {
    setLeftWidth(window.innerWidth);
    setRightWidth(30);
  };

  useEffect(() => {
    const url = BACKEND_ADDRESS + ADMIN_EDIT_PROBLEM_URL + id;

    const fetchProblems = async () => {
      const result = await performAuthenticatedGetActionAsync(url);

      if (result.error) {
        console.log(result.message);
        if (result.tokenExpired) navigate("/login");
      } else {
        console.log(result.data);
        setFormData({
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          level: result.data.level,
          visibility: result.data.visibility,
          placeholder: result.data.placeholder,
          solution: result.data.solution.solution,
          testScript: result.data.testCaseList[0].testScript,
        });
      }
      setLoading(false);
    };

    fetchProblems();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleDoubleClick = () => {
    setLeftWidth(DEFAULT_WIDTH);
    setRightWidth(DEFAULT_WIDTH);
  };

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

  const formatMessage = (str) => {
    if (typeof str !== "string") {
      return <span>No message available</span>;
    }
    return str
      .replace(/\x1B\[[0-?9;]*[mG]/g, "") // Strip ANSI codes
      .split("\n") // Split by newlines
      .map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ));
  };

  const handleRunEvent = async (event) => {
    event.preventDefault();

    setLoading(true);

    const requestData = {
      id: id,
      title: formData.title,
      description: formData.description,
      level: formData.level,
      visibility: formData.visibility,
      placeholder: formData.placeholder,
      solution: formData.solution,
      testScript: formData.testScript,
    };

    const response = await performAuthenticatedPutActionAsync(
      BACKEND_ADDRESS + ADMIN_EDIT_PROBLEM_URL + id + "/run",
      requestData,
    );

    if (response.error) {
      alert(`Error: ${response.error.message}`);
    } else {
      setResult(response.data.success === true ? "PASS" : "FAIL");
      setMessage(formatMessage(response.data.consoleMessage));
      setRightActiveTab("console");
      if (rightWidth < DEFAULT_WIDTH / 2) {
        setLeftWidth(0);
      }
    }

    setLoading(false);
  };

  const handleSubmitEvent = async (event) => {
    event.preventDefault();

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

    const response = await performAuthenticatedPutActionAsync(
      BACKEND_ADDRESS + ADMIN_EDIT_PROBLEM_URL + id,
      requestData,
    );

    if (response.error) {
      alert(`Error: ${response.error.message}`);
    } else {
      setResult(response.data.isSuccess === true ? "PASS" : "FAIL");
      setMessage(formatMessage(response.data.resultMessage));
      setRightActiveTab("console");
      setFormData({
        ...formData,
        visibility: response.data.visibility,
      });
    }

    setLoading(false);
  };

  const getResultStyle = (result) => {
    const style = "inline-block font-bold ";
    switch (result) {
      case "PASS":
        return style + "text-[#2CBB5D] ";
      case "FAIL":
        return style + "text-[#EF4743] ";
      default:
        return "hidden";
    }
  };

  return (
    <Builder className="flex flex-col justify-start !pt-8">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="cursor-pointer" onClick={() => handleGoback()}>
            <MenuIcon className="size-6" />
          </div>
          <h1 className="text-[#242533] text-2xl font-medium">
            {formData.id}. {formData.title}
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          {loading && (
            <div className="flex gap-2 justify-center items-center py-2 pl-2 pr-3">
              <LoadingIcon className="size-6 " />
              <span className="font-medium">Loading... </span>
            </div>
          )}
          <div
            className="flex gap-2 justify-center items-center py-2 pl-2 pr-3 rounded-md bg-indigo-200/60 hover:bg-indigo-200 cursor-pointer "
            type="submit"
            onClick={handleRunEvent}
          >
            <PlayIcon className="size-5 fill-indigo-500" />
            <span className="font-medium  text-indigo-500">Run</span>
          </div>
          <div
            className="flex gap-2 justify-center items-center py-2 pl-2 pr-3 rounded-md text-indigo-100 bg-indigo-500 hover:bg-indigo-600 cursor-pointer "
            type="submit"
            onClick={handleSubmitEvent}
          >
            <SaveIcon className="size-5" />
            <span className="font-medium">Save</span>
          </div>
        </div>
      </div>

      <MarkdownProvider className="flex gap-[1px] h-full max-h-[100vh] overflow-hidden">
        <div
          className={`
            ${
              leftWidth > 36 ? "overflow-auto" : "overflow-hidden"
            } bg-white rounded-md flex flex-col h-full relative min-w-[36px]`}
          style={{ width: `${leftWidth}px` }}
        >
          <div
            className="w-full min-w-72"
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
                content={formData.description}
                onMarkdownChange={handleMarkdownChange}
              />
            </TabSection>
          </div>
        </div>
        <div
          className="cursor-ew-resize flex justify-center items-center group/resize1"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
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
            className="w-full min-w-72 z-50"
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
              {result && (
                <>
                  <TabDivier />
                  <TabButton
                    label="Console"
                    icon={<BugIcon className="size-5 stroke-[#c16a42]" />}
                    isActive={rightActiveTab === "console"}
                    onClick={() => setRightActiveTab("console")}
                  />
                </>
              )}
            </TabBar>
            <hr />
          </div>
          <div className="flex-1 overflow-auto">
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
            {message && (
              <TabSection isActive={rightActiveTab === "console"}>
                <div className="flex flex-col h-full space-y-4">
                  <div className="flex gap-2 text-gray-800">
                    <span className="font-semibold">Result:</span>
                    <span
                      className={`font-semibold  ${getResultStyle(result)}`}
                    >
                      {result}
                    </span>
                  </div>

                  <p className="font-semibold">Message:</p>
                  <div className="flex-1 overflow-auto p-4 bg-gray-100 border border-gray-300 rounded-lg">
                    <div className="text-gray-700">
                      <span>{message}</span>
                    </div>
                  </div>
                </div>
              </TabSection>
            )}
          </div>
        </div>
      </MarkdownProvider>
    </Builder>
  );
}
