const TitleBar = ({ title, aside }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center">
      <h4 className="mb-2 font-semibold">{title ? title : "Untitled"}</h4>
      {aside && <h6>{aside}</h6>}
    </div>
    <hr />
  </div>
);

export default TitleBar;
