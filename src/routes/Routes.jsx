import { createBrowserRouter } from "react-router-dom";
import Notification from "../components/Notifications";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AdminStatistics from "../pages/Dashboard/Admin/AdminStatistics";
import AllDeliveryMen from "../pages/Dashboard/Admin/AllDeliveryMen";
import AllParcels from "../pages/Dashboard/Admin/AllParcels";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import MyDeliveryList from "../pages/Dashboard/DeliveryMen/MyDeliveryList";
import MyReviews from "../pages/Dashboard/DeliveryMen/MyReviews";
import BookParcel from "../pages/Dashboard/User/BookParcel";
import MyParcels from "../pages/Dashboard/User/MyParcels";
import MyProfile from "../pages/Dashboard/User/MyProfile";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import AdminRoute from "./AdminRoute";
import DeliveryMenRoute from "./DeliveryMenRoute";
import PrivateRoute from "./PrivateRoute";
import PrivateRouteRedirect from "./PrivateRouteRedirect";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/notifications", element: <Notification /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <PrivateRouteRedirect />,
      },
      {
        path: "/dashboard/book-parcel",
        element: (
          <PrivateRoute>
            <BookParcel />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/my-parcels",
        element: (
          <PrivateRoute>
            <MyParcels />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/my-profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/statistics",
        element: (
          <AdminRoute>
            <PrivateRoute>
              <AdminStatistics />
            </PrivateRoute>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/all-parcels",
        element: (
          <AdminRoute>
            <PrivateRoute>
              <AllParcels />
            </PrivateRoute>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/all-users",
        element: (
          <AdminRoute>
            <PrivateRoute>
              <AllUsers />
            </PrivateRoute>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/all-delivery-men",
        element: (
          <AdminRoute>
            <PrivateRoute>
              <AllDeliveryMen />
            </PrivateRoute>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/my-delivery-list",
        element: (
          <DeliveryMenRoute>
            {" "}
            <PrivateRoute>
              <MyDeliveryList />
            </PrivateRoute>
          </DeliveryMenRoute>
        ),
      },
      {
        path: "/dashboard/my-reviews",
        element: (
          <DeliveryMenRoute>
            <PrivateRoute>
              <MyReviews />
            </PrivateRoute>
          </DeliveryMenRoute>
        ),
      },
    ],
  },
]);
