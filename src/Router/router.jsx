import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Home from '../Pages/Home/Home'
import RootLayout from "../Layout/RootLayout";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage Area/Coverage";
import PrivateRoute from "../Routers/PrivateRoute";
import Send_Parcel from "../Pages/Send Parcel/Send_Parcel";
import DashBoardLayout from "../Layout/DashBoardLayout";

// users dashboard all the point here 
import MyParcels from "../Pages/Dashboard/user/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/user/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/user/Payment-History/PaymentHistory";

import BeARider from "../Pages/Be A Raider/BeARider";
import RiderForm from "../Pages/Be A Raider/Rider_Form/RiderForm";
// Admin route all path here 
import Active_riders from "../Pages/Dashboard/Admin/Active Riders/Active_riders";
import Pending_Riders from "../Pages/Dashboard/Admin/Pending Riders/Pending_Riders";
import Deactive_riders from "../Pages/Dashboard/Admin/Deactivate Riders/Deactivate_riders";
import AssignRider from "../Pages/Dashboard/Admin/Asign_Rider/AssignRider";
import MakeAdmin from "../Pages/Dashboard/Admin/MakeAdmin/MakeAdmin";
import AdminRoute from "../Routers/AdminRoute";

import Forbidden from "../Pages/Forbidden Access/Forbidden";
// rider route all the path here 
import RiderRoute from "../Routers/RiderRoute";
import PendingDelivary from "../Pages/Dashboard/Rider/Pending Delivary/PendingDelivary";
import CompletedDelivery from "../Pages/Dashboard/Rider/CompletedDelivary/CompletedDelivery";
import MyEarning from "../Pages/Dashboard/Rider/My Earning/MyEarning";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import ProfileUpdate from "../Pages/Dashboard/user/ProfileUpdate";
import AllFaQ from "../Pages/Home/FaQ/AllFaQ";
import Track_parcel from "../Pages/Dashboard/user/tracking_parcel/Track_parcel";







const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home

      },
      {
        path: '/FaQ',
       Component: AllFaQ
      },
      {
        path: '/coverage',
        element: <PrivateRoute><Coverage></Coverage></PrivateRoute>,
        loader: () => fetch('../../public/DataAll/areaMap.json')
      },
      // add parcel components 
      {
        path: 'send_parcel',
        element: <PrivateRoute><Send_Parcel></Send_Parcel></PrivateRoute>,
        loader: () => fetch('../../public/DataAll/areaMap.json')
      },
      {
        path: '/beARider',
        Component: BeARider
      },
      {
        path:'/riderForm',
        element: <PrivateRoute><RiderForm></RiderForm></PrivateRoute>,
        loader: () => fetch('../../public/DataAll/areaMap.json')
      },
      {
        path:'/forbidden',
        Component: Forbidden
      },
      {
        path: '*',
        Component: Forbidden
      }
    ]
  },

  // Authentication Layouts Components 
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: '/login',
        Component: Login
      },
      {
        path: '/register',
        Component: Register
      }
    ]
  },
  // Authentication Layouts Components 
  {
    path: '/dashboard',
    element: <PrivateRoute><DashBoardLayout></DashBoardLayout></PrivateRoute>,
    children: [
      {
        index: true,
        Component: DashboardHome
      },
      {
        path: 'myParcels',
        Component: MyParcels
      },
      {
        path: 'payment/:parcelId',
        Component: Payment
      },
      {
        path: 'payment-history',
        Component: PaymentHistory
      },
      {
        path:'active-riders',
        element:  <AdminRoute><Active_riders></Active_riders></AdminRoute>
      },
      {
        path:'pending-riders',
        element: <AdminRoute> <Pending_Riders></Pending_Riders></AdminRoute>
      },
      {
        path:'make-admin',
        element: <AdminRoute><MakeAdmin></MakeAdmin></AdminRoute>
      },
      {
        path:'assignRider',
        element: <AdminRoute><AssignRider></AssignRider></AdminRoute>
      },
      {
        path:'pending-deliveries',
        element: <RiderRoute><PendingDelivary></PendingDelivary></RiderRoute>
      },
      {
        path:'completed-deliveries',
        element: <RiderRoute><CompletedDelivery></CompletedDelivery></RiderRoute>
      },
      {
        path:'my-earnings',
        element:<RiderRoute><MyEarning></MyEarning></RiderRoute>
      },
      {
        path:'update-profile',
        element:<PrivateRoute><ProfileUpdate></ProfileUpdate></PrivateRoute>
      },
      {
        path:'track_parcel',
        Component : Track_parcel
      },
      {
        path:'deactive_riders',
        element: <AdminRoute><Deactive_riders></Deactive_riders></AdminRoute>
      }
    ]
  }
]);
export default router;