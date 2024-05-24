import React, { Suspense } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import { authProtectedRoutes, authPublicRoutes } from "./allRoutes";
import { Route, Routes } from "react-router-dom";

const index = () => {
  return (
    <>
      <Routes>
        {authProtectedRoutes.map((item, indx) => {
          return (
            <Route
              path={item.path}
              element={
                <ProtectedRoutes>
                  <Suspense fallback={<div>Loading...</div>}>
                    <div> {item.component}</div>
                  </Suspense>
                </ProtectedRoutes>
              }
              key={indx}
              exact={true}
            />
          );
        })}

        {authPublicRoutes.map((item, indx) => {
          return (
            <Route
              path={item.path}
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  {item.component}
                </Suspense>
              }
              key={indx}
              exact={true}
            />
          );
        })}
      </Routes>
    </>
  );
};

export default index;
