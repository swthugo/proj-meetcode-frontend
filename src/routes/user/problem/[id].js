import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Builder from "../../../components/Builder";
import Preview from "../../../components/MarkDownEditor/preview";
import MarkdownProvider from "../../../components/MarkDownEditor/providers/markdownProvider";
import AceEditorComponent from "../../../components/AceEditorComponent";

import MenuIcon from "../../../icons/menu-icon";
import PlayIcon from "../../../icons/play-icon";
import BookIcon from "../../../icons/book-icon";
import SaveIcon from "../../../icons/bookmark-square-icon";
import CodeIcon from "../../../icons/code-bracket-icon";
import DocumentIcon from "../../../icons/document-icon";
import TestCaseIcon from "../../../icons/command-line-icon";
import ChartBarIcon from "../../../icons/document-chart-bar";
import LoadingIcon from "../../../icons/LoadingIcon";

import TabBar, {
  TabButton,
  TabDivier,
  TabSection,
} from "../../../components/TabComponent";
import { BACKEND_ADDRESS, USER_SUBMISSION_URL } from "../../config";
import {
  performAuthenticatedGetActionAsync,
  performAuthenticatedPostActionAsync,
} from "../../utils";

export default function ProblemPage() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    solution: "",
    submissionList: [],
  });

  const [leftActiveTab, setLeftActiveTab] = useState("description");
  const [rightActiveTab, setRightActiveTab] = useState("code");

  const DEFAULT_WIDTH = (window.innerWidth - 32) / 2 - 5;
  const [leftWidth, setLeftWidth] = useState(DEFAULT_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_WIDTH);

  const [result, setResult] = useState();
  const [message, setMessage] = useState();

  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();
  const handleGoback = () => {
    navigate("/dashboard");
  };

  const handleResize = () => {
    setLeftWidth(window.innerWidth);
    setRightWidth(30);
  };

  useEffect(() => {
    const url = BACKEND_ADDRESS + USER_SUBMISSION_URL + id;

    const fetchProblems = async () => {
      const result = await performAuthenticatedGetActionAsync(url);

      // console.log(result.data);

      if (result.error) {
        // console.log(result.message);
        if (result.tokenExpired) navigate("/login");
      } else {
        // console.log(result.data.placeholder);
        setData(result.data);
        setFormData({
          solution: result.data.placeholder,
          submissionList: result.data.submissionList,
        });
      }
      setLoading(false);
    };

    fetchProblems();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDoubleClick = () => {
    setLeftWidth(DEFAULT_WIDTH);
    setRightWidth(DEFAULT_WIDTH);
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

  const getLevelStyle = (level) => {
    const style = "text-sm rounded-2xl px-2 py-1 inline-block mb-4 ";
    switch (level) {
      case "EASY":
        return style + "text-[#4bC77D] bg-[#4bC77D]/10";
      case "MEDIUM":
        return style + "text-[#C7A748] bg-[#C7A748]/10";
      case "HARD":
        return style + "text-[#C75248] bg-[#C75248]/10";
      default:
        return "hidden";
    }
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
      solution: formData.solution,
    };

    const response = await performAuthenticatedPostActionAsync(
      BACKEND_ADDRESS + USER_SUBMISSION_URL + id + "/run",
      requestData,
    );

    if (response.error) {
      alert(`Error: ${response.error.message}`);
    } else {
      // console.log(response.data);
      setResult(response.data.success === true ? "PASS" : "FAIL");
      setMessage(formatMessage(response.data.message));

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
      solution: formData.solution,
    };

    console.log(formData.solution);

    const response = await performAuthenticatedPostActionAsync(
      BACKEND_ADDRESS + USER_SUBMISSION_URL + id + "/submit",
      requestData,
    );

    if (response.error) {
      alert(`Error: ${response.error.message}`);
    } else {
      console.log(response.data);
      if (response.data.submissionList) {
        setResult(response.data.submissionList[0].runResult);
        setMessage(formatMessage(response.data.submissionList[0].console));
      }
      setFormData({
        ...formData,
        submissionList: response.data.submissionList,
      });

      setRightActiveTab("console");
      if (rightWidth < DEFAULT_WIDTH / 2) {
        setLeftWidth(0);
      }
    }

    setLoading(false);
  };

  const handleReadSubmission = async (event, submissionId) => {
    event.preventDefault();
    setLoading(true);

    const url =
      BACKEND_ADDRESS + USER_SUBMISSION_URL + "submit/" + submissionId;

    const result = await performAuthenticatedGetActionAsync(url);

    if (result.error) {
      console.log(result.message);
      if (result.tokenExpired) navigate("/login");
    } else {
      setFormData({ ...formData, solution: result.data.script });
      setRightActiveTab("code");
    }

    setLoading(false);
  };

  const handleShowAnswer = async (event) => {
    event.preventDefault();
    setLoading(true);

    const url = BACKEND_ADDRESS + USER_SUBMISSION_URL + id + "/showAns";

    const result = await performAuthenticatedGetActionAsync(url);

    if (result.error) {
      console.log(result.message);
      if (result.tokenExpired) navigate("/login");
    } else {
      setAnswer(
        result.data.answer.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        )),
      );
    }

    setIsVisible(true);
    setLoading(false);
  };

  return (
    <Builder className="flex flex-col justify-start !pt-8">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="cursor-pointer" onClick={() => handleGoback()}>
            <MenuIcon className="size-6" />
          </div>
          <h1 className="text-[#242533] text-2xl font-medium">
            {data.id}. {data.title}
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
            } bg-white rounded-md flex flex-col h-full relative min-w-[36px] `}
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
                : { display: "block" }
            }
          >
            <TabBar
              onDoubleClick={() => {
                setLeftWidth(window.innerWidth);
                setRightWidth(30);
              }}
            >
              <TabButton
                label="Description"
                icon={<DocumentIcon className="size-5 stroke-[#28A745]" />}
                isActive={leftActiveTab === "description"}
                onClick={() => {
                  setLeftActiveTab("description");
                }}
              />
              <TabDivier />
              <TabButton
                label="Answer"
                icon={<BookIcon className="size-5 stroke-[#de36e3]" />}
                isActive={leftActiveTab === "answer"}
                onClick={() => {
                  setLeftActiveTab("answer");
                }}
              />

              <TabDivier />
              <TabButton
                label="Submission"
                icon={<ChartBarIcon className="size-5 stroke-[#ee8720]" />}
                isActive={leftActiveTab === "submission"}
                onClick={() => {
                  setLeftActiveTab("submission");
                }}
              />
            </TabBar>
            <hr />
          </div>
          <div className="flex-1">
            <TabSection isActive={leftActiveTab === "description"}>
              <div className={` capitalize ${getLevelStyle(data.level)}`}>
                {data.level}
              </div>
              <Preview content={data.description} />
            </TabSection>
            <TabSection isActive={leftActiveTab === "answer"}>
              {isVisible ? (
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                  {answer}
                </div>
              ) : (
                <button
                  onClick={handleShowAnswer}
                  className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Show Answer
                </button>
              )}
            </TabSection>
            <TabSection isActive={leftActiveTab === "submission"}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm font-semibold border-b border-gray-300">
                    <th className="py-2 px-4 w-1/6">Status</th>
                    <th className="py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.submissionList &&
                    formData.submissionList.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 transition-colors border-b border-gray-200 place-items-center cursor-pointer"
                        onClick={(e) => handleReadSubmission(e, item.id)}
                      >
                        <td
                          className={`rounded-2xl px-2 py-1  ${getResultStyle(
                            item.runResult,
                          )}`}
                        >
                          <div className="py-2 px-4">{item.runResult}</div>
                        </td>
                        <td className="py-2 px-4 text-sm">
                          <span className="mr-2">
                            {item.createAt.split("T")[0]}
                          </span>
                          <span>
                            {item.createAt.split("T")[1].split(".")[0]}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
          } flex-1 flex flex-col h-full bg-white rounded-md min-w-[36px] relative `}
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
            <TabBar
              onDoubleClick={() => {
                setRightWidth(window.innerWidth);
                setLeftWidth(30);
              }}
            >
              <TabButton
                label="Code"
                icon={<CodeIcon className="size-5 stroke-[#DC3545]" />}
                isActive={rightActiveTab === "code"}
                onClick={() => setRightActiveTab("code")}
              />
              {message != null && (
                <>
                  <TabDivier />
                  <TabButton
                    label="Console"
                    icon={<TestCaseIcon className="size-5 stroke-[#6F42C1]" />}
                    isActive={rightActiveTab === "console"}
                    onClick={() => setRightActiveTab("console")}
                  />
                </>
              )}
            </TabBar>
            <hr />
          </div>
          <div className="flex-1 overflow-auto">
            <TabSection isActive={rightActiveTab === "code"} className="!p-0">
              <AceEditorComponent
                name="Code"
                value={formData.solution}
                onChange={(value) =>
                  setFormData({ ...formData, solution: value })
                }
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
