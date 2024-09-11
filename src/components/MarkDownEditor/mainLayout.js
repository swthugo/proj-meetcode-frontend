const MainLayout = ({ children }) => (
  <main className="flex h-screen">{children}</main>
);

MainLayout.Column = ({ children }) => (
  <div className="flex-1 p-8 border-r-[3px] last:border-r-0 border">
    {children}
  </div>
);

MainLayout.Row = ({children}) => (
  <div className="">
    {children}
  </div>
);

export default MainLayout;
